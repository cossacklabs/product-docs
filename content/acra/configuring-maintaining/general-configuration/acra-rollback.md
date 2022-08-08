---
title: acra-rollback
weight: 13
---

# acra-rollback

`acra-rollback` is a command-line utility that helps you to generate a clean SQL dump from an existing protected one.
Rollback utility especially applicable in case of any DB rollback - keys re-generating, going from a Zoneless mode to Zones or vice-versa etc. 

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

  Turn on zone mode.
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
  * **`master_key`** (**Default**) - Keystore using Acra Master Key, loaded from ENV (`ACRA_MASTER_KEY`) variable;
  * **`vault_master_key`** - Keystore using Acra Master Key, loaded from Hashicorp Vault
  * **`kms_encrypted_master_key`** - Keystore using Acra Master Key, loaded from ENV `ACRA_MASTER_KEY` variable and
    decrypted via KMS key-encryption key.
  * **`kms_per_client`** - Keystore using KMS for decryption Acra keys per ClientID and ZoneID.


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

`acra-addzone` can read `ACRA_MASTER_KEY` from HashiCorp Vault instead of environment variable.

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

