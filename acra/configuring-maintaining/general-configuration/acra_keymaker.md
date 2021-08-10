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
  
  Set keystore format. If `--keys_output_dir` points to existing keystore destination then `acra-keymaker` automatically detects version of keystore.
  If destination storage is empty and hasn't any key then this argument is required. Read more about [keystore versions]({{< ref "/acra/keys/versions/" >}})
  
### Storage destination

#### Filesystem

* `--keys_output_dir=<folder>`
  
  Folder where will be saved keys (you can change destination for asymmetric public keys with keystore V1 (V2 store at same destination)  with parameter `--keys_public_output_dir`).  
  Default is `.acrakeys`.

* `--keys_public_output_dir=<folder>`
  
  Folder where will be saved public asymmetric keys. Works only for `--keystore=v1` and do nothing with `--keystore=v2`.
  Default is `.acrakeys`.
  
#### Redis

* `--redis_db_keys=`

  Number of Redis database for keys.
  Default is `0`.
  <!-- `acra-server -help` says default is `-1` but in `cmd/redis.go` I see `redisDefaultDB = 0` -->
  <!-- this var is also used as default value for the flag, where's the truth? -->

* `--redis_host_port=<host:port>`

  `<host:port>` used to connect to Redis.
  Default is empty (don't connect).

* `--redis_password=<password>`

  Password to Redis database.


### Configuration files

* `--config_file=<filename>`

  Path to YAML configuration file.

* `--dump_config`

  Dump configuration to `configs/acra-translator.yaml`.

* `--generate_markdown_args_table`

  Generate markdown file with text description of all flags.
  Output file is `configs/markdown_acra-translator.md`.
  Works in pair with `--dump_config`.

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
  
### Common keys

{{< hint warning >}}
Note: backup all your keys before calling `acra-keymaker` with any flag described below. Some of them rotate and save current keys, 
some of them may override current keys.
{{< /hint >}}

* `--generate_master_key`
  
  Create new random master key acceptable by all Acra tools and save to file.

{{< hint info >}}
Note: When you generate any new type of key (or keypair) described below it rotates current key. After that new key becomes default 
for encryption purposes in [Transparent proxy mode]({{< ref "/acra/configuring-maintaining/general-configuration/acra_server.md#transparent-proxy-mode-INVALID" >}}) 
and archive previous key that used only for decryption purposes
{{< /hint >}}
  
### Transport keys

* `--generate_acraconnector_keys`
  
  Create new transport keypair for AcraConnector.

* `--generate_acraserver_keys`
  
  Create new transport keypair for AcraServer.

* `--generate_acratranslator_keys`
  
  Create new transport keypair for AcraTranslator.


### AcraServer & AcraTranslator keys


* `--generate_acrawriter_keys`
  
  Create storage keypair for data encryption/decryption with AcraStruct.
  
* `--generate_hmac_key`
  
  Create key for HMAC calculation and searchable encryption.
  
* `--generate_log_key`
  
  Create key symmetric key for secure logging.
  
* `--generate_poisonrecord_keys`
  
  Create keypair and symmetric key for poison records.
  
* `--generate_symmetric_storage_key`
  
  Create symmetric key for data encryption/decryption with AcraBlock.

  
### AcraServer & AcraAuthManager keys

* `--generate_acrawebconfig_keys`
  
  Create symmetric key for encryption AcraWebconfig's basic auth credentials.
  {{< hint warning >}}
  Note: this key is not rotatable and this flag replaces current with new one.
  {{< /hint >}}


