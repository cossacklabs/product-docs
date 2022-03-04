---
weight: 14
title: React Native
bookCollapseSection: true
---

# Using Themis in React Native

**React Native Themis** wrapper provides access to features of Themis cryptographic library for apps built on React Native platforms:

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

Themis can also be used with native applications: on iOS using [Swift](../swift/) or [Objective-C](../objc/); on Android using [Kotlin](../kotlin/) or [Java](../java/).

{{< hint warning >}}
**Important:**
If your application uses Themis and you want to submit it to the Apple App Store,
there are certain requirements towards declaring use of any cryptography.

Read about [US export regulations on cryptography for Themis](/themis/regulations/us-crypto-regulations/) to find out what to do.
{{< /hint >}}

## Supported platforms

React Native Themis supports the following React Native platform versions:

- \>= 0.60 

React Native Themis is tested with React Native 0.67.



## Getting started

[Follow these instructions](installation/) to install React Native Themis.

Here are other things that might interest you:

<!-- API docs when they are ready -->
- [browse code samples](examples/) to get a feel of React Native Themis API
- [read feature guides](features/) to learn how to use React Native Themis effectively
