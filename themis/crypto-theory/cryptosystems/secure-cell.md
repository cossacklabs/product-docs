---
weight: 2
title:  Secure Cell
---

# Secure Cell

**Secure Сell** is a high-level cryptographic container
aimed at protecting arbitrary data stored in various types of storages
(e.g., databases, filesystem files, document archives, cloud storage, etc.).

It provides a simple way of securing your data using strong encryption and data authentication mechanisms,
with easy-to-use interfaces for a broad range of use cases.

## Availability in Themis

Secure Cell is available in all languages supported by Themis:

  - [C++](/themis/languages/cpp/features/#secure-cell)
  - [Go](/themis/languages/go/features/#secure-cell)
  - [JavaScript (WebAssembly)](/themis/languages/wasm/features/#secure-cell)
  - [JavaScript (Node.js)](/themis/languages/nodejs/features/#secure-cell)
  - [Java](/themis/languages/java/features/#secure-cell)
  - [Kotlin](/themis/languages/kotlin/features/#secure-cell)
  - [Objective-C](/themis/languages/objc/features/#secure-cell)
  - [Swift](/themis/languages/swift/features/#secure-cell)
  - [PHP](/themis/languages/php/features/#secure-cell)
  - [Python](/themis/languages/python/features/#secure-cell)
  - [Ruby](/themis/languages/ruby/features/#secure-cell)
  - [Rust](/themis/languages/rust/features/#secure-cell)

## Usage model

Implementing secure storage is often constrained by various practical matters:
the ability to store keys,
the existence of length-sensitive code bound to the database structure,
the need to preserve the structure.
To cover a broader range of usage scenarios
and to provide the highest security level possible for systems with such constraints,
we've designed several types of interfaces and implementations
of our secure data container – _Secure Cell_.

### Secure Cell modes

Those interfaces differ slightly in their overall security level and their ease of use
because more complicated and slightly less secure ones can cover more constrained environments.
The interfaces below are prioritised by their security and ease of use
(our subjective and opinionated "hit parade").

#### Seal mode

Seal mode is (in our opinion) the easiest and the most secure way to protect stored data.
All that's required from you is to provide a secret (symmetric key or a passphrase)
and the data proper to the API.

![](/files/wiki/scell-seal.png)

Secure Cell in Seal mode will encrypt the data and append an "authentication tag" to it
with auxiliary security information.
This means that that size of the encrypted data will be larger than the original input.

Additionally, it is possible to bind the encrypted data to some **associated context**
(for example, database row number).
In this case decryption of the data with incorrect context will fail
(even if the secret is correct and the data has not been tampered).
This establishes cryptographically secure association between the protected data
and the context in which it is used.
With database row numbers, for example,
this prevents the attacker from swapping encrypted password hashes in the database
so the system will not accept credentials of a different user.

#### Token Protect mode

Token Protect mode is designed for cases when underlying storage constraints
do not allow the size of the data to grow (so Seal mode cannot be used).
However, if you have access to a different storage location
(e.g., another table in the database)
where additional security parameters can be stored
then Token Protect mode can be used instead of Seal mode.

![](/files/wiki/scell-token_protect.png)

Token Protect mode produces authentication tag and other auxiliary data
(aka "authentication token") in a detached buffer.
This keeps the original size of the encrypted data
while enabling separate storage of security information.
Note that the same token must be provided along with the correct secret and matching associated context
in order for the data to be decrypted successfully.

Since Token Protect mode uses the same security parameters as the Seal mode
(just stored in a different location),
these modes have the same highest security level.
Token Protect mode only requires slightly more programming effort
in exchange for preserving the original data size.

#### Context Imprint mode

Context Imprint mode is intended for environments where storage constraints
do not allow the size of the data to grow and there is no auxiliary storage available.
Context Imprint mode requires an additional "associated context" to be provided
along with the secret in order to protect the data.

![](/files/wiki/scell-context_imprint.png)

In Context Imprint mode no authentication token is computed or verified.
This means the integrity of the data is not enforced,
so the overall security level is slightly lower than in Seal or Token Protect modes.

{{< hint info >}}
**Note:**
To ensure highest security level possible,
supply a different associated context for each encryption invocation with the same secret.
{{< /hint>}}

### Which mode to choose?

We suggest that you start with analysing your product's requirements.
For example, Seal mode works for most cases,
but if preserving the cipher text's initial length is crucial for you,
it is better to choose from Context Imprint or Token Protect modes.

To select the best mode for your needs, consult the following table:

| Features               | Seal | Token Protect | Context Imprint |
| ---------------------- | -- | -- | -- |
| Encryption algorithm   | AES-GCM-256 | AES-GCM-256 | AES-CTR-256 |
| Passphrase support     | ✅ | ✅ | ✅ |
| Preserve text length   | ❌ | ✅ <sup>*</sup> | ✅ |
| Required context data  | ❌ | ❌ | ✅ |
| Integrity verification | ✅ | ✅ | ❌ |
| Separate auth tag      | ❌ | ✅ | ❌ |

<sup>*</sup>
Token Protect mode requires additional storage for the authentication tag,
but the message length is preserved when encrypted.

### Key derivation functions

A _key_ is a piece of information that actually provides security by being secret.
Good keys are random, unpredictable, and fairly long.
See the [key management guidelines](/themis/crypto-theory/key-management/) on this topic.

A key is not the same thing as a _passphrase_ which is intended to be used by humans,
as opposed to software.
Passphrases are generated for humans to read, remember, and reproduce.
For that a passphrase is not as strong a key of the same length
because it is constructed from a limited character set and has less randomness per character.

A **key derivation function** (KDF) is used to mitigate for deficiencies of passphrases
when they are used as keys.
KDF augments the input with additional randomness and
multiplies the computation complexity by repeated application of hash functions.
Cracking a passphrase without KDF requires much less resources than cracking a key.
KDF increase resource usage significantly so that cracking a passphrase is not practical.

Themis supports both kinds of secrets for Secure Cell.
Keys are preferred and Themis provides a way to generate them.
Passphrases are supported and Themis makes sure they can be used securely.

**Passphrase APIs** of Secure Cell use a strong password-based KDF
([PBKDF2](https://en.wikipedia.org/wiki/PBKDF2))
to convert passphrases into intermediate keys,
which are then passed to [NIST SP 800-108][NIST]-based KDF
to convert them into the format required by AES.

[NIST]: https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-108.pdf

## Implementation details

Secure Cell interface is described in
[`src/themis/secure_cell.h`](https://github.com/cossacklabs/themis/blob/master/include/themis/secure_cell.h).

#### Generating keys

A _symmetric key_ is needed to use Secure Cell.
Strong keys can be securely generated with Themis key generation functions.

The API is described in
[`src/themis/secure_keygen.h`](https://github.com/cossacklabs/themis/blob/master/include/themis/secure_keygen.h):

```c
themis_status_t themis_gen_sym_key(
    uint8_t* symmetric_key,
    size_t*  symmetric_key_length);
```

{{< hint info >}}
**Note:**
Symmetric keys do not have a specific format, they are just byte arrays.
However, please use Themis functions to generate high-quality keys in a safe manner,
reducing the chance that you might be using a weak key.
{{< /hint >}}

The shorter the key, the easier it is to crack the encryption.
NIST and NSA [currently recommend](https://www.keylength.com/en/4/)
using at least 32 random bytes for a key.
It is also important to use a non-predictable, strong random number generator for key generation.
Themis uses a cryptographically secure generator
verified by [NIST statistical test suite](https://csrc.nist.gov/Projects/Random-Bit-Generation/Documentation-and-Software).

{{< hint info >}}
Please consult the [key management guidelines](/themis/crypto-theory/key-management/)
to learn more about storing the keys securely after you have generated them.
{{< /hint >}}

#### Using passphrases

The preferred way to use Secure Cell is with symmetric keys.
However, it is hard for humans to memorize a string of 32 random bytes
so users prefer to use passphrases as the ultimate secret kept inside their head.


Themis supports both kinds of secrets for Secure Cell. Keys are preferred and Themis provides a way to generate them. Passphrases are supported and Themis makes sure they can be used securely.

#### Seal mode

In Seal mode all output data – encrypted message, authentication tag, IV, etc. –
is generated by Themis and packed into a single output buffer.

```c
themis_status_t themis_secure_cell_encrypt_seal(
    const uint8_t*  symmetric_key,
    const size_t    symmetric_key_length,
    const uint8_t*  associated_context,
    const size_t    associated_context_length,
    const uint8_t*  message,
    const size_t    message_length,
    uint8_t*        encrypted_message,
    size_t*         encrypted_message_length);

themis_status_t themis_secure_cell_decrypt_seal(
    const uint8_t*  symmetric_key,
    const size_t    symmetric_key_length,
    const uint8_t*  associated_context,
    const size_t    associated_context_length,
    const uint8_t*  encrypted_message,
    const size_t    encrypted_message_length,
    uint8_t*        plain_message,
    size_t*         plain_message_length);
```

Seal mode also supports **passphrases** with almost the same API:

```c
themis_status_t themis_secure_cell_encrypt_seal_with_passphrase(
    const uint8_t*  passphrase,
    const size_t    passphrase_length,
    const uint8_t*  associated_context,
    const size_t    associated_context_length,
    const uint8_t*  message,
    const size_t    message_length,
    uint8_t*        encrypted_message,
    size_t*         encrypted_message_length);

themis_status_t themis_secure_cell_decrypt_seal_with_passphrase(
    const uint8_t*  passphrase,
    const size_t    passphrase_length,
    const uint8_t*  associated_context,
    const size_t    associated_context_length,
    const uint8_t*  encrypted_message,
    const size_t    encrypted_message_length,
    uint8_t*        plain_message,
    size_t*         plain_message_length);
```

#### Token Protect mode

In Token Protect mode additional security data – authentication tag, IV, etc. –
is returned separately as “authentication token”,
along with the encrypted message in a different output buffer.
The encrypted message has the same length as the original data.

```c
themis_status_t themis_secure_cell_encrypt_token_protect(
    const uint8_t*  symmetric_key,
    const size_t    symmetric_key_length,
    const uint8_t*  associated_context,
    const size_t    associated_context_length,
    const uint8_t*  message,
    const size_t    message_length,
    uint8_t*        authentication_token,
    size_t*         authentication_token_length,
    uint8_t*        encrypted_message,
    size_t*         encrypted_message_length);

themis_status_t themis_secure_cell_decrypt_token_protect(
    const uint8_t*  symmetric_key,
    const size_t    symmetric_key_length,
    const uint8_t*  associated_context,
    const size_t    associated_context_length,
    const uint8_t*  encrypted_message,
    const size_t    encrypted_message_length,
    const uint8_t*  authetication_token,
    const size_t    authetication_token_length,
    uint8_t*        plain_message,
    size_t*         plain_message_length);
```

#### Context Imprint mode

In Context Imprint mode all the necessary additional security data
is derived from the provided associated context.
This mode does not compute any authentication tag,
meaning that it cannot verify intergrity of the encrypted data
(decryption may successfully return corrupted data instead of raising an error).
The encrypted message has the same length as the original data.

{{< hint info >}}
Mind the slightly different position of the associated context parameter.
{{< /hint >}}

```c
themis_status_t themis_secure_cell_encrypt_context_imprint(
    const uint8_t*  symmetric_key,
    const size_t    symmetric_key_length,
    const uint8_t*  message,
    const size_t    message_length,
    const uint8_t*  associated_context,
    const size_t    associated_context_length,
    uint8_t*        encrypted_message,
    size_t*         encrypted_message_length);

themis_status_t themis_secure_cell_decrypt_context_imprint(
    const uint8_t*  symmetric_key,
    const size_t    symmetric_key_length,
    const uint8_t*  encrypted_message,
    const size_t    encrypted_message_length,
    const uint8_t*  associated_context,
    const size_t    associated_context_length,
    uint8_t*        plain_message,
    size_t*         plain_message_length);
```

## Thread safety

Secure Cell objects are generally immutable.
You can safely use them concurrently from multiple threads.
Read more about [Themis thread safety guarantees](/themis/debugging/thread-safety/).

## Themis Server simulator

[Themis Server](/themis/debugging/themis-server/)
is an interactive simulator that can be used as a remote debugging aid.
We built this server to help engineers understand Themis.
It can come in handy if you're just starting out with this library.

With Themis Server, you can avoid building and installing Themis,
instead try using Secure Cell interactively from your browser.

Themis Server supports
[Secure Session](../secure-session/) and [Secure Message](../secure-cell/)
cryptosystems as well.
