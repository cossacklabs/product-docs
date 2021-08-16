---
title: AcraKeymaker
bookCollapseSection: true
---

# AcraKeymaker

## Command line flags

### General flags

* `--client_id=<id>`
  
  Use provided client ID as identifier to generate keys or keypairs.

* `--tls_cert=<path>`
  
  Path to TLS certificate to use as client_id identifier. Works only when passed empty ClientID: `--client_id=""`.

* `--tls_identifier_extractor_type={distinguished_name|serial_number}`
  
  Decide which field of TLS certificate to use as ClientID.

  * `distinguished_name` — (default) certificate Distinguished Name (DN).
  * `serial_number` — certificate serial number.

* `--keystore=<v1|v2>`
  
  Set keystore format.
  Read more about [keystore versions]({{< ref "/acra/keys/versions/" >}}).
  
  This option is required for newly created keystores.
  If `--keys_output_dir` points to existing keystore then `acra-keymaker` automatically detects the version of the keystore.
  
### Storage destination

#### Filesystem

* `--keys_output_dir=<folder>`
  
  Folder where will be saved keys (you can change destination for asymmetric public keys with keystore V1 (V2 store at same destination)  with parameter `--keys_public_output_dir`).  
  Default is `.acrakeys`.

* `--keys_public_output_dir=<folder>`
  
  Folder where will be saved public asymmetric keys. Works only for `--keystore=v1` and do nothing with `--keystore=v2`.
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


### Configuration files

* `--config_file=<path>`

  Path to YAML configuration file.

* `--dump_config`

  Dump configuration to `configs/acra-keymaker.yaml`.

* `--generate_markdown_args_table`

  Generate markdown file with text description of all flags.
  Output file is `configs/markdown_acra-keymaker.md`.
  Works in pair with `--dump_config`.

### HashiCorp Vault

`acra-keymaker` can read `ACRA_MASTER_KEY` from HashiCorp Vault instead of environment variable.

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
Back up all your keys before calling `acra-keymaker` with any flag described below.
Some keys can be rotated and the previous keys will be retained,
while some keys will be overwritten.
{{< /hint >}}

### Acra master key

* `--generate_master_key=<path>`

  Generate a new random master key and write it to the specified file.

  All Acra components will expect this key in `ACRA_MASTER_KEY` environment variable.

{{< hint info >}}
**Note:**
When you generate a new key (or keypair), the existing key is rotated.
That is, the new key becomes the default for encryption in [Transparent proxy mode]({{< ref "/acra/configuring-maintaining/general-configuration/acra_server.md#transparent-proxy-mode-INVALID" >}})
while the previous key is archived and used only for decryption.
{{< /hint >}}
  
### Transport keys

* `--generate_acraconnector_keys`
  
  Generate a new transport keypair for AcraConnector.

* `--generate_acraserver_keys`
  
  Generate a new transport keypair for AcraServer.

* `--generate_acratranslator_keys`
  
  Generate a new transport keypair for AcraTranslator.


### AcraServer & AcraTranslator keys

* `--generate_acrawriter_keys`
  
  Generate a new storage keypair for data encryption/decryption with AcraStruct.
  
* `--generate_hmac_key`
  
  Generate a new key for HMAC calculation and searchable encryption.
  
* `--generate_log_key`
  
  Generate a new key symmetric key for audit logging.
  
* `--generate_poisonrecord_keys`
  
  Generate a new keypair and symmetric key for poison records.
  
* `--generate_symmetric_storage_key`
  
  Generate a new symmetric key for data encryption/decryption with AcraBlock.

  
### AcraServer & AcraAuthManager keys

* `--generate_acrawebconfig_keys`
  
  Generate a new symmetric key for encrypting AcraWebconfig's basic authentication credentials.

  {{< hint warning >}}
  **Note:** This key cannot be rotated. Newly generated key replaces the current one.
  {{< /hint >}}
