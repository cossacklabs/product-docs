---
weight: 30
title:  Secure Cell data layout
---

# Secure Cell data layout

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

## Authentication token: symmetric keys

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
[Soter symmetric algorithm descriptor](/themis/spec/common/soter-alg/):

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
| AES-192-GCM                | `0x400100C0` |
| AES-128-GCM (_deprecated_) | `0x40010080` |

Refer to the [algorithm descriptor overview](/themis/spec/common/soter-alg/) for details.

The **IV data** and **auth tag** fields are theoretically flexible,
but with current algorithm choice IV is always 12 bytes long
and authentication tag takes 16 bytes.
These values are consistent with recommendations of [NIST SP 800-38D](https://csrc.nist.gov/publications/detail/sp/800-38d/final)
for use with AES-GCM algorithm.

The **message length** field limits the maximum length of Secure Cell encrypted data to 4 GB.
(Authentication token length is not counted against this limit.)

## Authentication token: passphrases

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
| AES-192-GCM                | `0x410100C0` |
| AES-128-GCM (_deprecated_) | `0x41010080` |

Refer to the [algorithm descriptor overview](/themis/spec/common/soter-alg/) for details.

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
These values are consistent with recommendations of [NIST SP 800-132](https://csrc.nist.gov/publications/detail/sp/800-132/final)
for use with PBKDF2 password-based key derivation algorithm.
