---
title: acra-addzone
weight: 10
---

# acra-addzone

`acra-addzone` is a command-line utility that generates new [Zone keys](/acra/security-controls/zones/) for AcraBlocks/AcraStructs.

## Command line flags

### Configuration files

* `--config_file=<filename>`

  Path to YAML configuration file.

* `--dump_config`

  Dump configuration to `configs/acra-addzone.yaml`.

* `--generate_markdown_args_table`

  Generate markdown file with text description of all flags.
  Output file is `configs/markdown_acra-addzone.md`.
  Works in a pair with `--dump_config`.
  
### Logging

* `-v`

  Log to stderr all `INFO`, `WARNING` and `ERROR` logs.


### Storage destination

#### Filesystem

* `--keys_output_dir=<path>`

  Path to keystore directory.

  Default is `.acrakeys`.

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
