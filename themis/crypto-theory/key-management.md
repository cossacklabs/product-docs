---
weight: 3
title:  Key management
---

# Key management

{{< hint info >}}
**Note:**
We strongly advise that you read this section first,
before proceeding to any of our language-specific how-tos.
It will help you to avoid some typical mistakes.
{{< /hint >}}

In the current version of Themis,
key management is left to the discretion of the end-user.
However, we've got some helpful tips for those willing to develop in a truly secure way.
According to the [Kerckhoffs's principle](https://en.wikipedia.org/wiki/Kerckhoffs%27_principle),
cryptosystems should be treated as secure as the keys.
The highest level of cryptography is negligible if your keys are not protected well.

## Generating new keys

A good key should be as random as possible.

Do not "construct" keys yourself and don't use "secret strings" as keys.
If possible, use a strong random number generator for key generation.
If possible, verify your random number generator using some statistical test suite
(for example, we use [NIST statistical test suite](https://csrc.nist.gov/Projects/Random-Bit-Generation/Documentation-and-Software) to check RNGs).
While passing statistical tests does not guarantee that your RNG is good,
failing them surely proves it is bad and predictable.

In a perfect world,
the way to generate long-term keys
(any key used more than once is considered to be a long-term key)
would be to use a dedicated machine or device placed in a separate room,
not connected to any network (even private or corporate),
which only allows authorised personnel to administer it.
Of course, in the real world,
the implementation of the "perfect world" scenario will end up being somewhat simplified
due to practical considerations.

To generate a cryptographically strong key:

  - Use a cryptographically secure pseudorandom number generator.

    You can usually find one in the `crypto` package of your favourite language.

  - Use an appropriate key length.

    For example, [NIST recommends](https://www.keylength.com/en/4/) using at least 32 random bytes.

  - Use key derivation functions (KDF).

    If you need a set of related keys, you should use an appropriate KDF
    to securely derive them from the common secret.

    If you need to convert a passphrase string into a key,
    there are special _passphrase-based_ KDFs for that purpose too.

  - (Bonus points) Use a true hardware random data source if you manage to find one.

Do not use as keys:

  - short strings,
  - predictable strings,
  - output of general-purpose pseudo-random generators.

{{< hint danger >}}
**Warning:**
Please do not use general-purpose random generators provided by standard libraries
– most likely coming from the `math` package –
which are not explicitly intended for cryptographic purposes.
They are a bad choice for generating encryption keys because their values are easy to predict.
{{< /hint >}}

### Themis key generators

Themis provides API for generating keys used by all its cryptosystems.

#### Symmetric keys in Secure Cell

[Secure Cell](/themis/crypto-theory/crypto-systems/secure-cell/)
cryptosystem uses symmetric encryption keys.
They do not have a particular format, but must be reasonably long to provide security.
Themis uses key stretching and key-derivation functions under the hood,
which allows converting the input key to the format required by AES.

Themis includes an API for secure generation of symmetric keys of sufficient length.
Consult a [how-to guide for your language](/themis/languages/).

#### Passphrases in Secure Cell

Themis also provides a separate “passphrase” interface for [Secure Cell](/themis/crypto-theory/crypto-systems/secure-cell/).
This interface allows using relatively short passphrases to encrypt and decrypt the data.
Passphrases are easier for humans to remember than random 32-byte strings
and may be easier to generate for most applications.

A cryptographically strong key is computed from a passphrase,
using [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) under the hood.
This ensures a comparable level of security for passphrases,
even though they are not as long as proper keys
(which should still be preferred if feasible).

{{< hint info >}}
**Note:**
We’ve provided only minimum details about cryptographic keys for Secure Cell.
If you’re curious about cryptographic keys and randomness in general,
check out [NIST key management advice](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-133r1.pdf)
and read _Chapter 2. Randomness_
from the [Serious Cryptography](https://nostarch.com/seriouscrypto) book.
{{< /hint >}}

#### Keypairs in Secure Message and Secure Session

[Secure Message](/themis/crypto-theory/crypto-systems/secure-message/)
and [Secure Session](/themis/crypto-theory/crypto-systems/secure-cell/)
cryptosystems use asymmetric keypairs.
RSA and EC keypairs have a specific format and mathematical requirements for them to be secure.
Not only they must be created for random data of sufficient length,
but you have to avoid certain weak values and components.

Themis includes an API for secure generation of strong asymmetric keypairs.
Consult a [how-to guide for your language](/themis/languages/).

## Storing keys in your application

Generally, we recommend using _ephemeral_ (one-time) keys for encryption whenever possible,
and only use signature keys as long-term keys.

Regardless of the key type,
applications must not store the keys in plaintext ("as is") in persistent storage.
While using well-defined policy and operating system access control mechanisms
to limit access to the key files is a good (and absolutely necessary) thing to do,
storing them in an encrypted form makes the overall security level of your solution much higher.

The simplest way you can choose (that requires little effort and no infrastructure)
is to use some kind of a master key to encrypt all your keys in the application.
The master key can be passed as some parameter on application startup,
and you can use [Secure Cell](/themis/crypto-theory/crypto-systems/secure-cell/)
to protect all your keys and other sensitive data.

### Signature keys vs encryption keys

Do not use the same key for multiple purposes.
For example, you should generate separate keys for encryption and signatures on the data,
and use a third key for transport key agreement protocols.
While mathematically they are the same thing
(and you may be tempted to simplify your key management scheme)
their purpose is what makes them different:

- **Encryption (or key agreement) keys** are used to protect data (or other keys).

  Losing such a key will definitely lead to losing all the data protected with this key.
  That's why you would probably like to keep several copies of this key on different backup media.

  Also, access to this key may be granted to several people
  (e.g., a backup security officer needs to access the key
  when the primary administrator is on an unexpected sick leave).

  So, the main aspects of this type of key are:
  it is replicated, allows shared usage, and it is critical not to lose it.

- **Signature keys**, on the other hand, are used to prove identity (of a person or a computing node) in various authentication mechanisms.

  Losing such a key will not result in data loss.
  These keys can be replaced relatively easily:
  just notify all the verifying parties that they should not trust the old key anymore
  and that they should trust the new key instead.
  Through careful use and verification of timestamps,
  they can still trust the old data that was signed by the old key before the notification.

  But since such key represents an identity,
  sharing or replicating it increases security risks
  because each user of the key may impersonate this identity.
  That is why you would probably want to limit the number of potential users of signature keys.

  For signature keys that represent a person's identity,
  there should be only one user—the person whose identity the key is representing.
  For machine keys, we recommend that no more than
  two people—that are very trusted within their security domain—possess a single key.

  So, in most cases, the signature keys are:
  non-replicable, single-use, replaceable, are relatively safe to lose.

As you may see, contradicting use cases and scenarios are what makes those keys different,
so keep it in mind while designing your key hierarchy and key management scheme.
Also, don't forget to store those keys in an encrypted form regardless of the key type.

## Exchanging keys between parties

The first recommendation may seem obvious:
do not send the keys in plaintext over the network.
Always encrypt the keys.

The second recommendation, which is unfortunately often overlooked, is:
even if you only exchange public keys,
you should ensure their integrity and authenticity.
If you fail to do so,
a man-in-the-middle (MitM) attacker may take over all your communications.

Relying on integrity through encryption is a bad practice,
please use a separate integrity mechanism.

Both [Secure Message](/themis/crypto-theory/crypto-systems/secure-message/)
and [Secure Session](/themis/crypto-theory/crypto-systems/secure-session/)
provided by Themis ensure confidentiality, integrity,
and authenticity of the transmitted data,
which means they can be safely used for key exchange.
