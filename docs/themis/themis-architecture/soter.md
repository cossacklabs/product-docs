---
weight: 1
title: "Soter"
---

## Soter library

**Soter** is a cross-platform multipurpose cryptographic library that serves as a backbone for Themis. It provides a set of highly secure cryptographic primitives through a well-defined, consistent, and simple interface. 

To name just a few things you can get with Soter (as the rabbit hole of its true capabilities runs much much deeper):

* necessary cryptographic primitives for building robust secure solutions with high level of security;
* intuitive, well-defined interface for cryptographic functions;
* compile-time support for different (interchangeable) underlying cryptographic (donor) implementations (libraries and platform-specific functions);
* object-oriented design.

Soter does not provide all the possible existing cryptoalgorithms. Instead, we tried to select the best ones for our cryptosystems (and future features) and provide a simple way of using them even for an inexperienced user. Also, we tried to provide the freedom in choosing the underlying cryptographic implementation for each of them.
 
The code is cleanly split into the generic part and the implementation-(and/or platform-)specific part, so moving the library to a different crypto implementation is very easy. Every function can be re-implemented using different cryptographic libraries. Appropriate source files are selected for compilation through compile-time switches. Thus, every instance of Soter library can be tweaked to support any platform-preferred implementation of the algorithms while still providing a consistent interface for its users.

We're currently using LibreSSL/OpenSSL's libcrypto, but plan to replace it in the future releases.


## Soter crypto stack

![](/files/wiki/soter.png)

While selecting the necessary cryptographic building blocks for our solutions, we had the following concepts in mind:

* all the basic cryptographic operations should be supported (symmetric cryptography, key agreement, digital signatures, data integrity and authentication);
* all the algorithms we're using should be open and well-established (such that underwent significant industry review(s));
* all the algorithms should use/support the latest "state-of-the-art" achievements and techniques in the field of data protection/information security;
* all the cryptographic modes of operation should be as transparent as possible for the user while imposing little additional overhead;
* combination of such primitives should allow information security protection with a high level of security.

## The selected cryptographic algorithms

### Symmetric encryption

[Advanced Encryption Standard](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) (_AES_) is the main algorithm we use for symmetric encryption. This algorithm is rather simple, fast, and proven to be secure. Also, many platforms currently have hardware support for AES, so our solutions can get additional performance improvements on such platforms. 

We also consider using [ChaCha](https://en.wikipedia.org/wiki/Salsa20#ChaCha_variant) as another future choice for our solutions.

**Encryption modes**

[Galois/Counter Mode](https://en.wikipedia.org/wiki/Galois/Counter_Mode) (_GCM_) is our main cryptographic mode of operation for AES. GCM is a relatively new concept in symmetric cryptography. It is a variant of "authenticated encryption" — a mode, which combines information confidentiality, integrity, and authentication. When information is being decrypted, its integrity and authenticity are verified simultaneously. 

This is not only faster and more convenient but it is also generally considered to be more secure than applying encryption and message authentication code separately. The key management is also easier because a single key is used for both encryption and data authentication.

Since GCM mode requires adding (storing, passing) additional message authentication code (_MAC_), in the end, the size of protected information increases. This behaviour may be undesirable or even unacceptable for some use cases, so for such scenarios, we use [counter mode](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Counter_(CTR)) (_CTR_) instead. 

Counter mode does not require the original information to be padded and has additional properties that allow implementations to parallel the computations of ciphertext. Although this mode does not provide information integrity and authentication functionality, it still ensures a high level of confidentiality while having less strict requirements for cryptographic parameters compared to other modes (like [CBC](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher_Block_Chaining_(CBC))).

### Digital signatures

[Elliptic Curve Digital Signature Algorithm](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm) (_ECDSA_) is our main digital signature scheme. Elliptic curve-based cryptosystems usually provide higher security levels with smaller keys. Currently, there are no publically known efficient algorithms for breaking elliptic curve keys. Since these keys are very small, they are also easier to generate and store. The overall computational load is reduced, too.

We also support [RSA](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) mainly to provide some level of compatibility with already established solutions. However, this is just a "back-up plan" option available to stay on the safe side.

### Key agreement

[Elliptic Curve Diffie–Hellman](https://en.wikipedia.org/wiki/Elliptic-curve_Diffie%E2%80%93Hellman) (_ECDH_) is our key agreement scheme for the reasons similar to choosing ECDSA: elliptic curve-based cryptosystems are just better than their "plain" counterparts. Also, much of the elliptic curve implementation is reused (if the same or similar cryptographic parameters are used), so most of the code is shared between ECDH and ECDSA.

Diffie-Hellman and ECDH are susceptible to man-in-the-middle-attack (_MiTM_), so we usually combine their usage with strong authentication in our solutions (ECDSA digital signatures) to mitigate such attacks.

### Asymmetric encryption

While Soter supports RSA asymmetric encryption, we recommend (and prefer using in our modules) the elliptic curve-based cryptosystems. However, there are no direct well-established asymmetric encryption schemes in the ECC-based domain. A simple combination of ECDSA+ECDH can be used to provide similar functionality in two steps:

1. Use peer's public ECDH key and your own private ECDH key to compute a shared secret (it will be used to encrypt the message as in RSA encryption).

2. Send your own signed ECDH public key to the peer, so that they can compute the same shared secret and decrypt the message.

This approach even has an advantage over RSA encryption: ECDH keys may be random and only used once. This provides perfect forward secrecy (_PFS_) to overall communication.

### Data integrity and authentication

SHA-family of algorithms is implemented for checking the data integrity in our solutions. These algorithms have been out for a while, and still no significant attacks on them are currently known. In our schemes, we use SHA-2 (SHA-256 or SHA-512).

For data authentication, we use GCM mode where applicable (usually combined with encryption). In other cases, we use hash-based message authentication code (HMAC). The security level of HMAC mostly depends on the security level of the underlying hash functions. It means that the security level in our implementation is high since we mostly use SHA-2. Every supported hash function can be used in HMAC as well.