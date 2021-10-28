---
title: Architecture
bookCollapseSection: true
weight: 3
---

# Architecture

Acra is a set of tools designed for protecting data, stored in a database (using AcraServer) or anywhere else (using AcraTranslator).
Some of them are easier to integrate, while others require writing additional code in places where application transmits or stores the sensitive data.


Acra allows you to keep various components of the security system outside of your main application architecture, securely keeping apart components that should not leak or become compromised together:

* Encryption/decryption happens in separate components (proxies and APIs).
* Keys are stored separately, unpacked / delivered to encryption layer atomically, with key layout minimizing risks of massive leakage. 
* Privileged key management happens outside of main components. 
* Configuration is managed separately, delivered to each Acra component separately. 
* Audit trail is exportable to independent audit log storage in real-time. 


## Acra components overview

Acra consists of several services and utilities. Depending on your architecture and use case, you might need to deploy only basic services or all of them.

* **Security enforcement components**: services where "encryption happens". One of them is required.
* **Key storage:** datastores where Acra keeps encrypted keys: Redis, table in your database, any KV store. One of them is required.
* **Master key storage:** KMS, Vault. One of them is required.
* **Additional services and utils:** key management utils, data migration scrips, transport security service, UI configuration service. Any of them are optional.

### Security enforcement components

* [AcraServer](/acra/acra-in-depth/architecture/acraserver/), also known as SQL Proxy. It's SQL database proxy that exposes Acra’s functionality by parsing SQL traffic between an app and a database and applying security functions where appropriate. It supports encryption, searchable encryption, masking, tokenization, SQL firewall, logging & audit logging.

* [AcraTranslator](/acra/acra-in-depth/architecture/acratranslator/), also known as API service. It's an API server, that exposes most of Acra’s features as HTTP / gRPC API with client SDKs and traffic protection. AcraTranslator doesn't depend on a database and makes application responsible for actually putting data into storage. It supports encryption, creating searchable hashes, masking, tokenization, logging.

* [AnyProxy](/acra/acra-in-depth/architecture/anyproxy/). It's an API server that works between several API-driven microservices/applications. AnyProxy can transparently forward requests/responses so your applications stay "thin clients".

* [Client-side SDKs](/acra/acra-in-depth/architecture/sdks/). Acra provides optional SDKs for encrypting data (AcraWriter), for decrypting data (AcraReader), or for working with AcraTranslator.


### Key management tools

* [Key management utilities](/acra/security-controls/key-management/) - utilities for key generation, key rotation, key export, etc. that are required when using Acra.

* [Key storage](/acra/acra-in-depth/architecture/key-storage/) – storage for intermediate encrypted encryption keys and tokens created as result of tokenization.

* [KMS](/acra/acra-in-depth/architecture/key-storage/) – storage for Acra's Master key, outside components – HashiCorp Vault, AWS KMS, GCP KMS, HSM, etc.



### Additional useful tooling

* [AcraWebConfig](/acra/configuring-maintaining/general-configuration/acra-webconfig/) — a lightweight HTTP web server for managing AcraServer's certain configuration options at runtime by clicking rather than updating configuration files manually.

* [AcraConnector](/acra/security-controls/transport-security/acra-connector) — additional client-side service/daemon that implements transport security and authentication for client application that doesn't support TLS 1.2+. Connects client app with AcraServer/AcraTranslator.

* [Configuration files](/acra/configuring-maintaining/general-configuration/) – AcraServer and AcraTranslator use configuration files to setup connections to the app and database, keys, TLS options, even encryption options.

* [Policies](/acra/configuring-maintaining/policies-enterprise/) — ready-made recipes for more flexible security controls, applying different behaviour based on keys, origin and other factors.

* [Rollback](/acra/configuring-maintaining/general-configuration/acra-rollback/) – utility that allows to decrypt SQL database back into original format.

* [Poison record maker](/acra/configuring-maintaining/general-configuration/acra-poisonrecordmaker/) – utility that creates [poison records]/acra/security-controls/intrusion-detection/) (honey tokens) to place them in the database for intrusion detection.

* [Audit log verifier](/acra/configuring-maintaining/general-configuration/acra-log-verifier/) – utility that verifies [cryptographically-signed audit logs](/acra/security-controls/security-logging-and-events/audit-logging/) dumped from AcraServer/AcraTranslator.


## Data flows

Different Acra components are required on different stages of the dataflow.

AcraServer/AcraTranslator talks to KMS and key storage during startup.

AcraServer talks to key storage, client-application and the database during encryption/decryption.

AcraTranslator talks to key storage and client-application during encryption/decryption.

We illustrate different examples of dataflows, see [Acra-in-depth / Dataflow](/acra/acra-in-depth/data-flow/) and [Getting started](/acra/getting-started/) to learn how to deploy components.
