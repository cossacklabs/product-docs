---
weight: 6
title:  Java
bookCollapseSection: true
---

# Using Themis in Java

**JavaThemis** wrapper provides access to features of Themis cryptographic library for Java and Android applications:

- **[Key generation](features#key-generation)**:
  securely generate strong key pairs and symmetric keys.
- **[Data storage at rest](features#secure-cell)**:
  encrypt sensitive data for storage with symmetric cryptography.
- **[Authenticated messaging](features#secure-message)**:
  exchange messages which are readable only by the recipent using asymmetric cryptography,
  or sign messages with your private key to prove identity.
- **[Protect data in motion](features#secure-session)**:
  establish a session between a client and a server for secure data exchange
  with _[perfect forward secrecy](https://en.wikipedia.org/wiki/Forward_secrecy)_ guarantees.
- **[Secret comparison](features#secure-comparator)**:
  verify that the other party has the same shared secret as you have —
  without disclosing anything about the secret to anyone —
  using _[zero-knowledge proofs](https://en.wikipedia.org/wiki/Zero-knowledge_proof)_.

Themis can also be used with [Kotlin](../kotlin).

## Supported Java versions

JavaThemis supports Java 8 or any later version.

## Getting started

For Android development,
[follow these instructions](installation-android) to install AndroidThemis.
If you want to develop desktop or server software with Java,
you need to [install JavaThemis](installation-desktop) with JNI library.

Here are other things that might interest you:

<!-- JavaDocs when they are ready -->
- [browse code samples](examples) to get a feel of JavaThemis API
- [use interactive simulator](/docs/themis/debugging/themis-server/) to cross-verify your code
- [read feature guides](features) to learn how to use JavaThemis effectively
