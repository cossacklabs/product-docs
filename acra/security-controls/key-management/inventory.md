---
weight: 1
title: Inventory of Acra keys
bookCollapseSection: true
---

# Inventory of Acra keys

## Master Key

The "main key" that is used to protect all the other keys.
Acra services will refuse to launch without it as well.
It is [generated]({{< ref "acra/security-controls/key-management/operations/generation.md#11-generating-master-keys">}})
during install, then stored KMS.

During the launch, Acra will read master key from KMS (environment variable or Hashicorp Vault).
And if you choose the environment variable, the way it appears there is up to you:
* Read from file
* Fetch from somewhere using `wget` or `curl`
* Fetch from Hashicorp Vault using `vault` binary (even though Acra has this [integrated]({{< ref "acra/configuring-maintaining/key-storing/kms.md#which-kms-we-support" >}}))
* Any other way of securely pulling the master key

After reading it, Acra will store it in memory, although it can be purged and re-requested later.

**TODO** discuss rotation, are we even allowing to rotate MK with current tooling?

## KEKs

Used essentially anywhere where some kind of cryptography is involved, see detailed list below.

They are [generated]({{< ref "acra/security-controls/key-management/operations/generation.md#12-generating-transport-and-encryption-keys">}})
using `acra-keymaker` tool, just like the master key.

KEKs are stored in [KV store]({{< ref "acra/configuring-maintaining/key-storing/kv-stores.md" >}}),
simply talking it is filesystem directory or Redis database.

All KEKs are encrypted by master key, that's why you should protect master key more than any other one.

When read from the store, these keys will be cached in memory to improve performance.
This behavior is completely adjustable.

Acra keys, unless in special cases, do not leave Acra-controlled ecosystem (Acra and KMS) in plaintext, thus making the key lifecycle easier.

There are several types of keys used in Acra:

  - **Storage asymmetric keys.**
    AcraWriter uses the public key to encrypt data to be stored in the database.
    AcraServer and AcraTranslator use corresponding private storage key
    to decrypt data queried from the database. Also AcraServer in 
    [Transparent proxy mode]({{< ref "acra/acra-in-depth/architecture/acraserver" >}}) and AcraTranslator use public key to encrypt data into [AcraStruct](/acra/acra-in-depth/data-structures/acrastruct).
  - **Storage symmetric keys.**
    AcraServer in Transparent proxy mode and AcraTranslator use symmetric keys to encrypt/decrypt data into [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock))

  - **Blind index keys.**
