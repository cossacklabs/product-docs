---
weight: 11
title:  Python
bookCollapseSection: true
---

# Using Themis in Python

**PyThemis** package provides access to features of Themis cryptographic library for Python:

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
- **[Secret comparison](features/#secure-comparator)**:
  verify that the other party has the same shared secret as you have —
  without disclosing anything about the secret to anyone —
  using _[zero-knowledge proofs](https://en.wikipedia.org/wiki/Zero-knowledge_proof)_.

## Supported Python versions

PyThemis is tested and supported on Python 3.x.

<!-- TODO: remove this paragraph in 2021 -->
{{< hint info >}}
**Note:**
Python 2 is not supported and not maintained.
PyThemis 0.13 is known to work with Python 2.7,
but it may break in later versions.
{{< /hint >}}

## Getting started

[Follow these instructions](installation/) to install PyThemis.

Here are other things that might interest you:

<!-- API references when they are done -->
- [browse code samples](examples/) to get a feel of PyThemis API
- [use interactive simulator](/themis/debugging/themis-server/) to cross-verify your code
- [read feature guides](features/) to learn how to use PyThemis effectively
