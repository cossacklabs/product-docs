---
title: acra-backup
weight: 9
---

# acra-backup

`acra-backup` is a command-line utility used for storing and managing the keystore [backups](/acra/security-controls/key-management/operations/backup).

## Command line flags

#### General

* `--action={import|export}`🔴

  Actions to perform.

### Logging

* `--logging_format={plaintext|json|CEF}`

  Logging format. Default is `plaintext`.

  * `plaintext` — (default) pretty human readable key/value format<br>
    ```
    INFO[2021-09-16T09:58:03+03:00] Starting service acra-backup [pid=459748]     version=0.85.0
    ```

  * `json` — one JSON object per line, easy to parse by most log collectors<br>
    ```
    {"level":"info","msg":"Starting service acra-backup [pid=460911]","product":"acra-backup","timestamp":"2021-09-16T10:14:33+03:00","unixTime":"1631776473.899","version":"0.85.0"}
    ```

  * `CEF` — Common Event Format<br>
    ```
    CEF:0|cossacklabs|acra-backup|0.85.0|100|Starting service acra-backup [pid\=461095]|1|unixTime=1631776510.183
    ```


### Storage destination

#### Filesystem

* `--keys_private_dir=<dir_path>`

  Folder with private keys. Default is `.acrakeys`.

* `--keys_public_dir=<dir_path>`

  Folder with public keys. Leave empty if keys stored in same folder as `keys_private_dir`.

* `--file=<path>`🔴 

  Path to file which will be used for **`import|export`** actions. Required to specify.

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

### Keystore

* `--keystore_encryption_type=<strategy>`

  Keystore encryption strategy.
  Currently supported strategies:
  * **`env_master_key`** (**Default**) - Keystore using Acra Master Key, loaded from ENV (`ACRA_MASTER_KEY`) variable;
  * **`vault_master_key`** -  Keystore using Acra Master Key, loaded from Hashicorp Vault
  * **`kms_encrypted_master_key`** - Keystore using Acra Master Key, loaded from ENV `ACRA_MASTER_KEY` variable and decrypted
    via KMS key-encryption key.
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

### Hashicorp Vault

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

  Path to acra-backup TLS certificate's CA certificate for Vault certificate validation (acra-backup works as "client" when communicating with Vault).
  Empty by default.


* `--vault_tls_client_cert=<filename>`

  Path to acra-backup TLS certificate presented to Vault (acra-backup works as "client" when communicating with Vault).
  Empty by default.


* `--vault_tls_client_key=<filename>`

  Path to acra-backup TLS certificate's private key of the TLS certificate presented to Vault (acra-backup works as "client" when communicating with Vault).
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

Using `acra-backup` you can easily migrate keys from different storages. Consider an example of migrating keys from a filesystem to Redis-based keystore.
First, we need to export keys to file using `export` action:

```
$ acra-backup --action=export --file=./acrakeys.backup
INFO[2021-09-16T11:14:18+03:00] Starting service acra-backup [pid=470120]     version=0.85.0
INFO[2021-09-16T11:14:18+03:00] Initializing ACRA_MASTER_KEY loader...       
INFO[2021-09-16T11:14:18+03:00] Initialized default env ACRA_MASTER_KEY loader 
INFO[2021-09-16T11:14:18+03:00] Backup master key: 1FEbOQ1k2jzn2LsF5xHy7jQmT93Yv1odqqgg1epwUcQ=
 Backup saved to file: ./acrakeys.backup
```

{{< hint info >}}
**Note:**
You need to have `ACRA_MASTER_KEY` environment variable set up for any operation using `acra-backup`.

Before running `import` operation, make sure you also specified `BACKUP_MASTER_KEY` environment variable with the value displayed in `export` operation output.
{{< /hint>}}

Then, we need to import keys using `import` action provided along with redis configuration flags:

```
$ export BACKUP_MASTER_KEY='1FEbOQ1k2jzn2LsF5xHy7jQmT93Yv1odqqgg1epwUcQ='
$ acra-backup \
    --action=import \
    --file=.acrakeys.backup \
    --redis_host_port=localhost:6379 \
    --redis_db_keys=0
INFO[2021-09-17T09:34:04+03:00] Starting service acra-backup [pid=488411]     version=0.85.0
INFO[2021-09-17T09:34:04+03:00] Initializing ACRA_MASTER_KEY loader...       
INFO[2021-09-17T09:34:04+03:00] Initialized default env ACRA_MASTER_KEY loader
```

To make sure that all keys were successfully migrated to redis you can run:

```
$ redis-cli --scan --pattern '*'
".acrakeys/user0_storage.pub"
".acrakeys/user0_storage"
".acrakeys/secure_log_key"
".acrakeys/DDDDDDDDYXtLNuuzjCXVeODJ_zone"
".acrakeys/user0.pub"
".acrakeys/user0_server.pub"
".acrakeys/DDDDDDDDYXtLNuuzjCXVeODJ_zone_sym"
".acrakeys/user0_hmac"
".acrakeys/user0_translator"
".acrakeys/user0"
".acrakeys/user0_translator.pub"
".acrakeys/DDDDDDDDYXtLNuuzjCXVeODJ_zone.pub"
".acrakeys/user0_storage_sym"
".acrakeys/auth_key"
".acrakeys/user0_server"
```
