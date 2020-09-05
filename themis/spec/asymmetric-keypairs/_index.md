---
weight: 81
title:  Asymmetric keypairs
---

# Asymmetric keypairs

{{< hint info >}}
This part of Themis documentation is currently under development.
Please come back later.

Meanwhile you can read our [key management guide](/themis/crypto-theory/key-management/).
{{< /hint >}}

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
