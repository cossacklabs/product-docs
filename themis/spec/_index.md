---
weight: 65
title:  Themis specification
bookCollapseSection: true
---

# Themis specification

Here we will explore true facts about Themis. <!-- (narrated in Ze Frank's voice) -->
That is, technical specifications for data structures and algorithms used in Themis.

These specifications are mostly interesting for interoperability and security analysis.
They are also a valuable source of information if you plan to extend Themis support to new platforms.

For more practical matters of software development,
Themis implementation details, and cryptography coding advice,
please consult the [architecture overview](/themis/architecture/)
and the [contribution guide](/themis/community/contributing/).

If you want to learn how to use Themis in your application,
we have [comprehensive guides](/themis/languages/) for all supported platforms.

## Cryptosystems

The specification is structured around the [cryptosystems of Themis](/themis/crypto-theory/cryptosystems/):

  - [Secure Cell](secure-cell/)
  - [Secure Message](secure-message/)
  - [Secure Session](secure-session/)
  - [Secure Comparator](secure-comparator/)

All of them use some shared data structures and common algorithms
which you might want to get familiar with first:

  - [Symmetric keys](symmetric-keys/) and [passphrases](symmetric-keys/#passphrases)
  - [Asymmetric keypairs](asymmetric-keypairs/)
  - [Other common utilities](common/)
