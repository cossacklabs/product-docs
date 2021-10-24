---
title: Architecture
bookCollapseSection: true
weight: 3
---

# Architecture

Acra is a set of tools designed for data protection, stored in a database (using AcraServer) or anywhere else (using AcraTranslator).
Some of them are easy to integrate, while others require writing additional code in places where application transmits or stores the sensitive data.


Acra consists of several services and utilities. Depending on your architecture and use case, you might need to deploy only basic services or many of them.

* **Security enforcement components**: services where "encryption happens".
* **Key storage:** datastores where Acra keeps encrypted keys: Redis, table in your database, any KV store.
* **Master key storage:** KMS, Vault.
* **Additional services and utils:** key mananagement utils, data migration scrips, transport security service, UI configuration service. 


Acra provides security enforcement components in different shapes: 

* AcraServer, also known as SQL Proxy. It's a database proxy that exposes Acra’s functionality by parsing SQL traffic between an app and a database and applying security functions where appropriate.

* AcraTranslator, also known as API service. It's an API server, that exposes most of Acra’s features as HTTP / gRPC API with client SDKs and traffic protection.

* Client-side SDKs. Acra provides optional SDKs for encrypting data (AcraWriter), for decrypting data (AcraReader), for enabling stronger transport security (AcraConnector), for working with AcraTranslator (AnyProxy).


Acra services allow you to construct infinitely sophisticated data flows and are perfectly suited for your exact infrastructure.

Refer to [Acra-in-depth / Architecture](/acra/acra-in-depth/architecture/) to learn more about Acra services.


Acra consists of a client-side library and several server-side applications. Server-side Acra components should run as separate services/servers.

Client-side:

AcraWriter — a client-side library that encrypts the data into a special binary format called AcraStruct. AcraWriter is available for Ruby, Python, Go, NodeJS, iOS (Objective-C/Swift), Android Java, and PHP, but you can easily generate AcraStruct containers with Themis for any platform you want.

AcraConnector — a client-side daemon that runs under a separate user / in a separate container, which acts as a database listener that redirects all the queries to AcraServer and, upon receiving the results, feeds it back into the app. AcraConnector is an optional component, required in systems that are using extra transport encryption layer via Themis' Secure Session.

Server-side:

AcraServer — a separate daemon that runs in an isolated environment (separate virtual machine or physical server). AcraServer is responsible for holding all the secrets required to decrypt the data and for actually decrypting this data.

AcraCensor — a firewall-like component that sits inside AcraServer and checks every SQL query to the database.

Acra also has AcraWebConfig — a lightweight HTTP web server for managing AcraServer's certain configuration options.

AcraTranslator – a lightweight daemon that runs in an isolated environment (a separate virtual machine or physical server), receives AcraStructs via HTTP or gRPC API, and returns the decrypted data. AcraTranslator doesn’t care about the source of the data, it is responsible for holding all the secrets required for data decryption and for actually decrypting the data. You can use AcraTranslator if you work with encrypted data stored as separate blobs (files, KV storages, NoSQL databases).

Check out Protecting data using Acra to gain a better understanding of the way data protection processes work in Acra.



Acra allows you to keep various components of the security system outside of your main application architecture, securely keeping apart components that should not leak or become compromised together:

* Encryption/decryption happens in separate components (proxies and APIs)
* Keys are stored separately, unpacked / delivered to encryption layer atomically, with key layout minimizing risks of massive leakage. 
* Privileged key management happens outside of main components. 
* Configuration is managed separately, delivered to each Acra component separately. 
* Audit trail is exportable to independent audit log storage in real-time. 

Acra CE consists of: 
* Security enforcement component (SQL proxy, API service/proxy, SDK)
* Key storage (Redis, table in your database, any KV store)
* Master key storage driver (plug into KMS / Vault)
... and a number of supporting utilities.

There are 3 basic form-factors of security enforcement components Acra provides: 

* SQL Proxy
* API service (with direct API and application SDKs to talk to that API)
* Privileged SDKs (enabling some operations to happen within application context)

... which allow you to construct infinitely sophisticated data flows with Acra: 

## Key components

* [SQL proxy]({{< ref "sql_proxy.md" >}}) —
  transparent proxy between applications and database, can encrypt/decrypt data, log requests,
  protect from SQL injections, provide other useful security-related tools
* [API]({{< ref "api_service.md" >}}) and [API proxy]({{< ref "api_proxy.md" >}}) —
  RPC service that provides crypto-related operations similar to those in SQL proxy,
  does not depend on database and makes application the one responsible for data storage
* [Key storage]({{< ref "dbs.md#key-storage ">}}) —
  storage for encryption keys and tokenization data
* Configuration and policies —
  YAML files for services configuration (instead of launching then with lots of arguments),
  for AcraServer configuration (transparent encryption, masking, tokenization)
* [KMS]({{< ref "dbs.md#kms ">}}) —
  storage for master key

## Supporting modules

[AcraConnector]({{< ref "acra/security-controls/transport-security/acra-connector.md" >}}) —
additional proxy between application and AcraServer

[WebConfig]({{< ref "acra/configuring-maintaining/general-configuration/acra-webconfig.md" >}}) —
web UI for AcraServer reconfiguration at runtime

# Data flow & component layout

Acra requires 3 components to talk together during startup:

* KMS to fetch keys
* AcraServer/AcraTranslator

Acra requires 3 components to talk together during encryption/decryption:

* Key store
* AcraServer/Translator
* Application
* Database (in AcraServer case)

For examples, please consult [data flow]({{< ref "acra/acra-in-depth/data-flow/_index.md" >}}) section.
