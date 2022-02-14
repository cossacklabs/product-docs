---
title: AcraConnector
weight: 2
---

# AcraConnector (deprecated since 0.91.0)

{{< hint warning >}}
Starting from version 0.91.0 Acra only supports TLS as a transport security. Refer to [TLS](/acra/security-controls/transport-security/tls/) section to read how to configure TLS connection.
{{< /hint >}}

AcraConnector is a proxy-daemon component that lives nearby client application (perfectly, on the same server /  VM). AcraConnector is an optional components created purely to improve transport security and authentication between client application and AcraServer/AcraTranslator.

AcraConnector creates a secure connection to AcraServer/AcraTranslator and listens for connections from the client application on the other side.
AcraConnector supports two types of transport encryption:

- [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/) (enabled by default), provides both transport encryption and mutual authentication,
- TLS (so, a client app connects to AcraConnector that connects to AcraServer/AcraTranslator via TLS).

Also, compared to TLS, the client identifier `ClientID` (text string that uniquely identifies a client and affects which encryption keys will be used when processing this client requests) will be set by AcraConnector, not taken from client TLS certificate.

Configuration flag for this behavior is `--client_id`.

Refer to the [Configuring and maintaining / General Configuration / AcraConnector](/acra/configuring-maintaining/general-configuration/acra-connector/) page to learn more about AcraConnector configuration.

Refer to a [client-side integration with AcraConnector guide](/acra/guides/advanced-integrations/client-side-integration-with-acra-connector/) describing what it is and how you can use it.
