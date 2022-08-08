---
title: migrate
weight: 6
---

# migrate

**`migrate`** is `acra-keys` subcommand used for migration from keystore type `v1` to `v2`.

## Command line flags

**`migrate`** subcommand contains general cli flags with prefixes `src` and `dst`, where `dst_*` flags are related to new keystore (destination) and
`src_*` to old one (source).

### General flags

* `--{src|dst}_keystore=<v1|v2>` 🔴

  Set keystore format.
  Read more about [keystore versions]({{< ref "/acra/security-controls/key-management/versions/" >}}).

* `--dry_run`

  Try migration without writing to the output keystore.

* `--force`

  Write to output keystore even if it exists.

### Storage destination

#### Filesystem

* `--{src|dst}_keys_dir=<path>` 🔴

  Path to keystore folder.

* `--{src|dst}_keys_dir_public=<path>`

  Path to key directory for public keys.


#### Redis

* `--{src|dst}_redis_db_keys=<number>`

  Redis database number to use.
  Default is `0`.
  <!-- `acra-server -help` says default is `-1` but in `cmd/redis.go` I see `redisDefaultDB = 0` -->
  <!-- this var is also used as default value for the flag, where's the truth? -->

* `--{src|dst}_redis_host_port=<host:port>`

  Address of Redis database to use as keystore.
  If not specified, Redis is not used.

* `--{src|dst}_redis_password=<password>`

  Password to Redis database.

### KMS

* `--kms_type=<type>`

  Specify your KMS.
  Currently supported KMS types:
  * `aws` - AWS Key Management Service

* `--kms_credentials_path=<filepath>`

  A path to a file with KMS credentials JSON format.

  Example of KMS config:
* **AWS**:
  ```json
     {"access_key_id":"<access_key_id>","secret_access_key":"<secret_access_key>","region":"<region>"}
  ```

{{< hint info >}}
**Note**:
Should be provided only with `--keystore_encryption_type=<kms_encrypted_master_key|kms_per_client>` flags.
{{< /hint >}}

#### HashiCorp Vault

`acra-keys` can read `ACRA_MASTER_KEY` from HashiCorp Vault instead of environment variable.

* `--{src|dst}_vault_connection_api_string=<url>`

  Connection string (like `https://example.com:8200`) for connecting to HashiCorp Vault.
  If not specified, `ACRA_MASTER_KEY` environment variable will be used.

* `--{src|dst}_vault_secrets_path=<kv-path>`

  Path to KV Secrets directory in Vault used to store `ACRA_MASTER_KEY`.
  Default is `secret/`.

* `--{src|dst}_vault_tls_ca_path=<path>`

  Path to CA certificate bundle to use for HashiCorp Vault certificate validation.

  If not specified, use root certificates configured in system.

* `--{src|dst}_vault_tls_client_cert=<path>`

  Path to client TLS certificate used to connect to HashiCorp Vault.

  If not specified, don't send client certificate.

* `--{src|dst}_vault_tls_client_key=<path>`

  Path to the private key of the client TLS certificate used to connect to HashiCorp Vault.

  If not specified, don't send client certificate.

* `--{src|dst}_vault_tls_transport_enable={true|false}`

  Use TLS to encrypt transport with HashiCorp Vault.
  Default is `false`.

{{< hint info >}}
**Note**:
Should be provided only with `--keystore_encryption_type=<vault_master_key>` flag.
{{< /hint >}}

  🔴 - flags required to be specified.


{{< hint info >}}
**Note:**
You can find out an example how to use `acra-keys` **`migrate`** in [keystore versions]({{< ref "/acra/security-controls/key-management/versions/migrate-v1-to-v2" >}}) section.
{{< /hint >}}
