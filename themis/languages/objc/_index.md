---
weight: 8
title:  Objective-C
bookCollapseSection: true
---

# Using Themis in Objective-C

**ObjCThemis** wrapper provides access to features of Themis cryptographic library for Apple platforms:

- **[Key generation](features/#key-generation)**
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

Themis can also be used with [Swift](../swift/).

{{< hint warning >}}
**Important:**
If your application uses Themis and you want to submit it to the Apple App Store,
there are certain requirements towards declaring use of any cryptography.

Read about [Apple export regulations on cryptography for Themis](/themis/regulations/apple-crypto-regulations/) to find out what to do.
{{< /hint >}}

## Supported platforms

ObjCThemis supports all current versions of macOS, iOS, iPadOS:

- macOS 10.12–10.15
- iOS 9–13
- iPadOS 13

## Getting started

[Follow these instructions](installation/) to install ObjCThemis.

Here are other things that might interest you:

<!-- API docs when they are ready -->
- [browse code samples](examples/) to get a feel of ObjCThemis API
- [use interactive simulator](/themis/debugging/themis-server/) to cross-verify your code
- [read feature guides](features/) to learn how to use ObjCThemis effectively