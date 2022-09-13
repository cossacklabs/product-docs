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

* `--{src|dst}_redis_tls_client_auth=<mode>`

  Set authentication mode that will be used for TLS connection with Redis.

  * `0` — do not request client certificate, ignore it if received;
  * `1` — request client certificate, but don't require it;
  * `2` — expect to receive at least one certificate to continue the handshake;
  * `3` — don't require client certificate, but validate it if client actually sent it;
  * `4` — (default) request and validate client certificate.

  These values correspond to [crypto.tls.ClientAuthType](https://golang.org/pkg/crypto/tls/#ClientAuthType).

* `--{src|dst}_redis_tls_client_ca=<filename>`

  Path to additional CA certificate for Redis' certificate validation.
  Empty by default.


* `--{src|dst}_redis_tls_client_cert=<filename>`

  Path to server TLS certificate presented to Redis.
  Empty by default.


* `--{src|dst}_redis_tls_client_key=<filename>`

  Path to private key of the TLS certificate presented to Redis.
  Empty by default.


* `--{src|dst}_redis_tls_client_sni=<SNI>`

  Expected Server Name (SNI) of the Redis instance. Will be used `--{src|dst}_redis_host_port` value if is empty.
  Empty by default.


* `--{src|dst}_redis_tls_crl_client_cache_size=<count>`

  How many CRLs to cache in memory in connections to Redis.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.


* `--{src|dst}_redis_tls_crl_client_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds for connections to Redis.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.


* `--{src|dst}_redis_tls_crl_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Redis' certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.


* `--{src|dst}_redis_tls_crl_client_from_cert=<policy>`

  How to treat CRL's URL described in a certificate from Redis server

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--redis_tls_crl_client_url` flags.


* `--{src|dst}_redis_tls_crl_client_url=<url>`

  CRL's URL for outcoming TLS connections to Redis.
  Empty by default.


* `--{src|dst}_redis_tls_enable=<true|false>`

  Turns on/off TLS for connection with Redis to `--{src|dst}_redis_host_port` endpoint.

  * `true` — turns on
  * `false` — (default) turns off.


* `--{src|dst}_redis_tls_ocsp_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Redis' certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no OCSP's URL configured and there is no OCSP's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know whom to ask about them.


* `--{src|dst}_redis_tls_ocsp_client_from_cert=<policy>`

  How to treat OCSP server URL described in a certificate from Redis server

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--redis_tls_ocsp_client_url` flags.


* `--{src|dst}_redis_tls_ocsp_client_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested Redis' certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and
    continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration


* `--{src|dst}_redis_tls_ocsp_client_url=<url>`

  OCSP service URL for outgoing TLS connections to check Redis' certificates.
  Empty by default.

### Keystore

* `--{src|dst}_keystore_encryption_type=<strategy>`

  Keystore encryption strategy.
  Currently supported strategies:
  * **`env_master_key`** (**Default**) - Keystore using Acra Master Key, loaded from ENV (`ACRA_MASTER_KEY`) variable;
  * **`vault_master_key`** -  Keystore using Acra Master Key, loaded from Hashicorp Vault
  * **`kms_encrypted_master_key`** - Keystore using Acra Master Key, loaded from ENV `ACRA_MASTER_KEY` variable and decrypted
    via KMS key-encryption key.
  * **`kms_per_client`** - Keystore using KMS for decryption Acra keys per ClientID and ZoneID (zones are deprecated since 0.94.0, will be removed in 0.95.0).
    Create new KMS zone key-encryption key if not present on KMS.

### KMS

* `--{src|dst}_kms_type=<type>`

  Specify your KMS.
  Currently supported KMS types:
  * `aws` - AWS Key Management Service

* `--{src|dst}_kms_credentials_path=<filepath>`

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
