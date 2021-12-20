---
weight: 5
title: ObjC features
---

# Features of ObjCThemis

After you have [installed ObjCThemis](../installation/),
it is ready to use in your application!

## Using Themis

In order to use ObjCThemis, you need to import it:

```objc
@import themis;
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

```objc
// Use TSKeyGenAsymmetricAlgorithmRSA to generate RSA keys instead
TSKeyGen *keypair =
    [[TSKeyGen alloc] initWithAlgorithm:TSKeyGenAsymmetricAlgorithmEC];

NSData *privateKey = keypair.privateKey;
NSData *publicKey = keypair.publicKey;
```

### Symmetric keys

Themis uses highly efficient and secure AES algorithm for symmetric cryptography.
A symmetric key is necessary for [Secure Cell](#secure-cell) objects.

{{< hint warning >}}
**Warning:**
When handling symmetric keys of your users, make sure the keys are sufficiently protected.
You can find [key management guidelines here](/themis/crypto-theory/key-management/).
{{< /hint >}}

To generate symmetric keys, use:

```objc
NSData *masterKey = TSGenerateSymmetricKey()
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

<!-- TODO: uncomment this when API docs are hosted there (T1682)
See [full API reference here](/themis/api/objc/latest/secure_cell/).
-->

### Seal mode

