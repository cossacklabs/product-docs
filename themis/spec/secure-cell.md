---
weight: 10
title:  Secure Cell
---

# Secure Cell

{{< hint info >}}
This part of Themis documentation is currently under development.
Please come back later.

Meanwhile, you can [read an overview of the Secure Cell cryptosystem](/themis/crypto-theory/cryptosystems/secure-cell/).
{{< /hint >}}

**Secure Сell** is a high-level cryptographic container
aimed at protecting arbitrary data stored in various types of storages
(e.g., databases, filesystem files, document archives, cloud storage, etc.).
You can read [Secure Cell overview](/themis/crypto-theory/cryptosystems/secure-cell/)
to get a high-level picture of the cryptosystem.

At its core, Secure Cell is based around AES encryption algorithm
in Galois/Counter Mode (GCM) providing authenticated encryption capabilities.
It also supports regular Counter Mode (CTR) if ciphertext length needs to be preserved.
The rest of the cryptosystem ensures that AES is used in a secure way.

## Desired and designed properties

First of all, let's discuss the desired properties of the cryptosystem.

  - Strong confidentiality and integrity guarantees.

    Given the typical use cases for Secure Cell,
    it must prevent direct and indirect disclosure of protected data
    in addition to preventing inadvertent modifications to it.

    Secure Cell uses proven authenticated encryption schemes
    to provide integrity and confidentiality guarantees.

  - Good performance for both encryption and decryption.

    Given the typical use cases for Secure Cell,
    it is important for it to be as fast as possible while being secure.

    Secure Cell uses well-known symmetric encryption algorithms
    for which hardware acceleration is generally available.

Now let's talk about some *non-goals* which influence design decisions.

  - Data pieces are protected individually.

    Secure Cell is designed to operate on individual data pieces,
    such as database fields, encryption keys, etc.

    Each protected piece of data is independent of any other.
    Secure Cell does not provide nor enforce any ordering between them.

    Contrast this with [Secure Session](../secure-session/) cryptosystem
    which protects ordered streams of packets, similar to TLS.

  - Symmetric encryption scheme is used.

    Secure Cell uses the same shared secret key to both encrypt and decrypt data.
    This is a symmetric encryption scheme.

    In contrast, [Secure Message](../secure-message/) cryptosystem is asymmetric,
    which is more practical for authenticated message exchange between distinct parties.

  - Data payload has bounded size.

    While the size of Secure Cell payload is not *strictly* limited,
    it is still expected to be bounded.
    That is, Secure Cell is not designed for handling data streams of arbitrary length,
    nor does it provide random access into data within an encrypted cell.

Finally, let's consider the desired cryptography-theoretical properties of the cryptosystem.
Secure Cell is required to be at least IND-CPA secure
and it would be nice to achieve IND-CCA2 whenever possible.
The choice of AES-GCM and AES-CTR satisfies these requirements.
Here are some examples of vulnerabilities mitigated by Secure Cell:

  - Optional context data prevents malicious reuse of ciphertexts in different contexts.
    Mismatches will be detected and reported.

  - Even in case of extremely short inputs, no information about plaintext is disclosed.
    For example, you can use Secure Cell to secure a boolean field in the database.

  - It is not possible for the attacker to restore the encryption secret
    even if they can exploit the system to encrypt arbitrary data
    or trick it into decrypting some known encrypted data.

## Operation modes

Secure Cell can operate in multiple modes which can be split on several axes:

  - authenticated encryption or just confidentiality
  - whether auxiliary data is detached or embedded
  - whether associated data is used or not
  - whether the secret is a key or a passphrase

{{< hint info >}}
Some of the combinations are excluded for security and technical reasons.
For example, if no authentication is provided then you cannot use passphrases and must use associated data.
{{< /hint >}}

Ultimately, Secure Cell supports the following major modes:

  - **Seal** mode with optional associated data, secured by a key or a passphrase.
  - **Token Protect** mode with optional associated data, secured by a key.
  - **Context Imprint** mode with required associated data, secured by a key.

Now let's dissect these variations in more detail.

### Authenticated encryption

On one axis, Secure Cell can either provide *authentication* or not:

  - **Authenticated encryption** provides strong integrity guarantees.

    That is, on decryption you can be sure that the data has not been tampered with.
    Encrypted message is secure from prying eyes and idle hands.

  - **Unauthenticated encryption** provides only confidentiality guarantees.

    That is, while the attacker cannot read the encrypted message (as with any encryption),
    they can still easily corrupt or modify it without you being able to undeniably confirm it.

**Seal** and **Token Protect** modes use authenticated encryption
while **Context Imprint** mode is not authenticated.

Secure Cell provides authentication via AES-GCM encryption mode
and unauthenticated encryption via the regular AES-CTR mode.

