---
title: acra-keymaker
weight: 5
---

# acra-keymaker


## Command line flags

### General flags

* `--client_id=<id>`
  
  Use provided ClientID as identifier to generate keys or keypairs.

* `--tls_cert=<path>`
  
  Path to TLS certificate to use as ClientID identifier. Works only when passed empty ClientID: `--client_id=""`.

* `--tls_identifier_extractor_type={distinguished_name|serial_number}`
  
  Decide which field of TLS certificate to use as ClientID.

  * `distinguished_name` — certificate Distinguished Name (DN)
  * `serial_number` — certificate serial number
  
By default, certificate Distinguished Name is used as ClientID.

* `--keystore=<v1|v2>`
  
  Set keystore format.
  Read more about [keystore versions]({{< ref "/acra/security-controls/key-management/versions/" >}}).
  
  This option is required for newly created keystores.
  If `--keys_output_dir` points to existing keystore then `acra-keymaker` automatically detects the version of the keystore.
  
### Storage destination

#### Filesystem

* `--keys_output_dir=<path>`

  Path to keystore directory.

  Default is `.acrakeys`.

* `--keys_public_output_dir=<folder>`

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

* `--redis_tls_client_auth=<mode>`

  Set authentication mode that will be used for TLS connection with Redis.

  * `0` — do not request client certificate, ignore it if received;
  * `1` — request client certificate, but don't require it;
  * `2` — expect to receive at least one certificate to continue the handshake;
  * `3` — don't require client certificate, but validate it if client actually sent it;
  * `4` — (default) request and validate client certificate.

  These values correspond to [crypto.tls.ClientAuthType](https://golang.org/pkg/crypto/tls/#ClientAuthType).

* `--redis_tls_client_ca=<filename>`

  Path to additional CA certificate for Redis' certificate validation.
  Empty by default.


* `--redis_tls_client_cert=<filename>`

  Path to server TLS certificate presented to Redis.
  Empty by default.


* `--redis_tls_client_key=<filename>`

  Path to private key of the TLS certificate presented to Redis.
  Empty by default.


* `--redis_tls_client_sni=<SNI>`

  Expected Server Name (SNI) of the Redis instance. Will be used `--redis_host_port` value if is empty.
  Empty by default.


* `--redis_tls_crl_client_cache_size=<count>`

  How many CRLs to cache in memory in connections to Redis.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.


* `--redis_tls_crl_client_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds for connections to Redis.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.


* `--redis_tls_crl_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Redis' certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.


* `--redis_tls_crl_client_from_cert=<policy>`

  How to treat CRL's URL described in a certificate from Redis server

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--redis_tls_crl_client_url` flags.


* `--redis_tls_crl_client_url=<url>`

  CRL's URL for outcoming TLS connections to Redis.
  Empty by default.


* `--redis_tls_enable=<true|false>`

  Turns on/off TLS for connection with Redis to `--redis_host_port` endpoint.

  * `true` — turns on
  * `false` — (default) turns off.


* `--redis_tls_ocsp_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Redis' certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no OCSP's URL configured and there is no OCSP's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know whom to ask about them.


* `--redis_tls_ocsp_client_from_cert=<policy>`

  How to treat OCSP server URL described in a certificate from Redis server

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--redis_tls_ocsp_client_url` flags.


* `--redis_tls_ocsp_client_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested Redis' certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and
    continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration


* `--redis_tls_ocsp_client_url=<url>`

  OCSP service URL for outgoing TLS connections to check Redis' certificates.
  Empty by default.


### Configuration files

* `--config_file=<path>`

  Path to YAML configuration file.

* `--dump_config`

  Dump configuration to `configs/acra-keymaker.yaml`.

* `--generate_markdown_args_table`

  Generate markdown file with text description of all flags.
  Output file is `configs/markdown_acra-keymaker.md`.
  Works in a pair with `--dump_config`.

### Keystore

* `--keystore_encryption_type=<strategy>`

  Keystore encryption strategy.
  Currently supported strategies:
  * **`env_master_key`** (**Default**) - Keystore using Acra Master Key, loaded from ENV (`ACRA_MASTER_KEY`) variable;
  * **`vault_master_key`** -  Keystore using Acra Master Key, loaded from Hashicorp Vault
  * **`kms_encrypted_master_key`** - Keystore using Acra Master Key, loaded from ENV `ACRA_MASTER_KEY` variable and decrypted
    via KMS key-encryption key.
  * **`kms_per_client`** - Keystore using KMS for decryption Acra keys per ClientID and ZoneID (zones are deprecated since 0.94.0, will be removed in 0.95.0).
    Create corresponded key-encryption keys on KMS if not present on KMS.

### KMS

* `--kms_type=<type>`

  Specify your KMS.
  Currently supported KMS types:
  * `aws` - AWS Key Management Service

* `--kms_key_policy=<policy>`

  KMS usage key policy. 
  Supported key policies:
  * `create` - create a key encryption key on KMS with name **acra_master_key** (***exit with code 1 if the key already exists***). Being used only with `generate_master_key` flag.
  
  Default is `create`

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

{{< hint info >}}
**Note**:
Should be provided only with `--keystore_encryption_type=<vault_master_key>` flag.
{{< /hint >}}

## Generating keys

{{< hint warning >}}
**Note:**
Back up all your keys before calling `acra-keymaker` with any flag described below.
Some keys can be rotated, and the previous keys will be retained,
while some keys will be overwritten.
{{< /hint >}}

### Acra master key

* `--generate_master_key=<path>`

  Generate a new random master key and write it to the specified file.

  Acra components might expect this key in `ACRA_MASTER_KEY` [environment variable or read from KMS](/acra/configuring-maintaining/key-storing/kms-integration/).
  

{{< hint info >}}
**Note:**
When you generate a new key (or keypair), the existing key is rotated.
That is, the new key becomes the default for encryption in [AcraServer](/acra/acra-in-depth/architecture/acraserver/)
while the previous key is archived and used only for decryption.
{{< /hint >}}
  
### Transport keys

{{< hint warning >}}
Transport keys support is deprecated and will not be available since 0.91.0.
{{< /hint >}}

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
  
  Generate a new symmetric key for HMAC calculation and searchable encryption.
  
* `--generate_log_key`
  
  Generate a new symmetric key for audit logging.
  
* `--generate_poisonrecord_keys`
  
  Generate a new keypair and symmetric key for poison records.
  
* `--generate_symmetric_storage_key`
  
  Generate a new symmetric key for data encryption/decryption with AcraBlock.

  
### AcraServer & AcraAuthManager keys

{{< hint warning >}}
AcraAuthManager tool is deprecated and will not be available since 0.91.0.
{{< /hint >}}

* `--generate_acrawebconfig_keys`
  
  Generate a new symmetric key for encrypting AcraWebconfig's basic authentication credentials.

  {{< hint warning >}}
  **Note:** This key cannot be rotated. Newly generated key replaces the current one.
  {{< /hint >}}
