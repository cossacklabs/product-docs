---
weight: 60
title:  Themis architecture
bookCollapseSection: true
---

# Themis in depth

Themis consists of four principal parts:

  - **Cryptography backend** — the low-level implementation of individual
    cryptographic algorithms and primitives.
    This is the platform-specific code that Themis depends on.

  - **Soter library** — the backbone of all the Themis operations.
    Soter is a cryptographic abstractions library
    that adapts the implementations of cryptography primitives from the backend
    for the rest of Themis code.

  - **Themis library** — the actual cryptographic procedures,
    built on top of the cryptographic abstractions provided by Soter.

  - **Themis wrappers** — the "user interface" which brings Themis
    to various high-level languages for writing actual applications.

Themis and Soter libraries together are often referred to as the **Themis Core**.

## Under the hood

The idea behind Themis is simple:
wrap complicated multi-step procedures with shared data
(like end-to-end perfect forward secrecy messaging with session control)
into simple objects and make these objects available through simple interfaces.

## Interoperability

Same generation versions of Themis across different platforms are guaranteed to be compatible.
Although different platforms might have different implementations of cryptographic primitives,
[our pluggable cryptographic stack – Soter](soter/) will take care of all the differences.

We strive to maintain backwards compatibility as well,
so adjacent Themis versions across different platforms are guaranteed to be compatible too.
(But we reserve the right to gradually deprecate features across multiple releases.)

## Architecture

The architecture of Themis is layered to ensure high portability as well as ease of use.
Every layer provides some level of abstraction to upper layers.

Here is a high-level overview of Themis:

![](/files/wiki/themis_architecture.png)

#### Low-level cryptographic bindings

At the lowest level, there are bindings to popular cryptographic libraries and APIs,
such as OpenSSL and BoringSSL.
They provide implementations of the necessary core cryptographic primitives
and allow our stack to operate in different environments.

This approach simplifies the process of porting to new platforms
as only bindings with corresponding donor libraries have to be updated.
We usually follow best practices and sensible recommendations of each platform maintainer
and try to utilise cryptographic implementations native to each platform.

Read more on the [cryptography donors](/docs/themis/crypto-theory/cryptography-donors/)
supported by Themis.

#### Soter library

[Soter](soter/) provides an abstraction layer for Themis
by wrapping all the different low-level cryptographic implementations
into consistent cryptographic interfaces.
Soter interfaces share the same signatures and behaviour across all the supported platforms and environments.
This allows our stack to interoperate between instances in different environments.
Also, since it's a restricted interface,
its makes the rest of the code easier to use and more secure.

#### Themis library

Themis provides a set of high-level cryptographic operations wrapped into a complete cryptosystem.
Each operation is a carefully selected combination of cryptographic primitives
for providing security for different scenarios and use cases.

We believe there is no single-best generic solution to every security problem.
Instead, we've picked common scenarios for a set of use cases that Themis' users
(including us)
are likely to stumble upon,
and polished up the cryptosystems to support a broad range of similar use cases.

So far, there are [4 separate cryptosystems](/docs/themis/crypto-theory/crypto-systems/)
available in Themis:

- [Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/)
- [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/)
- [Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session/)
- [Secure Comparator](/docs/themis/crypto-theory/crypto-systems/secure-comparator/)

![](/files/wiki/themis_cryptosystems.png)

#### High-level language wrappers

We want Themis to be as easy to use as it is secure.
We understand that the effort of adopting an "alien" module into your well-established codebase
may negate all the potential benefits it brings.
So, with a diverse set of high-level language bindings (wrappers),
we try to bring Themis closer to your application's architecture and language coding style,
and minimise the efforts necessary on your side.

While maintaining a general common object model across all the covered languages,
we try to tailor each binding to make Themis look most natural in each specific language.

See the [list of languages supported by Themis here](/docs/themis/getting-started/#language-howtos).
