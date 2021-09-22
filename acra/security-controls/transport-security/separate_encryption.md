---
title: Separate encryption [ENTERPRISE]
bookCollapseSection: true
weight: 3
---

# Separate encryption [ENTERPRISE]

When you want to encrypt data right in the application before sending it anywhere, even though you got TLS for secure transmission.

The usual flow of data when you store a secret looks like this:
* application send unencrypted data to AcraServer (maybe with AcraConnector between them)
* AcraServer encrypts the data and stores encrypted variant in database

The path between application and AcraServer remains encrypted with a strong protocol like TLS,
but the confidential data itself is not protected by any additional layer.

One way to reach kind of end to end encryption between app and database is to use AcraWriter.
This is one more piece of software that will encrypt sensitive data on client side, making it
decryptable only by AcraServer, then AcraServer will then re-encrypt it before storing in database.
Compared to other components, AcraWriter is a library rather than a separate service.
It creates crypto containers of [the same format]({{< ref "acra/acra-in-depth/data-structures/_index.md#acrastruct" >}})
that AcraServer uses, and data encrypted with AcraWriter can be written directly to database.

[Here]({{< ref "acra/guides/advanced-integrations/client-side-integration-with-acra-connector.md#acrawriter" >}})
is an example guide about using AcraWriter in combination with AcraConnector.
