---
weight: 30
title:  Soter KDF
---

# Soter KDF

**Soter KDF** is a key derivation function used by Themis in symmetric cryptosystems
to derive encryption keys from user-provided key material.

KDF enables secure usage of symmetric keys of arbitrary length,
regardless of the technical requirements of particular encryption algorithms.
It also reduces effective key reuse by incorporating additional context data into derived keys.

{{< hint info >}}
However, note that Soter KDF still requires strong keys as input.
It is also **not suitable for passphases**.
Themis makes use of alternative KDFs (such as PBKDF2)
in contexts where encryption keys need to be derived from passphrases.
{{< /hint >}}

Soter KDF is similar in construction to ZRTP KDF
defined by [RFC 6189](https://tools.ietf.org/html/rfc6189#section-4.5.1), section 4.5.1.

> _KDF_(**KI**, **Label**, **Context**..., **L**) = _truncate_(KDF*, **L**)
>
> KDF* = _HMAC-SHA-256_(**KI**, 0x00000001 || **Label** || 0x00 || **Context**...)

where the inputs are

  - **KI** is the input symmetric key provided by the user
  - **Label** indicates purpose of key derivation, a byte string
  - **Context** is a list of additional “context data” bytes,
    such as a nonce pertaining to this particular derivation
  - **L** is the length of derived key in bytes

The input key **KI** is used to key the HMAC function (HMAC-SHA-256 in case of Soter KDF),
and the rest of the parameters are concatenated (||) and hashed by the HMAC.
Its output is then truncated to the desired length **L**.

{{< hint info >}}
It is not possible to derive keys longer than the HMAC output.
That is 32 bytes in case of HMAC-SHA-256 used by Soter KDF.
{{< /hint >}}

Key differences between Soter KDF and ZRTP KDF:

  - the input key **KI** may be omitted,
    in which case it is derived from **Label** and **Contexts**
  - the counter **i** has fixed value of 0x00000001
  - the **Context** data is a list, not a single byte string
  - the length **L** is not included into the hashed string

If the input key **KI** is not provided by the user,
an _implicit key_ **KI\*** is derived in the following manner:

> **KI\*** = _truncate_(**Label**, 32) ⊕ _truncate_(**Context**, 32) ⊕ ⋯

The implicit key is 32 bytes long.
If the **Label** or any of the **Contexts** is longer, they are truncated to 32 bytes,
and if they are shorter, they are padded with zeros before being added up with XOR (⊕).
