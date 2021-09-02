---
title: acra-addzone
bookCollapseSection: true
weight: 10
---

# acra-addzone

`acra-addzone` is command-line utility that generates new Zone keys for AcraBlocks/AcraStructs and logs to `stdout` JSON object with new generated ZoneID and public key.

## Command line flags

### Configuration files

* `--config_file=<filename>`

  Path to YAML configuration file.

* `--dump_config`

  Dump configuration to `configs/acra-server.yaml`.

* `--generate_markdown_args_table`

  Generate markdown file with text description of all flags.
  Output file is `configs/markdown_acra-server.md`.
  Works in pair with `--dump_config`.
  
### Logging

* `-v`

  Log to stderr all `INFO`, `WARNING` and `ERROR` logs.


### Storage destination

#### Filesystem

* `--keys_output_dir=<folder>`

  Folder where will be saved keys.  
  Default is `.acrakeys`.
  
* `--fs_keystore_enable`
  Use filesystem keystore (deprecated, ignored)
  Default is `true`.

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


### Vault

* `--vault_connection_api_string=<url>`

  Connection string (like `http://x.x.x.x:yyyy`) for loading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is empty (`ACRA_MASTER_KEY` environment variable is expected).

* `--vault_secrets_path=<path>`

  KV Secret Path for reading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is `secret/`.

* `--vault_tls_ca_path=<filename>`

  Path to CA certificate for HashiCorp Vault certificate validation.
  Default is empty (use root certificates configured in system).

* `--vault_tls_client_cert=<filename>`

  Path to client TLS certificate for reading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is empty (don't send client certificate).

* `--vault_tls_client_key=<filename>`

  Path to private key of the client TLS certificate for reading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is empty (don't send client certificate).

* `--vault_tls_transport_enable={true|false}`

  Use TLS to encrypt transport with HashiCorp Vault.
  Default is `false`.
  
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
