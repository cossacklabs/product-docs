---
title: acra-rollback
weight: 13
---

# acra-rollback

`acra-rollback` is a command-line utility that helps you to generate a clean SQL dump from an existing protected one.
Rollback utility especially applicable in case of any DB rollback - keys re-generating, going from a Zoneless mode to Zones or vice-versa etc.

{{< hint warning >}}
Zones are deprecated since 0.94.0, will be removed in 0.95.0.
{{< /hint >}}

## Command line flags

### General flags

* `--mysql_enable={true|false}`

  Handle MySQL connections. 
  Default is `false`.

* `--postgresql_enable={true|false}`

  Handle PostgreSQL connections. 
  Default is `false`.

* `--client_id=<id>`

  ClientID that will be used for all encrypted data. 
  All data returned by a query specified in `--select=<select_query>` parameter should be encrypted only with this ClientID.

* `--connection_string=<connection_string>`

  Connection string for DB in format `dbname=<DBNAME> host=<HOST> port=<PORT> user=<USER> password=<PASSWORD>`.

* `--select=<select_query>`

  Query to fetch data for decryption.

* `--insert=<insert_query>`

  Query to insert decrypted data with placeholders (pg: $n, mysql: ?).

* `--zonemode_enable={true|false}`

  Turn on zone mode (deprecated since 0.94.0, will be removed in 0.95.0).
  Default is `false`.

* `--execute={true|false}`

  Execute inserts. 
  Default is `false`.

