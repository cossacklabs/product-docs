---
weight: 1
title: Inventory of Acra keys
bookCollapseSection: true
---

# Inventory of Acra keys

Acra uses many keys, but the key hierarchy is built to satisfy both security and usability requirements. Depending on how many features, `ClientID`s, and Acra services you use, your system will operate minimum of 2 keys (one Acra Master key and one storage symmetric key) to hundreds.


The key hierarchy is illustrated in the table below (with abbreviations used: AS – AcraServer; AT – AcraTranslator; AC – AcraConnector; service means one instance of AcraServer/AcraTranslator/AcraConnector).

| key | where stored | when required | used for | how many | 
|--|--|--|--|--|
| Acra Master Key| KMS or env | during launch of AS/AT/AC | en/decryption of intermediate keys| 1 per service |
| storage symmetric keys | keystorage (FS, Redis) | during encryption, masking, tokenization | en/decryption of DEKs | 1 per `ClientID` (app, customer) | 
| storage asymmetric keypairs | private key: keystorage (FS, Redis); public key: keystorage or on client app | during en/decryption, de/masking, de/tokenization | en/decryption of DEKs | 1 keypair per `ClientID` (app, customer) | 
| DEK (data encryption keys) | as part of encrypted data field | — | en/decryption of data fields | 1 per each data field | 
| TLS certificate | PKI or FS | during connections to AS/AT/AC | connections to AS/AT/AC | 1 per service |
| transport keypair for AcraConnector | private key: service; public key: service | during connections to AS/AT from AC | connections to AS/AT/AC | 1 per service |
| searchable encryption keys | keystorage (FS, Redis) | during searchable en/decryption | en/decryption of data field to search | 1 per service |
| audit logging keys | keystorage (FS, Redis) | during generating or verifying audit logs | generating or verifying audit logs | 1 per service |
| poison record keys | keystorage (FS, Redis) | for intrusion detection | generating or identifying poison record | 1 per service |


Read about [key generation](/acra/security-controls/key-management/operations/generation) to learn how to generate and distribute these keys between Acra components.

## Acra Master Key

{{< hint warning >}}
Keep an eye on Acra Master Key!

If lost, you won't be able to decrypt associated intermediate keys, thus won't be able to decrypt all data associated with them.

Use key backups and periodically verify that they actually work.

Use trusted KMS.
{{< /hint >}}

