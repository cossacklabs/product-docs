---
title: SQL firewall
bookCollapseSection: true
---

## AcraCensor — Acra’s firewall

AcraCensor is a separate SQL firewall module for AcraServer that checks every incoming request. AcraCensor logs SQL requests directed to the database, allows and denies those requests according to certain rules (configured as allowlist/denylist), or ignores them and logs an exception (this might be useful if some requests can’t be parsed by AcraCensor). AcraCensor can be configured for your exact use case, allowing to setup an allowlist and a denylist for tables, query patterns, and exact queries. AcraCensor's goal is to protect the database from SQL injections and suspicious SQL queries.

AcraCensor supports SQL database types — MySQL and PostgreSQL (and their flavours i.e. MariaDB). It is built on top of [xwb1989/sqlparser](https://github.com/xwb1989/sqlparser), which we had extended significantly.

AcraCensor is compatible with SIEM systems, with logs that can be used for alerts' configuration and anomaly detection.

To demonstrate the process of configuring AcraCensor for SQL injection prevention in [OWASP Mutillidae 2 example app](https://github.com/webpwnized/mutillidae), we created [a Docker-based demo project](https://github.com/cossacklabs/acra-censor-demo). Read engineering details about how we built AcraCensor in [our blog](https://www.cossacklabs.com/blog/how-to-build-sql-firewall-acracensor.html).

### Launching AcraCensor

AcraCensor is a built-in component of AcraServer, so it starts running when AcraServer does if the path to its configuration file is provided. You can provide a path for AcraCensor's configuration file using `--acracensor_config_file` parameter in [`acra-server.yaml` configuration](https://github.com/cossacklabs/acra/blob/master/configs/acra-server.yaml).

You can find the basic example configuration file [`configs/acra-censor.example.yaml`](https://github.com/cossacklabs/acra/blob/master/configs/acra-censor.example.yaml) of AcraCensor in our GitHub repository. More real-world examples are available in the [AcraCensor demo project](https://github.com/cossacklabs/acra-censor-demo). You can use these examples as a template for your own, using the database of your choice.

Starting AcraCensor using exact configuration file:

```
$GOPATH/bin/acra-server --acracensor_config_file=configs/acra-censor.example.yaml --client_id=client_name --incoming_connection_host=acra.connector.host --db_host=postgresql.db.host 
```

Refer to the [AcraServer]({{< ref "/acra/configuring-maintaining/general-configuration/acra_server.md" >}}) documentation if you have problems with passing configuration parameters.

### Configuring AcraCensor rules

The configuration file describes how AcraCensor should process the incoming SQL queries – log, pass, block, ignore. Each action is described by the corresponding handler. Their position in the file represents their priority of processing.

We suggest the following structure of handlers for better security: put `query_capture` first to log every query into the `censor.log`, then put `query_ignore` to ignore some database-specific control queries that occur when the database is starting and when the database drives check the connections, then put the `deny` handler to block all the unwanted queries, then put the `allow` handler to allow some specific "normal" queries.

The new configuration file format allows configuring the `allow` and `deny` handlers separately or simultaneously.


```yaml
ignore_parse_error: false
version: 0.85.0
parse_errors_log: unparsed_queries.log
handlers:
  - handler: query_capture
    filepath: censor.log
  - handler: query_ignore
    queries:
      # mysql queries AcraCensor will ignore
      - ROLLBACK
      - SET AUTOCOMMIT = 0
      - SHOW VARIABLES LIKE 'sql_mode'
      - show collation where `Charset` = 'utf8' and `Collation` = 'utf8_bin'
  - handler: deny
    queries:
      - select data_raw from plaintext_table
    tables:
      - acrarollback_output
    patterns:
      - "SELECT password from users %%WHERE%%"
      - "SELECT * from users where type=private"
  - handler: allow
    tables:
      - users
      - accounts
      - blogs_table
    patterns:
      - "%%INSERT%%"
      - "SELECT * from users where type=public"
```

Next, see the explanation for each handler below, in order of importance.

⚙️**Need help with configuring AcraCensor? Check out the [engineering examples](https://github.com/cossacklabs/acra-engineering-demo/#example-6-sql-injections-prevention-with-acra)!**⚙️



### Configuration versioning

Starting with Acra [0.85.0 release](https://github.com/cossacklabs/acra/releases/tag/0.85.0) in March 2019, we've introduced a new more flexible configuration format for AcraCensor rules.

AcraServer v0.85+ will work with AcraCensor's configuration file versioned 0.85 and above. AcraServer doesn't support configuration files that have an old format, all users should migrate to the new format.

The migration procedure consists of the following steps:

- rename `blacklist` handler to `deny` handler
- rename `whitelist` handler to `allow` handler
- add version line on the top of the file "version: 0.85.0"

These are all required steps to make your previous configuration file compatible with new AcraServer/AcraCensor versions.


### Allowlist and denylist

There are several handler types for AcraCensor:

- The `allow` handler, which allows specific queries or queries that match specific patterns and access to specific tables and blocks everything else. If the `allowall` handler is a final statement of a configuration file, it means that all the queries that were not processed by previous handlers are allowed.

- The `deny` handler, which blocks specific queries or queries that match specific patterns and access to the specific tables and allows everything else. If the `denyall` handler is a final statement of a configuration file, it means that all the queries that were not processed by previous handlers are allowed.


For each handler, there are settings that regulate:

- [Queries]({{< ref "/acra/security-controls/sql-firewall/queries_filter.md" >}}) — exact match character-by-character of the incoming SQL query and configured one;
- [Tables]({{< ref "/acra/security-controls/sql-firewall/table_filter.md" >}}) — match queries for specified tables;
- [Patterns]({{< ref "/acra/security-controls/sql-firewall/pattern_filter.md" >}}) — match queries by specific SQL statement types.

You can configure the allowlist and the denylist separately or simultaneously. The order of priority for the lists is defined by their order in the configuration file. Priority of processing for each list is the following: queries, followed by tables, followed by patterns.




### Prepared statements

The root of the SQL injection problem is that code and data get mixed up and can be mistaken for each other. SQL prepared statements help to separate code execution from the data itself.

AcraCensor has limited support of filtering prepared statements. AcraCensor doesn't apply allow/deny rules for SQL requests with prepared statements. However, it's possible to use query_capture/query_ignore to filter the whole statement when necessary (through comparing the incoming SQL char-by-char with the SQL from the config file).


### Ignoring specific queries

It might be useful not to apply allowlist/denylist rules to some exact queries, for example, the SQL queries on starting up the database. If the query is ignored, AcraCensor won't apply any rules to it (so basically AcraCensor will pass this query to the database).

```
- handler: query_ignore
  queries:
    # mysql queries AcraCensor will ignore
    - ROLLBACK
    - SET AUTOCOMMIT = 0
    - SHOW VARIABLES LIKE 'sql_mode'
    - show collation where `Charset` = 'utf8' and `Collation` = 'utf8_bin'
```

To ignore some queries, place them to the `query_ignore` handler. AcraCensor compares each input query with queries from the `query_ignore` list. If there is a match, the query is allowed through and no allow/deny handlers are applied.

We suggest looking into [tests/acra-censor_configs](https://github.com/cossacklabs/acra/tree/master/tests/acra-censor_configs) to see which PostgreSQL and MySQL queries we've added to the ignore list for running integration tests.

### Unparseable queries

Sometimes AcraCensor can't parse some particular SQL queries. It's potentially dangerous to send such queries to the database as they might contain SQL injections. So for security reasons, AcraCensor blocks "unparseable" queries by default.

However, some of these queries might be totally legit, so users should have a way to allow them. To remedy this, we've added a special `ignore_parse_error` field into the configuration.

```
ignore_parse_error: false
```

By default, `ignore_parse_error` is false in AcraCensor (check [configs/acra-censor.example.yaml](https://github.com/cossacklabs/acra/blob/master/configs/acra-censor.example.yaml)). Setting it to `true` will push AcraCensor to ignore "unparseable" queries and send them to the database — allowing developers to configure AcraCensor rules during the development and integration stages.

In a production environment, security-oriented users keep `ignore_parse_error` disabled, but add such “unparseable but legit” queries to the `query_ignore` handler manually, resulting in a well-defined and secure firewall configuration. The users encountering parsing errors can send us their GitHub Issue or PR and we'll look into it and try to help.


### Logging and masking queries

#### Continuous logging into syslog

It’s very important that AcraCensor doesn’t log sensitive data. That’s why the first thing AcraCensor does is masking the values in SQL queries’ logs. All values from SQL queries are edited and masked to `replaced` keyword.

This is what the logs from AcraCensor look like:

```
select * from accounts where cid = :replaced1
insert into hitlog(hostname, ip, browser, referer, `date`) values (:replaced1, :replaced2, :replaced3, :replaced4, now())
insert into accounts(username, password, mysignature) values (:replaced1, :replaced2, :replaced3)
```

#### Logging errors (unparseable queries)

You can have a separate log file that contains unparseable queries for the debugging and configuration purposes. Sometimes AcraCensor can't parse all of the incoming queries and it is useful to have a separate log for them. Provide a path to this log file into `parse_errors_log`:

```
parse_errors_log: unparsed_queries.log
```

Be careful, these queries are logged in plaintext, without masking.

#### Logging unique queries to the file

You might need to have a separate log file that contains unique queries that AcraCensor processes or even multiple log files – for each stage of processing.

The `query_capture` logger registers and logs the queries that pass through this handler to a file. Depending on the position of this handler in the configuration file (closer to the top, closer to the bottom), it will log more or fewer queries. For example, if you place this handler below the "deny" handler, you won't see the queries blocked on the previous step.

You can use this handler to log unique queries, and then use this log to improve your allow/deny configurations. AcraCensor won't log queries that can't be parsed (use `parse_errors_log` for this).

To activate this logger, define `query_capture` as a handler, and set the path to the log file (AcraCensor will create a log file if it was not created before).

```
handler: query_capture
filepath: <path_to_file>
```

This is how `query_capture.log` content looks like (real values are being masked):

```
{"raw_query":"commit","_blacklisted_by_web_config":false}
{"raw_query":"update pg_settings set setting = :replaced1 where name = :replaced2","_blacklisted_by_web_config":false}
{"raw_query":"select data from test where id = :replaced1","_blacklisted_by_web_config":false}
```

### Security-wise configurations

Despite the fact that AcraCensor can be configured in many ways, we suggest the following structure of handlers for better security:

- Put `query_capture` first to log every query into the censor_log.
- Next, put query_ignore to ignore some database-specific control queries that occur when the database is starting and when the database drives check the connections.
  Following the secure by default technique, put the allow handler to allow listed queries.
  Finally, put the denyall handler. In this case, all queries that are not on the allowlist will be blocked.
  There is a less secure (but still useable) approach when the deny handler is set for blocking all the unwanted queries and then the allowall handler is put to allow all the other queries.

Example configuration for “Allow — Denyall” rule:

```
parse_errors_log: unparsed_queries.log
handlers:
  - handler: query_capture
    filepath: censor.log
  - handler: query_ignore
    queries:
      - ROLLBACK
      - COMMIT
      - BEGIN
  - handler: deny
    patterns:
      - SELECT * FROM users
      - SELECT %%COLUMN%% FROM users %%WHERE%%
      - DROP table users
  - handler: allow
    tables:
      - users
      - accounts
      - blogs_table
    patterns:
      - "%%INSERT%%"
  - handler: denyall
```