---
title: TLS
bookCollapseSection: true
---



# TLS

## Certificate validation

Acra services can be configured to validate other peers certificate during TLS handshake.

This feature is currently implemented for `acra-connector`, `acra-server` and `acra-translator`.

There are two methods for certificate validation.
They are configured separately and can be enabled simultaneously.
Or disabled completely.
* [OCSP (Online Certificate Status Protocol)](ocsp)
* [CRL (Certificate Revocation List)](crl)

By dafault Acra will perform validation only if the certificate itself contains OCSP or CRL metadata.
And if certificate does not contain OCSP URLs, it won't be validated using OCSP protocol. Same applies for CRL.