Acra Master Key is the "main key" that is used to protect all the other keys.
Acra services will refuse to launch without it.
It is [generated](/acra/security-controls/key-management/operations/generation/#11-generating-master-keys/)
during deployment of Acra components manually or automatically, and then it can be stored in the KMS.

We strongly advise creating different Acra Master Keys for independent Acra services. For example, all AcraConnectors should use different Acra Master Keys. If AcraServer and AcraTranslator are used for different data sets (don't encrypt/decrypt data of each other), different Acra Master Keys should be used.

During the launch, each Acra service will read Acra Master Key either from environment variable or from the KMS.

Apart from loading Acra Master Key from the environment variable, following options are also available:

* Reading from file
* Fetching from somewhere using `wget` or `curl`
* Fetching from KMS manually and put as env variable before Acra launch
* Any other way of securely pulling the master key

After reading it, Acra will store it in memory, although it can be purged and re-requested later.


## Intermediate keys

{{< hint warning >}}
Keep an eye on intermediate keys!

If lost, you won't be able to decrypt all data associated with them.

[Do not rename the keys](/acra/security-controls/key-management/troubleshooting/#renaming-key-files), or you won't be able to decrypt the data associated with these keys.
{{< /hint>}}

Acra's intermediate keys – are actually all cryptographic keys except Acra Master Key and data encryption keys (DEKs) stored inside AcraStructs/AcraBlocks.
Intermediate keys are used essentially for all data protection operations (where cryptography is involved).

They are [generated](/acra/security-controls/key-management/operations/generation/#12-generating-transport-and-encryption-keys)
using `acra-keymaker` tool manually or automatically, just like the master key.

Intermediate keys are stored in [KV store](/acra/configuring-maintaining/key-storing/kv-stores/),
e.g. filesystem directory or Redis database.

All intermediate keys are encrypted by Acra Master Key, that's why you should protect Acra Master Key more than any other one.

These keys are shortly cached in memory to improve performance when they are read from the store.
This behavior is completely adjustable.

Acra's intermediate keys, unless in special cases, do not leave Acra-controlled ecosystem (Acra and KMS) in plaintext, thus making the key lifecycle easier. In 99% cases, only public key of keypair should leave your backend (for example, public key from storage asymmetric keypair could be used for [client-side data encryption using AcraWriter](/acra/acra-in-depth/architecture/sdks/acrawriter/)).

There are several types of keys used in Acra.

### Storage symmetric keys

AcraServer in Transparent proxy mode and AcraTranslator use storage symmetric keys to encrypt/decrypt data into/from [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock).

Storage symmetric keys are used for [encryption/decryption](/acra/security-controls/encryption/), [making/demasking](/acra/security-controls/masking/), [tokenization/detokenization](/acra/security-controls/tokenization/), [zones](/acra/security-controls/zones/). These are the default keys, in most cases, you will use them.

Under the hood, storage symmetric keys don't actually encrypt the data fields. Data encryption keys (DEKs) are randomly generated each time and used to encrypt every data field. Storage symmetric keys are used for particular DEK encryption. See [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock) for the encryption details.

| Purpose  | Key name  | Stays on
| --- | --- | --- 
| AcraBlock encryption + decryption | `${ClientID}_storage_sym` | AcraServer, AcraTranslator
| AcraBlock encryption + decryption with Zones | `${ZoneID}_zone_sym` | AcraServer, AcraTranslator

Storage keys can be represented by either:

  - One keypair for each [Client ID](/acra/guides/integrating-acra-server-into-infrastructure/client_id/),
    which is used for encryption by AcraWriter and decryption by AcraServer and AcraTranslator.

  - A set of [Zone keys](/acra/security-controls/zones/).
    Each zone represents a unique user or type of users and has corresponding encryption and decryption keys.
    Using zones complicates unauthorized decryption which requires possession correct Zone ID as well as decryption key.

### Storage asymmetric keypairs

Same as storage symmetric keys, but used to encrypt/decrypt data into [AcraStructs](/acra/acra-in-depth/data-structures/acrastruct). As AcraStructs use asymmetric cryptography, storage asymmetric keys are actually keypairs: public key is used for encryption, private key is used for decryption of DEK.

Storage asymmetric keypairs are used for [encryption/decryption](/acra/security-controls/encryption/), [making/demasking](/acra/security-controls/masking/) and [zones](/acra/security-controls/zones/).

AcraServer in Transparent proxy mode and AcraTranslator use storage asymmetric keys to encrypt/decrypt data into [AcraStructs](/acra/acra-in-depth/data-structures/acrastruct). 

In cases when client-side encryption is required, public key of keypair could be sent to the application side. Then application uses [AcraWriter](/acra/acra-in-depth/architecture/sdks/acrawriter/) to encrypt data into AcraStructs locally before sending it to the database.

Under the hood, storage asymmetric keys don't actually encrypt the data fields. Data encryption keys (DEKs) are randomly generated each time and used to encrypt every data field. Public key from storage asymmetric keypair is used to encrypt DEK, during decryption private key from storage asymmetric keypair is used to decrypt DEK. See [AcraStructs](/acra/acra-in-depth/data-structures/acrastruct) for the encryption details.

| Purpose  | Private key  | Stays on  | Public key | Put to
| --- | --- | --- | --- | ---
| AcraStruct encryption |  |  | `${ClientID}_storage.pub` | AcraWriter, AcraTranslator, AcraServer
| AcraStruct decryption | `${ClientID}_storage` | AcraServer, AcraTranslator |  |  |
| AcraStruct encryption with Zones |  |  | `${ZoneID}_zone.pub` | AcraWriter, AcraTranslator, AcraServer
| AcraStruct decryption with Zones | `${ZoneID}_zone` | AcraServer, AcraTranslator | |


### Searchable encryption keys

When [searchable encryption](/acra/security-controls/searchable-encryption/) is used, AcraServer in Transparent proxy mode and AcraTranslator uses symmetric keys to calculate searchable hash.

| Purpose  | Symmetric key  | Stays on
| --- | --- | --- 
| Searchable encryption + decryption |  `${ClientID}_hmac` | AcraServer, AcraTranslator


### Tamper-proof audit logging keys

AcraServer, AcraConnector and AcraTranslator use symmetric keys to generate tamper-proof [audit log](/acra/security-controls/security-logging-and-events/audit-logging). Then [acra-verifier](/acra/security-controls/security-logging-and-events/audit-logging/) utility uses same key to verify signed logs.

Under the hood this key is used for multiply chained HMAC-calculations to sign/verify log-stream generated by Acra's service.

| Purpose  | Symmetric key  | Stays on
| --- | --- | --- 
| Secure logging |  `secure_log_key` | AcraServer, AcraTranslator, AcraConnector


### TLS certificates

AcraServer and AcraTranslator allow connections from client apps that use TLS or AcraConnector.

TLS is an easy & safe option. Acra services support TLS v1.2+.

Refer to [TLS](/acra/security-controls/transport-security/tls/) section to read how to configure TLS connection. Typically, TLS certificates and CA certificates are stored on AcraServer / AcraTranslator filesystem. 


### Transport encryption via AcraConnector

[AcraConnector](/acra/security-controls/transport-security/acra-connector/) is a transport encryption daemon for secure connecting the client application to AcraServer/AcraTranslator. It provides usage of TLS or [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/) as transport encryption protocols.

`client app <> AcraConnector < [TLS or Themis Secure Session] > AcraServer`

`client app <> AcraConnector < [TLS or Themis Secure Session] > AcraTranslator`

In TLS mode, Acra uses TLS certificates for AcraServer/AcraTranslator and AcraConnector.

In Themis Secure Session mode, Acra uses transport keypairs: the two parties should exchange public keys, keeping the private keys to themselves.

AcraConnector needs to have its own transport private key and other party transport public key to establish a Themis Secure Session connection. You need to put transport public key of AcraServer/AcraTranslator into AcraConnector's key storage, depending on the connection type.

AcraServer/AcraTranslator will have its own transport private key and AcraConnector's public key.

| Purpose  | Private key  | Stays on  | Public key | Put to
| --- | --- | --- | --- | ---
| Transport AcraConnector | `${ClientID}` | AcraConnector | `${ClientID}.pub` | AcraServer, AcraTranslator
| Transport AcraServer | `${ClientID}_server`| AcraServer | `${ClientID}_server.pub` | AcraConnector
| Transport AcraTranslator | `${ClientID}_translator`| AcraTranslator | `${ClientID}_translator.pub` | AcraConnector


### Poison record keys

Poison record keys are used by AcraServer and AcraTranslator to [detect suspicious data access patterns](/acra/security-controls/intrusion-detection/). First, you should generate poison records using Poison record key, and then place the key to AcraServer/AcraTranslator, and the poison records to the database.

As poison records should look like encrypted data, you should generate either symmetric key (when you use AcraBlocks) or asymmetric keypair (when you use AcraStructs).


| Purpose  | Symmetric key  | Stays on
| --- | --- | --- 
| Poison record with AcraBlock |  `poison_key`| AcraServer, AcraTranslator


| Purpose  | Private key  | Stays on  | Public key | Put to
| --- | --- | --- | --- | ---
| Poison record with AcraStruct | `poison_key` | AcraServer, AcraTranslator | `poison_key.pub` | AcraServer, AcraTranslator


### Authentication storage key

{{< hint warning >}}
It is deprecated and will not be used since 0.91.0.
{{< /hint >}}

If you're using [AcraWebConfig](/acra/configuring-maintaining/general-configuration/acra-webconfig/) to configure AcraServer remotely, the users' credentials are stored encrypted with authentication storage key and are decrypted on AcraServer upon users' login. AcraServer needs to have an authentication storage key.

| Purpose  | Symmetric key  | Stays on
| --- | --- | --- 
| Authentication storage key for AcraWebConfig's users | `auth_key`| AcraServer


## Key names and locations

{{< hint info >}}
Read more about handling key names in [Losing your keys](/acra/security-controls/key-management/troubleshooting/#losing-the-keys) and [Renaming your keys](/acra/security-controls/key-management/troubleshooting/#renaming-key-files).
{{< /hint>}}

Correct operation of each Acra's component requires set of cryptographic keys (default keystore is `.acrakeys` filesystem directory).

- **AcraServer** needs to have:
    - Acra Master Key.
    - Storage symmetric keys for encrypting and decrypting AcraBlocks in transparent mode. Necessary only if AcraBlocks are used for encryption, masking, tokenization.
    - Storage asymmetric keypair for encrypting and decrypting AcraStructs. Necessary only if AcraStructs are used for encryption, masking.
    - Searchable encryption keys. Necessary only if searchable encryption is enabled.
    - Keys for tamper-proof audit logging that prevents editing messages, removing, adding or changing the order of log entries. Necessary, only if tamper-proof audit logging is enabled.
    - TLS certificates if TLS is used for transport encryption.
    - AcraConnector's transport public key and AcraServer's own transport private key. Necessary only if AcraConnector is used to connect client app with AcraServer and AcraConnector uses Themis Secure Session.
    - Poison record keys to be able to detect poison records in database responses. Necessary only if intrusion detection is used.
    - Authentication storage key to access AcraWebConfig's credentials and allow update AcraServer's configuration from web. Necessary only if AcraWebConfig is used.

- **AcraTranslator** needs to have same keys as AcraServer except authentication storage key.


- **AcraConnector** needs to have its own transport private key and other party transport public key to establish Themis Secure Session connection. You need put transport public key of AcraServer or AcraTranslator into AcraConnector's key storage, depending on the connection type. Necessary only if AcraConnector is used to connect client app with AcraServer and AcraConnector uses Themis Secure Session.

- **AcraWriter** should have the public key from storage asymmetric keypair. It is necessary for encrypting data into AcraStructs in such a way that would only be readable for AcraServer/AcraTranslator. Necessary only if AcraWriter is used.
