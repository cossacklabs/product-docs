---
weight: 2
title: "Cryptosystems"
---

# Cryptosystems

Themis provides 4 important cryptographic services:

* **[Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell)**: a multi-mode cryptographic container suitable for **storing anything** from encrypted files to database records and format-preserved strings. Secure Cell is built around AES-256 in GCM (Token and Seal modes) and CTR (Context imprint mode).
* **[Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message)**: a simple **encrypted messaging** solution for the widest scope of applications. Exchange the keys between the parties and you're good to go. Two pairs of underlying cryptosystems: ECC + ECDSA / RSA + PSS + PKCS#7. 
* **[Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session)**: **session-oriented encrypted data exchange** with forward secrecy for better security guarantees and more demanding infrastructures. Secure Session can perfectly function as socket encryption, session security, or a high-level messaging primitive (with some additional infrastructure like PKI). ECDH key agreement, ECC & AES encryption.
* **[Secure Comparator](/docs/themis/crypto-theory/crypto-systems/secure-comparator)**: Zero knowledge-based cryptographic protocol for **authentication** and comparing secrets.

We created Themis to build other products on top of it - i.e. [Acra](https://www.cossacklabs.com/acra/) and [Hermes](https://www.cossacklabs.com/hermes/).


![](/files/wiki/themis_cryptosystems.png)