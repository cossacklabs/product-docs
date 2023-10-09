---
title: list
weight: 1
---

# list

**`list`** is `acra-keys` subcommand used for describing keys of the keystore versions `v1|v2`.

## Command line flags

### General flags

* `--rotated-keys`

  List rotated keys if present in keystore (available since 0.95.0).

#### TLS (available since 0.96.0)

* `--tls_auth=<mode>`

  Set authentication mode that will be used for TLS connection.

  * `0` — do not request client certificate, ignore it if received;
  * `1` — request client certificate, but don't require it;
  * `2` — expect to receive at least one certificate to continue the handshake;
  * `3` — don't require client certificate, but validate it if client actually sent it;
  * `4` — (default) request and validate client certificate.

  These values correspond to [crypto.tls.ClientAuthType](https://golang.org/pkg/crypto/tls/#ClientAuthType).

* `--tls_key=<filename>`

  Path to acra-keys TLS certificate's private key of the TLS certificate presented to Database (acra-keys works as "client" when communicating with Database).
  Empty by default.

* `--tls_cert=<filename>`

  Path to acra-keys TLS certificate presented to Database (acra-keys works as "client" when communicating with Database).
  Empty by default.

* `--tls_ca=<filename>`

  Path to acra-keys TLS certificate's CA certificate for Database certificate validation (acra-keys works as "client" when communicating with Database).
  Empty by default.

* `--tls_crl_url=<url>`

  URL of the Certificate Revocation List (CRL) to use.
  Empty by default.

  Can be either `http://` or `file://` (for local files).
  When using local file, Acra will simply read the file and won't monitor filesystem for changes afterwards.
  Usual caching rules apply (see `--tls_crl_cache_time`).

* `--tls_crl_from_cert=<policy>`

  How to treat CRL's URL described in a certificate itself

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

* `--tls_crl_cache_size=<count>`

  How many CRLs to cache in memory.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.

* `--tls_crl_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.

* `--tls_crl_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.

* `--tls_ocsp_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and
    continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration

* `--tls_ocsp_url=<url>`

  URL of OCSP service.
  Empty by default.

  Should point to HTTP server that accepts `application/ocsp-request` MIME type
  and responds with `application/ocsp-response`.

* `--tls_ocsp_from_cert=<policy>`

  How to treat OCSP server URL described in a certificate itself.

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

* `--tls_ocsp_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no OCSP's URL configured and there is no OCSP's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know whom to ask about them.

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
  If not specified, acra-keys uses value from `--tls_ca` flag.


* `--redis_tls_client_cert=<filename>`

  Path to TLS certificate presented to Redis.
  Empty by default.
  If not specified, acra-keys uses value from `--tls_cert` flag.


* `--redis_tls_client_key=<filename>`

  Path to private key of the TLS certificate presented to Redis.
  Empty by default.
  If not specified, acra-keys uses value from `--tls_key` flag.


* `--redis_tls_client_sni=<SNI>`

  Expected Server Name (SNI) of the Redis instance. Will be used `--redis_host_port` value if is empty.
  Empty by default.


* `--redis_tls_crl_client_cache_size=<count>`

  How many CRLs to cache in memory in connections to Redis.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.
  If not specified, acra-keys uses value from `--tls_crl_cache_size` flag.


* `--redis_tls_crl_client_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds for connections to Redis.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.
  If not specified, acra-keys uses value from `--tls_crl_cache_time` flag.


* `--redis_tls_crl_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Redis' certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.
  If not specified, acra-keys uses value from `--tls_crl_check_only_leaf_certificate` flag.


* `--redis_tls_crl_client_from_cert=<policy>`

  How to treat CRL's URL described in a certificate from Redis server

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--redis_tls_crl_client_url` flags. See [Configuring & maintaining > TLS > CRL](/acra/configuring-maintaining/tls/crl/).
  If not specified, acra-keys uses value from `--tls_crl_from_cert` flag.


* `--redis_tls_crl_client_url=<url>`

  CRL's URL for outcoming TLS connections to Redis.
  Empty by default.
  If not specified, acra-keys uses value from `--tls_crl_url` flag.


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
  If not specified, acra-keys uses value from `--tls_ocsp_check_only_leaf_certificate` flag.


* `--redis_tls_ocsp_client_from_cert=<policy>`

  How to treat OCSP server URL described in a certificate from Redis server

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--redis_tls_ocsp_client_url` flags, see [Configuring & maintaining > TLS > OCSP](/acra/configuring-maintaining/tls/ocsp/).
  If not specified, acra-keys uses value from `--tls_ocsp_from_cert` flag.


* `--redis_tls_ocsp_client_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested Redis' certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration
  If not specified, acra-keys uses value from `--tls_ocsp_required` flag.


* `--redis_tls_ocsp_client_url=<url>`

  OCSP service URL for outgoing TLS connections to check Redis' certificates.
  Empty by default.
  If not specified, acra-keys uses value from `--tls_ocsp_url` flag.

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


#### HashiCorp Vault

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
  If not specified, acra-keys uses value from `--tls_auth` flag. (since 0.96.0)

* `--vault_tls_ca_path=<filename>`

  Path to CA certificate for HashiCorp Vault certificate validation.
  Default is empty (deprecated since 0.94.0, use `vault_tls_client_ca` instead).


* `--vault_tls_client_ca=<filename>`

  Path to acra-keys TLS certificate's CA certificate for Vault certificate validation (acra-keys works as "client" when communicating with Vault).
  Empty by default.
  If not specified, acra-keys uses value from `--tls_ca` flag. (since 0.96.0)


* `--vault_tls_client_cert=<filename>`

  Path to acra-keys TLS certificate presented to Vault (acra-keys works as "client" when communicating with Vault).
  Empty by default.
  If not specified, acra-keys uses value from `--tls_cert` flag. (since 0.96.0)


* `--vault_tls_client_key=<filename>`

  Path to acra-keys TLS certificate's private key of the TLS certificate presented to Vault (acra-keys works as "client" when communicating with Vault).
  Empty by default.
  If not specified, acra-keys uses value from `--tls_key` flag. (since 0.96.0)


* `--vault_tls_client_sni=<SNI>`

  Expected Server Name (SNI) of the Vault instance. Will be used `--vault_connection_api_string` value if is empty.
  Empty by default.


* `--vault_tls_crl_client_cache_size=<count>`

  How many CRLs to cache in memory in connections to Vault.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.
  If not specified, acra-keys uses from `--tls_crl_cache_size` flag. (since 0.96.0)


* `--vault_tls_crl_client_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds for connections to Vault.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.
  If not specified, acra-keys uses value from `--tls_crl_cache_time` flag. (since 0.96.0)


* `--vault_tls_crl_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Vault certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.
  If not specified, acra-keys uses value from `--tls_crl_check_only_leaf_certificate` flag. (since 0.96.0)


* `--vault_tls_crl_client_from_cert=<policy>`

  How to treat CRL's URL described in a certificate from Vault server/agent

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--vault_tls_crl_client_url` flags.
  If not specified, acra-keys uses value from `--tls_crl_from_cert` flag. (since 0.96.0)


* `--vault_tls_crl_client_url=<url>`

  CRL's URL for outcoming TLS connections to Vault.
  Empty by default.
  If not specified, acra-keys uses value from `--tls_crl_url` flag. (since 0.96.0)


* `--vault_tls_ocsp_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Vault certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no OCSP's URL configured and there is no OCSP's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know whom to ask about them.
  If not specified, acra-keys uses value from `--tls_ocsp_check_only_leaf_certificate` flag. (since 0.96.0)


* `--vault_tls_ocsp_client_from_cert=<policy>`

  How to treat OCSP server URL described in a certificate from Vault server.

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--vault_tls_ocsp_client_url` flags.
  If not specified, acra-keys uses value from `--tls_ocsp_from_cert` flag. (since 0.96.0)


* `--vault_tls_ocsp_client_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested Vault certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration
  If not specified, acra-keys uses value from `--tls_ocsp_required` flag. (since 0.96.0)


* `--vault_tls_ocsp_client_url=<url>`

  OCSP service URL for outgoing TLS connections to check Vaults' certificates.
  Empty by default.
  If not specified, acra-keys uses value from `--tls_ocsp_url` flag. (since 0.96.0)

{{< hint info >}}
**Note**:
Should be provided only with `--keystore_encryption_type=<vault_master_key>` flag.
{{< /hint >}}

  🔴 - flags required to be specified.


## Usage example

Using **`list`** subcommand of `acra-keys` you can get the description about keys stored in a keystore.
For example, let's generate several keys using [`generate`]({{< ref "/acra/configuring-maintaining/general-configuration/acra-keys/generate" >}}) subcommand:

{{< hint info >}}
**Note:**
Make sure you have set `ACRA_MASTER_KEY` env variable for the keystore `v1`.
{{< /hint >}}
```
$ acra-keys generate --client_id=user1 --keystore=v1 --client_storage_symmetric_key --audit_log_symmetric_key

INFO[0000] Initializing ACRA_MASTER_KEY loader...       
INFO[0000] Initialized default env ACRA_MASTER_KEY loader 
INFO[0000] Generated client storage symmetric key       
INFO[0000] Generated HMAC key for audit log
```

Now we can use `list` subcommand to get all keystore keys description:

{{< hint info >}}
``Index`` - is a virtual index in the keystore, `1` represents the current key. Rotated keys will have incrementally increasing index always greater than `1`.
{{< /hint >}}

```
$ acra-keys list

INFO[0000] Initializing default env ACRA_MASTER_KEY loader 
Index | Key purpose                  | Client | Key ID
-----------------------------+--------+--------------------------
1     | audit log signature key      |        | audit-log
1     | encrypted search HMAC key    | client | client/client/hmac-sym
```

{{< hint info >}}
**Note:**
Since 0.95.0 `list` subcommand also supports displaying rotated keys for V1/V2 keystore additionally to keystore keys.
{{< /hint >}}

```
$ acra-keys list --rotated-keys

INFO[0000] Initializing default env ACRA_MASTER_KEY loader 
Index | Key purpose                  | Client | Key ID
-----------------------------+--------+--------------------------
1     | audit log signature key      |        | audit-log
1     | encrypted search HMAC key    | client | client/client/hmac-sym


Rotated keys: 
Index | Key purpose                  | Client | Creation Time                 | Key ID
-----------------------------+--------+-------------------------------+-----------------------
2     | audit log signature key      |        | 2023-02-13 12:36:49 +0000 UTC | audit-log
3     | audit log signature key      |        | 2023-02-13 12:49:27 +0000 UTC | audit-log
2     | encrypted search HMAC key    | client | 2023-02-13 12:36:49 +0000 UTC | client/client/hmac-sym
3     | encrypted search HMAC key    | client | 2023-02-13 12:49:27 +0000 UTC | client/client/hmac-sym
```

To display all keys in JSON format:

```
$ acra-keys list --rotated-keys --json

INFO[0000] Initializing default env ACRA_MASTER_KEY loader 
[
{"Index":1,"KeyID":"audit-log","State":"current","Purpose":"audit log signature key","CreationTime":"2023-02-13T13:08:09Z"},
 {"Index":1,"KeyID":"client/client/hmac-sym","State":"current","Purpose":"encrypted search HMAC key","ClientID":"client","CreationTime":"2023-02-13T13:08:09Z"},
 {"Index":2,"KeyID":"audit-log","State":"rotated","Purpose":"audit log signature key","CreationTime":"2023-02-13T12:36:49Z"},
 {"Index":3,"KeyID":"audit-log","State":"rotated","Purpose":"audit log signature key","CreationTime":"2023-02-13T12:49:27Z"},
 {"Index":2,"KeyID":"client/client/hmac-sym","State":"rotated","Purpose":"encrypted search HMAC key","ClientID":"client","CreationTime":"2023-02-13T12:36:49Z"},
 {"Index":3,"KeyID":"client/client/hmac-sym","State":"rotated","Purpose":"encrypted search HMAC key","ClientID":"client","CreationTime":"2023-02-13T12:49:27Z"}
]
```
