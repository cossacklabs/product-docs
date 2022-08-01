---
title: acra-rotate
weight: 8
---

# acra-rotate

`acra-rotate` is a command-line utility that rotates intermediate keys or [Zone](/acra/security-controls/zones) keys and re-encrypt data stored in database or as files.

## Command line flags


### General flags

* `--mysql_enable={true|false}`

  Handle MySQL connections.
  Default is `false`.

* `--postgresql_enable={true|false}`

  Handle PostgreSQL connections.
  Default is `false`.

* `--zonemode_enable={true|false}`

  Turn on zone mode.
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


#### HashiCorp Vault

`acra-rotate` can read `ACRA_MASTER_KEY` from HashiCorp Vault instead of environment variable.

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
