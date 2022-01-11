---
title: TLS everywhere
bookCollapseSection: true
weight: 4
---

# TLS everywhere

TLS is supported by all major Acra components that can act as a server, this includes AcraConnector, AcraServer, AcraTranslator.

Each of them has enough [configuration options]({{< ref "acra/configuring-maintaining/tls/_index.md" >}}) to set up TLS
with a custom client and/or server certificates, custom root certificates and with optional certificate validation using OCSP and/or CRL.

It is highly recommended to enable TLS everywhere you can, especially when data is transferred between different machines or servers.
Other layers of protection, such as VPNs, can be added on top of that.
