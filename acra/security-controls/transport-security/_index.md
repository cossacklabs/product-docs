---
title: Transport security
bookCollapseSection: true
weight: 7
---

# Transport security

So, your client application communicates with AcraServer/AcraTranslator to encrypt the data. But the communication channel between your app and Acra should be protected!

There are few ways how to create an encrypted channel between client application and AcraServer/AcraTranslator:

* Just use [TLS](/acra/security-controls/transport-security/tls/).

* Use [AcraConnector](/acra/security-controls/transport-security/acra-connector/),
  a proxy daemon that lives next to your application and securely forwards all requests to AcraServer or AcraTranslator. Useful if you can't configure strong TLS on application side, or if the app works in a hostile environment.

* [Client-side encryption using AcraWriter](/acra/security-controls/transport-security/client-side-encryption/), the app is responsible for encrypting the data before it is sent to AcraServer. Technically, it's not a _transport_ encryption, but an _application-layer encryption_. The client-side encryption is useful when the app works in a hostile environment, so even if attackers "remove" TLS layer, they can't inspect transmitted data (because it's encrypted 8-)).