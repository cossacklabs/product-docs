---
weight: 60
title: "Themis Architecture"
bookCollapseSection: true
---

## Themis in depth

Themis consists of two large parts: 

* **Soter** library: the backbone of all the Themis' operations, Soter is a cryptographic abstractions library that acts as an active interface between implementations of crypto-primitives and the main code.
* **Themis** library: the actual cryptographic procedures, built on top of the cryptographic abstractions provided by Soter.

## Under the hood

The idea behind Themis is simple: wrap complicated multi-step procedures with shared data (like end-to-end perfect forward secrecy messaging with session control) into simple objects and make these objects available through simple interfaces.

## Interoperability

Same generation versions (versions that are using the same crypto engine) of Themis across different platforms are guaranteed to be compatible. For different versions, check corresponding build flags in the makefile. Although different platforms might have different implementations of cryptographic primitives, our [pluggable cryptographic stack Soter](/docs/themis/themis-architecture/soter/) will take care of all the differences.

## Architecture

The architecture of Themis is layered to ensure high portability as well as ease of use. Every layer provides some level of abstraction to upper layers. 

Below is a high-level overview of Themis:

![](/files/wiki/themis_architecture.png)

### Low-level cryptographic bindings

At the lowest level, there are bindings to popular cryptographic libraries and APIs. They provide implementations of the necessary core cryptographic primitives and allow our stack to operate in different environments. This simplifies the process of porting to new platforms as only bindings with corresponding donor libraries have to be updated. We usually follow best practices and sensible recommendations of each platform maintainer and try to utilise cryptographic implementations native to each platform.

### Soter

[Soter](/docs/themis/themis-architecture/soter/) provides an abstraction layer for Themis by wrapping all the different low-level cryptographic implementations into consistent cryptographic interfaces. These interfaces share the same signatures and behaviour across all the supported platforms and environments. This allows our stack to interoperate between instances in different environments. Also, we tried to make our interfaces easier to use and more secure.

### Themis

Themis provides a set of high-level cryptographic operations wrapped into a full cryptosystem. Each operation is a carefully selected combination of cryptographic primitives for providing security for different scenarios and use cases. We believe there is no single-best generic solution to every security problem. Instead, we've picked common scenarios for a set of use cases that Themis' users (including us) are likely to stumble upon and polished up the cryptosystems to support a broad range of similar use cases. 

So far, there are 4 services with [separate cryptosystems](/docs/themis/crypto-theory/crypto-systems/) available in Themis:

- [Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/)
- [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/)
- [Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session/)
- [Secure Comparator](/docs/themis/crypto-theory/crypto-systems/secure-comparator/)


![](/files/wiki/themis_cryptosystems.png)


### High-level language wrappers

We want Themis to be as easy to use as it is secure. We understand that the effort of adopting an "alien" module into your well-established codebase may negate all the potential benefits it brings. So, with a diverse set of high-level language bindings (wrappers), we try to bring Themis closer to your application's architecture and language coding style and minimise the efforts necessary on your side. 

While maintaining a general common object model across all the covered languages, we try to tailor each binding to make Themis look most natural in each specific language. 

Currently, Themis supports [these languages](/docs/themis/getting-started/#language-howtos).
