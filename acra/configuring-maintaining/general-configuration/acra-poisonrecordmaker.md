---
title: acra-poisonrecordmaker
weight: 11
---

# acra-poisonrecordmaker

`acra-poisonrecordmaker` is a command-line utility that generates new [poison records](/acra/security-controls/intrusion-detection) for intrusion detection.

## Command line flags

### General flags

* `--data_length=<length>`

  Length of random data for data block in crypto envelope (`acrastruct` or `acrablock`).

  Default is `-1` which is random in range 1-100.

* `--type=<crypto_envelope>`

  Type of poison record: `acrastruct` | `acrablock`.

  Default is `acrastruct`.

### Filesystem

* `--keys_dir=<path>`

  Path to keystore directory.

  Default is `.acrakeys`.


### Redis

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


### HashiCorp Vault

* `--vault_connection_api_string=<url>`

  Connection string (like `http://x.x.x.x:yyyy`) for loading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is empty (`ACRA_MASTER_KEY` environment variable is expected).

* `--vault_secrets_path=<path>`

  KV Secret Path for reading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is `secret/`.

* `--vault_tls_ca_path=<filename>`

  Path to CA certificate for HashiCorp Vault certificate validation.
  Default is empty (use root certificates configured in system).

* `--vault_tls_client_cert=<filename>`

  Path to client TLS certificate for reading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is empty (don't send client certificate).

* `--vault_tls_client_key=<filename>`

  Path to private key of the client TLS certificate for reading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is empty (don't send client certificate).

* `--vault_tls_transport_enable={true|false}`

  Use TLS to encrypt transport with HashiCorp Vault.
  Default is `false`.

## Usage

In general, this tool is used like this:

1) Generate "poison keys" using one of
   * `acra-keys generate --keystore=vX --poison_record_keys`
   * `acra-keymaker --keystore=vX --generate_poisonrecord_keys`

2) Use this tool to generate the poison record itself:

   `acra-poisonrecordmaker > poison_record`

   File content will be base64-encoded.

3) Insert generated poison record into the database or any other storage your application interacts with.
   It should be in the same column as the usual encrypted data
   (attacker won't be able to distinguish poison records from legitimate data as they look kinda the same).
   Don't forget to base64 decode before storing it in database if other encrypted data is stored in binary format.

4) As soon as the application attempts to decrypt the poison record

   * through transparent decryption in AcraServer
   * or through decrypt RPC request in AcraTranslator

   Acra will perform [preconfigured actions]({{< ref "acra/security-controls/intrusion-detection#command-line-flags" >}}).
