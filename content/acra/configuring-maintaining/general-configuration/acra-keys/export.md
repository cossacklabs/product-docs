---
title: export
weight: 4
---

# export

**`export`** is `acra-keys` subcommand used for exporting keys of the keystore version `v2`.

## Command line flags

### General flags

* `--key_bundle_file=<path>` 🔴

  Path to output file for exported key bundle.

* `--key_bundle_secret=<path>` 🔴

  Path to input file for key encryption keys.

* `--all`

  Export all keys from keystore to output file.

### Storage destination

#### Filesystem

* `--keys_dir=<path>`

  Path to keystore folder. 
  Default is `.acrakeys`.

* `--keys_dir_public=<path>`

  Path to key folder for public keys.


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


#### HashiCorp Vault

`acra-keys` can read `ACRA_MASTER_KEY` from HashiCorp Vault instead of environment variable.

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

  🔴 - flags required to be specified.


## Usage example

Using **`export`** subcommand of `acra-keys` you can easily exchange keys from different Acra components like AcraServer and AcraConnector.
Before [`keys import`]({{< ref "/acra/configuring-maintaining/general-configuration/acra-keys/import" >}}), you should export keys to produce output file with exported keys(`key_bundle_file` and `key_bundle_secret`):

```
$ acra-keys export --key_bundle_file "encrypted-keys.dat" --key_bundle_secret "access-keys.json" client/user/transport/server
```

To export all keys into one output file, you can specify `all` flag:

```
$ acra-keys export --key_bundle_file "encrypted-keys.dat" --key_bundle_secret "access-keys.json" --all
```

{{< hint info >}}
**Note:**
For more detailed information about keys exchanging you can reference [key management]({{< ref "/acra/security-controls/key-management/operations/backup#3-exchanging-public-keys" >}}) section.
{{< /hint >}}

