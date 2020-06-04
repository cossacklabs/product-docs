---
weight: 2
title: "Cryptographic donors"
---

## Cryptographic donors

### Do you roll your own crypto 

"So do you roll your own crypto?"

If you're reading this section, you might already know the short answer: No. 

We don't roll our own crypto. Themis relies on algorithm implementations that come from platform providers and open-source projects. We believe that anyone in their right mind should use well-known, audited implementations of well-known and proven cryptographic ciphers for their core security needs. 

We've built Themis to have easy-to-use large building blocks bound to precise security guarantees and use cases — these are Secure Cell, Secure Message, Secure Session, and Secure Comparator cryptosystems. They are composed according to the best modern practices of achieving certain security guarantees. 

## What should you use

### The current state of things

Cryptographic algorithms mentioned on the main [Soter](/docs/themis/crypto-theory/soter/) page come from 3 cryptographic donors (all coming from one family of products), linked `libcrypto.so` from: 

  * [OpenSSL](https://www.openssl.org/),    
  * [LibreSSL](http://www.libressl.org/),    
  * [BoringSSL](https://boringssl.googlesource.com/boringssl/).    

However: 

**1.** These kinds of `libcrypto.so` do not contain all the primitives we need (i.e. Secure Comparator relies on ed25519 and in the future it might require the implementation of an even more esoteric elliptic curve), so we have to supply the primitives from different backends in one build.


**2.** Some considerations concerning the performance and implementation elegance made us build additional experimental backends based on: 


   * [BearSSL](https://bearssl.org/),
   * [LibSodium](https://libsodium.gitbook.io/doc/),
   * [CommonCrypto](https://github.com/soffes/CommonCrypto).

## Cryptographic algorithms

Themis is designed to be algorithm-agnostic thanks to its special abstraction layer, [Soter](/docs/themis/crypto-theory/soter/).
It could be built with custom ciphers or cipher implementations specific to your regulatory needs or to the available implementations in your environment.
There are two ways you can alter these parameters for symmetric and asymmetric algorithms. 

For symmetric algorithms, there is a variable that points `libsoter` to a specific function picked at the compilation time.

Authenticated symmetric algorithm is selected by the `AUTH_SYM_ALG` variable.
(Only AES in GCM mode is currently available.)

  - `THEMIS_AUTH_SYM_ALG_AES_256_GCM` **(used by default)**
  - `THEMIS_AUTH_SYM_ALG_AES_128_GCM`
  - `THEMIS_AUTH_SYM_ALG_AES_192_GCM`

General symmetric algorithm is selected by the `SYM_ALG` variable.
(Only AES in CTR mode is currently available.)

  - `THEMIS_SYM_ALG_AES_256_CTR` **(used by default)**
  - `THEMIS_SYM_ALG_AES_128_CTR`
  - `THEMIS_SYM_ALG_AES_192_CTR`

As for asymmetric algorithms, we're still working on making them switchable during compilation. Currently, for most of the asymmetric operations, the algorithm is selected by the key type you feed into it (either RSA or EC key, defined when the keypair is generated).

However, for RSA you can change the key length at compilation time using the `RSA_KEY_LENGTH` variable. We strongly insist that using a key length less than 2048 should only be done due to performance considerations, in safe environments.

  - `1024`
  - `2048` **(used by default)**
  - `4096`    


## Controlling backends

What to use as a default backend is a matter of personal preferences and specific constraints of the task in question. So since [0.9.5](https://github.com/cossacklabs/themis/releases/tag/0.9.5) release version, Themis' `make` system enables you to build Themis based on different backends yourself. 

Our goal is not only to keep developing Themis with the best implementations of the best cryptographic algorithms available under the hood. Our goal lies as much in being able to consciously choose the optimal cryptographic algorithms for each use case, on every Themis build.


## On leaving OpenSSL

We rely on the following list of crypto-primitives and ciphers for Themis:   

* AES    
* RSA    
* ChaCha   
* KDF   
* Rand   
* SHA / HMAC, ECDSA, ECDH 

We consider OpenSSL, LibreSSL, and BoringSSL to be crypto engines that fully support these crypto-primitives and ciphers on Linux, macOS, Windows, iOS and Android. However, we're planning to move away from OpenSSL everywhere some day and use BoringSSL as a default crypto engine on every platform supported by Themis.

We shall accumulate various sources of algorithms for different platforms to roadmap the migration away from the **libcrypto** dependency soon.

You can out check our plans concerning the support and migration to BoringSSL [in the list of issues](https://github.com/cossacklabs/themis/issues?utf8=%E2%9C%93&q=is%3Aissue+boringssl).