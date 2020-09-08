---
weight: 81
title:  Asymmetric keypairs
---

# Asymmetric keypairs

Asymmetric keypairs are used by [**Secure Message**](../secure-message/)
and [**Secure Session**](../secure-session/) cryptosystems.

Asymmetric cryptography imposes certain mathematical requirements on the structure of the keys.
To preserve the format and content of the keys intact,
all asymmetric keys are stored in [Soter containers](../common/#soter-container)
which provide key type identification and prevent accidental corruption.

## Asymmetric key kinds

Currently, Themis supports the following asymmetric keys:

- [EC keys](ecc/) used by Secure Message and Secure Session
- [RSA keys](rsa/) supported only by Secure Message

EC keys are preferred over RSA because EC keys can be shorter while providing comparable security guarantees.
Moreover, elliptic cryptography is more computationally efficient for most use cases.
<!-- TODO: provide a link to Secure Message section which benchmarks the keys -->
However, you may still need RSA in order to comply with certain regulations.
Read more about compliance on the [Regulations](/themis/regulations/) page.
