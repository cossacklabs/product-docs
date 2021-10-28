---
title: Cryptography and key management
weight: 7
---

# Cryptography in Acra

Cryptography is widely used across all Acra services for:

* data protection: during [encryption](/acra/security-controls/encryption/), 
  [searchable encryption](/acra/security-controls/searchable-encryption/), 
  [masking](/acra/security-controls/masking/) and [tokenization](/acra/security-controls/tokenization/);
* transport protection and authentication: during mutual authentication and encryption used in 
  [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/) and [TLS](/acra/configuring-maintaining/tls/);
* [audit logging](/acra/security-controls/security-logging-and-events/audit-logging/): when calculating integrity checks of log messages and log chains;
* [password hashing](/acra/configuring-maintaining/general-configuration/acra-authmanager#auth-file) of registered users of Acra Web Configuration UI;
* [key management](/acra/security-controls/key-management/): all intermediate keys are encrypted by key encryption keys and Acra Master Key.


Acra does not contain any self-made cryptographic primitives or obscure ciphers and relies on:

* [Themis cryptographic library](https://www.cossacklabs.com/themis/) which uses OpenSSL/BoringSSL/LibreSSL under the hood;
* [Golang's TLS implementation](https://pkg.go.dev/crypto/tls);
* [Golang's Argon2 hash function implementation](https://pkg.go.dev/golang.org/x/crypto/argon2). 


To deliver its unique guarantees, Acra relies on the combination of well-known ciphers and a smart key management scheme.

|Use case|Crypto source|
|--|--|
|Default crypto-primitive source|OpenSSL|
|Supported crypto-primitive sources |BoringSSL, LibreSSL, FIPS-compliant, GOST-compliant, HSM|
|Storage encryption|AES-256-GCM-PKCS#7 + ECDH (AcraStructs) or AES-256-GCM-PKCS#7 (AcraBlocks)|
|Transport encryption|TLS v1.2+ / Themis Secure Session|
|KMS integration|Amazon KMS, Google Cloud Platform KMS, Hashicorp Vault, Keywhiz|


### Themis

Themis is a high-level open source cryptographic library that encapsulates multiple ciphers into _cryptosystems_ aimed at exact data protection goals.

Themis uses the best available [open-source implementations](/themis/crypto-theory/cryptography-donors) of the 
[most reliable ciphers](/themis/architecture/soter.md). Currently, Themis can be built using OpenSSL, LibreSSL, and Google's BoringSSL (a number of experimental build methods for LibSodium, BearSSL, and even CommonCrypto are available, too).

Acra uses [GoThemis](/themis/languages/go/) (Go-language wrapper for Themis) in AcraServer, AcraTranslator and key management utility. AcraWriters per each platform rely on Themis wrappers built for that platform (for example, AcraWriter for iOS uses ObjCThemis for iOS). 

Acra uses [Themis Secure Message](/themis/crypto-theory/cryptosystems/secure-message/), [Themis Secure Cell Seal](/themis/crypto-theory/cryptosystems/secure-cell/#seal-mode) and [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/) cryptosystems. 

[Acra Enterprise Edition](/acra/enterprise-edition/) can be built on the certified crypto-libraries 
of your choice (i.e. FIPS, GOST). If you'd like to discuss a custom build [drop us an email](mailto:sales@cossacklabs.com).


### Application level encryption

**[AcraStructs](/acra/acra-in-depth/data-structures/acrastruct)** are built on asymmetric cryptography, and combine ECDH with AES-256-GCM-PKCS#7. That's [Themis Secure Message](/themis/crypto-theory/cryptosystems/secure-message/) and [Themis Secure Cell Seal](/themis/crypto-theory/cryptosystems/secure-cell/#seal-mode).

The data is encrypted using AES-256-GCM-PKCS#7 and random symmetric key, which is then encrypted by shared key derived from Acra's public key and encryptor private key (either Acra or client-side application) using ECDH. This scheme is similar to [the HPKE](https://datatracker.ietf.org/doc/draft-irtf-cfrg-hpke/).

**[AcraBlocks](/acra/acra-in-depth/data-structures/acrablock)** are built on symmetric cryptograhy, and use AES-256-GCM-PKCS#7 twice. That's [Themis Secure Cell Seal](/themis/crypto-theory/cryptosystems/secure-cell/#seal-mode).

The data is encrypted using AES-256-GCM-PKCS#7 and random symmetric key, which is then encrypted using AES-256-GCM-PKCS#7 by Acra's secret storage key. This scheme is similar to [the key wrapping](https://en.wikipedia.org/wiki/Key_Wrap).

Acra also uses key derivation and key stretching functions to derive cryptographically strong keys.


### Searchable encryption

[Searchable encryption](/acra/security-controls/searchable-encryption/) is based on data encryption and generation of search index. Searchable encryption is supported in both [AcraStructs](/acra/acra-in-depth/data-structures/acrastruct) and [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock). Searchable index is generated using HMAC-SHA256.


### Key management

Acra uses a lot of encryption keys (symmetric and asymmetric). Refer to [Key management section](/acra/security-controls/key-management/) to learn more about keys and their lifecycle.

Intermediate and secret keys (KEKs) are stored encrypted by Acra Master Key using AES-256-GCM-PKCS#7.


### TLS

Acra handles TLS connections between: 

* Client application and [AcraServer](/acra/configuring-maintaining/general-configuration/acra-server). TLS is used to protect plaintext from application to AcraServer in [Transparent encryption mode](/acra/configuring-maintaining/general-configuration/acra-server#transparent-encryption-mode), and to protect decrypted plaintext by AcraServer before sending to the application back.
* Client application and [AcraTranslator](/acra/configuring-maintaining/general-configuration/acra-translator). TLS is used as transport encryption in HTTP and gRPC protocols supported by AcraTranslator.
* AcraServer and database. TLS is used to protect other data transmitted through AcraServer to database and to be transparent for 
  strictly configured environment with fully protected communication between applications and databases, with mutual 
  TLS authentication.
* [AcraConnector](/acra/configuring-maintaining/general-configuration/acra-connector) and AcraServer. 
  Used as one of supported transport encryption between AcraConnector and AcraServer for same reasons as for 
  communication between application and AcraServer. AcraConnector may be used with applications that cannot
  be extended with TLS protection.
* [Hashicorp Vault](https://www.vaultproject.io/) and AcraServer/AcraTranslator/AcraConnector. All Acra's services use encrypted private keys encrypted with symmetric key `ACRA_MASTER_KEY` that may be safely loaded from Hashicorp Vault.

To increase security, we extended [TLS processing](/acra/configuring-maintaining/tls/) with additional [OCSP](/acra/configuring-maintaining/tls/ocsp) and [CRL](/acra/configuring-maintaining/tls/crl) validation that not implemented in standard library. 

Additionally, Acra's services accept only TLS 1.2+ connections and cipher suites with [perfect forward secrecy](https://en.wikipedia.org/wiki/Forward_secrecy).


### Password hashing

[AcraWebConfig](/acra/configuring-maintaining/general-configuration/acra-webconfig) web UI supports basic authentication for users. Users' passwords are hashed and stored in the [auth file](/acra/configuring-maintaining/general-configuration/acra-authmanager#auth-file).

[Argon2](https://argon2.online/) is a password-based KDF function used by AcraServer and [AcraAuthManager](/acra/configuring-maintaining/general-configuration/acra-authmanager) for hashing stored passwords.


### Cryptographically signed audit logs

AcraServer, AcraConnector and AcraTranslator use symmetric keys and HMAC-SHA256 for generating [audit logs](/acra/security-controls/security-logging-and-events/audit-logging) and signing log messages.