---
title: SQL firewall
bookCollapseSection: true
---

## AcraCensor — Acra’s firewall

AcraCensor is a separate SQL firewall module for AcraServer that checks every incoming request. AcraCensor logs SQL requests directed to the database, allows and denies those requests according to certain rules (configured as allowlist/denylist), or ignores them and logs an exception (this might be useful if some requests can’t be parsed by AcraCensor). AcraCensor can be configured for your exact use case, allowing to setup an allowlist and a denylist for tables, query patterns, and exact queries. AcraCensor's goal is to protect the database from SQL injections and suspicious SQL queries.

AcraCensor supports SQL database types — MySQL and PostgreSQL (and their flavours i.e. MariaDB). It is built on top of [xwb1989/sqlparser](https://github.com/xwb1989/sqlparser), which we had extended significantly.

AcraCensor is compatible with SIEM systems, with logs that can be used for alerts' configuration and anomaly detection.

We created [a Docker-based demo project](https://github.com/cossacklabs/acra-censor-demo) to demonstrate how to prevent SQL injections with AcraCensor using [OWASP Mutillidae II example app](https://github.com/webpwnized/mutillidae). You can read engineering details about how we built AcraCensor in [our blog](https://www.cossacklabs.com/blog/how-to-build-sql-firewall-acracensor.html).

### Launching AcraCensor

AcraCensor is a built-in component of AcraServer, so it starts running when AcraServer does if the path to its configuration file is provided. You can provide a path for AcraCensor's configuration file using `--acracensor_config_file` parameter on the command line or in [`acra-server.yaml`](https://github.com/cossacklabs/acra/blob/master/configs/acra-server.yaml) configuration file.

You can find a basic example configuration file [`configs/acra-censor.example.yaml`](https://github.com/cossacklabs/acra/blob/master/configs/acra-censor.example.yaml) in our GitHub repository. More real-world examples are available in the [AcraCensor demo project](https://github.com/cossacklabs/acra-censor-demo). You can use these examples as a template for your own, using the database of your choice.

Starting AcraCensor using exact configuration file:

```
acra-server \
    --acracensor_config_file=configs/acra-censor.example.yaml \
    --client_id=client_name \
    --incoming_connection_host=acra.connector.host \
    --db_host=postgresql.db.host 
```

Refer to the [AcraServer]({{< ref "/acra/configuring-maintaining/general-configuration/acra_server.md" >}}) documentation for details on configuration parameters.

### Configuring AcraCensor rules

The configuration file describes how AcraCensor should process the incoming SQL queries – log, pass, block, ignore. Each action is described by the corresponding handler. Handlers are considered in specified order, from top to bottom.

We suggest the following structure of handlers for better security: put `query_capture` first to log every query into the `censor.log`, then put `query_ignore` to ignore some database-specific control queries that occur when the database is starting and when the database drives check the connections, then put the `deny` handler to block all the unwanted queries, then put the `allow` handler to allow some specific "normal" queries.
{{< hint info >}}
Note: any change in the AcraCensor configuration file require AcraServer restart to apply changes.
{{< /hint >}}

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

Starting with Acra [0.85.0 release](https://github.com/cossacklabs/acra/releases/tag/0.85.0) in March 2019, we introduced a more flexible configuration format for AcraCensor rules.

AcraServer v0.85+ will work with AcraCensor's configuration file versioned 0.85 and above. AcraServer doesn't support configuration files that have an old format, all users must migrate to the new format.

The migration procedure consists of the following steps:

- rename `blacklist` handler to `deny` handler
- rename `whitelist` handler to `allow` handler
- add version line on the top of the file: 
  ```yaml
  "version: 0.85.0"
  ```

These are all required steps to make your previous configuration file compatible with new AcraServer/AcraCensor versions.


### Allowlist and denylist

There are several handler types for AcraCensor:

- The `allow` handler - blocks everything by default, but allows specific queries or queries that match specific patterns and access to specific tables. If the `allowall` handler is a final statement of a configuration file, it means that all the queries that were not processed by previous handlers are allowed.

- The `deny` handler - allows everything by default, but blocks specific queries or queries that match specific patterns and access to the specific tables.
For each handler you need to specify what queries it applies to:

- [`queries`]({{< ref "/acra/security-controls/sql-firewall/queries_filter.md" >}}) — match the queries literally with the provided list
- [`tables`]({{< ref "/acra/security-controls/sql-firewall/table_filter.md" >}}) — match the queries affecting the specified tables
- [`patterns`]({{< ref "/acra/security-controls/sql-firewall/pattern_filter.md" >}}) — match the queries by SQL statement patterns

You can configure the allowlist and the denylist separately or simultaneously.
Rules are checked in the order they appear in the configuration until one of them matches,
which decides what to do with the query: either allow or deny it.
Within each rule, `queries` are matched first,  followed by `tables`, and then `patterns`.




### Prepared statements

The root of the SQL injection problem is that the code and the data (withing SQL query) can get mixed up and be mistaken for each other. SQL prepared statements help to separate code execution from the data itself.

AcraCensor has limited support of filtering prepared statements. AcraCensor doesn't apply `allow` and `deny` rules to SQL requests with prepared statements. However, it's possible to use `query_capture` and `query_ignore` to filter the whole statement when necessary (through comparing the incoming SQL char-by-char with the SQL from the config file).


### Ignoring specific queries

It might be useful to skip allowlist/denylist rules for certain SQL queries, for example, the queries performed during database connection initialisation.
If a query is ignored, AcraCensor won't apply any rules to it and will pass this query to the database verbatim.

```yaml
- handler: query_ignore
  queries:
    # mysql queries AcraCensor will ignore
    - ROLLBACK
    - SET AUTOCOMMIT = 0
    - SHOW VARIABLES LIKE 'sql_mode'
    - show collation where `Charset` = 'utf8' and `Collation` = 'utf8_bin'
```

To ignore some queries, put them to the `query_ignore` handler. AcraCensor compares each input query with queries from the `query_ignore` list. If there is a match, the query is allowed through and no allow/deny handlers are applied.

We suggest looking into [`tests/acra-censor_configs`](https://github.com/cossacklabs/acra/tree/master/tests/acra-censor_configs) to see which PostgreSQL and MySQL queries we ignore when running integration tests.

### Handling parsing errors

AcraCensor is not a database engine and it might not be able to parse all possible SQL queries.
It's potentially dangerous to send unrecognized queries to the database as they might contain SQL injections.
So for security reasons, by default, AcraCensor blocks any queries it cannot understand.

However, some of these queries might be totally legit.
AcraCensor can be configured to allow the queries it cannot parse to pass through to the database:

```yaml
ignore_parse_error: false
```

By default, `ignore_parse_error` is false and AcraCensor will block queries that cause parsing errors.
Setting it to `true` makes AcraCensor ignore parsing errors and send such queries to the database.
This allows developers to configure AcraCensor rules during the development and integration stages
by observing [AcraCensor logs](#logging-errors) while the application is running.

In a production environment, security-oriented users keep `ignore_parse_error` disabled.
Any exceptional queries are added to the `query_ignore` list manually,
resulting in a well-defined and secure firewall configuration.

{{< hint info >}}
If you encounter parsing errors for valid SQL queries,
please [file an issue on GitHub](https://github.com/cossacklabs/acra/issues/new)
or send us a pull request with a fix.
We will look into it and try to help.
{{< /hint >}}


### Logging and masking queries

It’s very important that AcraCensor doesn’t log sensitive data. That’s why the first thing AcraCensor does is masking the values in SQL queries’ logs. All values from SQL queries are edited and masked to `replaced` keyword.

This is what the logs from AcraCensor look like:

```
select * from accounts where cid = :replaced1
insert into hitlog(hostname, ip, browser, referer, `date`) values (:replaced1, :replaced2, :replaced3, :replaced4, now())
insert into accounts(username, password, mysignature) values (:replaced1, :replaced2, :replaced3)
```

#### Logging errors

Sometimes AcraCensor can't parse a query and it is useful to have a separate log for these
which comes handy for debugging and configuration.
You can provide a path to this log file with `parse_errors_log`:

```yaml
parse_errors_log: unparsed_queries.log
```

{{< hint warning >}}
**Warning:**
Be careful, parse error log contains verbatim queries, without any masking.
Make sure to avoid exposing sensitive information from this log.
{{< /hint >}}

#### Logging unique queries

You might need to have a separate log file that contains all unique queries that AcraCensor processes –
or even multiple log files, for each stage of processing.

The `query_capture` handler logs queries that pass through it. Depending on the position of this handler in the configuration file, it will log more or fewer queries. For example, if you place this handler below the `deny` handler, you won't see the queries blocked on the previous step.

You can use this handler to log unique queries, and then use this log to improve your allow/deny configurations. AcraCensor won't log queries that can't be parsed (use `parse_errors_log` for this).

To activate query logging, define `query_capture` handler with the log file path.
(AcraCensor will create the file if it does not exist).

```yaml
- handler: query_capture
  filepath: "path/to/query.log"
```

This is how `query_capture.log` content looks like (real values are being masked):

```
{"raw_query":"commit","_blacklisted_by_web_config":false}
{"raw_query":"update pg_settings set setting = :replaced1 where name = :replaced2","_blacklisted_by_web_config":false}
{"raw_query":"select data from test where id = :replaced1","_blacklisted_by_web_config":false}
```

### Security-wise configurations

Despite the fact that AcraCensor can be configured in many ways, we suggest the following structure of handlers for better security:

- Put `query_capture` first to log every query into a log file.
- Next, specify `query_ignore` to ignore some database-specific control queries that occur when the database driver initializes and checks the connection.
- Following the secure by default technique, add an `allow` handler to allow listed queries.
- Finally, use a `denyall` handler to block all queries that are not explicitly allowed.

There is also a less secure (but sometimes appropriate) approach using the `deny` handler to block a certain list of unwanted queries, followed by `allowall` handler allowing everything else.

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