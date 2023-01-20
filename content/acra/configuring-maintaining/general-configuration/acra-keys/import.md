---
title: import
weight: 5
---

# import

**`import`** is `acra-keys` subcommand used for importing keys into the keystore version `v2`.

## Command line flags

### General flags

* `--key_bundle_file=<path>` 🔴

  Path to input file for exported key bundle.

* `--key_bundle_secret=<path>` 🔴

  Path to input file for key encryption keys. 

* `--json` 

  Use machine-readable JSON output.


### Storage destination

#### Filesystem

* `--keys_dir=<path>`

  Path to keystore directory. 
  Default is `.acrakeys`.

* `--keys_dir_public=<path>`

  Path to key directory for public keys.


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

  * `-1` — not specified, common `--tls_ca` value will be used.
  * `1` — request client certificate, but don't require it;
  * `2` — expect to receive at least one certificate to continue the handshake;
  * `3` — don't require client certificate, but validate it if client actually sent it;
  * `4` — (default) request and validate client certificate.

  These values correspond to [crypto.tls.ClientAuthType](https://golang.org/pkg/crypto/tls/#ClientAuthType).

* `--redis_tls_client_ca=<filename>`

  Path to additional CA certificate for Redis' certificate validation.
  Empty by default.


* `--redis_tls_client_cert=<filename>`

  Path to TLS certificate presented to Redis.
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

  "URL from configuration" above means the one configured with `--redis_tls_crl_client_url` flags. See [Configuring & maintaining > TLS > CRL](/acra/configuring-maintaining/tls/crl/).


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

  "URL from configuration" above means the one configured with `--redis_tls_ocsp_client_url` flags, see [Configuring & maintaining > TLS > OCSP](/acra/configuring-maintaining/tls/ocsp/).


* `--redis_tls_ocsp_client_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested Redis' certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration


* `--redis_tls_ocsp_client_url=<url>`

  OCSP service URL for outgoing TLS connections to check Redis' certificates.
  Empty by default.

### Keystore

* `--keystore_encryption_type=<strategy>`

  Keystore encryption strategy.
  Currently supported strategies:
  * **`env_master_key`** (**Default**) - Keystore using Acra Master Key, loaded from ENV (`ACRA_MASTER_KEY`) variable;
  * **`vault_master_key`** -  Keystore using Acra Master Key, loaded from Hashicorp Vault
  * **`kms_encrypted_master_key`** - Keystore using Acra Master Key, loaded from ENV `ACRA_MASTER_KEY` variable and decrypted
    via KMS key-encryption key.
  * **`kms_per_client`** - Keystore using KMS for decryption Acra keys per ClientID and ZoneID (zones are deprecated since 0.94.0, will be removed in 0.95.0).
    Create new KMS zone key-encryption key if not present on KMS.

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

### HashiCorp Vault

`acra-keys` can read `ACRA_MASTER_KEY` from HashiCorp Vault instead of environment variable.

* `--vault_connection_api_string=<url>`

  Connection string (like `http://x.x.x.x:yyyy`) for loading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is empty (`ACRA_MASTER_KEY` environment variable is expected).

* `--vault_secrets_path=<path>`

  KV Secret Path for reading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is `secret/`.

* `--vault_tls_transport_enable=<true|false>`

  Turns on/off TLS for connection with vault to `--vault_connection_api_string` endpoint.

  * `true` — turns on
  * `false` — (default) turns off.

* `--vault_tls_client_auth=<mode>`

  Set authentication mode that will be used for TLS connection with Vault.

  * `0` — do not request client certificate, ignore it if received;
  * `1` — request client certificate, but don't require it;
  * `2` — expect to receive at least one certificate to continue the handshake;
  * `3` — don't require client certificate, but validate it if client actually sent it;
  * `4` — (default) request and validate client certificate.

  These values correspond to [crypto.tls.ClientAuthType](https://golang.org/pkg/crypto/tls/#ClientAuthType).

* `--vault_tls_ca_path=<filename>`

  Path to CA certificate for HashiCorp Vault certificate validation.
  Default is empty (deprecated since 0.94.0, use `vault_tls_client_ca` instead).


* `--vault_tls_client_ca=<filename>`

  Path to acra-keys TLS certificate's CA certificate for Vault certificate validation (acra-keys works as "client" when communicating with Vault).
  Empty by default.


* `--vault_tls_client_cert=<filename>`

  Path to acra-keys TLS certificate presented to Vault (acra-keys works as "client" when communicating with Vault).
  Empty by default.


* `--vault_tls_client_key=<filename>`

  Path to acra-keys TLS certificate's private key of the TLS certificate presented to Vault (acra-keys works as "client" when communicating with Vault).
  Empty by default.


* `--vault_tls_client_sni=<SNI>`

  Expected Server Name (SNI) of the Vault instance. Will be used `--vault_connection_api_string` value if is empty.
  Empty by default.


* `--vault_tls_crl_client_cache_size=<count>`

  How many CRLs to cache in memory in connections to Vault.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.


* `--vault_tls_crl_client_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds for connections to Vault.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.


* `--vault_tls_crl_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Vault certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.


* `--vault_tls_crl_client_from_cert=<policy>`

  How to treat CRL's URL described in a certificate from Vault server/agent

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--vault_tls_crl_client_url` flags.


* `--vault_tls_crl_client_url=<url>`

  CRL's URL for outcoming TLS connections to Vault.
  Empty by default.


* `--vault_tls_ocsp_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Vault certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no OCSP's URL configured and there is no OCSP's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know whom to ask about them.


* `--vault_tls_ocsp_client_from_cert=<policy>`

  How to treat OCSP server URL described in a certificate from Vault server.

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--vault_tls_ocsp_client_url` flags.


* `--vault_tls_ocsp_client_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested Vault certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration


* `--vault_tls_ocsp_client_url=<url>`

  OCSP service URL for outgoing TLS connections to check Vaults' certificates.
  Empty by default.

{{< hint info >}}
**Note**:
Should be provided only with `--keystore_encryption_type=<vault_master_key>` flag.
{{< /hint >}}

  🔴 - flags required to be specified.


## Usage example

Using **`import`** subcommand of `acra-keys` you can easily exchange keys from different Acra components like AcraServer and AcraConnector.
First, the public key has to be exported using **`export`** subcommand, with corresponded produced result (`key_bundle_file` and `key_bundle_secret`).

```
$ acra-keys import --key_bundle_file "encrypted-keys.dat" --key_bundle_secret "access-keys.json"
```

{{< hint info >}}
**Note:**
For more detailed information about keys exchanging you can reference [key management]({{< ref "/acra/security-controls/key-management/operations/backup#3-exchanging-public-keys" >}}) section.
{{< /hint >}}


