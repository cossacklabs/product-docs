---
weight: 10
title:  Secure Cell design
---

# Secure Cell design and properties

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

    Contrast this with [Secure Session](/themis/spec/secure-session/) cryptosystem
    which protects ordered streams of packets, similar to TLS.

  - Symmetric encryption scheme is used.

    Secure Cell uses the same shared secret key to both encrypt and decrypt data.
    This is a symmetric encryption scheme.

    In contrast, [Secure Message](/themis/spec/secure-message/) cryptosystem is asymmetric,
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
