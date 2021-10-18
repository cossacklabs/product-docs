---
title: Separate encryption
bookCollapseSection: true
weight: 3
---

# Separate encryption flow on write queries

One of Acra's operational models (AcraStruct-based) allows you to encrypt data inside your applications, then UPDATE/INSERT your database asyncronously / without passing Acra and only use Acra for SELECT queries. It is useful for gathering data from remote devices/telemetry/services, and it protects the data in motion.

The usual "transparent proxy" data flow implies that sensitive data reaches AcraServer via trusted channel and only then gets encrypted:
* application send unencrypted data to AcraServer (maybe with AcraConnector between them)
* AcraServer encrypts the data and stores encrypted version in database

The network session between application and AcraServer remains encrypted with a strong protocol like TLS, but the confidential data itself is not protected by any additional encryption.

Acra provides ability to generate encrypted records on application/device side and then write it to database in a way that no transit MiTM would lead to data being revealed. Generating records is done via AcraWriter (TODO: link) library in AcraEE's SDK. It creates crypto containers of [the same format]({{< ref "acra/acra-in-depth/data-structures/_index.md#acrastruct" >}}) that AcraServer uses, and data encrypted with AcraWriter can be written directly to database.

[Here]({{< ref "acra/guides/advanced-integrations/client-side-integration-with-acra-connector.md#acrawriter" >}})
is an example guide about using AcraWriter in combination with AcraConnector.
