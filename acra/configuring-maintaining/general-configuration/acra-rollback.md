---
title: acra-rollback
bookCollapseSection: true
weight: 10
---

# acra-rollback

`acra-rollback` is a command-line utility that help you generate a clean SQL dump from an existing protected one. 
Rollback utility especially applicable in case of any DB rollback - keys re-generating, go from a Zoneless mode to using Zones or vice-versa etc. 

## Command line flags

### General flags

* `--mysql_enable={true|false}` ❗

  Handle MySQL connections. Default is `false`.

* `--postgresql_enable={true|false}` ❗

  Handle PostgreSQL connections. Default is `false`.

* `--client_id=<id>`

  Client ID should be name of file with private key.

* `--connection_string=<host:port>`

  Connection string for db.

* `--select=<select_query>`

  Query to fetch data for decryption.

* `--insert=<insert_query>`

  Query to insert decrypted data with placeholders (pg: $n, mysql: ?).

* `--zonemode_enable={true|false}`

  Turn on zone mode. Default is `false`.

* `--execute={true|false}`

  Execute inserts. Default is `false`.

* `--escape={true|false}`

  Escape bytea format. Default is `false`.


### Storage destination

#### Filesystem

* `--keys_dir=<path>`

  Path to keystore directory. Default is `.acrakeys`.

* `--output_file=<path>`

  File for store inserts queries. Default is `decrypted.sql`.

#### Redis

* `--redis_db_keys=<number>`

  Redis database number to use.
  Default is `0`.
  <!-- `acra-server -help` says default is `-1` but in `cmd/redis.go` I see `redisDefaultDB = 0` -->
  <!-- this var is also used as default value for the flag, where's the truth? -->

* `--redis_host_port=<host:port>`

  Address of Redis database to use as keystore.
  If not specified, Redis is not used.

* `--redis_password=<password>`

  Password to Redis database.


### HashiCorp Vault

`acra-addzone` can read `ACRA_MASTER_KEY` from HashiCorp Vault instead of environment variable.

* `--vault_connection_api_string=<url>`

  Connection string (like `https://example.com:8200`) for connecting to HashiCorp Vault.
  If not specified, `ACRA_MASTER_KEY` environment variable will be used.

* `--vault_secrets_path=<kv-path>`

  Path to KV Secrets directory in Vault used to store `ACRA_MASTER_KEY`.
  Default is `secret/`.

* `--vault_tls_ca_path=<path>`

  Path to CA certificate bundle to use for HashiCorp Vault certificate validation.

  If not specified, use root certificates configured in system.

* `--vault_tls_client_cert=<path>`

  Path to client TLS certificate used to connect to HashiCorp Vault.

  If not specified, don't send client certificate.

* `--vault_tls_client_key=<path>`

  Path to the private key of the client TLS certificate used to connect to HashiCorp Vault.

  If not specified, don't send client certificate.

* `--vault_tls_transport_enable={true|false}`

  Use TLS to encrypt transport with HashiCorp Vault.
  Default is `false`.

❗ - flags required to be specified.
  
## Output

```
$ acra-addzone
INFO[0000] Disabling future logs... Set -v to see logs  
INFO[0000] Initializing ACRA_MASTER_KEY loader...       
INFO[0000] Initialized default env ACRA_MASTER_KEY loader 
{"id":"DDDDDDDDlMeojXNMDnMhrFNN","public_key":"VUVDMgAAAC1IbMPQAknSveiUj4xWzi7ZX50uzT+4/cbT7Tz5wZBbyDGAa3u8"}
```

Logs have written to `stderr` and `JSON` output with Zone data have written to `stdout`. To get only JSON output you can redirect `stderr` to `/dev/null`:

```
$ acra-addzone 2>/dev/null
{"id":"DDDDDDDDitpDYzEmbXWbBZzG","public_key":"VUVDMgAAAC1PF4yhAtF0ygbsRlEBMjY0E+9Pp694hauHyQfjC8gVAuOQJ0CX"}
```
