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


### Keystore

* `--keystore_encryption_type=<strategy>`

  Keystore encryption strategy.
  Currently supported strategies:
    * **`env_master_key`** (**Default**) - Keystore using Acra Master Key, loaded from ENV (`ACRA_MASTER_KEY`) variable;
    * **`vault_master_key`** -  Keystore using Acra Master Key, loaded from Hashicorp Vault
    * **`kms_encrypted_master_key`** - Keystore using Acra Master Key, loaded from ENV `ACRA_MASTER_KEY` variable and decrypted
      via KMS key-encryption key.
    * **`kms_per_client`** - Keystore using KMS for decryption Acra keys per ClientID and ZoneID.
      Create corresponded key-encryption key on KMS if not present on KMS.


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

  Path to additional CA certificate for Vault certificate validation.
  Empty by default.


* `--vault_tls_client_cert=<filename>`

  Path to AcraServer TLS certificate presented to Vault (AcraServer works as "client" when communicating with Vault).
  Empty by default.


* `--vault_tls_client_key=<filename>`

  Path to private key of the TLS certificate presented to Vault.
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
