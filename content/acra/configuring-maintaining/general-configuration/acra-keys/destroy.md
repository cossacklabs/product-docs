---
title: destroy
weight: 7
---

# destroy

**`destroy`** is `acra-keys` subcommand used for destroying keypair from the keystore.

{{< hint warning >}}
Since 0.91.0 `acra-keys` **`destroy`** doesn't support destroying keys and will be extended in subsequent versions.
{{< /hint >}}

## Command line flags

### Storage destination

#### Filesystem

* `--keys_dir=<path>`

  Path to keystore folder.
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

For example, lets generate several transport keys using [`generate`]({{< ref "/acra/configuring-maintaining/general-configuration/acra-keys/generate" >}}) subcommand:

{{< hint info >}}
**Note:**
Make sure you have set `ACRA_MASTER_KEY` env variable for keystore `v1`.
{{< /hint >}}

```
$ acra-keys generate --client_id=user1 --keystore=v1 --acraconnector_transport_key --acraserver_transport_key

INFO[0000] Initializing ACRA_MASTER_KEY loader...       
INFO[0000] Initialized default env ACRA_MASTER_KEY loader 
INFO[0000] Generated AcraConnector transport key        
INFO[0000] Generated AcraServer transport key
```

To destroy the keypair use the following command:
```
$ acra-keys destroy client/user1/transport/connector

INFO[0000] Initializing ACRA_MASTER_KEY loader...       
INFO[0000] Initialized default env ACRA_MASTER_KEY loader
```

{{< hint info >}}
**Note:**
Currently, only some key kinds are supported for destroying via `destroy` subcommand.
Here is the list of supported key kinds:

<!-- cmd/acra-keys/keys/command-line.go func ParseKeyKind -->
- `client/<client ID>/transport/connector`
- `client/<client ID>/transport/server`
- `client/<client ID>/transport/translator`
{{< /hint >}}
