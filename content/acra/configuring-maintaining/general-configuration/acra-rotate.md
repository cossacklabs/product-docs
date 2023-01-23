---
title: acra-rotate
weight: 8
---

# acra-rotate

`acra-rotate` is a command-line utility that rotates intermediate keys or [Zone](/acra/security-controls/zones) (zones are deprecated since 0.94.0, will be removed in 0.95.0) keys and re-encrypt data stored in database or as files.

## Command line flags

### General flags

* `--mysql_enable={true|false}`

  Handle MySQL connections.
  Default is `false`.

* `--postgresql_enable={true|false}`

  Handle PostgreSQL connections.
  Default is `false`.

* `--zonemode_enable={true|false}`

  Turn on zone mode (deprecated since 0.94.0, will be removed in 0.95.0).
  Default is `true`.

* `--sql_select=<query>`

  Select query with placeholders where last columns in result must be ClientId/ZoneId and AcraStruct. 
  Other columns will be passed into Insert/Update query into placeholders.
  PostgreSQL placeholder is `$1` and MySQL is `?`.

* `--sql_update=<query>`

  Insert/Update query with placeholders where rotated AcraStruct will be placed into the first.
  PostgreSQL placeholder is `$n` and MySQL is `?`. Additional information could be found on the pages of the respective DB drivers: [PostgreSQL](https://github.com/lib/pq), [MySQL](https://github.com/go-sql-driver/mysql).

* `--dry-run`

  Perform rotation without saving rotated AcraStructs and keys.

### Configuration files

* `--config_file=<filename>`

  Path to YAML configuration file.

* `--dump_config`

  Dump configuration to `configs/acra-rotate.yaml`.

* `--generate_markdown_args_table`

  Generate markdown file with text description of all flags.
  Output file is `configs/markdown_acra-rotate.md`.
  Works in a pair with `--dump_config`.

### Network

* `--db_connection_string=<db_connection_url>`

  Connection string to DB.\
  PostgreSQL - `postgresql://{db_user}:{user_pass}@{db_host}/{db}`. \
  MySQL - `{db_user}:{user_pass}@tcp({db_host})/{db}`.

### Storage destination

#### Filesystem

* `--keys_dir=<path>`

  Folder from which keys will be loaded.
  Default is `.acrakeys`.

* `--file_map_config=<path>`

  Path to file with a map of **ZoneId**: **FilePaths** in json format `{"zone_id1": ["filepath1", "filepath2"], "zone_id2": ["filepath1", "filepath2"]}`.

#### TLS

* `--tls_database_enabled=<true|false>`

  Turns on/off TLS for connection with Database to `--db_connection_string`.

  * `true` — turns on
  * `false` — (default) turns off.

* `--tls_auth=<mode>`

  Set authentication mode that will be used for TLS connection.

  * `-1` — not specified, common `--tls_ca` value will be used.
  * `1` — request client certificate, but don't require it;
  * `2` — expect to receive at least one certificate to continue the handshake;
  * `3` — don't require client certificate, but validate it if client actually sent it;
  * `4` — (default) request and validate client certificate.

  These values correspond to [crypto.tls.ClientAuthType](https://golang.org/pkg/crypto/tls/#ClientAuthType).

* `--tls_key=<filename>`

  Path to acra-rotate TLS certificate's private key of the TLS certificate presented to Database (acra-rotate works as "client" when communicating with Database).
  Empty by default.

* `--tls_cert=<filename>`

  Path to acra-rotate TLS certificate presented to Database (acra-rotate works as "client" when communicating with Database).
  Empty by default.

* `--tls_ca=<filename>`

  Path to acra-rotate TLS certificate's CA certificate for Database certificate validation (acra-rotate works as "client" when communicating with Database).
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
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration

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

* `--tls_database_auth=<mode>`

  Set authentication mode that will be used for TLS connection with a database.
  Possible values are the same as for `--tls_auth`.
  Overrides the `--tls_auth` setting.
  Default is `-1` which means "take value of `--tls_auth`".

* `--tls_database_key=<filename>`

  Path to acra-rotate TLS certificate's private key of the TLS certificate presented to Database (acra-rotate works as "client" when communicating with Database).
  Empty by default.
  If not specified, acra-rotate uses value from `--tls_key` flag.

* `--tls_database_cert=<filename>`

  Path to acra-rotate TLS certificate presented to Database (acra-rotate works as "client" when communicating with Database).
  Empty by default.
  If not specified, acra-rotate uses value from `--tls_cert` flag.

* `--tls_database_ca=<filename>`

  Path to acra-rotate TLS certificate's CA certificate for Database certificate validation (acra-rotate works as "client" when communicating with Database).
  Empty by default.
  If not specified, acra-rotate uses value from `--tls_ca` flag.

* `--tls_crl_database_from_cert=<policy>`

  How to treat CRL's URL described in a certificate itself (overrides `--tls_crl_from_cert`).

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

* `--tls_crl_database_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.

* `--tls_crl_database_cache_size=<count>`

  How many CRLs to cache in memory (overrides `--tls_crl_cache_size`).
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.

* `--tls_crl_database_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds (overrides `--tls_crl_cache_time`).
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.

* `--tls_database_sni=<SNI>`

  Expected Server Name (SNI) of a database.
  Empty by default which means "don't check the SNI sent by a database".

* `--tls_ocsp_database_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when certificate chain contains at least one intermediate certificate (overrides `--tls_ocsp_check_only_leaf_certificate`).

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

* `--tls_ocsp_database_url=<url>`

  URL of OCSP service.
  Empty by default.

  Should point to HTTP server that accepts `application/ocsp-request` MIME type
  and responds with `application/ocsp-response`.

* `--tls_ocsp_database_from_cert=<policy>`

  How to treat OCSP server URL described in a certificate itself (overrides `--tls_ocsp_database_from_cert`).

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

* `--tls_ocsp_database_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested certificate and returns "Unknown" (overrides `--tls_ocsp_required`).

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration

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

  Path to AcraServer TLS certificate presented to Redis (AcraServer works as "client" when communicating with Redis).
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


### Keystore

* `--keystore_encryption_type=<strategy>`

  Keystore encryption strategy.
  Currently supported strategies:
  * **`env_master_key`** (**Default**) - Keystore using Acra Master Key, loaded from ENV (`ACRA_MASTER_KEY`) variable;
  * **`vault_master_key`** - Keystore using Acra Master Key, loaded from Hashicorp Vault
  * **`kms_encrypted_master_key`** - Keystore using Acra Master Key, loaded from ENV `ACRA_MASTER_KEY` variable and
    decrypted via KMS key-encryption key.
  * **`kms_per_client`** - Keystore using KMS for decryption Acra keys per ClientID and ZoneID (zones are deprecated since 0.94.0, will be removed in 0.95.0).


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

`acra-rotate` can read `ACRA_MASTER_KEY` from HashiCorp Vault instead of environment variable.

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

  Path to additional CA certificate for Vault certificate validation.
  Empty by default.

  These values correspond to [crypto.tls.ClientAuthType](https://golang.org/pkg/crypto/tls/#ClientAuthType).

* `--vault_tls_ca_path=<filename>`

  Path to CA certificate for HashiCorp Vault certificate validation.
  Default is empty (deprecated since 0.94.0, use `vault_tls_client_ca` instead).


* `--vault_tls_client_ca=<filename>`

  Path to AcraServer TLS certificate's CA certificate for Vault certificate validation (AcraServer works as "client" when communicating with Vault).
  Empty by default.


* `--vault_tls_client_cert=<filename>`

  Path to AcraServer TLS certificate presented to Vault (AcraServer works as "client" when communicating with Vault).
  Empty by default.


* `--vault_tls_client_key=<filename>`

  Path to AcraServer TLS certificate's private key of the TLS certificate presented to Vault (AcraServer works as "client" when communicating with Vault).
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
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and
    continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration


* `--vault_tls_ocsp_client_url=<url>`

  OCSP service URL for outgoing TLS connections to check Vaults' certificates.
  Empty by default.

{{< hint info >}}
**Note**:
Should be provided only with `--keystore_encryption_type=<vault_master_key>` flag.
{{< /hint >}}

## Usage example

Acra encrypts data using storage encryption keys, and these keys support rotation process, which can be done in response to a potential leak or compromise.

`acra-rotate` generates new storage keypair, reads data from a database via AcraServer, decrypts it and re-encrypts with new keys. In this example, new keys overwrite previous ones, so it's important to rotate all data at the same time.
However, it is worth mentioning that previously used keys will be placed to archive folder with `.old` extension and could be used only for decryption.

{{< hint warning >}}
**Note:**
Due to it's sensitive nature (`acra-rotate` has access to keys and decrypted data), `acra-rotate` should be run only on AcraServer host by admin user!
{{< /hint>}}


Before running `acra-rotate` command, make sure you have successfully encrypted data via AcraServer using storage encryption keys. 

In this example, we are not going to use [Zones](/acra/security-controls/zones) for rotation example. You'll get output with base64 of new public storage key:

```
$ acra-rotate 
    --db_connection_string="postgresql://test:test@acra-client/test" \
    --zonemode_enable=false \
    --postgresql_enable \
    --sql_select="select id, 'user0'::bytea, email from users" \
    --sql_update='update users set email=$1 where id=$2' 

INFO[0000] Initializing ACRA_MASTER_KEY loader...       
INFO[0000] Initialized default env ACRA_MASTER_KEY loader 
INFO[0000] Rotate data in database                       select_query="select id, 'user0'::bytea, email from profiles" update_query="update profiles set email=$1 where id=$2"
INFO[0000] Rotate AcraStruct                             Key ID=user0
INFO[0000] Rotate AcraStruct                             KeyID=user0
INFO[0000] Rotate AcraStruct                             Key ID=user0
INFO[0000] Rotate AcraStruct                             KeyID=user0
INFO[0000] Rotate AcraStruct                             Key ID=user0
INFO[0000] Rotate AcraStruct                             KeyID=user0
INFO[0000] Rotate AcraStruct                             Key ID=user0
INFO[0000] Rotate AcraStruct                             KeyID=user0
{"user0":{"new_public_key":"VUVDMgAAAC2BRTi4A9r4ntytLcwCE8/CcK83vToRUr23NnSSdROYzbcZQW/w"}}
```

After rotation AcraServer still will be able to decrypt records, because keys were rotated and Acra uses new keys to decrypt the data.

Also, `user0` is predefined ClientID. You can also generate ClientID from certificates via [`acra-keys extract-client-id`](/acra/configuring-maintaining/general-configuration/acra-keys/extract-client-id/) in case of using TLS certificates as ClientID. 

{{< hint info >}}
**Note:**
Currently, `acra-rotate` only supports [AcraStruct](/acra/acra-in-depth/data-structures/acrastruct/) as crypto containers but not [AcraBlock](/acra/acra-in-depth/data-structures/acrablock/).
{{< /hint >}}
