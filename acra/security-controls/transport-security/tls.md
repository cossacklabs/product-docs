---
title: TLS
bookCollapseSection: true
weight: 2
---

# TLS

Acra services such as AcraServer and AcraTranslator support TLS connection from clients.
In this case these services perform all the crypto operations and client/application only works with unencrypted data,
making TLS the one that protects the data.

Apart from the fact that the transport layer will be encrypted, TLS has another important role:
client authentication and key selection.
TLS certificate presented to AcraServer or AcraTranslator will prove that it's indeed a legitimate and known client.
It will also give server side the identifier of encryption keys that should be used to process requests of this specific client.
In other words, clients won't be able to decrypt each others data since they can only decrypt things encrypted with their own keys.

More info about TLS configuration can be found [here]({{< ref "acra/configuring-maintaining/tls/_index.md" >}}).
The part where client identifier is extracted from the certificate is controlled by `--tls_identifier_extractor_type` flag.
