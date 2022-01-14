---
title: TLS
weight: 1
---

# TLS

Acra services such as AcraServer and AcraTranslator support TLS connection from client applications. It means that client application sends data in a plaintext to AcraServer/AcraTranslator to encrypt, and the only protection layer the data has – is TLS.

Apart from the fact that the transport layer will be encrypted, TLS has another important role: client authentication and key selection.

TLS certificate presented to AcraServer or AcraTranslator will prove that it's indeed a legitimate and known client app.
It will also give AcraServer/AcraTranslator the identifier of encryption keys that should be used to process requests of this specific client.
In other words, client apps won't be able to decrypt each other's data since they can only decrypt things encrypted with their own keys.

The part where client app's identifier is extracted from the certificate is controlled by `--tls_identifier_extractor_type` flag.

We strongly recommend using TLS with mutual authentication ("pinning TLS certificates") when possible

Refer to [Configuring and maintaining / TLS](/acra/configuring-maintaining/tls/) to learn more.