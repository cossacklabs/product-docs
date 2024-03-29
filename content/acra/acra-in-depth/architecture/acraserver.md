---
title: AcraServer, an SQL proxy
weight: 2
---

# AcraServer, an SQL database proxy

## How AcraServer works

AcraServer is also known as SQL Proxy. It's an SQL database proxy that exposes Acra’s functionality by parsing SQL traffic between an app and a database and applying security functions where appropriate. 

If you'd like to encrypt the data between your app and SQL database "transparently on-a-fly" then AcraServer should be your main choice.

AcraServer sits between your application and MySQL/PostgreSQL database and does the following:

- captures all packets from database driver to database and back
- recognizes packets related to SQL queries or data transferring
- passes SQL queries through [AcraCensor SQL firewall]({{< ref "/acra/security-controls/sql-firewall" >}}) before further processing
- encrypts, tokenizes, masks all recognized plaintext fields according to the [encryptor config]({{< ref "acra/security-controls/encryption/#acraServer-configuration" >}}) 
  and passes further to the database as it was sent by application
- decrypts, detokenizes, unmasks data from database to application as it was sent by database
- checks on intrusion detection via recognizing [poison records]({{<ref "/acra/security-controls/intrusion-detection/" >}})

Refer to [Integrating AcraServer into infrastructure](/acra/guides/integrating-acra-server-into-infrastructure/) to learn how configure AcraServer.

{{< hint warning >}}
Read detailed technical blogpost about [transparent data encryption for SQL databases](https://www.cossacklabs.com/blog/acra-transparent-data-encryption-for-sql-databases/).
{{</ hint >}}

## AcraServer's functionality

It performs different [data protection operations](/acra/acra-in-depth/security-features/), like [encryption/decryption](/acra/security-controls/encryption), [searchable encryption](/acra/security-controls/searchable-encryption/), [masking/demasking](/acra/security-controls/masking/), [tokenization/detokenization](/acra/security-controls/tokenization/). 

It allows filtering SQL queries by its built-in [SQL request firewall](/acra/security-controls/sql-firewall/). 

It supports [intrusion detection](/acra/security-controls/intrusion-detection/), [programmatic reactions on security incidents](/acra/security-controls/security-logging-and-events/programmatic-reactions/), and provides full-on monitoring: [security logging & audit logging](/acra/security-controls/security-logging-and-events/), security events, metrics, traces, etc.

Refer to a [Acra security features](/acra/acra-in-depth/security-features/) to learn the full list.


## Functional requirements

Your application sends plaintext data to the database through AcraServer. AcraServer encrypts the data and sends it to the database. The data is stored encrypted in the database until the app reads it through AcraServer.

Your application doesn't need to handle any cryptographic code or have access to any keys.

* Transparent data encryption/decryption.
* Searchable encryption.
* Transparent tokenization/detokenization (it's a kind of pseudonymization; [read more about tokenization](/acra/security-controls/tokenization/)).
* Transparent encryption/decryption with masking (leaving some part of data unencrypted;
  [read more about masking](/acra/security-controls/masking/)).
* Encrypted data in the database will remain protected and useless unless AcraServer has access to decryption keys.


## Non-functional requirements

* Is easy to integrate into existing infrastructure – supports SQL databases, [supports SIEMs](/acra/security-controls/security-logging-and-events/siem-soc-integration/), [supports KMS](/acra/configuring-maintaining/key-storing/kms-integration/).
* Is available as a package for common server Linux distros, available as Docker image. See [Getting started](/acra/getting-started/).
* Is integrated with [AcraWebConfig](/acra/configuring-maintaining/general-configuration/acra-webconfig/) (deprecated since 0.91.0) - a helper tool for re-configuring at runtime.
* Supports a whole set of additional modules and tools - [key management](/acra/security-controls/key-management/), [SQL firewall](/acra/security-controls/sql-firewall), [AcraConnector](/acra/security-controls/transport-security/acra-connector) (deprecated since 0.91.0) for better transport encryption, [AcraWriter](/acra/acra-in-depth/architecture/sdks/acrawriter/) for client-side encryption, [cryptographically-signed audit logs](/acra/security-controls/security-logging-and-events/audit-logging/).


## Dataflows

We outlined typical dataflows for AcraServer in [the Dataflow](/acra/acra-in-depth/data-flow/#simplest-version-with-sql-proxy) chapter.

Here is the simplest connection:

![](/files/acra/app-as-db.png)


Client application connects to the AcraServer, which works as a reverse-proxy for SQL database.


## Connection with other parts

Except talking with the client app and the database, AcraServer also connects to other parts of your system. Some connections are required – for example, if you place Acra Master key to KMS, AcraServer should know how to connect to the KMS.

Other connections are optional – for example, you can use Redis as external key storage for intermediate keys (useful when you have a cluster of AcraServers), or put them into FS on AcraServer side.

![](/files/acra/as-and-all-their-friends.png)


* [Redis](/acra/acra-in-depth/architecture/key-storage-and-kms/key-storage/) – external key storage for intermediate keys (optional), or required storage for tokens if AcraServer performs [tokenization](/acra/security-controls/tokenization/).

* [KMS](/acra/acra-in-depth/architecture/key-storage-and-kms/kms/) – if you put Acra Master Key to KMS, like HashiCorp Vault, AcraServer should read this key during startup.

* [AcraWriter](/acra/acra-in-depth/architecture/sdks/acrawriter/), [AcraReader](/acra/acra-in-depth/architecture/sdks/acrareader/) – optional client-side SDKs to encrypt or decrypt AcraBlocks/AcraStructs without AcraTranslator.

* [AcraConnector](/acra/security-controls/transport-security/acra-connector) (deprecated since 0.91.0) – optional client-side service/daemon that implements transport security and authentication for client application that doesn't support TLS 1.2+.

* [AcraWebConfig](/acra/configuring-maintaining/general-configuration/acra-webconfig/) (deprecated since 0.91.0) — optional lightweight HTTP web server for managing AcraServer's certain configuration options at runtime by clicking rather than updating configuration files manually.

## Architectural considerations

It is strictly recommended to host AcraServer on a different machine (virtual or physical),
isolated from both client applications and the database.

This comes from the fact that Acra works with a sensitive data (such as encryption keys) and isolation
will decrease risks of other components doing malicious things with it.

When using AcraServer, it is considered that you trust it, but do not trust the database.
Anyway, AcraServer won't be able to decrypt data for which it does not have the encryption keys,
as well as it won't decrypt data for SQL clients not supposed to access it.

In many cases using SQL proxy would be a desired solution as it is
[quite easy to integrate into existing infrastructure](/acra/guides/integrating-acra-server-into-infrastructure/).
Also, it provides a whole complex data protection stuff.

However, in cases when you need to make application the only component that interacts with plaintext,
AcraServer won't help you, you will have to use things like [AcraWriter](/acra/acra-in-depth/architecture/sdks/acrawriter/) to encrypt data on application-side before it leaves.

Refer to [Scaling and HA](/acra/acra-in-depth/scaling-and-high-availability/) to learn how to scale and support growing infrastructure when you use AcraServer.