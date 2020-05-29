---
weight: 3
title: "Key management"
---

## Key management

{{< hint info >}}
**Note:** We strongly advise that you read this section first, before proceeding to any of our language-specific how-tos. It will help you avoid some typical mistakes.
{{< /hint >}}

In the current version of Themis, key management is left to the discretion of the end-user. However, we've got some helpful tips for those willing to develop in a truly secure way. And the highest level of cryptography is negligible if your keys are not protected well. 

### Generating keys

A good key should be as random as possible. 

Do not "construct" keys yourself and don't use "secret strings" as keys. If possible, use a strong random number generator for key generation.
If possible, verify your random number generator using some statistical test suite (currently we use [NIST statistical test suite](https://csrc.nist.gov/Projects/Random-Bit-Generation/Documentation-and-Software) to check RNGs). While passing statistical tests does not guarantee that your RNG is good, failing them surely proves it is bad and predictable.

In a perfect world, the way to generate long-term keys (any key used more than once is considered to be a long-term key) would be to use a dedicated machine or device placed in a separate room, not connected to any network (even private or corporate), which only allows authorised personnel to administer it. Of course, in the real world, the implementation of the "perfect world" scenario will end up being somewhat simplified due to practical considerations.    

For generating a cryptographically strong key:

* use cryptographically secure pseudorandom number generator (you can usually find it in the “crypto” package of your favourite language),
* use appropriate key length (at least 32 bytes for Secure Cell),     
* use key derivation function (KDF),        
* (bonus point) use true hardware random data source if you manage to find one.        

Do not use as keys:

* short strings,     
* predictable strings,     
* output of general-purpose “random” generators.   

{{< hint warning >}}
**Warning:** Please don’t use general-purpose random generators provided by standard libraries (most likely coming from the “math” package of your favourite language). They are a bad choice of encryption keys because their values are easy to predict.    
{{< /hint >}}


#### Keys in Secure Message and Secure Session    

Themis provides API for generating keypairs to use in [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/) and [Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-cell/).    

#### Keys in Secure Cell     

The main requirement for using [Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/) is to generate a reasonably long key using a cryptographically secure pseudorandom number generator. We suggest making your keys at least 32 bytes long. Themis uses key stretching and key-derivation functions (KDF) under the hood, which allows converting the input key to AES-specific key.   

{{< hint info >}}
**Note:** Starting with release 0.13.0, Themis provides a convenient interface for generation of cryptographically strong keys.     
{{< /hint >}}

#### Passphrases in Secure Cell     
  
Starting with version 0.13.0, Themis provides “passphrase” interface for Secure Cell. Such interface allows using simple passphrases to encrypt and decrypt the data. Passphrases are easier for humans to remember than random 32-byte strings and are easier to generate during the application flow for most applications.

A cryptographically strong key is computed from a passphrase using password key derivation function ([PBKDF2](https://en.wikipedia.org/wiki/PBKDF2)) under the hood. 

{{< hint info >}}
**Note:** We’ve provided minimum details about cryptographic keys for Secure Cell. If you’re curious about cryptographic keys and randomness in general, check out [NIST key management advice](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-133r1.pdf) and read _Chapter 2. Randomness_ from [Serious Cryptography](https://nostarch.com/seriouscrypto) book.
{{< /hint >}}

### Storing keys in your application

Generally, we recommend using ephemeral (one-time) keys for encryption whenever possible, and only use signature keys as long-term keys. Regardless of the key type, applications must not store the keys in plaintext ("as is") in persistent storage. While using well-defined policy and operating system access control mechanisms to limit access to the key files is a good (and absolutely necessary) thing to do, storing them in an encrypted form makes the overall security level of your solution much higher. 

The simplest way (that requires little effort and no infrastructure) you can choose is to use some kind of a master key to encrypt all your keys in the application. The master key can be passed as some parameter on application startup, and you can use [Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/) to protect all your keys and other sensitive data.

### Signature keys vs encryption keys

Do not use the same asymmetric keys for both signature and encryption (or key agreement). While mathematically they are the same thing (and you may be tempted to simplify your key management scheme) their purpose is what makes them different:

- **Encryption (or key agreement) keys** are used to protect data (or other keys). Losing such a key will definitely lead to losing all the data protected with this key. That's why you would probably like to keep several copies of this key on different backup media. Also, access to this key may be granted to several people (i.e. a backup security officer needs to access the key when the primary administrator is on an unexpected sick leave). So, the main aspects of this type of key are: it is replicated, allows shared usage, and it is critical not to lose it.

- **Signature keys**, on the other hand, are used to prove identity (of a person or a computing node) in various authentication mechanisms. Losing such a key will not result in losing the data. These keys can be replaced relatively easily: just notify all the verifying parties that they should not trust the old key anymore and that they should trust the new key instead. Through careful use of timestamps, they can still trust the old data that was signed by the old key before the notification. But since such key represents an identity, sharing or replicating it increases security risks because each user of the key may impersonate this identity. That is why you would probably want to limit the number of potential users of signature keys. For signature keys that represent a person's identity, there should be only one user — the person whose identity the key is representing. For machine keys, we recommend that no more than two people that are very trusted within their security domain possess a single key. So, in most cases, the signature keys are: non-replicable, single-use, replaceable, are relatively safe to lose.

As you may see, contradicting use cases and scenarios are what makes those keys different, so keep it in mind while designing your key hierarchy and key management scheme. Also, don't forget to store those keys in an encrypted form regardless of the key type.

### Exchanging and transmitting keys over the network

The first recommendation may seem obvious: do not send the keys in plaintext over a network. Always encrypt the keys.
The second recommendation, which is unfortunately often overlooked, is: even if you only exchange public keys, you should ensure their integrity and authenticity because if you fail to do it, a man-in-the-middle (MiTM) attacker will take over all your communications. 

Relying on integrity through encryption is a bad practice, please use a separate integrity mechanism. 

Both [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/) and [Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session/) provided by Themis ensure confidentiality, integrity, and authenticity of the transmitted data, which means they can be used to send/receive keys.