---
weight: 1
bookFlatSection: true
title: "Themis in a nutshell"
productMenuTitle: "themis"
Menu: "main"
searchScope: "themis"
repository: "themis"
---

# Themis in a nutshell

_What Themis is and why it's awesome_

![](/files/wiki/themis_cossack_labs_docs_logo.png)

## What Themis is

Themis is a cross-platform high-level cryptographic library for mobile, web, and server platforms. Themis solves 90% of typical data protection use cases that are common for most apps.

Themis provides ready-made building blocks _(["cryptosystems"](#cryptosystems))_ which simplify usage of core cryptographic security operations.

{{< hint info >}}
Learn more about [cryptography in Themis](/themis/crypto-theory/).
{{< /hint>}}



## Why Themis

Unlike many other cryptographic libraries, Themis is a high-level, easy-to-use and hard-to-misuse library _(["boring crypto"](https://speakerdeck.com/vixentael/use-cryptography-dont-learn-it))_.

Themis is made by cryptographers, but is targeted at developers, so it hides cryptographic details under the hood _("secure by design")_.

Themis helps to build both simple and complex cryptographic features easily, quickly, and securely. Themis allows developers to focus on the main thing: developing their applications.

{{< hint info >}}
Learn more about [security design ideas behind Themis](/themis/architecture/) and [how our team maintains Themis](https://speakerdeck.com/vixentael/maintaining-cryptographic-library-for-12-languages) for the last 6 years.
{{< /hint>}}



## Use cases that Themis solves

* **Encrypt stored secrets** in your apps and backend: API keys, session tokens, files.

* **Encrypt sensitive data fields** before storing in database (_"application-side field-level encryption"_).

* Support **searchable encryption**, data tokenisation (FPE) and data masking using Themis and [Acra](https://www.cossacklabs.com/acra/).

* Exchange secrets securely: **share sensitive data** between parties, build simple chat app between patients and doctors.

* Build **end-to-end encryption schemes** with centralised or decentralised architecture:
  encrypt data locally on one app, use it encrypted everywhere, decrypt only for authenticated user.

* Maintain **real-time secure sessions**: send encrypted messages to control connected devices from your app,
  receive real-time sensitive data from your apps to your backend.

* **Compare secrets** between parties without revealing them (zero-knowledge proof-based authentication).

* **One cryptographic library that fits them all**: Themis is the best fit for multi-platform apps (e.g., iOS+Android+Electron app with Node.js backend)
  because it provides 100% compatible API and works in the same way across all supported platforms.


Themis works in a wide range of projects: power grids, banking apps, telemed apps, documents' exchange platforms, note-taking apps, no-code platforms, remote-debuging platforms, and so on.
[Themis is recommended by OWASP MSTG](https://github.com/OWASP/owasp-mstg/blob/master/Document/0x06e-Testing-Cryptography.md#third-party-libraries) to use in mobile apps.

{{< hint info >}}
Learn about [projects built using Themis](/themis/community/projects-that-use-themis/) and [regulations](/themis/regulations/) that Themis helps to cover.
{{< /hint>}}


## Cryptosystems

Themis provides [4 important cryptographic services](/themis/crypto-theory/cryptosystems/):

* **[Secure Cell](/themis/crypto-theory/cryptosystems/secure-cell/)**: a multi-mode cryptographic container suitable for **storing anything** from encrypted files to database records and format-preserved strings. Secure Cell is built around AES-256-GCM, AES-256-CTR.
* **[Secure Message](/themis/crypto-theory/cryptosystems/secure-message/)**: a simple **encrypted messaging** solution for the widest scope of applications. Exchange the keys between the parties and you're good to go. Two pairs of underlying cryptosystems: ECC + ECDSA / RSA + PSS + PKCS#7.
* **[Secure Session](/themis/crypto-theory/cryptosystems/secure-session/)**: **session-oriented encrypted data exchange** with forward secrecy for better security guarantees and more demanding infrastructures. Secure Session can perfectly function as socket encryption, session security, or a high-level messaging primitive (with some additional infrastructure like PKI). ECDH key agreement, ECC & AES encryption.
* **[Secure Comparator](/themis/crypto-theory/cryptosystems/secure-comparator/)**: Zero knowledge proofs-based cryptographic protocol for **authentication** and comparing secrets.

We created Themis to build other products on top of it – i.e. [Acra](https://www.cossacklabs.com/acra/) and [Hermes](https://www.cossacklabs.com/hermes/).


![](/files/wiki/themis_cryptosystems.png)



## What Themis doesn’t solve


1. Themis doesn't provide a low-level/raw cryptographic API for encryption and hashing.

   For example, Themis doesn't provide a way to select a certain cryptographic cipher, or key length, or exact elliptic curve, or hash function.
   There is no API like

   ```swift
   let encrypted = encrypt(data, cipher: AES, keyLength: 256, mode: GCM)
   ```

   Instead of thinking about cryptographic parameters, developers take Themis to solve certain functions/requirement of their products. Themis is designed in a way that eliminates typical cryptographic mistakes, and makes development faster, but Themis is not as flexible as OpenSSL.

   For those who understand what they are doing and require certain ciphers, [Themis allows to change default algorithms and build a custom version](/themis/installation/installation-from-sources/#selecting-algorithm-parameters).

2. Themis doesn't have an API for homomorphic or PQ encryption.

3. Themis is not designed to run on low-power hardware, microcontrollers, etc.
   Themis targets mobile, desktop, and server hardware with x86 and ARM CPUs.

{{< hint info >}}
If some of these points are critical for you, consider [commercial support](/themis/support/).
{{< /hint>}}


## Community behind Themis

Open [Community page](/themis/community/) to learn more about authors, projects that use Themis, example apps and tutorials, and engineering talks about Themis.

