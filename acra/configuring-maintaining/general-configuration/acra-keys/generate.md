---
title: generate
weight: 2
---

# generate

**`generate`** is `acra-keys` subcommand used for generating keys (for both `v1`, `v2` keystore versions).

# Command line flags

### General flags

* `--client_id=<id>` 🔴

  Use provided ClientID as identifier to generate keys or keypairs.

* `--tls_cert=<path>`

  Path to TLS certificate to use as ClientID identifier. Works only when passed empty ClientID: `--client_id=""`.

* `--tls_identifier_extractor_type={distinguished_name|serial_number}`

  Decide which field of TLS certificate to use as ClientID.

  * `distinguished_name` — certificate Distinguished Name (DN)
  * `serial_number` — certificate serial number

  By default, certificate `distinguished_name` is used as ClientID.

* `--keystore=<v1|v2>` 🔴

  Set keystore format.
  Read more about [keystore versions]({{< ref "/acra/security-controls/key-management/versions/" >}}).

  This option is required for newly created keystores.

### Storage destination

#### Filesystem

* `--keys_dir=<path>`

  Folder from which keys will be loaded.
  Default is `.acrakeys`.

* `--keys_dir_public=<folder>`

  Path to public key directory for `--keystore=v1` format.
  (Ignored for `--keystore=v2`.)

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

## Generating keys

{{< hint warning >}}
**Note:**
Back up all your keys before calling `acra-keys generate` with any flag described below.
Some keys can be rotated and the previous keys will be retained,
while some keys will be overwritten.
{{< /hint >}}

### Acra master key

* `--master_key_path=<path>`

  Generate a new random master key and write it to the specified file.

  Acra components might expect this key in `ACRA_MASTER_KEY` [environment variable or read from KMS](/acra/configuring-maintaining/key-storing/kms-integration/).
  

{{< hint info >}}
**Note:**
When you generate a new key (or keypair), the existing key is rotated.
That is, the new key becomes the default for encryption in [AcraServer](/acra/acra-in-depth/architecture/acraserver/)
while the previous key is archived and used only for decryption.
{{< /hint >}}

### Transport keys

* `--acraconnector_transport_key`

  Generate a new transport keypair for AcraConnector.

* `--acraserver_transport_key`

  Generate a new transport keypair for AcraServer.

* `--acratranslator_transport_key`

  Generate a new transport keypair for AcraTranslator.


### AcraServer & AcraTranslator keys

* `--search_hmac_symmetric_key`

  Generate a new key for HMAC calculation and searchable encryption.

* `--audit_log_symmetric_key`

  Generate a new symmetric key for log integrity checks.

* `--poison_record_keys`

  Generate a new keypair and symmetric key for poison records.

* `--client_storage_symmetric_key`

  Generate a new symmetric key for data encryption/decryption with AcraBlock.

* `--client_storage_key`

  Generate keypair for data encryption/decryption (for a client).


### AcraServer & AcraAuthManager keys

{{< hint warning >}}
AcraAuthManager tool is deprecated and will not be available since 0.91.0.
{{< /hint >}}

* `--acrawebconfig_symmetric_key`

  Generate a new symmetric key for encrypting AcraWebconfig's basic authentication credentials.


### Zone keys

* `--zone`

  Generates new Zone keypair (without symmetric key).

* `--zone_storage_key`

  Rotates existing Acra Zone by generating new storage keypair and changing current to read-only state, for decryption purposes only.

  Should be provided with `--zone_id` flag.


* `--zone_symmetric_key`

  Rotates existing Acra Zone by generating new storage symmetric key and changing current to read-only state, for decryption purposes only.

  Should be provided with `--zone_id` flag.


* `--zone_id`

  Zone ID should be used for `zone_storage_key` generating.


  🔴 - flags required to be specified.
  > Exception: `--client_id` is not required when generating only poison record keys
