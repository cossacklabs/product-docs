---
title: AcraTranslator, an API service
weight: 3
---

# AcraTranslator, an API service

AcraTranslator is an API server, that exposes most of Acra’s features as 
[HTTP](/acra/guides/integrating-acra-translator-into-new-infrastructure/http_api/) or
[gRPC](/acra/guides/integrating-acra-translator-into-new-infrastructure/grpc_api/) API with client SDKs and traffic 
protection. This element of Acra is necessary in the use-cases when applications store the encrypted data as separate blobs (files
that are not in a database - i.e. in the S3 bucket, local file storage, etc.).

By its nature, AcraTranslator is a separate daemon that runs in an isolated environment (separate virtual machine or
physical server). AcraTranslator is responsible for holding all the secrets required for data decryption and for
actually decrypting the data.

AcraTranslator doesn't care about the source of the data, it accepts
[AcraStructs](/acra/acra-in-depth/data-structures/acrastruct/) or [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock/) 
via HTTP or gRPC API. An application can conveniently store crypto envelope anywhere: as
cells in the database, as files in the file storage (local or cloud storage, like S3).
An application sends [AcraStructs](/acra/acra-in-depth/data-structures/acrastruct/) or [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock/) 
as binary data and receives plaintext (or decryption error) from AcraTranslator.

However, sending plaintext data via a non-secure channel is a bad idea, so AcraTranslator requires usage of
[Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/) (deprecated since 0.91.0) or [TLS](/acra/configuring-maintaining/general-configuration/acra-translator/#tls) 
encryption channel (which is basically encrypted TCP/UNIX sockets).
To establish a Themis Secure Session connection, an application doesn't need to include the crypto-code itself, only to
direct the traffic through [AcraConnector](/acra/configuring-maintaining/general-configuration/acra-connector/) instead.

AcraTranslator is your main choice when your application should make encryption calls, or you use NoSQL/KV datastore.

Refer to [Integrating AcraTranslator into infrastructure](/acra/guides/integrating-acra-translator-into-new-infrastructure/) to learn how to configure AcraTranslator.


## AcraTranslator's functionality

AcraTranslator provides an API (either gRPC or HTTP) for applications giving them the ability to perform different [data protection operations](/acra/acra-in-depth/security-features/), like [encryption/decryption](/acra/security-controls/encryption), [generating hash for searchable encryption](/acra/security-controls/searchable-encryption/), [tokenization/detokenization](/acra/security-controls/tokenization/). 

AcraTranslator reacts on poison records in received data ([intrusion detection](/acra/security-controls/intrusion-detection/)), provides [programmatic reactions on security incidents](/acra/security-controls/security-logging-and-events/programmatic-reactions/), and full-on monitoring: [security logging & audit logging](/acra/security-controls/security-logging-and-events/), security events, metrics, traces, etc.

Refer to a [Acra security features](/acra/acra-in-depth/security-features/) to learn the full list.


## Functional requirements

Your application explicitly sends data to the AcraTranslator via API. Your application defines AcraTranslator's behavior regarding the data -- for example, encrypt a plaintext and return encrypted container. Then your app is responsible for storing the data, or sending it to another services.

Your application doesn't need to handle any cryptographic code or have access to any keys.

* Data encryption/decryption as API.
* Generating searchable hash for search of encrypted value in a database.
* Tokenization/detokenization as API (it's a kind of pseudonymization, [read more about tokenization](/acra/security-controls/tokenization/)).
* Encrypted data will remain protected and useless unless AcraTranslator has access to decryption keys.


## Non-functional requirements

* Is easy to use from any application – AcraTranslator supports HTTP and gRPC API, [supports SIEMs](/acra/security-controls/security-logging-and-events/siem-soc-integration/), [supports KMS](/acra/configuring-maintaining/key-storing/kms-integration/).
* Is available as a package for common server Linux distros, available as Docker image. See [Getting started](/acra/getting-started/).
* Supports a whole set of additional modules and tools - [key management](/acra/security-controls/key-management/), [AcraConnector](/acra/security-controls/transport-security/acra-connector) (deprecated since 0.91.0) for better transport encryption, [cryptographically-signed audit logs](/acra/security-controls/security-logging-and-events/audit-logging/).


## Dataflows

We outlined typical dataflows for AcraTranslator in [the Dataflow](/acra/acra-in-depth/data-flow/#simplest-version-with-api-service) chapter.

Here is the simplest connection:

![](/files/acra/app-at-app-db.png)


Client application connects to the AcraTranslator via API, then client app is responsible for storing/using encrypted data. If the client app wants to decrypt data, it reads encrypted data from the storage (or another app), and asks AcraTranslator to decrypt it.

Acra provides [SDK for AcraTranslator](/acra/acra-in-depth/architecture/sdks/acratranslator-sdk/) to improve working with its API and make integration easier.


## Connection with other parts

Except talking with the client app, AcraTranslator also connects to other parts of your system. Some connections are required – for example, if you place Acra Master Key to KMS, AcraTranslator should know how to connect to the KMS.

Other connections are optional – for example, you can use Redis as external key storage for intermediate keys (useful when you have a cluster of AcraTranslator), or put them into FS on AcraTranslator side.

![](/files/acra/at-and-all-their-friends.png)


* [Redis](/acra/acra-in-depth/architecture/key-storage-and-kms/key-storage/) – external key storage for intermediate keys (optional), or required storage for tokens if AcraTranslator performs [tokenization](/acra/security-controls/tokenization/).

* [KMS](/acra/acra-in-depth/architecture/key-storage-and-kms/kms/) – if you put Acra Master Key to KMS, like HashiCorp Vault, AcraTranslator should read this key during startup.

* [SDK for AcraTranslator](/acra/acra-in-depth/architecture/sdks/acratranslator-sdk/) – optional client-side SDK for easier usage of AcraTranslator's API in the app.

* [AcraWriter](/acra/acra-in-depth/architecture/sdks/acrawriter/), [AcraReader](/acra/acra-in-depth/architecture/sdks/acrareader/) – optional client-side SDKs to encrypt or decrypt AcraBlocks/AcraStructs without AcraTranslator.

* [AcraConnector](/acra/security-controls/transport-security/acra-connector) (deprecated since 0.91.0) – optional client-side service/daemon that implements transport security and authentication for client application that doesn't support TLS 1.2+.


## Architectural considerations

Similar to [AcraServer's recommendations](/acra/acra-in-depth/architecture/acraserver/#what-are-architectural-considerations), it is strictly recommended to host AcraTranslator on a different machine (virtual or physical),
isolated from both client applications and the database.

This comes from the fact that Acra works with a sensitive data (such as encryption keys) and isolation
will decrease risks of other components doing malicious things with it.

When using AcraTranslator, it is considered that you trust it, but do not trust the database.
Anyway, AcraTranslator won't be able to decrypt data for which it does not have the encryption keys,
as well as it won't decrypt data for application clients not supposed to access it.

However, in cases when you need to make application the only component that interacts with plaintext,
AcraTranslator won't help you, you will have to use things like [AcraWriter](/acra/acra-in-depth/architecture/sdks/acrawriter/) to encrypt data on application-side before it leaves.

Refer to [Scaling and HA](/acra/acra-in-depth/scaling-and-high-availability/) to learn how to scale and support growing infrastructure when you use AcraTranslator.
