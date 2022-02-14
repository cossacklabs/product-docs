---
title: list
weight: 1
---

# list

**`list`** is `acra-keys` subcommand used for describing keys of the keystore version `v2`.

## Command line flags

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


#### HashiCorp Vault

`acra-keys` can read `ACRA_MASTER_KEY` from HashiCorp Vault instead of environment variable.

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

  🔴 - flags required to be specified.


## Usage example

Using **`list`** subcommand of `acra-keys` you can get the description about keys stored in `v2` keystore.
For example, lets generate several keys using [`generate`]({{< ref "/acra/configuring-maintaining/general-configuration/acra-keys/generate" >}}) subcommand:

{{< hint info >}}
**Note:**
Make sure you have set `ACRA_MASTER_KEY` env variable for keystore `v2`.
{{< /hint >}}
```
$ acra-keys generate --client_id=user1 --keystore=v2 --client_storage_symmetric_key --audit_log_symmetric_key

INFO[0000] Initializing ACRA_MASTER_KEY loader...       
INFO[0000] Initialized default env ACRA_MASTER_KEY loader 
INFO[0000] Generated client storage symmetric key       
INFO[0000] Generated HMAC key for audit log
```

Now we can use `list` subcommand to get all keystore keys description:

```
$ acra-keys list

INFO[0000] Initializing ACRA_MASTER_KEY loader...       
INFO[0000] Initialized default env ACRA_MASTER_KEY loader 
Key purpose                  | Client/Zone ID | Key ID
-----------------------------+----------------+-------------------------
audit log signature key      |                | audit-log
client storage symmetric key | user1          | client/user1/storage-sym
```

