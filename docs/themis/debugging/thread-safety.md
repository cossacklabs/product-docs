---
weight: 4
title: "Thread Safety"
---

## Thread Safety

Themis as a library is safe to use from multiple threads for non-interactive cryptosystems ([Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/) and [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/)) and isn't thread safe for interactive protocols ([Secure Comparator](/docs/themis/crypto-theory/crypto-systems/secure-comparator/) and [Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session/)).

However, access to individual shared objects may need to be synchronized by your application locks.

Particular cryptographic backends and language wrappers may impose additional safety considerations described below.

## Themis objects

### Secure Message, Secure Cell

_Secure Message_ and _Secure Cell_ objects are generally immutable. They can be safely used from multiple threads concurrently. However, some language wrappers have specific exceptions, [see details below](#language-wrappers).

### Secure Comparator, Secure Session

_Secure Comparator_ and _Secure Session_ objects implement stateful interactive protocols.
Therefore you must never share them between multiple threads. You may create a handle in one thread and then pass it to another, but you must never use a single object from more than one thread at any given time.

#### Shared Secure Session transport objects

If you use Secure Session in [wrap/unwrap mode](/docs/themis/crypto-theory/crypto-systems/secure-session/#usage-modes), you may share the transport callbacks between multiple Secure Session objects and between multiple threads, provided that your callback implementation is correctly synchronized internally.

Secure Sessions in [send/receive mode](/docs/themis/crypto-theory/crypto-systems/secure-session/#usage-modes) requires individual transport objects that must never be shared between multiple Secure Sessions (and by extension, between multiple threads).

## Crypto backends

### OpenSSL

[Modern OpenSSL 1.1.0+](https://www.openssl.org/docs/man1.1.0/man3/CRYPTO_THREAD_lock_new.html) can be safely used in multi-threaded applications, provided that support for the underlying OS threading API is built-in. This is usually the case with distribution-provided packages for OpenSSL.

[Older OpenSSL 1.0.2](https://www.openssl.org/docs/man1.0.2/man3/CRYPTO_lock.html) requires developers to install several callbacks in order to be used safely in multithreaded environment. 

Note that you always **have to** install these callbacks, regardless of synchronization for individual Themis objects and function calls (unless all Themis and OpenSSL usage throughout the application is restricted to a single thread).

### LibreSSL

Themis uses LibreSSL in a way that is fully thread-safe.

### BoringSSL

Themis uses BoringSSL in a way that is fully thread-safe.

## Language wrappers

### ThemisPP (C++)

_Secure Cell_ and _Secure Message_ objects are **not thread-safe** in C++, contrary to other language wrappers. You must never use the same object from multiple threads.