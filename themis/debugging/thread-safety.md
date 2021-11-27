---
weight: 4
title:  Thread safety
---

# Thread safety

Some parts of Themis API are thread-safe.
Other parts may require external synchronisation to be used safely.
Particular cryptographic backends and language wrappers may impose additional safety considerations described below.

## Themis objects

### Secure Cell, Secure Message

[Secure Cell](/themis/crypto-theory/cryptosystems/secure-cell/) and
[Secure Message](/themis/crypto-theory/cryptosystems/secure-message/)
objects are generally immutable.
You can safely use these objects concurrently from multiple threads.

However, some language wrappers have historical exceptions,
[see details below](#language-wrappers).

### Secure Comparator, Secure Session

[Secure Comparator](/themis/crypto-theory/cryptosystems/secure-comparator/) and
[Secure Session](/themis/crypto-theory/cryptosystems/secure-session/)
objects implement stateful interactive protocols.
You need to use application locks to synchronise access to those objecs,
if you share them between threads.

However, it is safe to create a handle in one thread then pass it to the other thread,
as long as only one thread is using an interactive object.

#### Shared Secure Session transport objects

If you use Secure Session in [wrap/unwrap mode](/themis/crypto-theory/cryptosystems/secure-session/#usage-models),
you may share the transport callbacks between multiple Secure Session objects
and between multiple threads,
provided that your callback implementation is correctly synchronised internally.

Secure Sessions in [send/receive mode](/themis/crypto-theory/cryptosystems/secure-session/#usage-models)
require individual transport objects that must never be shared between multiple Secure Sessions
(and by extension, between multiple threads).
You cannot use locks here, you need to create separate transport callback instances.

## Crypto backends

### OpenSSL

[Modern OpenSSL 1.1.1+](https://www.openssl.org/docs/man1.1.0/man3/CRYPTO_THREAD_lock_new.html)
can be safely used in multi-threaded applications,
provided that support for the underlying OS threading API is built-in.
This is usually the case with distribution-provided packages of OpenSSL.

[Older OpenSSL 1.0.2](https://www.openssl.org/docs/man1.0.2/man3/CRYPTO_lock.html)
requires developers to install several callbacks
in order to be used safely in multithreaded environment.
Refer to [OpenSSL documentation](https://www.openssl.org/docs/man1.0.2/man3/CRYPTO_lock.html)
on what functions you need to implement and call.

{{< hint info >}}
**Note:**
With OpenSSL 1.0.2, you _have to_ install these callbacks,
regardless of synchronisation for individual Themis objects and function calls.
(Unless your application is single-threaded.)
{{< /hint >}}

### LibreSSL

Themis uses LibreSSL in a way that is fully thread-safe.

### BoringSSL

Themis uses BoringSSL in a way that is fully thread-safe.

## Language wrappers

<!-- TODO: remove this section in 2021 -->
### ThemisPP (C++)

In ThemisPP 0.12 and earlier,
_Secure Cell_ and _Secure Message_ objects were **not thread-safe**,
contrary to other language wrappers.
You have to use proper synchronisation if you share those objects between threads.

Starting from Themis 0.13.0,
Secure Cell and Secure Message objects are thread-safe in ThemisPP as well.
