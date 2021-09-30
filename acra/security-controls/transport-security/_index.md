---
title: Transport security
bookCollapseSection: true
---

# Transport security

There are few ways to get encrypted channel between application and database:

* [AcraConnector]({{< ref "acra/security-controls/transport-security/acra-connector.md" >}}),
  a proxy that lives next to your application and securely forwards all requests to AcraServer or AcraTranslator.
* Direct connection to AcraServer,
  with [TLS enabled between app and AcraServer]({{< ref "acra/security-controls/transport-security/tls.md" >}})
  responsible for secure transmission.
* ["separate encryption"]({{< ref "acra/security-controls/transport-security/separate_encryption.md" >}})
  where the app is responsible for encryption of data before it is sent to AcraServer.
  As a result it would be impossible to decrypt the data even if
  attacker can "remove" encryption layers like TLS and inspect transmitted data.
