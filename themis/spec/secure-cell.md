---
weight: 10
title:  Secure Cell
---

# Secure Cell

{{< hint info >}}
This part of Themis documentation is currently under development.
Please come back later.

Meanwhile, you can [read an overview of the Secure Cell cryptosystem](/themis/crypto-theory/cryptosystems/secure-cell/).
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

## Desired and designed properties

First of all, let's discuss the desired properties of the cryptosystem.

  - Strong confidentiality and integrity guarantees.

    Given the typical use cases for Secure Cell,
    it must prevent direct and indirect disclosure of protected data
    in addition to preventing inadvertent modifications to it.

    Secure Cell uses proven authenticated encryption schemes
    to provide integrity and confidentiality guarantees.

  - Good performance for both encryption and decryption.

    Given the typical use cases for Secure Cell,
    it is important for it to be as fast as possible while being secure.

    Secure Cell uses well-known symmetric encryption algorithms
    for which hardware acceleration is generally available.

Now let's talk about some *non-goals* which influence design decisions.

  - Data pieces are protected individually.

    Secure Cell is designed to operate on individual data pieces,
    such as database fields, encryption keys, etc.

    Each protected piece of data is independent of any other.
    Secure Cell does not provide nor enforce any ordering between them.

    Contrast this with [Secure Session](../secure-session/) cryptosystem
    which protects ordered streams of packets, similar to TLS.

  - Symmetric encryption scheme is used.

    Secure Cell uses the same shared secret key to both encrypt and decrypt data.
    This is a symmetric encryption scheme.

    In contrast, [Secure Message](../secure-message/) cryptosystem is asymmetric,
    which is more practical for authenticated message exchange between distinct parties.

  - Data payload has bounded size.

    While the size of Secure Cell payload is not *strictly* limited,
    it is still expected to be bounded.
    That is, Secure Cell is not designed for handling data streams of arbitrary length,
    nor does it provide random access into data within an encrypted cell.

Finally, let's consider the desired cryptography-theoretical properties of the cryptosystem.
Secure Cell is required to be at least IND-CPA secure
and it would be nice to achieve IND-CCA2 whenever possible.
The choice of AES-GCM and AES-CTR satisfies these requirements.
Here are some examples of vulnerabilities mitigated by Secure Cell:

  - Optional context data prevents malicious reuse of ciphertexts in different contexts.
    Mismatches will be detected and reported.

  - Even in case of extremely short inputs, no information about plaintext is disclosed.
    For example, you can use Secure Cell to secure a boolean field in the database.

  - It is not possible for the attacker to restore the encryption secret
    even if they can exploit the system to encrypt arbitrary data
    or trick it into decrypting some known encrypted data.

## Operation modes

Secure Cell can operate in multiple modes which can be split on several axes:

  - authenticated encryption or just confidentiality
  - whether auxiliary data is detached or embedded
  - whether associated data is used or not
  - whether the secret is a key or a passphrase

{{< hint info >}}
Some of the combinations are excluded for security and technical reasons.
For example, if no authentication is provided then you cannot use passphrases and must use associated data.
{{< /hint >}}

Ultimately, Secure Cell supports the following major modes:

  - **Seal** mode with optional associated data, secured by a key or a passphrase.
  - **Token Protect** mode with optional associated data, secured by a key.
  - **Context Imprint** mode with required associated data, secured by a key.

Now let's dissect these variations in more detail.

### Authenticated encryption

On one axis, Secure Cell can either provide *authentication* or not:

  - **Authenticated encryption** provides strong integrity guarantees.

    That is, on decryption you can be sure that the data has not been tampered with.
    Encrypted message is secure from prying eyes and idle hands.

  - **Unauthenticated encryption** provides only confidentiality guarantees.

    That is, while the attacker cannot read the encrypted message (as with any encryption),
    they can still easily corrupt or modify it without you being able to undeniably confirm it.

