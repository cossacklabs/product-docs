---
title: AcraTranslator, an API service
bookCollapseSection: true
weight: 3
---

# AcraTranslator, an API service

AcraTranslator also known as API service. It's an API server, that exposes most of Acra’s features as HTTP / gRPC API with client SDKs and traffic protection. AcraTranslator doesn't depend on a database and makes application responsible for actually putting data into storage.

AcraTranslator is your the main choice when your application should make encryption calls, or you use NoSQL/KV datastore.

Refer to [Integrating AcraTranslator into infrastructure](/acra/guides/integrating-acra-translator-into-new-infrastructure/) to learn how configure AcraTranslator.


## What AcraTranslator does

AcraTranslator provides an API (either gRPC or HTTP) for applications giving them the ability to perform different [data protection operations](/acra/acra-in-depth/security-features/), like [encryption/decryption](/acra/security-controls/encryption), [generating hash for searchable encryption](/acra/security-controls/searchable-encryption/), [tokenization/detokenization](/acra/security-controls/tokenization/). 

AcraTranslator reacts on poison records in received data ([intrusion detection](/acra/security-controls/intrusion-detection/)), provides [programmatic reactions on security incidents](/acra/security-controls/security-logging-and-events/programmatic-reactions/), and full-on monitoring: [security logging & audit logging](/acra/security-controls/security-logging-and-events/), security events, metrics, traces, etc.

Refer to a [Acra security features](/acra/acra-in-depth/security-features/) to learn the full list.


## Functional requirements

You application explicitly sends data to the AcraTranslator via API. Your application indicates what AcraTranslator should do with data -- for example, encrypt plaintext and return encrypted container. Then your app is responsible for storing the data, or sending it to another services.

Your application doesn't need to handle any cryptographic code or have access to any keys.

* Data encryption/decryption as API.
* Generating searchable hash for search of encrypted value in a database.
* Tokenization/detokenization as API (it's kind of preudonymization, [read more about tokenization](/acra/security-controls/tokenization/)).
* Encrypted data will remain protected and useless unless AcraTranslator has access to decryption keys.


## Non-functional requirements

* Easy to use from any application – support HTTP and gRPC API, [support SIEMs](/acra/security-controls/security-logging-and-events/siem-soc-integration/), [supports KMS](/acra/configuring-maintaining/key-storing/kms/).
* Available as a package for common server Linux distros, available as Docker image. See [Getting started](/acra/getting-started/).
* Supports a whole set of additional modules and tools - [key management](/acra/security-controls/key-management/), [AcraConnector](/acra/security-controls/transport-security/acra-connector) for better transport encryption, [cryptographically-signed audit logs](/acra/security-controls/security-logging-and-events/audit-logging/).


## Dataflows

We outlined typical dataflows for AcraTranslator in [the Dataflow](/acra/acra-in-depth/data-flow/#simplest-version-with-api-service) chapter.

Here is the simplest connection:

![](/files/acra/app-at-app-db.png)


Client application connects to the AcraTranslator via API, then client app is responsible to storing/using encrypted data. If the client app wants to decrypt data, it reads encrypted data from the storage (or another app), and asks AcraTranslator to decrypt it.


## How it connects to other parts

Except talking with the client app, AcraTranslator also connects to other parts of your system. Some connections are required – for example, if you place Acra Master key to KMS, AcraTranslator should know how to connect to the KMS.

Other connections are optional – for example, you can use Redis as external key storage for intermediate keys (useful when you have a cluster of AcraTranslator), or put them into FS on AcraTranslator side.

![](/files/acra/at-and-all-their-friends.png)


* [AcraConnector](/acra/security-controls/transport-security/acra-connector) – optional client-side service/daemon that implements transport security and authentication for client application that don't support TLS 1.2+.

* [Redis](/acra/acra-in-depth/architecture/key-storage/) – external key storage for intermediate keys (optional), or required storage for tokens if AcraServer performs [tokenization](/acra/security-controls/tokenization/).

* [KMS](/acra/configuring-maintaining/key-storing/kms/) – if you put Acra Master key to KMS, like HashiCorp Vault, AcraServer should read this key during startup.



## What are architectural considerations?

Similar to [AcraServer's recomendations](/acra/acra-in-depth/architecture/acraserver/#what-are-architectural-considerations), it is strictly recommended to host AcraTranslator on a different machine (virtual or physical),
isolated from both client applications and the database.

This comes from the fact that Acra works with a sensitive data (such as encryption keys) and isolation
will decrease risks of other components doing malicious things with it.

When using AcraTranslator, it is considered that you trust it, but do not trust the database.
Anyway, AcraTranslator won't be able to decrypt data for which it does not have the encryption keys,
as well as it won't decrypt data for application clients not supposed to access it.

However, in cases when you need to make application the only component that interacts with plaintext,
AcraTranslator won't help you, you will have to use use things like [AcraWriter](/acra/acra-in-depth/architecture/sdks/) to encrypt data on application-side before it leaves.

Refer to [Scaling and HA](/acra/acra-in-depth/scaling-and-high-availability/) to learn how to scale and support growing infrastructure when you use AcraTranslator.
