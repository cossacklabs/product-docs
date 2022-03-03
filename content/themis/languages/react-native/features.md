---
weight: 5
title: React Native features
---

# Features of React Native Themis

After you have [installed React Native Themis](../installation/),
it is ready to use in your application!

## Using Themis

In order to use React Native Themis,
you need to import it like this:

```javascript
import { symmetricKey64, keyPair64 } from 'react-native-themis'
```

---

## Key generation

### Asymmetric keypairs

Themis supports both Elliptic Curve and RSA algorithms for asymmetric cryptography.
Algorithm type is chosen according to the generated key type.
Asymmetric keys are used by [Secure Message](#secure-message)
and [Secure Session](#secure-session) objects.

{{< hint warning >}}
**Warning:**
When using public keys of other peers, make sure they come from trusted sources
to prevent Man-in-the-Middle attacks.

When handling private keys of your users, make sure the keys are sufficiently protected.
You can find [key management guidelines here](/themis/crypto-theory/key-management/).
{{< /hint >}}

To generate asymmetric keypairs, use:

```javascript
import {
  keyPair64,
  KEYTYPE_EC,
  KEYTYPE_RSA
} from 'react-native-themis'

keyPair64(KEYTYPE_EC) // or KEYTYPE_RSA
  .then((pair: any) => {
    console.log("private key", pair.private64)
    console.log("public key", pair.public64)
  })
```

{{< hint warning >}} Warning: React Native Themis use base64 encoded strings to exchange binary data with developers. You can safe store it in variables and states. {{< /hint >}}



### Symmetric keys

Themis uses highly efficient and secure AES algorithm for symmetric cryptography.
A symmetric key is necessary for [Secure Cell](#secure-cell) objects.

{{< hint warning >}}
**Warning:**
When handling symmetric keys of your users, make sure the keys are sufficiently protected.
You can find [key management guidelines here](/themis/crypto-theory/key-management/).
{{< /hint >}}

To generate symmetric keys, use:

```javascript

import {
  symmetricKey64,
} from 'react-native-themis'

symmetricKey64()
  .then((key64) => {
    console.log(key64)
  });

```

---

## Secure Cell

[**Secure Сell**](/themis/crypto-theory/cryptosystems/secure-cell/)
is a high-level cryptographic container
aimed at protecting arbitrary data stored in various types of storage
(e.g., databases, filesystem files, document archives, cloud storage, etc.)
It provides both strong symmetric encryption and data authentication mechanism.

The general approach is that given:

  - _input:_ some source data to protect
  - _secret:_ symmetric key or a password
  - _context:_ and an optional “context information”

Secure Cell will produce:

  - _cell:_ the encrypted data
  - _authentication token:_ some authentication data

The purpose of the optional context information
(e.g., a database row number or file name)
is to establish a secure association between this context and the protected data.
In short, even when the secret is known, if the context is incorrect then decryption will fail.

The purpose of the authentication data is to validate
that given a correct key or passphrase (and context),
the decrypted data is indeed the same as the original source data,
and the encrypted data has not been modified.

The authentication data must be stored somewhere.
The most convenient way is to simply append it to the encrypted data,
but this is not always possible due to the storage architecture of your application.
Secure Cell offers variants that address this issue in different ways.

By default, Secure Cell uses AES-256 for encryption.
Authentication data takes additional 44 bytes when symmetric keys are used
and 70 bytes in case the data is secured with a passphrase.

Secure Cell supports 2 kinds of secrets:

  - **Symmetric keys** are convenient to store and efficient to use for machines.
    However, they are relatively long and hard for humans to remember.

  - **Passphrases**, in contrast, can be shorter and easier to remember.

    However, passphrases are typically much less random than keys.
    Secure Cell uses a [_key derivation function_][KDF] (KDF) to compensate for that
    and achieves security comparable to keys with shorter passphrases.
    This comes at a significant performance cost though.

    [KDF]: /themis/crypto-theory/cryptosystems/secure-cell/#key-derivation-functions

Secure Cell supports 3 operation modes:

  - **[Seal mode](#seal-mode)** is the most secure and easy to use.
    Your best choice most of the time.
    This is also the only mode that supports passphrases at the moment.

  - **[Token Protect mode](#token-protect-mode)** is just as secure, but a bit harder to use.
    This is your choice if you need to keep authentication data separate.

  - **[Context Imprint mode](#context-imprint-mode)** is a length-preserving version of Secure Cell
    with no additional data stored. Should be used carefully.

Read more about
[Secure Cell cryptosystem design](/themis/crypto-theory/cryptosystems/secure-cell/)
to understand better the underlying considerations, limitations, and features of each mode.


### Seal mode

[**Seal mode**](/themis/crypto-theory/cryptosystems/secure-cell/#seal-mode)
is the most secure and easy to use mode of Secure Cell.
This should be your default choice unless you need specific features of the other modes.

Use a Secure Cell with a secret of your choice to start using it.
Seal mode supports [symmetric keys](#symmetric-keys) and passphrases.

{{< hint info >}}
Each secret type has its pros and cons.
Read about [Key derivation functions](/themis/crypto-theory/cryptosystems/secure-cell/#key-derivation-functions) to learn more.
{{< /hint >}}

```javascript
import {
  symmetricKey64,
} from 'react-native-themis'

const key64 = await symmetricKey64()
```

You can use `secureCellSealWithSymmetricKeyEncrypt64` function to encrypt `plaintext` data with optional `context`. 

```javascript
import {
  symmetricKey64,
  secureCellSealWithSymmetricKeyEncrypt64,
  secureCellSealWithSymmetricKeyDecrypt64,
  secureCellSealWithPassphraseEncrypt64,
  secureCellSealWithPassphraseDecrypt64
} from 'react-native-themis'

// Symmetric key => promise => encryption => promise => decryption
symmetricKey64()
  .then((key64) => {
    secureCellSealWithSymmetricKeyEncrypt64(key64, plaintext, context)
      .then((encrypted64) => {
        console.log(encrypted64) 
      })
      .catch((error: any) => {
        console.log(error)
      })
  });

//
// OR
// the same, but with await
const key64 = await symmetricKey64()
const encrypted64 = await secureCellSealWithSymmetricKeyEncrypt64(key64, plaintext, context)
```

Also you can encrypt your data using `secureCellSealWithPassphraseEncrypt64` function and plaintext password:
```javascript
// secure seal with passphrase encrypt and decrypt
secureCellSealWithPassphraseEncrypt64(passphrase, plaintext, context)
  .then((encrypted64) => {
    console.log(encrypted64) 
  })
  .catch((error: any) => {
    console.log(error)
  })
```

The _associated context_ argument is optional and can be empty.

Seal mode produces encrypted cells that are slightly bigger than the input:

You can decrypt the data back using the `decrypt` method:

```javascript
secureCellSealWithSymmetricKeyDecrypt64(key64, encrypted64, context)
  .then((decrypted) => {
    console.log("Decrypted with the key:", decrypted)
  })
  .catch((error: any) => {
    console.log(error)
  })

// OR
// the same, but with await
(async () => {
  const decrypted = await secureCellSealWithSymmetricKeyDecrypt64(key64, encrypted64, context)
})();

```

Make sure to initialise the Secure Cell with the same secret
and provide the same associated context as used for encryption.
Secure Cell will throw an exception if those are incorrect or if the encrypted data was corrupted.

### Token Protect mode

[**Token Protect mode**](/themis/crypto-theory/cryptosystems/secure-cell/#token-protect-mode)
should be used if you cannot allow the length of the encrypted data to grow
but have additional storage available elsewhere for the authentication token.
Other than that,
Token Protect mode has the same security properties as the Seal mode.

Initialise a Secure Cell with a secret of your choice to start using it.
Token Protect mode supports only [symmetric keys](#symmetric-keys).

```javascript
import {
  symmetricKey64,
  secureCellTokenProtectEncrypt64,
  secureCellTokenProtectDecrypt64,
} from 'react-native-themis'

 // token protect
symmetricKey64()
  .then((key64) => {
    console.log(key64)
  })
```

Now you can encrypt the data using the `encrypt` method:

```javascript
// token protect
secureCellTokenProtectEncrypt64(key64, plaintext, context)
  .then((encrypted: any) => {
    console.log("Encrypted part:", encrypted.encrypted64)
    console.log("Authentication token:", encrypted.token64)
  })
  .catch((error: any) => {
    console.log(error)
  })
```

The _associated context_ argument is optional and can be omitted.

Token Protect mode produces encrypted text and authentication token separately.

You need to save both the encrypted data and the token, they are necessary for decryption.
Use the `decrypt` method for that:

```javascript
secureCellTokenProtectDecrypt64(key64, encrypted.encrypted64, encrypted.token64, context)
  .then((decrypted) => {
    console.log("Decrypted with token protect:", decrypted)
  })
  .catch((error: any) => {
    console.log(error)
  })
```


Make sure to initialise the Secure Cell with the same secret
and provide the same associated context as used for encryption.
Secure Cell will throw an exception if those are incorrect
or if the data or the authentication token was corrupted.

### Context Imprint mode

[**Context Imprint mode**](/themis/crypto-theory/cryptosystems/secure-cell/#context-imprint-mode)
should be used if you absolutely cannot allow the length of the encrypted data to grow.
This mode is a bit harder to use than the Seal and Token Protect modes.
Context Imprint mode also provides slightly weaker integrity guarantees.

Initialise a Secure Cell with a secret of your choice to start using it.
Context Imprint mode supports only [symmetric keys](#symmetric-keys).

```javascript
import {
  symmetricKey64,
  secureCellContextImprintEncrypt64,
  secureCellContextImprintDecrypt64
} from 'react-native-themis'

symmetricKey64()
  .then((key64) => {
    console.log(key64)
  })
```

Now you can encrypt the data using the `encrypt` method:

```javascript
secureCellContextImprintEncrypt64(key64, plaintext, context)
  .then((encrypted64: any) => {
    console.log(encrypted64)   
  })
  .catch((error: any) => {
    console.log(error)
  })
})
```

{{< hint info >}}
**Note:**
Context Imprint mode **requires** associated context for encryption and decryption.
For the highest level of security, use a different context for each data piece.
{{< /hint >}}

You can decrypt the data back using the `decrypt` method:

```javascript
secureCellContextImprintDecrypt64(key64, encrypted64, context)
  .then((decrypted) => {
    console.log("Decrypted with context imprint:", decrypted)
  })
  .catch((error: any) => {
    console.log(error)
  })

```

{{< hint warning >}}
**Warning:**
In Context Imprint mode, Secure Cell cannot validate correctness of the decrypted data.
If an incorrect secret or context is used, or if the data has been corrupted,
Secure Cell will return garbage output without throwing an exception.
{{< /hint >}}

Make sure to initialise the Secure Cell with the same secret
and provide the same associated context as used for encryption.
You should also do some sanity checks after decryption.

---

## Secure Message

[**Secure Message**](/themis/crypto-theory/cryptosystems/secure-message/)
is a lightweight container
that can help deliver some message or data to your peer in a secure manner.
It provides a sequence-independent, stateless, contextless messaging system.
This may be preferred in cases that don't require frequent sequential message exchange
and/or in low-bandwidth contexts.

Secure Message is secure enough to exchange messages from time to time,
but if you'd like to have [_perfect forward secrecy_](https://en.wikipedia.org/wiki/Forward_secrecy)
and higher security guarantees,
consider using [Secure Session](#secure-session) instead.

Secure Message offers two modes of operation:

  - In [**Sign–Verify mode**](#signature-mode),
    the message is signed by the sender using their private key,
    then it is verified by the recipient using the sender's public key.

    The message is packed in a suitable container and signed with an appropriate algorithm,
    based on the provided keypair type.
    Note that the message is _not encrypted_ in this mode.

  - In [**Encrypt–Decrypt mode**](#encryption-mode),
    the message will be additionally encrypted
    with an intermediate symmetric key using [Secure Cell](#secure-cell) in Seal mode.

    The intermediate key is generated in such way that only the recipient can recover it.
    The sender needs to provide their own private key
    and the public key of the intended recipient.
    Correspondingly, to get access to the message content,
    the recipient will need to use their private key
    along with the public key of the expected sender.

Read more about
[Secure Message cryptosystem design](/themis/crypto-theory/cryptosystems/secure-message/)
to understand better the underlying considerations, limitations, and features of each mode.

<!-- TODO: uncomment this when API docs are hosted there (T1682)
See [full API reference here](/themis/api/nodejs/latest/secure_message/).
-->

### Signature mode

[**Signature mode**](/themis/crypto-theory/cryptosystems/secure-message/#signed-messages)
only adds cryptographic signatures over the messages,
enough for anyone to authenticate them and prevent tampering
but without additional confidentiality guarantees.

To begin, the sender needs to generate an [asymmetric keypair](#asymmetric-keypairs).
The private key stays with the sender and the public key should be published.
Any recipient with the public key will be able to verify messages
signed by the sender which owns the corresponding private key.

The **sender** initialises Secure Message using only their private key:

```javascript
import {
  keyPair64,
  secureMessageSign64,
  secureMessageVerify64,
  secureMessageEncrypt64,
  secureMessageDecrypt64,
  KEYTYPE_EC,
  KEYTYPE_RSA
} from 'react-native-themis'

keyPair64(KEYTYPE_EC) //  KEYTYPE_RSA
  .then((pair: any) => {
    console.log("pair private", pair.private64)
    console.log("pair public", pair.public64)
  });

```

Messages can be signed using the `secureMessageSign64` function:

```javascript
secureMessageSign64(plaintext, pair.private64, "")
  .then((signed64: any) => {
    console.log(signed64)
  })
  .catch((error: any) => {
    console.log(error)
  })
```

To verify messages, the **recipient** first has to obtain the sender's public key. The public key is used to initialise Secure Message for verification. Now the receipent may verify messages signed by the sender using the `verify` method:

```javascript
secureMessageVerify64(signed64, "", pair.public64)
  .then((verified) => {
    console.log(verified);
  })
  .catch((error: any) => {
    console.log(error)
  })
```

Secure Message will reject a promise if the message has been modified since the sender signed it, or if the message has been signed by someone else, not the expected sender.

### Encryption mode

[**Encryption mode**](/themis/crypto-theory/cryptosystems/secure-message/#encrypted-messages)
not only certifies the integrity and authenticity of the message,
it also guarantees its confidentialty.
That is, only the intended recipient is able to read the encrypted message,
as well as to verify that it has been signed by the expected sender and arrived intact.

For this mode, both the sender and the recipient—let's call them
Alice and Bob—each need to generate an [asymmetric keypair](#symmetric-keypairs) of their own,
and then send their public keys to the other party.

{{< hint info >}}
**Note:**
Be sure to authenticate the public keys you receive to prevent Man-in-the-Middle attacks.
You can find [key management guidelines here](/themis/crypto-theory/key-management/).
{{< /hint >}}

**Alice** encrypts Secure Message with her private key and Bob's public key.

```javascript
const aliceKeyPair = await keyPair64(KEYTYPE_RSA); // or KEYTYPE_EC 
const encrypted64  = await secureMessageEncrypt64(plaintext, aliceKeyPair.private64, bobKeyPair.public64);
console.log("Encrypted secure message:", encrypted64); 
```

**Bob** decrypts Secure Message with his private key and Alice's public key. 

```javascript
const bobKeyPair  = await keyPair64(KEYTYPE_RSA); // must be the same type
const decrypted = await secureMessageDecrypt64(encrypted64, bobKeyPair.private64, aliceKeyPair.public64);
console.log("Decrypted secure message:", decrypted)
```

Bob's Secure Message will reject a promise
if the message has been modified since Alice encrypted it;
or if the message was encrypted by Carol, not by Alice;
or if the message was actually encrypted by Alice but *for Carol* instead, not for Bob.

---

## Secure Session

Secure session is not ready for React Native. 

## Secure Comparator

[**Secure Comparator**](/themis/crypto-theory/cryptosystems/secure-comparator/)
is an interactive protocol for two parties that compares whether they share the same secret or not.
It is built around a [_Zero-Knowledge Proof_][ZKP]-based protocol
([Socialist Millionaire's Protocol][SMP]),
with a number of [security enhancements][paper].

[ZKP]: https://www.cossacklabs.com/blog/zero-knowledge-protocols-without-magic/
[SMP]: https://en.wikipedia.org/wiki/Socialist_millionaire_problem
[paper]: https://www.cossacklabs.com/files/secure-comparator-paper-rev12.pdf

Secure Comparator is transport-agnostic.
That is, the implementation handles all intricacies of the protocol,
but the application has to supply networking capabilities to exchange the messages.

Read more about
[Secure Comparator cryptosystem design](/themis/crypto-theory/cryptosystems/secure-comparator/)
to understand better the underlying considerations,
get an overview of the protocol, etc.

<!-- TODO: uncomment this when API docs are hosted there (T1682)
See [full API reference here](/themis/api/nodejs/latest/secure_comparator/).
-->

### Comparing secrets

Secure Comparator has two parties called “client” and “server” for the sake of simplicity,
but the only difference between the two is in who initiates the comparison.

Both parties start by initialising Secure Comparator with the secret they need to compare:

```javascript
import {
  string64,
  comparatorInit64,
  comparatorBegin,
  comparatorProceed64,
  COMPARATOR_NOT_READY,
  COMPARATOR_NOT_MATCH,
  COMPARATOR_MATCH,
  COMPARATOR_ERROR
} from 'react-native-themis'

const lorem64 = string64(lorem);
const server = await comparatorInit64(lorem64);
```

```javascript
const lorem64 = string64(lorem);
const client = await comparatorInit64(lorem64);
```

The client initiates the protocol and sends the message to the server:

```javascript
const message64 = await comparatorBegin(client);
sendToPeer(message64)
```

Now, each peer waits for a message from the other one,
passes it to Secure Comparator, and gets a response that needs to be sent back.
This should repeat until the comparison is complete:

```javascript
for (;;) {
  const message64 = receiveFromPeer()
  const serverResult = await comparatorProceed64(server, message64)
  const status = serverResult.status 
  const reply64 = serverResult.data64
  if (status === COMPARATOR_NOT_READY) {
    sendToPeer(reply64)
    continue
  } 
}
```

Once the comparison is complete, you can get the results (on each side):

```javascript
if (status === COMPARATOR_MATCH) {
  // password is matched 
}
```

Secure Comparator performs consistency checks on the protocol messages
and will return `COMPARATOR_ERROR` as `status` if they were corrupted.
But if the other party fails to demonstrate that it has a matching secret, Secure Comparator will only return a negative result `COMPARATOR_NOT_MATCH`.

