---
weight: 3
title: "Secure Message"
---

## Secure Message


**Secure Message** is a lightweight service that can help deliver some message or data to your peer in a secure manner. It provides a simple way to protect your messages and bind them to the credentials of the communicating peers through the use of strong cryptography. It adds data confidentiality, integrity, and authenticity to your message in a single go (single function call). 

Some of the features of Secure Message are:

- strong data encryption,
- message integrity and authentication,
- key generation (both RSA and ECC),
- stateless, easy-to-use API.

Secure Message assumes that peers have each other's public key that they trust. Then they can freely exchange any messages with a high level of security and little overhead.

![](/files/wiki/secure_message.png)

Secure Message comes in two flavours: **signed message** (integrity and authenticity) and **encrypted message** (confidentiality, integrity, and authenticity).


### Signed message

**Signed** message is useful for cases where you don't need data confidentiality. It allows the receiver to verify the origin and integrity of the data while still allowing intermediate nodes to process it accordingly (for example, route data based on its type).

![](/files/wiki/signed_message.png)


### Encrypted message

**Encrypted** message is useful when you need the full stack of protection for your data — in most cases, you will be using this flavour. The encrypted message currently uses [Secure Cell](/pages/secure-cell-cryptosystem/) in **Seal** mode for data protection.

![](/files/wiki/encrypted_message.png)


## KDF (key derivation function)

Themis Secure Message uses [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) and [NIST SP 800-108](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-108.pdf)-based KDF to convert the input key into a cryptographically strong key. Generate the keys for [Secure Message](/pages/documentation-themis/#key-management) using the provided API. 


## Implementation details

As described above, Secure Message may be used in two modes:

1. sign/verify (integrity and authenticity only) mode;
2. encrypt/decrypt (confidentiality, integrity and authenticity; authenticity is provided through the use of EC cryptography) mode.

In **sign/verify** mode the message will be signed by the appropriate signature algorithm (ECDSA by default) and packed into `THEMIS_SIGNED_MESSAGE_CONTAINER`.

In **encrypt/decrypt** mode the message will be encrypted by a randomly generated symmetric key (in RSA) or derived by ECDH (in ECDSA). All the additional necessary data for encryption will be derived by Themis and packed into the `THEMIS_ENCRYPTED_MESSAGE_CONTAINER`.

The Secure Message interface is described in [src/themis/secure_message.h](https://github.com/cossacklabs/themis/blob/master/src/themis/secure_message.h).

If you need **sign/verify** mode of Secure Message then use the following API. Note that it either uses private key for signing messages or public key for verifying signatures.

```c
themis_status_t themis_secure_message_sign(
        const uint8_t*  private_key,
        size_t          private_key_length,
        const uint8_t*  message,
        size_t          message_length,
        uint8_t*        signed_message,
        size_t*         signed_message_length);

themis_status_t themis_secure_message_verify(
        const uint8_t*  public_key,
        size_t          public_key_length,
        const uint8_t*  signed_message,
        size_t          signed_message_length,
        uint8_t*        message,
        size_t*         message_length);
```

For **encrypt/decrypt** mode of Secure Message, use the following API instead. It requires both private and public keys to be available for both parties.

```c
themis_status_t themis_secure_message_encrypt(
        const uint8_t*  private_key,
        size_t          private_key_length,
        const uint8_t*  public_key,
        size_t          public_key_length,
        const uint8_t*  message,
        size_t          message_length,
        uint8_t*        encrypted_message,
        size_t*         encrypted_message_length);

themis_status_t themis_secure_message_decrypt(
        const uint8_t*  private_key,
        size_t          private_key_length,
        const uint8_t*  public_key,
        size_t          public_key_length,
        const uint8_t*  encrypted_message,
        size_t          encrypted_message_length,
        uint8_t*        message,
        size_t*         message_length);
```

{{< hint info >}}
**Note:** The current implementations of `verify` and `decrypt` do not signal about extra data
at the end of the wrapped message.
Extra data is silently ignored and only the correctly signed or encrypted data is returned.
{{< /hint>}}


### Generating keypairs

It's important to use a strong random number generator for key generation, that's why Themis uses a suitable generator verified by [NIST statistical test suite](https://csrc.nist.gov/Projects/Random-Bit-Generation/Documentation-and-Software).

Themis's key generation is simple: select RSA or ECC, and get a keypair. 

Please consult the [key management guidelines](/docs/themis/crypto-theory/key-management/) to learn more about storing and exchanging keys securely after you have generated them.

Use the following API to securely generate the new pairs of private and public ECC or RSA keys for Secure Message (described in [src/themis/secure_keygen.h](https://github.com/cossacklabs/themis/blob/master/src/themis/secure_keygen.h)).

```c
themis_status_t themis_gen_ec_key_pair(
        uint8_t* private_key,
        size_t* private_key_length,
        uint8_t* public_key,
        size_t* public_key_length);

themis_status_t themis_gen_rsa_key_pair(
        uint8_t* private_key,
        size_t* private_key_length,
        uint8_t* public_key,
        size_t* public_key_length);
```

{{< hint info >}}
**Note:** Themis does not support importing pre-existing keys that have been generated elsewhere. This way it is much harder to use weak keys, unknowingly or intentionally provided by third parties.  
{{< /hint >}}


## Secure Message across Themis wrappers 

To see how Secure Message is implemented in each language supported by Themis, go straight to the language wrapper that interests you:     

* [Secure Message in C++](/docs/themis/languages/cpp/#secure-message)
* [Secure Message in Go](/docs/themis/languages/go/#secure-message)
* [Secure Message in Java Android](/docs/themis/languages/java-android/#secure-message)
* [Secure Message in Kotlin Android](/docs/themis/languages/kotlin-android/#secure-message) 
* [Secure Message in Java Desktop](/docs/themis/languages/java-desktop/#secure-message)
* [Secure Message in Javascript (WebAssembly)](/docs/themis/languages/wasm/#secure-message)
* [Secure Message in Node.js](/docs/themis/languages/nodejs/#secure-message)
* [Secure Message in Objective-C](/docs/themis/languages/objc/#secure-message) (iOS, macOS)
* [Secure Message in Swift](/docs/themis/languages/swift/#secure-message) (iOS, macOS)
* [Secure Message in PHP](/docs/themis/languages/php/#secure-message)
* [Secure Message in Python](/docs/themis/languages/python/#secure-message)
* [Secure Message in Ruby](/docs/themis/languages/ruby/#secure-message)
* [Secure Message in Rust](/docs/themis/languages/rust/#secure-message)


## Thread Safety

Themis as a library is safe to use from multiple threads for Secure Message. However, access to individual shared objects may need to be synchronized by your application locks. Read more in the documentation section on [thread safety](/docs/themis/debugging/thread-safety/).

## Themis Server Simulator

[Themis Server](/docs/themis/debugging/themis-server/) is an interactive simulator that can be used as a remote debugging server for Themis. It is aimed at helping engineers understand Themis. It can come in handy if you're just starting out with this encryption library.

It can come in handy if you're just starting out with Themis. Using the Themis Serer, you can avoid spending a lot of time and effort building your own client and server, making sure you get the keys right, etc. Using a simple 'remote party simulator' you can try out [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/) (and [Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session/) in an interactive mode and use copying and pasting to test encryption/decryption of containers with [Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/).