The tradeoff here is that AES-GCM produces an *authentication tag*
which needs to be stored with encrypted data, increasing its length.
Sometimes it is acceptable, in other cases you may not have that flexibility.

Seal and Token Protect are basically the same,
but Token Protect mode stores the authentication tag and other auxiliary data in a detached buffer.
This allows to replace the original message with an encrypted one of the same length,
if you can afford to store the auxiliary data elsewhere.

Context Imprint mode exists for use cases which do not allow for any additional storage.
This constraint somewhat lowers the security of the cryptosystem
since there is no space for authentication data or – more importantly – random IV.
To compensate for this, Secure Cell requires *associated data* to be used in Context Imprint mode.

### Associated data and nonces

Another axis of Secure Cell is how much *associated data* the user provides for encryption.

**Associated data** is used in encryption algorithm, influencing its output,
but it is not a part of the plaintext, the ciphertext, or the encryption key.

Associated data provides another layer of protection against unintended disclosure, use, and modification of encrypted data.
Different associated data makes the same plaintext with the same key to be encrypted into a different ciphertext.
This makes it much harder for the attacker to guess the content of encrypted messages.
It also makes it harder to reuse encrypted data verbatim in different contexts (replay attacks).

Some parts of the associated data can be transmitted together with the ciphertext, but some can be omitted.
This complicates unintended decryption: even if the attacker has obtained the encryption key somehow,
they still need to get ahold of the associated data which might be stored elsewhere (like the user's brain).

A related concept is **nonce** – an arbitrary random number which must be used only once in cryptographic communication.
The AES-GCM and AES-CTR algorithms used by Secure Cell use an *initialisation vector* (IV) as a nonce.
Since they are effectively streaming ciphers, it is **critical** for security to never reuse nonces:
the most powerful known attack on AES-GCM is based on IV reuse.
Secure Cell includes several mitigations for it.

With Secure Cell, in addition to the message and the key, users can provide extra **context data**
which is used to derive associated data for encryption.
If the context data is not provided explicitly, Secure Cell derives some from the message length.
It is also used in key derivation to minimise the risks of key reuse and XOR attacks as well.
See the [Encryption](#encryption) section for the details.

**Seal** and **Token Protect** modes require additional storage for authentication data.
Therefore, Secure Cell can use a bit more of that extra storage
to choose and keep a completely new, random IV for each encrypted piece of data.
Thus, user-provided context is optional in Seal and Token Protect modes
but it can still be provided to enhance security even further.

On the other hand, **Context Imprint** mode must preserve the length of the input.
It does not allow for any unaccounted randomess and thus is completely deterministic:
given the same input, key, and context, the resulting output is always the same.
In Context Imprint mode the IV is derived from available encryption key and context data,
making the encryption susceptible to nonce reuse attacks.
This is the reason why in Context Imprint mode the users are *required* to provide context data,
and encouraged to use unique context data for each encryption to maintain security.

### Keys vs. passphrases

Secure Cell supports several types of secrets used to secure encrypted data:

  - [Symmetric keys](../symmetric-keys/) for machines to remember.

    Keys should be as random as possible and can be as long as necessary.

  - [Passphrases](../symmetric-keys/#passphrases) for humans to remember.

    Since human memory is usually not good at remembering strings of random numbers,
    passphrases are typically shorter and have fewer randomness per character.

Ultimately, AES-256 encryption algorithm works with 256-bit keys.
Secure Cell uses _key derivation functions_ (KDF) to stretch or shrink user-provided keys to the length required by AES.
If a passphrase is used, a [special _passphrase_ KDF](/themis/crypto-theory/cryptosystems/secure-cell.md#key-derivation-functions) is employed
to compensate for potentially poorer statistical properties of passphrases.
See the [Encryption](#encryption) section for the details.

Passphrase KDFs require additional parameters which need to be adjusted with time, as computers get faster.
KDF parameters need to be stored together with the encrypted data so that it can always be decrypted.
Therefore, **Context Imprint** mode does not support passphrases as it has no spare space for the parameters.
Requiring the users to supply KDF parameters goes against Themis design philosophy.

Moreover, passphrase KDFs are designed to be exceedingly slow.
**Token Protect** mode is particularly useful in database contexts to encrypt individual database cells.
This use case is pretty sensitive to performance so *key wrapping* should be preferred.
As a result, only **Seal** mode provides passphrase support.

Finally, KDF plays another auxiliary role.
AES-GCM algorithm has a limit on how much data can be safely encrypted using the same key,
before cryptanalysis attacks become practical.
KDF mixes in user-provided associated data into the derived key,
randomising it, and reducing effective key reuse even when the same secret is used with Secure Cell.
