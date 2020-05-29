---
weight: 6
title: "Possible Attacks on Themis Cryptosystems"
---

## Possible attacks on cryptosystems in Themis

Themis consists of 4 basic cryptosystems:

- [Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/);
- [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/);
- [Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session/);
- [Secure Comparator](/docs/themis/crypto-theory/crypto-systems/secure-comparator/).

To evaluate the security of each cryptosystem against theoretical attacks, we first need to outline the algorithms used. The table below demonstrates the exact algorithms that constitute structural parts of each cryptosystem. Note that ECDH and ECDSA both work on ANSI X9.62 Prime 256v1 Elliptic curve, so the key length is 256 bit.


| Themis  Cryptosystems |       Modes       |      Involved cryptoalgorithms / protocols (by default)     |
|:---------------------:|:-----------------:|:-----------------------------------------------------------:|
|     Secure Message    |   Signed message  |                    ECDSA or RSA-2048-PSS                    |
|                       | Encrypted message |         ECDH / ECDSA  or RSA-2048-PSS/  AES-256-GCM         |
|      Secure Cell      |        Seal       |                         AES-256-GCM                         |
|                       |   Token protect   |                         AES-256-GCM                         |
|                       |  Context imprint  |                         AES-256-CTR                         |
|     Secure Session    |    Send/Receive   | ECDH / ECDSA  or RSA-2048-PSS/  HMAC-SHA-256 /  AES-256-GCM |
|                       |    Wrap/Unwrap    | ECDH / ECDSA  or RSA-2048-PSS/  HMAC-SHA-256 /  AES-256-GCM |
|                       |       Mixed       | ECDH / ECDSA  or RSA-2048-PSS/  HMAC-SHA-256 /  AES-256-GCM |
| Secure Comparator     |         -         |                        SMP + ed25519                        |


## The most famous known attacks on the cryptoalgorhitms used in Themis 

The most famous known attacks on the AES Cipher are:

- **Timing attack** (SCA);
- **Biclique attack** (Man-in-the-Middle);
- **XSL attack** (KPA);
- **Gilbert-Peyrin distinguishing attack** (OKMA).

They are listed in the [Theory of attacks and cryptoanalysis](/docs/themis/crypto-theory/theory-of-attacks-and-cryptoanalysis/) chapter of this documentation.

The most powerful of these attacks on the AES is the biclique (Man-in-the-Middle) attack. Its complexity is approximately 2126, 2190, and 2190 for AES-128, AES-192, and AES-256 respectively. However, currently this is a seriously impractical attack from an applied point of view, and it _has no practical implication on the AES security_.  

**The most famous known attacks on the block cipher modes:**

- Related-Mode attacks (CPA, CCA on ECB, CBC, CFB, OFB, CTR);
- Padding oracle attacks (SCA on CBC, CFB).

**The most powerful attack on the block cipher mode:**   
The most powerful attack on the block cipher mode is Vaudenay’s padding oracle attack. Since the cryptosystems of Themis only use AES in GCM/CTR mode (Security Cell / Secure Message / Secure Session), practically speaking, they are secure against the above-mentioned attacks.

**Security of HMAC-SHA256 message authentication code:**   
There are currently no known attacks on HMAC-SHA256, so it’s extremely secure.

**Security of the RSA-PSS signature:**   
There are currently no known attacks on the RSA-PSS signature algorithm, assuming that the underlying factorisation problem is intractable. In fact, the security of RSA in general totally relies on the factorisation problem. A simple formula can be applied for calculation of a secure key size: `(year - 2000) * 32 + 512`.   

Secure Message and Secure Session of Themis have a potential flaw – they support 1024 bit RSA keys (the user is allowed to build a library with such key size). This is done for the sake of compatibility with other cryptosystems. However, by default, the key size is set to 2048.

**Security of ECC algorithms (ECDH, ECDSA):**   
All the ECC algorithms rely on the elliptic curve discrete logarithm problem (ECDLP). Little to no major progress has been made in improving the algorithms for solving this problem by the Mathematical community since it was independently introduced by Koblitz and Miller in 1985. _Which means that in theory ECDLP is intractable and ECC algorithms are secure._ 

The great advantage of ECC algorithms is the key size:

| Symmetric | ECC | DH/DSA/RSA |
|:---------:|:---:|:----------:|
|     80    | 163 |    1024    |
|    112    | 233 |    2048    |
|    128    | 283 |    3072    |
|    192    | 409 |    7680    |
|    256    | 571 |    15360   |

The table above provides the comparison of the key sizes needed for achieving similar levels of security.

**Analysis of Secure Comparator:**   
The secureness of Secure Comparator is based on the security of the Socialist Millionaire Problem Off-the-Record Messaging (OTR) solution (which, in turn, depends on the discrete logarithm problem – DLP). When moving OTR SMP to ECC domain (ed25519) – DLP becomes ECDLP, which is considered to be more secure, because for ECDLP solution there only exist exponential time algorithms (and sub-exponential algorithms exist for DLP). 

There are some known threats to OTR SMP – they arise when one of the communicating parties is being dishonest and presents a secret or some of their intermediate parameters are forged. This may cause potential security flaws – i.e. some indirect information about the secret of the honest party may leak if they present their real secret value for comparison. A cheating party would present their fake secret value and then they will be able to learn everything that is implied by the knowledge of `x1, … , xn and f (x1, y), …, f (xn, y)`, where `y` is a real secret value of the honest party. 

Since Secure Comparator involves additional [security proofs and verifications (Zero-knowledge proofs)](https://www.cossacklabs.com/files/secure-comparator-paper-rev12.pdf) on each step, it’s considered to be secure against “cheating parties”.

### Additionally

All the cryptosystems of Themis also follow these rules:

- We don’t roll our own crypto;
- We only use proven public algorithms that are cryptographically strong;
- We use encryption with message authentication;
- We use cryptographically strong pseudorandom number generators seeded with enough entropy;
- We don’t use weak block cipher modes (ECB, CBC).