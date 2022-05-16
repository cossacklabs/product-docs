---
title: Debugging and troubleshooting
weight: 12
---

# Debugging and troubleshooting

## Verbose logging

In order to get more logs from AcraConnector, AcraServer or AcraTranslator, you can add `-v` (or even `-d`) flags to their configuration.
You can also switch `-d` flag in running AcraServer using [acra-webconfig](/acra/configuring-maintaining/general-configuration/acra-webconfig/) (deprecated since 0.91.0).

A lot of things may become clear:
* wrong hosts/ports in configuration
* problems with TLS certificates
* inability to find keys for clients/zones

## Tracing

When requests are taking much more time that you have expected,
[analyzing traces](/acra/configuring-maintaining/tracing/) may give you hints about which place is the bottleneck.

## TLS

### Configuration

While AcraTranslator only have one direction, to clients that perform requests,
AcraServer accepts connections while also connects to the database.

If certificates used on different sides of AcraServer are signed by different authorities,
you should separate the configuration by using `--tls_client_*` and `--tls_database_*`
[flags]({{< ref "acra/configuring-maintaining/general-configuration/acra-server/#tls" >}}) respectively.

### Versions and ciphers

Acra only supports TLS `>= 1.2`, and [only secure cipher suites]({{< ref "acra/getting-started/requirements/#tls" >}}).
One of the reasons TLS connection may fail is because  two peers do not have any TLS version + cipher in common.

## Redis

### Database number

Among usual options like username/password for authentication,
Redis also needs database number (index), and if this number is different in different places,
you may end up writing into one place and reading from a completely different one.

Acra binaries have these two flags for such purpose:
* `--redis_db_keys=<id>` — Redis database number to use. Default is `0`.
* `--redis_db_tokens=<id>` — Number of Redis database for tokens. Default is `0`.

For `redis-cli` this option is described as `-n <db> Database number`.

### Checking content

If AcraServer/AcraTranslator are complaining about inability to find a key for some client ID or zone ID,
but you remember that the keys were generated successfully and should be stored in Redis,
you may try to double check their existence:

* Use [`acra-keys list`]({{< ref "acra/configuring-maintaining/general-configuration/acra-keys/list.md" >}})
  to list all keys
* Use [`acra-keys read`]({{< ref "acra/configuring-maintaining/general-configuration/acra-keys/read.md" >}})
  to get information about the particular key
* Run `redis-cli --scan --pattern '*'` to list what is stored in Redis,
  if the client/zone ID exists, it will appear in the output (most likely with some suffix in the "file" name)

BTW, first two commands work with the usual filesystem keystore as well, just omit the `--redis_host_port` flag.

## PostgreSQL

### Acra's custom errors in transactions
There is one pitfall with `response_on_fail: error` option if you use transactions in Postgres. The state of a transaction is stored on the database side and is changed in case of an error. When the state is changed, `COMMIT` statement does a rollback:
```
test=# BEGIN;
BEGIN
test=*# SELECT 1/0;
ERROR:  division by zero
test=!# COMMIT;
ROLLBACK
```

The way Acra works is by intercepting and changing packets between a user and a database. Therefore, if there is a decryption error, it happens purely on the Acra side. The latter sends an error packet to the user instead of a data row. But unfortunately, it cannot and doesn't change the state of the database:
```
test=# BEGIN;
BEGIN
test=*# SELECT data FROM testtable;
ERROR:  encoding error in column "data"
test=# COMMIT;
COMMIT
```

Though most of the db-drivers do an explicit `ROLLBACK` in case of an error, so it should not be a problem.

## Data types

AcraServer only supports storing AcraStructs/AcraBlocks in `bytea` column types and supports 3 types of binary data encoding from PostgreSQL:
[hex](https://www.postgresql.org/docs/current/datatype-binary.html#AEN5755),
[escape](https://www.postgresql.org/docs/current/datatype-binary.html#AEN5764),
and `binary` (when client libraries use [extended query protocol](https://www.postgresql.org/docs/current/protocol-overview.html#PROTOCOL-QUERY-CONCEPTS) with the [binary](https://www.postgresql.org/docs/current/protocol-overview.html#PROTOCOL-FORMAT-CODES) format).