AcraServer in Transparent proxy mode and AcraTranslator uses symmetric keys for hash calculations to implement searchable encryption. You can find more details in our [scientific paper](https://eprint.iacr.org/2019/806.pdf).

  - **Secure logging keys.**
    AcraServer, AcraConnector and AcraTranslator use symmetric keys for [audit log](/acra/security-controls/security-logging-and-events/audit-logging) and HMAC calculations to sign all output logs

  - **Keys for transport encryption.**
    Acra uses either [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/) or TLS
    as transport protection between AcraServer and AcraConnector, or AcraTranslator and AcraConnector.

    In Themis Secure Session mode, Acra uses transport keypairs:
    the two parties should exchange public keys, keeping the private keys to themselves.
    In TLS mode, Acra uses TLS certificates instead of transport keypairs.

  - **Poison record keys.** Used by AcraServer and AcraTranslator to detect suspicious data access patterns.

  - **Authentication storage key.** Used by AcraServer for encryption/decryption credentials of AcraWebConfig users.

Storage keys can be represented by either:

  - One keypair for each [Client ID](/acra/guides/integrating-acra-server-into-infrastructure/client_id/),
    which is used for encryption by AcraWriter and decryption by AcraServer and AcraTranslator.

  - A set of [Zone keys](/acra/security-controls/zones/).
    Each zone represents a unique user or type of users and has corresponding encryption and decryption keys.
    Using zones complicates unauthorized decryption:
    the attacker not only needs to get the decryption key but to use a correct Zone ID, too.

## Key names and locations

> Note: Read more about handling key names in [Losing your keys]({{< ref "/acra/security-controls/key-management/troubleshooting.md#losing-the-keys" >}}) and [Renaming your keys]({{< ref "/acra/security-controls/key-management/troubleshooting.md#renaming-key-files" >}}).

Correct operation of each Acra's component requires set of cryptographic keys (default keystore is `.acrakeys` filesystem directory)

- **AcraConnector** needs to have its own transport private key and other party transport public key to establish a [Themis Secure Session connection]({{< ref "themis/crypto-theory/cryptosystems/secure-session.md" >}}). You need put transport public key of AcraServer or AcraTranslator into AcraConnector's key storage, depending on the connection type.

- **AcraServer** needs to have:
    - AcraConnector's transport public key and AcraServer's own transport private key. This is necessary for accepting connections from clients via Themis Secure Session
    - Storage and zone asymmetric private keys for decrypting AcraStructs generated by AcraWriter.
    - Storage symmetric keys for encrypting and decrypting AcraBlocks in transparent mode.
    - If AcraServer is running in [Transparent proxy mode]({{< ref "acra/acra-in-depth/architecture/acraserver" >}}), it should possess the zone and storage public key(s) for encrypting the values from SQL queries to AcraStructs and symmetric data encryption keys for AcraBlocks.
    - Poison record keys to be able to detect poison records in database responses.
    - Keys for secure logging that prevents tampering messages, removing, adding or changing the order of log entries
    - Authentication storage key to access AcraWebConfig's credentials and allow update AcraServer's configuration from WebUI.

- **AcraTranslator** needs to have same keys as AcraServer except authentication storage key.

- **AcraWriter** should have the storage public keys. They are necessary for encrypting data into AcraStructs in such a way that would only be readable for AcraServer/AcraTranslator.

- If you're using **AcraWebConfig** HTTP server to configure AcraServer remotely, the users' credentials are stored encrypted with authentication storage key and are decrypted on AcraServer upon users' login. AcraServer needs to have an authentication storage key.

#### Keys table

##### Asymmetric keys
| Purpose  | Private key  | Stays on  | Public key | Put to
| --- | --- | --- | --- | ---
| Transport AcraConnector | `${ClientID}` | AcraConnector | `${ClientID}.pub` | AcraServer<br/>AcraTranslator
| Transport AcraServer | `${ClientID}_server`| AcraServer | `${ClientID}_server.pub` | AcraConnector
| Transport AcraTranslator | `${ClientID}_translator`| AcraTranslator | `${ClientID}_translator.pub` | AcraConnector
| AcraStruct encryption |  |  | `${ClientID}_storage.pub` | AcraWriter<br/>AcraTranslator<br/>AcraServer (Transparent proxy mode)
| AcraStruct decryption | `${ClientID}_storage` | AcraServer<br/>AcraTranslator |  |  |
| AcraStruct encryption with Zones |  |  | `${ZoneID}_zone.pub` | AcraWriter<br/>AcraTranslator<br/>AcraServer (Transparent proxy mode)
| AcraStruct decryption with Zones | `${ZoneID}_zone` | AcraServer<br/>AcraTranslator | |
| Poison record with AcraStruct | `poison_key` | AcraServer<br/>AcraTranslator | `poison_key.pub` | AcraServer<br/>AcraTranslator

##### Symmetric keys
| Purpose  | Symmetric key  | Stays on
| --- | --- | --- 
| AcraBlock encryption + decryption | `${ClientID}_storage_sym` | AcraServer<br/>AcraTranslator
| AcraBlock encryption + decryption with Zones | `${ZoneID}_zone_sym` | AcraServer<br/>AcraTranslator
| Poison record with AcraBlock |  `${ZoneID}_zone_sym`| AcraServer<br/>AcraTranslator
| Searchable encryption + decryption |  `${ClientID}_hmac` | AcraServer<br/>AcraTranslator
| Secure logging |  `secure_log_key` | AcraServer<br/>AcraTranslator<br/>AcraConnector
| Authentication storage key for AcraWebConfig's users | `auth_key`| AcraServer

<!-- TODO: describe Acra EE keys? -->

Read about [key generation]({{< ref "acra/security-controls/key-management/operations/generation.md" >}})
to learn how to generate and distribute these keys between Acra components.
