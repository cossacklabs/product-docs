---
weight: 10
title:  PHP
bookCollapseSection: true
---

# Using Themis in PHP

**PHPThemis** extension provides access to features of Themis cryptographic library in PHP:

- **[Key generation](features/#key-generation)**:
  securely generate strong key pairs and symmetric keys.
- **[Data storage at rest](features/#secure-cell)**:
  encrypt sensitive data for storage with symmetric cryptography.
- **[Authenticated messaging](features/#secure-message)**:
  exchange messages which are readable only by the recipent using asymmetric cryptography,
  or sign messages with your private key to prove identity.
- **[Protect data in motion](features/#secure-session)**:
  establish a session between a client and a server for secure data exchange
  with _[perfect forward secrecy](https://en.wikipedia.org/wiki/Forward_secrecy)_ guarantees.

{{< hint info >}}
PHPThemis does not support _secure comparison_ —
verification of shared secret ownership using zero-knowledge proofs.
This feature is currently in development for PHPThemis.
{{< /hint >}}

## Supported PHP versions

PHP versions 5.6, 7.0, 7.1, 7.2 are supported.

{{< hint warning >}}
**Warning:**
At the moment, PHPThemis does not work with PHP 7.3 and 7.4.

Please [contact us](mailto:dev@cossacklabs.com) if you need support.
{{< /hint >}}

## Getting started

[Follow these instructions](installation/) to install PHPThemis.

Here are other things that might interest you:

<!-- [API reference](when-it-is-done) -->
- [browse code samples](examples/) to get a feel of PHPThemis API
- [read feature guides](features/) to learn how to use PHPThemis effectively
