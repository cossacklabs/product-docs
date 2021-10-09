---
title: Architecture
bookCollapseSection: true
weight: 1
---

# Architecture

Acra is a set of tools designed for data protection, stored in a database (using AcraServer) or anywhere else (using AcraTranslator).
Some of them are easy to integrate, while others require writing additional code in places where application transmits or stores the sensitive data.

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
  TODO
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

For examples, please consult (TODO link) appropriate section for data flow examples.
