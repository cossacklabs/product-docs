---
weight: 4
title:  JavaScript (Node.js)
bookCollapseSection: true
---

# Using Themis in JavaScript with Node.js

**JsThemis** package provides access to features of Themis cryptographic library for Node.js:

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

## Supported Node.js versions

JsThemis is tested and supported on the current LTS versions of Node.js
(v8, v10, v12).

## Getting started

[Follow these instructions](installation/) to install JsThemis.

Here are other things that might interest you:

<!-- API references when they are done -->
- [browse code samples](examples/) to get a feel of JsThemis API
- [read feature guides](features/) to learn how to use JsThemis effectively
