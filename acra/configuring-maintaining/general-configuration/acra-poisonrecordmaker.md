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

   ```
   $ ./acra-poisonrecordmaker --type=acrablock > poison_record_ab
   $ ./acra-poisonrecordmaker --type=acrastruct > poison_record_as
   $ ls -l poison_record*
   -rw-r--r-- 1 user user 213 Nov  9 13:18 poison_record_ab
   -rw-r--r-- 1 user user 301 Nov  9 13:18 poison_record_as
   ```

   File content will be base64-encoded:
   ```
   $ cat poison_record_ab
   JSUlnwAAAAAAAADwIiIiIo8AAAAAAAAAAAwhAEwAAAEBQAwAAAAQAAAAIAAAAME4YnR4NYfwH6fhIoDcQsXf0GPpRPKBzE0jiPRvAx6lsbsM2wqtFXwQDP2zVB16BIL7TofIE8FEzvYK8QABAUAMAAAAEAAAAAkAAAD1FOJL82EdUoHYOEgcjk+GpWG1iEbPVZ9EyruCue7oix0Gww6D
   $ cat poison_record_as
   JSUl3wAAAAAAAADxIiIiIiIiIiJVRUMyAAAALbcKG8kCT4lmL1z3fz5JEAPknzgMbmxTqCSpirGSRi2Itmoc2pQgJwQmVAAAAAABAUAMAAAAEAAAACAAAADvLC6TB/8c3VaZoqr8nAgsw8leOB9NFwWbxoxYC5MKaXQP8RjTS7OkC9Rw3wu2ZpXCqJjN70lN4mjBq1lCAAAAAAAAAAABAUAMAAAAEAAAABYAAADzcOwIwaztpphfSKqkC6Z6l4fKIJPg39sLXFHa5qvVYvHGBAg9J4vAF9kj1RfXt6IT6w==
   ```

   With usual crypto envelope header inside:
   ```
   $ base64 -d poison_record_ab | hexdump -C | head -n2
   00000000  25 25 25 9f 00 00 00 00  00 00 00 f0 22 22 22 22  |%%%.........""""|
   00000010  8f 00 00 00 00 00 00 00  00 0c 21 00 4c 00 00 01  |..........!.L...|

   $ base64 -d poison_record_as | hexdump -C | head -n2
   00000000  25 25 25 df 00 00 00 00  00 00 00 f1 22 22 22 22  |%%%.........""""|
   00000010  22 22 22 22 55 45 43 32  00 00 00 2d b7 0a 1b c9  |""""UEC2...-....|
   ```


3) Insert generated poison record into the database or any other storage your application interacts with.
   It should be in the same column as the usual encrypted data
   (attacker won't be able to distinguish poison records from legitimate data as they look kinda the same).
   Don't forget to base64 decode before storing it in database if other encrypted data is stored in the binary format.

4) As soon as the application attempts to decrypt the poison record

   * through transparent decryption in AcraServer
   * or through decrypt RPC request in AcraTranslator

   Acra will perform [preconfigured actions]({{< ref "acra/security-controls/intrusion-detection#command-line-flags" >}}).

{{< hint warning >}}
There are two types of crypto envelopes (`acrastruct` & `acrablock`),
and while AcraServer will simply transparently decrypt everything it can,
AcraTranslator decryption methods are specific for each crypto envelope.
For example, in HTTP we have `/v2/decrypt` for AcraStructs and `/v2/decryptSym` for AcraBlocks.
This means you should use the same crypto envelope (`--type` flag for `acra-poisonrecordmaker`)
as for other data you encrypt before storing in the database.
Otherwise, you may end up catching RPC decryption errors instead of AcraTranslator catching poison record access and reacting accordingly.
{{< /hint >}}