[**Seal mode**](/themis/crypto-theory/cryptosystems/secure-cell/#seal-mode)
is the most secure and easy to use mode of Secure Cell.
This should be your default choice unless you need specific features of the other modes.

Initialise a Secure Cell with a secret of your choice to start using it.
Seal mode supports [symmetric keys](#symmetric-keys) and passphrases.

{{< hint info >}}
Each secret type has its pros and cons.
Read about [Key derivation functions](/themis/crypto-theory/cryptosystems/secure-cell/#key-derivation-functions) to learn more.
{{< /hint >}}

```objc
NSData *symmetricKey = TSGenerateSymmetricKey();
TSCellSeal *cell = [[TSCellSeal alloc] initWithKey:symmetricKey];

// OR

TSCellSeal *cell = [[TSCellSeal alloc] initWithPassphrase:@"a password"];
```

Now you can encrypt your data using the `encrypt` method:

```objc
NSData *plaintext = ...;
NSData *context = ...;

NSData *encrypted = [cell encrypt:plaintext context:context];
```

The _associated context_ argument is optional and can be omitted.

Seal mode produces encrypted cells that are slightly longer than the input:

```objc
assert(encrypted.length > plaintext.length);
```

You can decrypt the data back using the `decrypt` method:

```objc
NSError *error;
NSData *decrypted = [cell decrypt:encrypted
                          context:context
                            error:&error];
if (error) {
    // handle decryption failure
}
```

Make sure to initialise the Secure Cell with the same secret
and provide the same associated context as used for encryption.
Secure Cell will return an error if those are incorrect or if the encrypted data was corrupted.

### Token Protect mode

[**Token Protect mode**](/themis/crypto-theory/cryptosystems/secure-cell/#token-protect-mode)
should be used if you cannot allow the length of the encrypted data to grow
but have additional storage available elsewhere for the authentication token.
Other than that,
Token Protect mode has the same security properties as the Seal mode.

Initialise a Secure Cell with a secret of your choice to start using it.
Token Protect mode supports only [symmetric keys](#symmetric-keys).

```objc
NSData *symmetricKey = TSGenerateSymmetricKey();

TSCellToken *cell = [[TSCellToken alloc] initWithKey:symmetricKey];
```

Now you can encrypt the data using the `encrypt` method:

```objc
NSData *plaintext = ...;
NSData *context = ...;

TSCellTokenEncryptedResult *result = [cell encrypt:plaintext
                                           context:context];
NSData *encrypted = result.encrypted;
NSData *authToken = result.token;
```

The _associated context_ argument is optional and can be omitted.

Token Protect mode produces encrypted text and authentication token separately.
Encrypted data has the same length as the input:

```objc
assert(encrypted.length == plaintext.length);
```

You need to save both the encrypted data and the token, they are necessary for decryption.
Use the `decrypt` method for that:

```objc
NSError *error;
NSData *decrypted = [cell decrypt:encrypted
                            token:authToken
                          context:context
                            error:&error];
if (error) {
    // handle decryption failure
}
```

Make sure to initialise the Secure Cell with the same secret
and provide the same associated context as used for encryption.
Secure Cell will return an error if those are incorrect
or if the data or the authentication token was corrupted.

### Context Imprint mode

[**Context Imprint mode**](/themis/crypto-theory/cryptosystems/secure-cell/#context-imprint-mode)
should be used if you absolutely cannot allow the length of the encrypted data to grow.
This mode is a bit harder to use than the Seal and Token Protect modes.
Context Imprint mode also provides slightly weaker integrity guarantees.

Initialise a Secure Cell with a secret of your choice to start using it.
Context Imprint mode supports only [symmetric keys](#symmetric-keys).

```objc
NSData *symmetricKey = TSGenerateSymmetricKey();

TSCellContextImprint *cell =
    [[TSCellContextImprint alloc] initWithKey:symmetricKey];
```

Now you can encrypt the data using the `encrypt` method:

```objc
NSData *plaintext = ...;
NSData *context = ...;

NSData *encrypted = [cell encrypt:plaintext context:context];
```

{{< hint info >}}
**Note:**
Context Imprint mode **requires** associated context for encryption and decryption.
For the highest level of security, use a different context for each data piece.
{{< /hint >}}

Context Imprint mode produces encrypted text of the same size as the input:

```objc
assert(encrypted.length == plaintext.length);
```

You can decrypt the data back using the `decrypt` method:

```objc
NSData *decrypted = [cell decrypt:encrypted context:context];
if (!correct(decrypted)) {
    // handle decryption failure
}
```

{{< hint warning >}}
**Warning:**
In Context Imprint mode, Secure Cell cannot validate correctness of the decrypted data.
If an incorrect secret or context is used, or if the data has been corrupted,
Secure Cell will return garbage output without returning an error.
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
See [full API reference here](/themis/api/objc/latest/secure_message/).
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

The **sender** initialises Secure Message using their private key:

```objc
TSKeyGen *keypair =
    [[TSKeyGen alloc] initWithAlgorithm:TSKeyGenAsymmetricAlgorithmEC];
NSData *privateKey = keypair.privateKey;
NSData *publicKey = keypair.publicKey;

TSMessage *secureMessage =
    [[TSMessage alloc] initInSignVerifyModeWithPrivateKey:privateKey
                                            peerPublicKey:nil];
```

Messages can be signed using the `wrapData` method:

```objc
NSData *message = ...;

NSError *error;
NSData *signedMessage = [secureMessage wrapData:message error:&error];
```

To verify messages, the **recipient** first has to obtain the sender's public key.
Secure Message should be initialised using only the public key:

```objc
NSData *peerPublicKey = ...;

TSMessage *secureMessage =
    [[TSMessage alloc] initInSignVerifyModeWithPrivateKey:nil
                                            peerPublicKey:peerPublicKey];
```

Now the receipent may verify messages signed by the sender using the `unwrapData` method:

```objc
NSError *error;
NSData *verifiedMessage = [secureMessage unwrapData:signedMessage
                                              error:&error];
if (error) {
    // handle verification error
}
```

Secure Message will return an error if the message has been modified since the sender signed it,
or if the message has been signed by someone else, not the expected sender.

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

**Alice** initialises Secure Message with her private key and Bob's public key:

```objc
TSKeyGen *aliceKeypair =
    [[TSKeyGen alloc] initWithAlgorithm:TSKeyGenAsymmetricAlgorithmEC];
NSData *alicePrivateKey = aliceKeypair.privateKey;
NSData *bobPublicKey = ...; // received securely

TSMessage *aliceSecureMessage =
    [[TSMessage alloc] initInEncryptModeWithPrivateKey:alicePrivateKey
                                         peerPublicKey:bobPublicKey];
```

Now Alice can encrypt messages for Bob using the `wrapData` method:

```objc
NSData *message = ...;

NSError *error;
NSData *encryptedMessage = [secureMessage wrapData:message error:&error];
```

**Bob** initialises Secure Message with his private key and Alice's public key:

```objc
TSKeyGen *bobKeypair =
    [[TSKeyGen alloc] initWithAlgorithm:TSKeyGenAsymmetricAlgorithmEC];
NSData *bobPrivateKey = bobKeypair.privateKey;
NSData *alicePublicKey = ...; // received securely

TSMessage *bobSecureMessage =
    [[TSMessage alloc] initInEncryptModeWithPrivateKey:bobPrivateKey
                                         peerPublicKey:alicePublicKey];
```

With this, Bob is able to decrypt messages received from Alice
using the `unwrapData` method:

```objc
NSError *error;
NSData *decryptedMessage = [bobSecureMessage unwrapData:encryptedMessage
                                                  error:&error];
if (error) {
    // handle decryption error
}
```

Bob's Secure Message will return an error
if the message has been modified since Alice encrypted it;
or if the message was encrypted by Carol, not by Alice;
or if the message was actually encrypted by Alice but *for Carol* instead, not for Bob.

---

## Secure Session

[**Secure Session**](/themis/crypto-theory/cryptosystems/secure-session/)
is a lightweight protocol for securing any kind of network communication,
on both private and public networks, including the Internet.
It operates on the 5th layer of the network OSI model (the session layer).

Secure Session provides a stateful, sequence-dependent messaging system.
This approach is suitable for protecting long-lived peer-to-peer message exchanges
where the secure data exchange is tied to a specific session context.

Communication over Secure Session consists of two stages:

  - **Session negotiation** (key agreement),
    during which the peers exchange their cryptographic material and authenticate each other.
    After a successful mutual authentication,
    each peer derives a session-shared secret and other auxiliary data
    (session ID, sequence numbers, etc.)

  - **Actual data exchange**,
    when the peers securely exchange data provided by higher-layer application protocols.

<!-- (Actually, it *does* support both, but the callback API is broken.)

Secure Session supports two operation modes:

  - [**Buffer-aware API**](#buffer-aware-api)
    in which encrypted messages are handled explicitly, with data buffers you provide.
  - [**Callback-oriented API**](#callback-oriented-api)
    in which Secure Session handles buffer allocation implicitly
    and uses callbacks to notify about incoming messages or request sending outgoing messages.
 -->

Read more about
[Secure Session cryptosystem design](/themis/crypto-theory/cryptosystems/secure-session/)
to understand better the underlying considerations,
get an overview of the protocol and its features,
etc.

<!-- TODO: uncomment this when API docs are hosted there (T1682)
See [full API reference here](/themis/api/objc/latest/secure_session/).
-->

### Setting up Secure Session

Secure Session has two parties called “client” and “server” for the sake of simplicity,
but they could be more precisely called “initiator” and “acceptor” –
the only difference between the two is in who starts the communication.
After the session is established, either party can send messages to their peer whenever it wishes to.

{{< hint info >}}
Take a look at code samples in the [`docs/examples/objc`](https://github.com/cossacklabs/themis/tree/master/docs/examples/objc)
directory on GitHub.
There you can find examples of Secure Session setup and usage in all modes.
{{< /hint >}}

First, both parties have to generate [asymmetric keypairs](#asymmetric-keypairs)
and exchange their public keys.
The private keys should never be shared with anyone else.
{{< hint info >}}
**Note:**
Secure Session only supports EC keys. RSA support is available per request only.
{{< /hint >}}

Each party should also choose a unique *peer ID* –
arbitrary byte sequence identifying their public key.
Read more about peer IDs in [Secure Session cryptosystem overview](/themis/crypto-theory/cryptosystems/secure-session/#peer-ids-and-keys).
The peer IDs need to be exchanged along with the public keys.

To identify peers, Secure Session uses a **callback interface**.
It calls the `publicKeyFor:error:` method to locate a public key associated with presented peer ID.
Typically, each peer keeps some sort of a database of known public keys
and fulfills Secure Session requests from that database.

```objc
@interface SessionCallbacks : TSSessionTransportInterface
@end

@implementation SessionCallbacks

- (NSData *)publicKeyFor:(NSData *)peerID error:(NSError **)error
{
    // Retrieve public key for peer "id" from the trusted storage.
    if (!found) {
        return nil;
    }
    return publicKey;
}

@end
```

Each peer initialises Secure Session with their ID, their private key,
and an instance of the callback interface:

```objc
NSData *peerID = ...;
NSData *privateKey = ...;

SessionCallbacks *callbacks = [[SessionCallbacks alloc] ...];

TSSession *session = [[TSSession alloc] initWithUserId:peerID
                                            privateKey:privateKey
                                             callbacks:callbacks];
```

{{< hint info >}}
**Note:**
The same callback interface may be shared by multiple Secure Session instances,
provided it is correctly synchronised.
Read more about [thread safety of Secure Session](/themis/debugging/thread-safety/#shared-secure-session-transport-objects).
{{< /hint >}}

<!-- (The interface exists, but it's currently unusable.)

#### Transport callbacks

If you wish to use the **callback-oriented API** of Secure Session,
you have to implement two additional methods of the callback interface:

```objc
@implementation TransportCallbacks

- (void)sendData:(nullable NSData *)data error:(NSError *__autoreleasing *)error
{
    // Send "data" to the peer over the network.
    // Return an error if that fails.
}

- (nullable NSData *)receiveDataWithError:(NSError *__autoreleasing *)error
{
    // Receive a message for peer and return it.
    // Return an error if that fails.
}

- (NSData *)publicKeyFor:(NSData *)peerID error:(NSError **)error
{
    // Implement this required method as well.
}

@end
```

{{< hint warning >}}
**Warning:**
In send–receive mode, each Secure Session needs its own instance of transport callback interface.
The same instance cannot be shared by multiple sessions.
Read more about [thread safety of Secure Session](/themis/debugging/thread-safety/#shared-secure-session-transport-objects).
{{< /hint >}}

-->

### Using Secure Session

ObjCThemis supports only
[**buffer-aware API**](/themis/crypto-theory/cryptosystems/secure-session/#buffer-aware-api)
(aka *wrap–unwrap* mode).
It is easy to integrate into existing applications with established network processing path.

{{< hint info >}}
**Note:**
Support for [callback-oriented API](/themis/crypto-theory/cryptosystems/secure-session/#callback-oriented-api)
in ObjCThemis is currently in development.
If you find that it might be a good fit for your use case,
please [let us know](mailto:dev@cossacklabs.com).
{{< /hint >}}

#### Establishing connection

The client initiates the connection and sends the first request to the server:

```objc
NSError *error;
NSData *negotiationMessage = [session connectRequest:&error];

[self sendToPeer:negotiationMessage];
```

Then both parties communicate to negotiate the keys and other details
until the connection is established:

```objc
for (;;) {
    NSData *request = [self receiveFromPeer];
    NSError *error;
    NSData *reply = [session unwrapData:request error:&error];
    if ([session isSessionEstablished]) {
        break;
    }
    [self sendToPeer:reply];
}
```

#### Exchanging messages

After the session is established,
the parties can proceed with actual message exchange.
At this point the client and the server are equal peers –
they can both send and receive messages independently, in a duplex manner.

In buffer-aware API, the messages are wrapped into Secure Session protocol and sent separately:

```objc
NSData *message = ...;

NSError *error;
NSData *encryptedMessage = [session wrapData:message error:&error];

[self sendToPeer:encryptedMessage];
```

You can wrap multiple messages before sending them out.
Encrypted messages are independent.

{{< hint info >}}
**Note:**
Secure Session allows occasional message loss,
slight degree of out-of-order delivery, and some duplication.
However, it is still a sequence-dependent protocol.
Do your best to avoid interrupting the message stream.
{{< /hint >}}

After receiving an encrypted message, you need to unwrap it:

```objc
NSData *encryptedMessage = [self receiveFromPeer];

NSError *error;
NSData *decryptedMessage = [session unwrapData:encryptedMessage
                                         error:&error];
if (error) {
    // handle corrupted messages
}
```

Secure Session ensures message integrity and will return an error
if the message has been modified in-flight.
It will also detect and report protocol anomalies,
such as unexpected messages, outdated messages, etc.

<!-- (The interface exists, but it's currently unusable.)

### Callback-oriented API

[**Callback-oriented API**](/themis/crypto-theory/cryptosystems/secure-session/#callback-oriented-api)
(aka *send–receive* mode)
uses Secure Session as a framework for network communication, handling data buffers implicitly.
It allows for simpler messaging code at an expense of more complex setup code.

{{< hint info >}}
**Note:**
Remember to [configure transport callbacks](#transport-callbacks) for Secure Session,
they are required to use the callback-oriented API.
{{< /hint >}}

#### Establishing connection

The client initiates the connection and sends the first request to the server:

```objc
NSError *error;
[session connect:&error];
```

Then both parties communicate to negotiate the keys and other details
until the connection is established:

```objc
for (;;) {
    NSError *error;
    NSData *reply = [session unwrapAndReceive:4096 error:&error];
    if ([session isSessionEstablished]) {
        break;
    }
}
```

Note that actual networking happens implicitly, within the Secure Session object
which calls appropriate transport callbacks to send and receive data over the network.

#### Exchanging messages

After the session is established,
the parties can proceed with actual message exchange.
At this point the client and the server are equal peers –
they can both send and receive messages independently, in a duplex manner.

Send messages as if the Secure Session were a network socket,
using the `wrapAndSend` method:

```objc
NSData *message = ...;

NSError *error;
[session wrapAndSend:message error:&error];
```

Secure Session encrypts the message, wraps it into the protocol,
and synchronously calls the `sendData` transport callback to ship the message out.
Networking errors are reported by throwing appropriate exceptions.

The receiving side uses the `unwrapAndReceive` method to receive messages:

```cpp
NSError *error;
NSUInteger length = 4096; // max message length
NSData *message = [session unwrapAndReceive:length error:&error];
if (error) {
    // handle corrupted messages
}
```

Secure Session synchronously calls the `receiveDataWithError` transport callback
to wait for the next message, then unwraps and decrypts it,
and returns already decrypted message to the application.

Secure Session ensures message integrity and will return an error
if the message has been modified in-flight.
It will also detect and report protocol anomalies,
such as unexpected messages, outdated messages, etc.

-->

---

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
See [full API reference here](/themis/api/objc/latest/secure_comparator/).
-->

### Comparing secrets

Secure Comparator has two parties called “client” and “server” for the sake of simplicity,
but the only difference between the two is in who initiates the comparison.

Both parties start by initialising Secure Comparator with the secret they need to compare:

```objc
NSData *sharedSecret = ...;

TSComparator *comparison =
    [[TSComparator alloc] initWithMessageToCompare:sharedSecret];
```

The client initiates the protocol and sends the message to the server:

```objc
NSError *error;
NSData *message = [comparison beginCompare:&error];

[self sendToPeer:message];
```

Now, each peer waits for a message from the other one,
passes it to Secure Comparator, and gets a response that needs to be sent back.
The comparison is complete when the response is empty:

```objc
NSError *error;
for (;;) {
    NSData *message = [self receiveFromPeer];
    NSData *response = [comparison proceedCompare:message error:&error];
    if (error) {
        // handle protocol error
    }
    if ([comparison status] != TSComparatorNotReady) {
        // Comparison complete!
        break;
    }
    [self sendToPeer:response];
}
```

Once the comparison is complete, you can get the results (on each side):

```objc
if ([comparison status] == TSComparatorMatch) {
    // shared secrets match
}
```

Secure Comparator performs consistency checks on the protocol messages
and will return an error if they were corrupted.
But if the other party fails to demonstrate that it has a matching secret,
Secure Comparator will only return a negative result.
