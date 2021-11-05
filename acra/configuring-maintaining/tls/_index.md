---
title: TLS
bookCollapseSection: true
weight: 5
---

# TLS

## CLI flags

Flags related to TLS configuration can be found on page listing all flags of a binary:
* [AcraConnector](/acra/configuring-maintaining/general-configuration/acra-connector/#tls)
* [AcraServer](/acra/configuring-maintaining/general-configuration/acra-server/#tls)
* [AcraTranslator](/acra/configuring-maintaining/general-configuration/acra-translator/#tls)

## Validating a certificate for revocation

TLS-based transport security of Acra services can be additionally enhanced by validation whether peer's certificate is revoked.

This feature is currently implemented for `acra-connector`, `acra-server` and `acra-translator`.

There are two methods for validating the certificate's revocation:
* [OCSP (Online Certificate Status Protocol)](ocsp)
* [CRL (Certificate Revocation List)](crl)

They are configured separately and can be enabled simultaneously.

By default, Acra performs mentioned validation only if the certificate itself contains OCSP or CRL metadata.
And if certificate does not contain OCSP URLs, it won't be validated using OCSP protocol. Same applies for CRL.

## PKI

We have a dedicated page about public key infrastructure, located in [Acra in depth](/acra/acra-in-depth/security-design/acra-and-pki) section.
