---
weight: 10
title:  Secure Cell
---

# Secure Cell

{{< hint info >}}
This part of Themis documentation is currently under development.
It might be incomplet and incorekt.
{{< /hint >}}

**Secure Сell** is a high-level cryptographic container
aimed at protecting arbitrary data stored in various types of storages
(e.g., databases, filesystem files, document archives, cloud storage, etc.).
You can read [Secure Cell overview](/themis/crypto-theory/cryptosystems/secure-cell/)
to get a high-level picture of the cryptosystem.

At its core, Secure Cell is based around AES encryption algorithm
in Galois/Counter Mode (GCM) providing authenticated encryption capabilities.
It also supports regular Counter Mode (CTR) if ciphertext length needs to be preserved.
The rest of the cryptosystem ensures that AES is used in a secure way.

Read more about Secure Cell on the following pages:

  - [Desired cryptographic properites and design of the cryptosystem](design/)
  - [Operation modes of Secure Cell:](modes/)
    keys & passphrases, Seal, Token Protect, and Context Imprint modes
  - [Data layout of Secure Cells](layout/)
  - [Secure Cell examples and test vectors](examples/)
