---
title: Client-side encryption
weight: 3
---

# Client-side encryption

{{< hint info >}}
This feature is available in [Acra Enterprise Edition](/acra/enterprise-edition/) only.
{{< /hint>}}

As we describe in [Acra in depth / Architecture](/acra/acra-in-depth/architecture/), data encryption can happen in client application using [AcraWriter SDK](/acra/acra-in-depth/architecture/sdks/acrawriter/).

AcraWriter SDK allows client application to encrypt data into AcraStructs/AcraBlocks and then send encrypted. It means that even if a client application doesn't use TLS or works in a hostile environment, the data is still sent encrypted. Application can sen it directly to the database omitting AcraServer, or send to the AcraServer (it won't encrypt data twice).

Client-side encryption is useful for gathering sensitive data from remote devices/telemetry/services, and it protects the data in motion.

Refer to the [AcraWriter](/acra/acra-in-depth/architecture/sdks/acrawriter/) page to learn more and see examples of dataflows.

Refer to a [client-side integration with AcraConnector guide](/acra/guides/advanced-integrations/client-side-integration-with-acra-connector/) describing how to use AcraWriter and AcraConnector on client app.