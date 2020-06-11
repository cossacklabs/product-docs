---
weight: 3
title:  Secure Message
---

# Secure Message

**Secure Message** is a lightweight container
that can help deliver some message or data to your peer in a secure manner.
It provides a simple way to protect your messages
and bind them to the credentials of the communicating peers
through the use of asymmetric cryptography.
Secure Message adds data confidentiality, integrity, and authenticity
in one go (a single function call).

Some of the features of Secure Message are:

  - use of strong cryptography (including ECC)
  - message integrity and authentication
  - stateless, easy-to-use API

## Availability in Themis

Secure Message is available in all languages supported by Themis:

  - [C++](/docs/themis/languages/cpp/features/#secure-message)
  - [Go](/docs/themis/languages/go/features/#secure-message)
  - [JavaScript (WebAssembly)](/docs/themis/languages/wasm/features/#secure-message)
  - [JavaScript (Node.js)](/docs/themis/languages/nodejs/features/#secure-message)
  - [Java](/docs/themis/languages/java/features/#secure-message)
  - [Kotlin](/docs/themis/languages/kotlin/features/#secure-message)
  - [Objective-C](/docs/themis/languages/objc/features/#secure-message)
  - [Swift](/docs/themis/languages/swift/features/#secure-message)
  - [PHP](/docs/themis/languages/php/features/#secure-message)
  - [Python](/docs/themis/languages/python/features/#secure-message)
  - [Ruby](/docs/themis/languages/ruby/features/#secure-message)
  - [Rust](/docs/themis/languages/rust/features/#secure-message)

## Usage model

Secure Message assumes that peers have each other's public key that they trust.
Then they can freely exchange any messages with a high level of security and little overhead.

![](/files/wiki/secure_message.png)

Secure Message comes in two flavours:

  - **encrypted message** – confidentiality, integrity, and authenticity
  - **signed message** – integrity and authenticity, but no confidentiality

### Encrypted message

Encrypted messages are useful when you need the full stack of protection for your data –
in most cases you will be using this flavour.
The encrypted message currently uses [Secure Cell](../secure-cell/)
in **Seal** mode for data protection.

![](/files/wiki/encrypted_message.png)

### Signed messages

Signed messages are useful for cases where you don't need data confidentiality.
It allows the receiver to verify the origin and integrity of the data
while still allowing intermediate nodes to process it accordingly
(for example, route data based on its type).

![](/files/wiki/signed_message.png)

## Implementation details

Secure Message interface is described in
[`src/themis/secure_message.h`](https://github.com/cossacklabs/themis/blob/master/src/themis/secure_message.h).

#### Generating keypairs

Parties need to generate keypairs before they can communicate with Secure Messages.
New keypairs can be securely generated with Themis key generation functions.
Secure Message supports both EC and RSA key pairs.

The API is described in
[`src/themis/secure_keygen.h`](https://github.com/cossacklabs/themis/blob/master/src/themis/secure_keygen.h):

```c
themis_status_t themis_gen_ec_key_pair(
    uint8_t* private_key,
    size_t*  private_key_length,
    uint8_t* public_key,
    size_t*  public_key_length);

themis_status_t themis_gen_rsa_key_pair(
    uint8_t* private_key,
    size_t*  private_key_length,
    uint8_t* public_key,
    size_t*  public_key_length);
```

{{< hint info >}}
**Note:**
Themis does not support importing pre-existing keys generated elsewhere.
This makes it much harder to use weak keys, unknowingly or intentionally provided by third-parties.
{{< /hint >}}

The resulting private key must be kept secret, it is used to encrypt and sign outgoing messages,
and to decrypt messages sent to you.

Send the public key to the parties you want to communicate with and get their public keys in return.
Public keys are used to encrypt outgoing messages and to verify messages sent to you.

{{< hint info >}}
Please consult the [key management guidelines](/docs/themis/crypto-theory/key-management/)
to learn more about storing and exchanging keys securely after you have generated them.
{{< /hint >}}

#### Encrypting and decrypting messages

For the _encrypt/decrypt_ mode of Secure Message, use the following API.
It requires both private and public keys to be available for both parties.
Use your own private key and the public key of the party you are communicating with.

```c
themis_status_t themis_secure_message_encrypt(
    const uint8_t*  private_key,
    size_t          private_key_length,
    const uint8_t*  peer_public_key,
    size_t          peer_public_key_length,
    const uint8_t*  message,
    size_t          message_length,
    uint8_t*        encrypted_message,
    size_t*         encrypted_message_length);

themis_status_t themis_secure_message_decrypt(
    const uint8_t*  private_key,
    size_t          private_key_length,
    const uint8_t*  peer_public_key,
    size_t          peer_public_key_length,
    const uint8_t*  encrypted_message,
    size_t          encrypted_message_length,
    uint8_t*        message,
    size_t*         message_length);
```

#### Signing and verifying messages

If you need the _sign/verify_ mode of Secure Message, use the following API.
Note that it needs only your private key to sign messages
and corresponding public key to verify signatures.

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

## Thread safety

Secure Message objects are generally immutable.
You can safely use them concurrently from multiple threads.
Read more about [Themis thread safety guarantees](/docs/themis/debugging/thread-safety/).

## Themis Server simulator

[Themis Server](/docs/themis/debugging/themis-server/)
is an interactive simulator that can be used as a remote debugging aid.
We built this server to help engineers understand Themis.
It can come in handy if you're just starting out with this library.

Using the Themis Server, you can avoid spending a lot of time and effort
to build your own client and server, make sure you get the keys right, etc.
With a simple “remote party simulator” you can try out Secure Message interactively.

Themis Server supports
[Secure Session](../secure-session/) and [Secure Cell](../secure-cell/)
cryptosystems as well.