**Seal** and **Token Protect** modes use authenticated encryption
while **Context Imprint** mode is not authenticated.

Secure Cell provides authentication via AES-GCM encryption mode
and unauthenticated encryption via the regular AES-CTR mode.

The tradeoff here is that AES-GCM produces an *authentication tag*
which needs to be stored with encrypted data, increasing its length.
Sometimes it is acceptable, in other cases you may not have that flexibility.

Seal and Token Protect are basically the same,
but Token Protect mode stores the authentication tag and other auxiliary data in a detached buffer.
This allows to replace the original message with an encrypted one of the same length,
if you can afford to store the auxiliary data elsewhere.

Context Imprint mode exists for use cases which do not allow for any additional storage.
This constraint somewhat lowers the security of the cryptosystem
since there is no space for authentication data or – more importantly – random IV.
To compensate for this, Secure Cell requires *associated data* to be used in Context Imprint mode.

### Associated data and nonces

Another axis of Secure Cell is how much *associated data* the user provides for encryption.

**Associated data** is used in encryption algorithm, influencing its output,
but it is not a part of the plaintext, the ciphertext, or the encryption key.

Associated data provides another layer of protection against unintended disclosure, use, and modification of encrypted data.
Different associated data makes the same plaintext with the same key to be encrypted into a different ciphertext.
This makes it much harder for the attacker to guess the content of encrypted messages.
It also makes it harder to reuse encrypted data verbatim in different contexts (replay attacks).

