---
weight: 2
title:  Cryptography donors
---

# Cryptography donors

## "So do you roll your own crypto?"

If you're reading this section, you might already know the short answer: **No.**

We don't roll our own crypto.
Themis relies on algorithm implementations
that come from platform providers and open-source projects.
We believe that anyone in their right mind should use well-known,
audited implementations of well-known and proven cryptographic ciphers
for their core security needs.

We've built Themis to have easy-to-use large building blocks
bound to precise security guarantees and use cases—these are
[Secure Cell](../cryptosystems/secure-cell/),
[Secure Message](../cryptosystems/secure-message/),
[Secure Session](../cryptosystems/secure-session/),
and [Secure Comparator](../cryptosystems/secure-comparator/) cryptosystems.
They are composed according to the best modern practices of achieving certain security guarantees.

## What should you use

[Soter](/themis/themis-architecture/soter/)
uses cryptographic algorithms provided by cryptography donors (or _backends_).
Currently, all of them come from one family of products based on OpenSSL:

  - [OpenSSL](https://www.openssl.org/)
  - [LibreSSL](http://www.libressl.org/)
  - [BoringSSL](https://boringssl.googlesource.com/boringssl/)

However,

 1. The `libcrypto` library provided by these products does not contain all the primitives we need.

    For example, Secure Comparator relies on ed25519,
    and in the future we might require even more esoteric elliptic curves.

    We have to supply some primitives from different backends.

 2. Some considerations about performance and implementation elegance
    made us build additional experimental backends:

    - [BearSSL](https://bearssl.org/)
    - [libsodium](https://libsodium.gitbook.io/doc/)
    - [CommonCrypto](https://github.com/soffes/CommonCrypto)

## Choosing a backend

What to use as a backend is a matter of personal preferences
and specific constraints of the task at hand.
Since [Themis 0.9.5](https://github.com/cossacklabs/themis/releases/tag/0.9.5)
the build system enables you to choose a different backend yourself when building Themis.

Our goal is not only to keep developing Themis with the best implementations
of the best cryptographic algorithms available under the hood.
Our goal lies as much in being able to consciously choose the optimal cryptographic algorithms
for each use case, on every Themis build.

## On leaving OpenSSL

We rely on the following list of crypto-primitives and ciphers for Themis:

  - AES
  - CSPRNG
  - ECDSA, ECDH
  - PBKDF
  - RSA
  - SHA, HMAC

We consider OpenSSL, LibreSSL, and BoringSSL
to be crypto-engines that fully support these crypto-primitives and ciphers
on Linux, macOS, Windows, iOS and Android.
However, we're planning to move away from using OpenSSL everywhere some day
and use BoringSSL as the default crypto engine on every platform supported by Themis.

As the algorithm choice for Themis stabilises,
we plan to migrate away from the `libcrypto` dependency as well.

You can check out our plans concerning the support and migration to BoringSSL
[in the list of issues](https://github.com/cossacklabs/themis/issues?utf8=%E2%9C%93&q=is%3Aissue+boringssl).
