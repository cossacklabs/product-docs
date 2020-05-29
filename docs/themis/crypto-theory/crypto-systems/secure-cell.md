---
weight: 2
title: "Secure Cell"
---

## Secure Cell

**Secure Сell** is a high-level cryptographic service aimed at protecting arbitrary data stored in various types of storages (i.e. databases, filesystem files, document archives, cloud storage, etc.). It provides a simple way of securing your data using strong encryption and data authentication mechanisms, with easy-to-use interfaces for a broad range of use-cases.

Implementing secure storage is often constrained by various practical matters — the ability to store keys, the existence of length-sensitive code bound to the database structure, the need to preserve the structure. To cover a broader range of usage scenarios and to provide the highest security level possible for systems with such constraints, we've designed several types of interfaces and implementations of our secure data container, _Secure Cell_. 

Those interfaces differ slightly in their overall security level and their ease of use because more complicated and slightly less secure ones can cover more constrained environments. The interfaces below are prioritised by their security and ease of use (our subjective and opinionated "hit parade").

### Seal mode

This is (in our opinion) the easiest and the most secure way to protect stored data. All that's required from you is to provide some secret (password, secret key, etc.) and the data proper to the API. The data will then be encrypted and an authentication tag will be appended to the data, meaning the size of the encrypted data will be larger than that of the original data. 

The users of this object mode can also bind the data to **some context** (i.e. database row number), so the decryption of data with incorrect context will fail (even if the secret is correct). This allows establishing cryptographically secure associations between the protected data and its context. In the example with the database row numbers, this will prevent encrypted data from being tampered with by an attacker (who, for example, is forcing the system to accept a wrong hash to check credentials by displacing row numbers or primary key values).

![](/files/wiki/scell-seal.png)


### Token Protect mode

This object mode is for cases when underlying storage constraints do not allow the size of the data to grow (so _Secure Cell Seal mode_ described above cannot be used). However, the user has access to a different storage location (i.e. another table in the database) where they can store the needed security parameters. 

The Secure Cell object puts authentication tag and other auxiliary information (aka "data token") to a *separate buffer*, so the user can store it elsewhere while keeping the original encrypted data size. The same token has to be provided along with the correct secret for the data to be decrypted successfully. Since the same security parameters are used (stored in a different location) this object mode has the same security level as _Secure Cell Seal mode_, but requires slightly more effort from the user. In this mode, the user also has the ability to bind the data to its context.

![](/files/wiki/scell-token_protect.png)


### Context Imprint mode

This object mode is created for environments where the storage constraints do not allow the size of the data to increase and where no auxiliary storage is available. Secure Cell context imprint relies on the user to provide the data context along with the secret to protect the information. Also, no authentication tag is computed or verified. This means the integrity of the data is not enforced, so the overall security level is slightly lower than in the two preceding cases.

{{< hint info >}}
**Note:** To ensure the highest security level possible, the user has to supply different context for each encryption invocation of the object for the same secret.
{{< /hint>}}

![](/files/wiki/scell-context_imprint.png)


## Which Secure Cell mode to chose?

We suggest that you start with analysing your product's requirements. For example, *Seal* mode works for most cases, but if preserving the cipher text's initial length is crucial for you, it is better to choose from *Context Imprint* or *Token Protect* modes. 

To select the best mode for your needs, consult the following table:

| Features | Seal | Token Protect |  Context Imprint |
| --------- |---------| -----| -----|
| cipher | AES-GCM-256 | AES-GCM-256 | AES-CTR-256 |
| built in KDF | ✅ | ✅ | ✅ |
| Preserve text length | ❌ | ✅ <sup>*caveat</sup> | ✅ |
| User context is required | ❌ | ❌ |  ✅ |
| Enforce integrity (calculate and verify auth tag) | ✅ | ✅ | ❌ |
| Separate cypher data and auth tag | ❌ | ✅ | ❌ |

{{< hint info >}}
<sup>*</sup> Token protect mode requires an additional buffer for auth tag,
but the message length is preserved when encrypted.
{{< /hint >}}

## KDF (key derivation function)

Themis Secure Cell uses [NIST SP 800-108](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-108.pdf)-based KDF to convert the input key into an AES-specific key. The main requirement for using Secure Cell is to generate a reasonably long key using a cryptographically secure pseudorandom number generator. [See the key management guidelines](/docs/themis/crypto-theory/key-management/).

