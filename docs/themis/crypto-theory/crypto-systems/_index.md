---
weight: 1
title: "Cryptosystems"
bookCollapseSection: true
---

# Cryptosystems

There are strict definitions of what a **cryptosystem** is, but in practice, the answer still varies depending on the point of view.

According to [Wikipedia](http://en.wikipedia.org/wiki/Cryptosystem), a **cryptosystem** refers to a suite of cryptographic algorithms necessary for implementing a particular security service, most commonly — to achieve confidentiality. We agree that most of the time the term **cryptography** is associated with data encryption (confidentiality).

Nowadays, however, driven by the continuously growing complexity of IT systems and due to the expansion of the vector space of a possible security attack, **cryptography** is now much more than being only about encryption. **Cryptography** is now associated with the {confidentiality, integrity, authenticity} tuple.

## Cryptosystems and cryptoalgorithms

A **cryptoalgorithm** is a formal description of a certain way of processing the original data to get the required result: for example, ciphertext for confidentiality, message authentication code for authenticity, etc. It is a sequence of operations to be performed. Like any other algorithm, it has input and output.

A **cryptosystem**, as stated above, is a suite of **cryptoalgorithms**. It may be a combination of one or more algorithms aimed at implementing a certain security service. This implies that a particular cryptosystem is designed to support a specific security use case, so cryptosystems more closely reflect the real-world security requirements.

Apart from cryptoalgorithms, a cryptosystem may also include auxiliary information, guidelines, restrictions, etc. to better support its use case. For example, AES as a cryptoalgorithm is just a description of how to combine the input data and the key to produce a ciphertext. But AES as a standalone cryptosystem should also include guidelines for key generation, requirements for keys (randomness, uniform distribution, weak keys) and some description of the desired operating environment.

A modern **cryptosystem** would probably consist of some of these components (depending on the use case):

 * key agreement scheme;
 * encryption scheme;
 * signature scheme;
 * integrity scheme;
 * support routines: key generation, derivation functions, data format, etc.

## Themis cryptosystems

In **Themis** we aim for our cryptosystems to be able to support the modern real-world security scenarios. We wanted to make them very simple to use even for an inexperienced developer. This is why the amount of "moving parts" that could be broken and compromise the cryptosystem's security is minimised in **Themis**.

Our cryptosystems are:

* [Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/);
* [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/);
* [Secure Session](/docs/themis/crypto-theory/rypto-systems/secure-session/);
* [Secure Comparator](/docs/themis/crypto-theory/crypto-systems/secure-comparator/).


![](/files/wiki/themis_cryptosystems.png)


Please check out the documentation pages for the corresponding cryptosystems listed above to determine, which one(s) to use in your specific case(s). If you still have doubts, don't hesitate to [contact us](mailto:dev@cossacklabs.com).