Some parts of the associated data can be transmitted together with the ciphertext, but some can be omitted.
This complicates unintended decryption: even if the attacker has obtained the encryption key somehow,
they still need to get ahold of the associated data which might be stored elsewhere (like the user's brain).

A related concept is **nonce** – an arbitrary random number which must be used only once in cryptographic communication.
The AES-GCM and AES-CTR algorithms used by Secure Cell use an *initialisation vector* (IV) as a nonce.
Since they are effectively streaming ciphers, it is **critical** for security to never reuse nonces:
the most powerful known attack on AES-GCM is based on IV reuse.
Secure Cell includes several mitigations for it.

With Secure Cell, in addition to the message and the key, users can provide extra **context data**
which is used to derive associated data for encryption.
If the context data is not provided explicitly, Secure Cell derives some from the message length.
It is also used in key derivation to minimise the risks of key reuse and XOR attacks as well.
See the [Encryption](#encryption) section for the details.

**Seal** and **Token Protect** modes require additional storage for authentication data.
Therefore, Secure Cell can use a bit more of that extra storage
to choose and keep a completely new, random IV for each encrypted piece of data.
Thus, user-provided context is optional in Seal and Token Protect modes
but it can still be provided to enhance security even further.

On the other hand, **Context Imprint** mode must preserve the length of the input.
It does not allow for any unaccounted randomess and thus is completely deterministic:
given the same input, key, and context, the resulting output is always the same.
In Context Imprint mode the IV is derived from available encryption key and context data,
making the encryption susceptible to nonce reuse attacks.
This is the reason why in Context Imprint mode the users are *required* to provide context data,
and encouraged to use unique context data for each encryption to maintain security.

### Keys vs. passphrases

Secure Cell supports several types of secrets used to secure encrypted data:

  - [Symmetric keys](../symmetric-keys/) for machines to remember.

    Keys should be as random as possible and can be as long as necessary.

  - [Passphrases](../symmetric-keys/#passphrases) for humans to remember.

    Since human memory is usually not good at remembering strings of random numbers,
    passphrases are typically shorter and have fewer randomness per character.

Ultimately, AES-256 encryption algorithm works with 256-bit keys.
Secure Cell uses _key derivation functions_ (KDF) to stretch or shrink user-provided keys to the length required by AES.
If a passphrase is used, a [special _passphrase_ KDF](/themis/crypto-theory/cryptosystems/secure-cell.md#key-derivation-functions) is employed
to compensate for potentially poorer statistical properties of passphrases.
See the [Encryption](#encryption) section for the details.

Passphrase KDFs require additional parameters which need to be adjusted with time, as computers get faster.
KDF parameters need to be stored together with the encrypted data so that it can always be decrypted.
Therefore, **Context Imprint** mode does not support passphrases as it has no spare space for the parameters.
Requiring the users to supply KDF parameters goes against Themis design philosophy.

Moreover, passphrase KDFs are designed to be exceedingly slow.
**Token Protect** mode is particularly useful in database contexts to encrypt individual database cells.
This use case is pretty sensitive to performance so *key wrapping* should be preferred.
As a result, only **Seal** mode provides passphrase support.

Finally, KDF plays another auxiliary role.
AES-GCM algorithm has a limit on how much data can be safely encrypted using the same key,
before cryptanalysis attacks become practical.
KDF mixes in user-provided associated data into the derived key,
randomising it, and reducing effective key reuse even when the same secret is used with Secure Cell.

## Layout

The two main parts of a Secure Cell are:

  - **encrypted data** which is self-explanatory, and
  - **authentication token** which keeps all auxiliary metadata

Their arrangement is defined by Secure Cell operation mode.

In Seal mode the authentication token is a header of a unified data block:

    +---------------------------------------------------------------+
    |                             token                             |
    +---------------------------------------------------------------+
    |                                                               |
    +                         encrypted data                        +
    |                                                               |
    +---------------------------------------------------------------+

In Token Protect mode the token is detached from encrypted data:

    +---------------------------------------------------------------+
    |                                                               |
    +                         encrypted data                        +
    |                                                               |
    +---------------------------------------------------------------+

    +---------------------------------------------------------------+
    |                             token                             |
    +---------------------------------------------------------------+

And in Context Imprint mode there is no authentication token at all:

    +---------------------------------------------------------------+
    |                                                               |
    +                         encrypted data                        +
    |                                                               |
    +---------------------------------------------------------------+

### Authentication token: symmetric keys

Layout of the authentication token depends on the type of secret in use.
For symmetric keys the token looks like this:

     0               4               8               12              16
    +---------------+---------------+---------------+---------------+
    |  algorithm ID |   IV length   |auth tag length| message length|
    +---------------+---------------+---------------+---------------+
    |                    IV data                    |    auth tag   >
    +---------------+---------------+---------------+---------------+
    >                auth tag (cont.)               |
    +---------------+---------------+---------------+

where

  - **algorithm ID** (4 bytes) describes the encryption algorithm
  - **IV length** (4 bytes) stores the length of **IV data** in bytes, normally 12
  - **auth tag length** (4 bytes) stores the length of **auth tag** in bytes, normally 16
  - **message length** (4 bytes) stores the length of **encrypted data** in bytes
  - **IV data** (12 bytes) stores the random initialisation vector for encryption
  - **auth tag** (16 bytes) stores integrity authentication tag produced by encryption

All non-data fields are stored in *little-endian* byte order.
**IV data** and **auth tag** are interpreted as is.

{{< hint info >}}
Contrary to most other data structures in Themis,
Secure Cell uses little-endian due to historical reasons.
{{< /hint >}}

The **algorithm ID** field is actually a bitmask with
[Soter symmetric algorithm descriptor](../common/#soter-symmetric-algorithm-descriptor):

          28      24      20      16      12       8       4       0
    +-------+-------+-------+-------+-------+-------+-------+-------+
    |  alg. |  KDF  |  ---  |padding|  ---  |      key length       |
    +-------+-------+-------+-------+-------+-------+-------+-------+

As of Themis 0.13 released in 2020,
Secure Cell in Seal and Token Protect mode uses AES-GCM, with Soter KDF, and PKCS#7 padding.
This results in the following descriptors currently being in use for symmetric keys:

| Encryption algorithm       | Algorithm ID |
| -------------------------- | ------------ |
| AES-256-GCM **(default)**  | `0x40010100` |
| AES-196-GCM                | `0x400100C0` |
| AES-128-GCM (_deprecated_) | `0x40010080` |

Refer to the [algorithm descriptor overview](../common/#soter-symmetric-algorithm-descriptor) for details.

The **IV data** and **auth tag** fields are theoretically flexible,
but with current algorithm choice IV is always 12 bytes long
and authentication tag takes 16 bytes.

The **message length** field limits the maximum length of Secure Cell encrypted data to 4 GB.
(Authentication token length is not counted against this limit.)

### Authentication token: passphrases

When Secure Cell is used with passphrases
the authentication token contains an additional block with *passphrase key derivation context*.
In this case the layout of the token is as follows:

     0               4               8               12              16
    +---------------+---------------+---------------+---------------+
    |  algorithm ID |   IV length   |auth tag length| message length|
    +---------------+---------------+---------------+---------------+
    |   KDF length  |                    IV data                    |
    +---------------+---------------+---------------+---------------+
    |                           auth tag                            |
    +---------------+---------------+---------------+---------------+
    |                       KDF context data                        |
    +               +       +-------+---------------+---------------+
    |                       |
    +---------------+-------+

where

  - **algorithm ID** (4 bytes) describes the encryption algorithm
  - **IV length** (4 bytes) stores the length of **IV data** in bytes, normally 12
  - **auth tag length** (4 bytes) stores the length of **auth tag** in bytes, normally 16
  - **message length** (4 bytes) stores the length of **encrypted data** in bytes
  - **KDF length** (4 bytes) stores the length of **KDF context data** in bytes
  - **IV data** (12 bytes) stores the random initialisation vector for encryption
  - **auth tag** (16 bytes) stores integrity authentication tag produced by encryption
  - **KDF context data** (22 bytes) stores passphrase KDF parameters

Most fields have the same meaning as with symmetric keys, and use *little-endian* byte order.

As of Themis 0.13 released in 2020,
Secure Cell in Seal mode uses AES-GCM, with PBKDF2 over HMAC-SHA-256, and PKCS#7 padding.
This results in the following **algorithm ID** values currently being in use for passphrases:

| Encryption algorithm       | Algorithm ID |
| -------------------------- | ------------ |
| AES-256-GCM **(default)**  | `0x41010100` |
| AES-196-GCM                | `0x410100C0` |
| AES-128-GCM (_deprecated_) | `0x41010080` |

Refer to the [algorithm descriptor overview](../common/#soter-symmetric-algorithm-descriptor) for details.

The PBKDF2 passphrase key derivation uses the following KDF context format:

     0               4       6                                       16
    +---------------+-------+-------+---------------+---------------+
    |   iterations  |salt l.|                  salt                 >
    +---------------+-------+-------+---------------+---------------+
    >      salt (cont.)     |
    +---------------+-------+

where

  - **iterations** (4 bytes) is the number of PBKDF2 iterations to perform
  - **salt length** (2 bytes) stores the length of **salt** in bytes
  - **salt** (16 bytes) stores the random salt for key derivation

The **iteration** count is stored as is.
Currently, Secure Cell uses 200,000 iterations by default.
This value is stored as `40 0d 03 00` in little-endian encoding.

The **salt** field is theoretically flexible,
but with current algorithm choice the salt is always 16 bytes long.

## Example

Now let's look at and dissect sample data protected by Secure Cell.
You can try it out yourself using [command-line utilities](/themis/debugging/cli-utilities/) if you have Themis installed,
or with [Themis Server](/themis/debugging/themis-server/) from your web browser.

### Example: symmetric keys

With the following inputs (all encoded in ASCII):

| Input          | Value |
| -------------- | ----- |
| encryption key | `au6aimoa8Pee8wahxi4Aique6eaxai2a` |
| context data   | `additional context` |
| plaintext      | `encrypted message` |

Secure Cell in Seal mode produces the following output (encoded in base64):

    AAEBQAwAAAAQAAAAEQAAAM5da3KkReYC7++OPbrI13UycoVi3s01Ji64WQ/KIe+3oF8cgLle19WC+tnaCg==

which looks like this in hexadecimal (61 bytes):

```
00000000  00 01 01 40 0c 00 00 00  10 00 00 00 11 00 00 00  |...@............|
00000010  ce 5d 6b 72 a4 45 e6 02  ef ef 8e 3d ba c8 d7 75  |.]kr.E.....=...u|
00000020  32 72 85 62 de cd 35 26  2e b8 59 0f ca 21 ef b7  |2r.b..5&..Y..!..|
00000030  a0 5f 1c 80 b9 5e d7 d5  82 fa d9 da 0a           |._...^.......|
```

There you can note the authentication token (44 bytes):

```
00000000  00 01 01 40 0c 00 00 00  10 00 00 00 11 00 00 00  |...@............|
00000010  ce 5d 6b 72 a4 45 e6 02  ef ef 8e 3d ba c8 d7 75  |.]kr.E.....=...u|
00000020  32 72 85 62 de cd 35 26  2e b8 59 0f -- -- -- --  |2r.b..5&..Y.    |
00000030  -- -- -- -- -- -- -- --  -- -- -- --              |             |
```

and the actual encrypted data (17 bytes) in the end:

```
00000000  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000010  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000020  -- -- -- -- -- -- -- --  -- -- -- -- ca 21 ef b7  |            .!..|
00000030  a0 5f 1c 80 b9 5e d7 d5  82 fa d9 da 0a           |._...^.......|
```

Since Seal mode has been used, the token and data are concatenated.
In Token Protect mode they would have been returned as separate buffers.
Here's how they look encoded in base64:

    AAEBQAwAAAAQAAAAEQAAAM5da3KkReYC7++OPbrI13UycoVi3s01Ji64WQ8=

    yiHvt6BfHIC5XtfVgvrZ2go=

Try decrypting this data in Token Protect mode, it should work!

Let's inspect the authentication token now.
Match [the reference](#authentication-token--symmetric-keys)
with the data as follows:

| Field           | Offset | Data          | Meaning |
| --------------- | ------ | ------------- | ------- |
| algorithm ID    | 0x00   | `00 01 01 40` | `0x40010100` – AES-GCM-256, Soter KDF, PKCS#7 padding |
| IV length       | 0x04   | `0c 00 00 00` | IV data is 12 bytes long |
| auth tag length | 0x08   | `10 00 00 00` | auth tag is 16 bytes long |
| message length  | 0x0C   | `11 00 00 00` | payload is 17 bytes long |
| IV data         | 0x10   | `ce . . . 3d` | initialisation vector data |
| auth tag        | 0x1C   | `ba . . . 0f` | authentication tag data |

All the encoded values match the expectations.

### Example: passphrases

With the following inputs (all encoded in ASCII):

| Input        | Value |
| ------------ | ----- |
| passphrase   | `au6aimoa8Pee8wahxi4Aique6eaxai2a` |
| context data | `additional context` |
| plaintext    | `encrypted message` |

Secure Cell in Seal mode produces the following output (encoded in base64):

    AAEBQQwAAAAQAAAAEQAAABYAAAALWhQwD5hn1LRK75ueKvVydPXPtIBKujPHEutHQA0DABAAxAsov0/Zr0HIVdLQ0T99Fc9Hj4qCpIBLJ2cWU1dZMhlI

which looks like this in hexadecimal (87 bytes):

```
00000000  00 01 01 41 0c 00 00 00  10 00 00 00 11 00 00 00  |...A............|
00000010  16 00 00 00 0b 5a 14 30  0f 98 67 d4 b4 4a ef 9b  |.....Z.0..g..J..|
00000020  9e 2a f5 72 74 f5 cf b4  80 4a ba 33 c7 12 eb 47  |.*.rt....J.3...G|
00000030  40 0d 03 00 10 00 c4 0b  28 bf 4f d9 af 41 c8 55  |@.......(.O..A.U|
00000040  d2 d0 d1 3f 7d 15 cf 47  8f 8a 82 a4 80 4b 27 67  |...?}..G.....K'g|
00000050  16 53 57 59 32 19 48                              |.SWY2.H|
```

There you can note the extended authentication token (48 bytes):

```
00000000  00 01 01 41 0c 00 00 00  10 00 00 00 11 00 00 00  |...A............|
00000010  16 00 00 00 0b 5a 14 30  0f 98 67 d4 b4 4a ef 9b  |.....Z.0..g..J..|
00000020  9e 2a f5 72 74 f5 cf b4  80 4a ba 33 c7 12 eb 47  |.*.rt....J.3...G|
00000030  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000040  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000050  -- -- -- -- -- -- --                              |       |
```

the passphase key derivation context (22 bytes):

```
00000000  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000010  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000020  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000030  40 0d 03 00 10 00 c4 0b  28 bf 4f d9 af 41 c8 55  |@.......(.O..A.U|
00000040  d2 d0 d1 3f 7d 15 -- --  -- -- -- -- -- -- -- --  |...?}.          |
00000050  -- -- -- -- -- -- --                              |       |
```

and the actual encrypted data (17 bytes) in the end:

```
00000000  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000010  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000020  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000030  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000040  -- -- -- -- -- -- cf 47  8f 8a 82 a4 80 4b 27 67  |      .G.....K'g|
00000050  16 53 57 59 32 19 48                              |.SWY2.H|
```

Secure Cell supports passphrases only in Seal mode,
therefore the authentication token cannot be detached from the encrypted data.

Let's inspect the authentication token now.
Match [the reference](#authentication-token--passphrases)
with the data as follows:

| Field           | Offset | Data          | Meaning |
| --------------- | ------ | ------------- | ------- |
| algorithm ID    | 0x00   | `00 01 01 41` | `0x41010100` – AES-GCM-256, PBKDF2, PKCS#7 padding |
| IV length       | 0x04   | `0c 00 00 00` | IV data is 12 bytes long |
| auth tag length | 0x08   | `10 00 00 00` | auth tag is 16 bytes long |
| message length  | 0x0C   | `11 00 00 00` | payload is 17 bytes long |
| KDF length      | 0x10   | `16 00 00 00` | KDF context is 22 bytes long |
| IV data         | 0x14   | `0b . . . 9b` | initialisation vector data |
| auth tag        | 0x20   | `9e . . . 47` | authentication tag data |

and the PBKDF context data is interpreted like this:

| Field           | Offset | Data          | Meaning |
| --------------- | ------ | ------------- | ------- |
| iteration count | 0x30   | `40 0d 03 00` | 200,000 iterations |
| salt length     | 0x34   | `10 00`       | salt is 16 bytes long |
| salt            | 0x36   | `c4 . . . 15` | salt data |

All the encoded values match the expectations.

### Example: Context Imprint mode

With the following inputs (all encoded in ASCII):

| Input          | Value |
| -------------- | ----- |
| encryption key | `au6aimoa8Pee8wahxi4Aique6eaxai2a` |
| context data   | `additional context` |
| plaintext      | `encrypted message` |

Secure Cell in Context Imprint mode produces the following output (encoded in base64):

    egHLD0020cqhs5uB93CqdNA=

which looks like this in hexadecimal (17 bytes):

```
00000000  7a 01 cb 0f 4d 36 d1 ca  a1 b3 9b 81 f7 70 aa 74  |z...M6.......p.t|
00000010  d0                                                |.|
```

Note that the output has exactly the same length as the original plaintext.
It also never changes on repeated encryption,
contrary to the behaviour of other modes
which always produce a slightly different output each time with the same input parameters.