* `--escape={true|false}`

  Encode binary data with `bytea` type into the [escape format](https://www.postgresql.org/docs/current/datatype-binary.html#id-1.5.7.12.10) if `true`. 
  Otherwise, into the [hex format](https://www.postgresql.org/docs/current/datatype-binary.html#id-1.5.7.12.9). 
  Applicable only with `--postgresql_enable` flag.

  MySQL [hexadecimal literals](https://dev.mysql.com/doc/refman/5.7/en/hexadecimal-literals.html) will be used only in case of `--mysql_enable`.
  Default is `false`.


### Storage destination

#### Filesystem

* `--keys_dir=<path>`

  Path to keystore folder. 
  Default is `.acrakeys`.

* `--output_file=<path>`

  File for store inserts queries. 
  Default is `decrypted.sql`.

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

### Hashicorp Vault
`acra-addzone` (deprecated since 0.94.0, will be removed in 0.95.0) can read `ACRA_MASTER_KEY` from HashiCorp Vault instead of environment variable.

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
  If not specified, acra-rollback uses value from `--tls_auth` flag.

* `--vault_tls_ca_path=<filename>`

  Path to CA certificate for HashiCorp Vault certificate validation.
  Default is empty (deprecated since 0.94.0, use `vault_tls_client_ca` instead).


* `--vault_tls_client_ca=<filename>`

  Path to acra-rollback TLS certificate's CA certificate for Vault certificate validation (acra-rollback works as "client" when communicating with Vault).
  Empty by default.
  If not specified, acra-rollback uses value from `--tls_ca` flag.


* `--vault_tls_client_cert=<filename>`

  Path to acra-rollback TLS certificate presented to Vault (acra-rollback works as "client" when communicating with Vault).
  Empty by default.
  If not specified, acra-rollback uses value from `--tls_cert` flag.


* `--vault_tls_client_key=<filename>`

  Path to acra-rollback TLS certificate's private key of the TLS certificate presented to Vault (acra-rollback works as "client" when communicating with Vault).
  Empty by default.
  If not specified, acra-rollback uses value from `--tls_key` flag.


* `--vault_tls_client_sni=<SNI>`

  Expected Server Name (SNI) of the Vault instance. Will be used `--vault_connection_api_string` value if is empty.
  Empty by default.


* `--vault_tls_crl_client_cache_size=<count>`

  How many CRLs to cache in memory in connections to Vault.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.
  If not specified, acra-rollback uses value from `--tls_crl_cache_size` flag.


* `--vault_tls_crl_client_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds for connections to Vault.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.
  If not specified, acra-rollback uses value from `--tls_crl_cache_time` flag.


* `--vault_tls_crl_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Vault certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.
  If not specified, acra-rollback uses value from `--tls_crl_check_only_leaf_certificate` flag.


* `--vault_tls_crl_client_from_cert=<policy>`

  How to treat CRL's URL described in a certificate from Vault server/agent

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--vault_tls_crl_client_url` flags.
  If not specified, acra-rollback uses value from `--tls_crl_from_cert` flag.


* `--vault_tls_crl_client_url=<url>`

  CRL's URL for outcoming TLS connections to Vault.
  Empty by default.
  If not specified, acra-rollback uses value from `--tls_crl_url` flag.


* `--vault_tls_ocsp_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Vault certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no OCSP's URL configured and there is no OCSP's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know whom to ask about them.
  If not specified, acra-rollback uses value from `--tls_ocsp_check_only_leaf_certificate` flag.


* `--vault_tls_ocsp_client_from_cert=<policy>`

  How to treat OCSP server URL described in a certificate from Vault server.

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--vault_tls_ocsp_client_url` flags.
  If not specified, acra-rollback uses value from `--tls_ocsp_from_cert` flag.


* `--vault_tls_ocsp_client_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested Vault certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration
  If not specified, acra-rollback uses value from `--tls_ocsp_required` flag.


* `--vault_tls_ocsp_client_url=<url>`

  OCSP service URL for outgoing TLS connections to check Vaults' certificates.
  Empty by default.
  If not specified, acra-rollback uses value from `--tls_ocsp_url` flag.

{{< hint info >}}
**Note**:
Should be provided only with `--keystore_encryption_type=<vault_master_key>` flag.
{{< /hint >}}

## Usage example

{{< hint warning >}}
**Note:**
Starting from Acra [`v.0.77.0`](https://github.com/cossacklabs/acra/releases/tag/0.77.0), `acra-rollback` requires Go version >= 1.8.
{{< /hint >}}


Single-quote syntax with $ escaping:

```
acra-rollback \
    --client_id=client \
    --postgresql_enable \
    --connection_string="dbname=acra user=postgres password=postgres host=127.0.0.1 port=5432" \
    --output_file=out.txt \
    --select="select data from test_example_without_zone;" \
    --insert="insert into test_example_without_zone values(\$1);"
```


Double-quote syntax:

```
acra-rollback \
    --client_id=client \
    --postgresql_enable \
    --connection_string="dbname=acra user=postgres password=postgres host=127.0.0.1 port=5432" \
    --output_file=out.txt \
    --select="select data from test_example_without_zone;" \
    --insert='insert into test_example_without_zone values($1);'
```

### ZoneMode

{{< hint warning >}}
Zones are deprecated since 0.94.0, will be removed in 0.95.0.
{{< /hint >}}

`acra-rollback` supports work with [zones](/acra/security-controls/zones/), you can configure it via `zonemode_enable` flag.
If Zones are enabled, make sure you have Zone ID in your `SELECT` query:

```
select zone_id, encrypted_data from some_table;
```



### Saving decrypted data to file

Instead of inserting data back into the database, you can write it to the output file, to handle it later. To do it, change the `INSERT` query to a simple `$1;`, like this:

```
acra-rollback \
    --client_id=client \
    --postgresql_enable \
    --connection_string="dbname=acra user=postgres password=postgres host=127.0.0.1 port=5432" \
    --output_file=data.txt \
    --select="select data from test_example_without_zone;" \
    --insert='$1;'
```


{{< hint info >}}
**Note:**
Currently `acra-rollback` ignores [poison records](/acra/security-controls/intrusion-detection). 
Security-wise, the consideration is that if you can run CLI commands on the server that holds all the private keys, you can compromise the system anyway.
{{< /hint >}}

