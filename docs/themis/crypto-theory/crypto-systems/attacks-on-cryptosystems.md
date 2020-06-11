---
weight: 6
title:  Attacks on cryptosystems
---

# Possible attacks on cryptosystems in Themis

Themis provides 4 basic cryptosystems:

- [Secure Cell](../secure-cell/)
- [Secure Message](../secure-message/)
- [Secure Session](../secure-session/)
- [Secure Comparator](../secure-comparator/)

To evaluate the security of each cryptosystem against theoretical attacks,
we first need to outline the algorithms used.
The table below demonstrates the exact algorithms that constitute structural parts of each cryptosystem.
Note that ECDH and ECDSA both work on ANSI X9.62 Prime 256v1 Elliptic curve,
so the key length is 256 bits.


| Themis Cryptosystem | Operation mode  | Default cryptoalgorithms and protocols                  |
|:-------------------:|:---------------:|:-------------------------------------------------------:|
| Secure Cell         | Seal            | AES-256-GCM                                             |
|                     | Token Protect   | AES-256-GCM                                             |
|                     | Context Imprint | AES-256-CTR                                             |
|                     | Passphrase API  | PBKDF2 + AES-256-GCM                                    |
| Secure Message      | Signature       | ECDSA or RSA-2048-PSS                                   |
|                     | Encryption      | ECDH/ECDSA or RSA-2048-PSS + AES-256-GCM                |
| Secure Session      | —               | ECDH/ECDSA or RSA-2048-PSS + HMAC-SHA-256 + AES-256-GCM |
| Secure Comparator   | —               | SMP + ed25519                                           |

## Known attacks on Themis

### AES encryption algorithm

The most famous known attacks on the AES algorithm are:

  - Timing attack (SCA)
  - Biclique attack (Man-in-the-Middle)
  - XSL attack (KPA)
  - Gilbert-Peyrin distinguishing attack (OKMA)

The most powerful of these attacks on the AES is the biclique (Man-in-the-Middle) attack.
Its computational complexity is approximately 2^126, 2^190, and 2^190
for AES-128, AES-192, and AES-256 respectively.
However, currently this is a seriously impractical attack from an applied point of view,
and it _has no practical implication on the AES security_.

### Block cipher modes

The most famous known attacks on the block cipher modes:

- Related-Mode attacks (CPA, CCA on ECB, CBC, CFB, OFB, CTR)
- Padding oracle attacks (SCA on CBC, CFB)

The most powerful attack on the block cipher mode is Vaudenay’s padding oracle attack.
Since the cryptosystems of Themis only use AES in GCM/CTR mode,
practically speaking, they are secure against the above-mentioned attacks.

### HMAC-SHA-256 algorithm

There are currently no known attacks on HMAC-SHA-256, so it’s extremely secure.

### RSA-PSS signatures

There are currently no known attacks on the RSA-PSS signature algorithm,
assuming that the underlying factorisation problem is intractable.
In fact, the security of RSA in general totally relies on the factorisation problem.
A simple formula can be applied to calculate currently secure key size:
(_year_ − 2000) × 32 + 512.

Secure Message and Secure Session have a potential flaw –
they support 1024-bit RSA keys –
it is technically possible to build the library with such key size.
This is done for the sake of compatibility with other cryptosystems.
However, by default, the RSA key size in Themis is set to 2048.

### ECC algorithms (ECDH, ECDSA)

All the ECC algorithms rely on the elliptic curve discrete logarithm problem (ECDLP).
Little to no major progress has been made in improving the algorithms for solving this problem
by the mathematical community since it was independently introduced by Koblitz and Miller in 1985.
_Which means that in theory ECDLP is intractable and ECC algorithms are secure._

The great advantage of ECC algorithms is the key size:

| AES | ECC | RSA   |
| ---:| ---:| -----:|
|  80 | 163 |  1024 |
| 112 | 233 |  2048 |
| 128 | 283 |  3072 |
| 192 | 409 |  7680 |
| 256 | 571 | 15360 |

The table above provides the comparison of the key sizes in bits
needed for achieving similar levels of security.

### Analysis of Secure Comparator

The secureness of Secure Comparator is based on the solution to
the Socialist Millionaire Problem (SMP) in Off-the-Record Messaging (OTR) –
which, in turn, depends on the discrete logarithm problem (DLP).
When moving OTR SMP to ECC domain (ed25519) – DLP becomes ECDLP,
which is considered to be more secure
because for ECDLP solution there only exist exponential time algorithms
(and sub-exponential algorithms exist for DLP).

There are some known threats to OTR SMP.
They arise when one of the communicating parties is being dishonest
and presents a secret or some of their intermediate parameters are forged.
This may cause potential security flaws:
i.e., some indirect information about the secret of the honest party may leak
if they present their real secret value for comparison.
A cheating party would present their fake secret value
and then they will be able to learn everything that is implied
by the knowledge of `x1`, ..., `xn` and `f(x1, y)`, ..., `f(xn, y)`,
where `y` is a real secret value of the honest party.

Since Secure Comparator involves
[additional security proofs and verifications (zero-knowledge proofs)](https://www.cossacklabs.com/files/secure-comparator-paper-rev12.pdf)
on each step, it is considered to be secure against “cheating parties”.

## Additional precautions

All the cryptosystems of Themis also follow these rules:

- We don’t roll our own crypto.
- We only use proven public algorithms that are known cryptographically strong.
- We use encryption with message authentication.
- We use cryptographically strong pseudorandom number generators
  and make sure they are seeded with enough entropy.
- We don’t use weak block cipher modes (ECB, CBC).