If you are using a password or a passphrase, remember to use a password-based KDF first (for example, [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2), [scrypt](https://en.wikipedia.org/wiki/Scrypt), [Argon2](https://en.wikipedia.org/wiki/Argon2)) before calling Secure Cell.

{{< hint info >}}
**Note:** Starting with release 0.13.0, Themis will provide a convenient interface for using a passphrase as a key.
{{< /hint >}}

## Implementation details

You can use all the three modes programmatically. The Secure Cell interface is described in [src/themis/secure_cell.h](https://github.com/cossacklabs/themis/blob/master/src/themis/secure_cell.h).

### Key generation

Themis uses highly efficient and secure AES algorithm for symmetric cryptography. A _symmetric key_ is needed for using Secure Cell objects. For the security of your data, a high-quality key must be used here. Themis provides functions for convenient generation of strong symmetric keys.

The shorter the key, the easier it is to crack the encryption. NIST and NSA [currently recommend](https://www.keylength.com/en/4/) using at least 32 random bytes for a key. It is also important to use a non-predictable, strong random number generator for key generation. Themis uses a cryptographically secure generator verified by [NIST statistical test suite](https://csrc.nist.gov/Projects/Random-Bit-Generation/Documentation-and-Software).

See the [key management guidelines](/docs/themis/crypto-theory/key-management/) to learn more about storing and exchanging keys securely after you have generated them.

Use the following API to securely generate new symmetric keys for Secure Cell (described in [src/themis/secure_keygen.h](https://github.com/cossacklabs/themis/blob/master/src/themis/secure_keygen.h)).

```c
themis_status_t themis_gen_sym_key(
        uint8_t* master_key,
        size_t*  master_key_length);
```

### Seal mode

All the output data (encrypted message, auth tag, iv, etc.) is generated by Themis and is packed into a single output buffer. Error status is returned if decryption is not possible.

```c
themis_status_t themis_secure_cell_encrypt_seal(
        const uint8_t*  master_key,
        const size_t    master_key_length,
        const uint8_t*  user_context,
        const size_t    user_context_length,
        const uint8_t*  message,
        const size_t    message_length,
        uint8_t*        encrypted_message,
        size_t*         encrypted_message_length);
  
themis_status_t themis_secure_cell_decrypt_seal(
        const uint8_t*  master_key,
        const size_t    master_key_length,
        const uint8_t*  user_context,
        const size_t    user_context_length,
        const uint8_t*  encrypted_message,
        const size_t    encrypted_message_length,
        uint8_t*        plain_message,
        size_t*         plain_message_length);
```

### Token Protect mode

Additional encrypting data (auth_tag, iv, etc.) called "token" is generated by Themis and is stored in a buffer that is separate from the encrypted message (preserving the length of the original message). Error status is returned if decryption is not possible.

```c
themis_status_t themis_secure_cell_encrypt_token_protect(
        const uint8_t*  master_key,
        const size_t    master_key_length,
        const uint8_t*  user_context,
        const size_t    user_context_length,
        const uint8_t*  message,
        const size_t    message_length,
        uint8_t*        token,
        size_t*         token_length,
        uint8_t*        encrypted_message,
        size_t*         encrypted_message_length);   

themis_status_t themis_secure_cell_decrypt_token_protect(
        const uint8_t*  master_key,
        const size_t    master_key_length,
        const uint8_t*  user_context,
        const size_t    user_context_length,
        const uint8_t*  encrypted_message,
        const size_t    encrypted_message_length,
        const uint8_t*  token,
        const size_t    token_length,
        uint8_t*        plain_message,
        size_t*         plain_message_length);
```


### Context Imprint mode

All the necessary additional encryption data is derived from the user's context data. This mode doesn't calculate auth tag. This means that integrity checks can't be done, so if decryption is not possible, corrupted data is returned and no error is raised.

```c
themis_status_t themis_secure_cell_encrypt_context_imprint(
        const uint8_t*  master_key,
        const size_t    master_key_length,
        const uint8_t*  message,
        const size_t    message_length,
        const uint8_t*  context,
        const size_t    context_length,
        uint8_t*        encrypted_message,
        size_t*         encrypted_message_length);

themis_status_t themis_secure_cell_decrypt_context_imprint(
        const uint8_t*  master_key,
        const size_t    master_key_length,
        const uint8_t*  encrypted_message,
        const size_t    encrypted_message_length,
        const uint8_t*  context,
        const size_t    context_length,
        uint8_t*        plain_message,
        size_t*         plain_message_length);
```

## Secure Cell across Themis wrappers 

To see how Secure Cell is implemented in each language supported by Themis, go straight to the language wrapper that interests you: 

* [Secure Cell in C++](/docs/themis/languages/cpp/#secure-cell)
* [Secure Cell in Go](/docs/themis/languages/go/#secure-cell)
* [Secure Cell in Java Android](/docs/themis/languages/java-android/#secure-cell)
* [Secure Cell in Kotlin Android](/docs/themis/languages/kotlin-android/#secure-cell) 
* [Secure Cell in Java Desktop](/docs/themis/languages/java-desktop/#secure-cell)
* [Secure Cell in Javascript (WebAssembly)](/docs/themis/languages/wasm/#secure-cell)
* [Secure Cell in Node.js](/docs/themis/languages/nodejs/#secure-cell)
* [Secure Cell in Objective-C](/docs/themis/languages/objc/#secure-cell) (iOS, macOS)
* [Secure Cell in Swift](/docs/themis/languages/swift/#secure-cell) (iOS, macOS)
* [Secure Cell in PHP](/docs/themis/languages/php/#secure-cell)
* [Secure Cell in Python](/docs/themis/languages/python/#secure-cell)
* [Secure Cell in Ruby](/docs/themis/languages/ruby/#secure-cell)
* [Secure Cell in Rust](/docs/themis/languages/rust/#secure-cell)

## Thread Safety

Secure Cell is safe to use concurrently from multiple threads. Read more about Themis thread safety guarantees [in the documentation](/docs/themis/debugging/thread-safety/).

## Themis Server Simulator

[Themis Server](/docs/themis/debugging/themis-server/) is an interactive simulator that can be used as a remote debugging server for Themis. It is built to help engineers better understand Themis and can be handy if you're just starting out with our encryption library.

Using Themis Server, you can try [Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session/) and [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/) in an interactive mode without the need to spend time and effort on building your own client and server, making sure you get the keys right, etc. Use copy and paste commands to test encryption/decryption of containers with [Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/).