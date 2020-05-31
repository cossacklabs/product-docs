---
weight: 5
title: "On leaving OpenSSL"
---

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