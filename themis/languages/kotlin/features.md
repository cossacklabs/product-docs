---
weight: 5
title:  Features
---

# Features of JavaThemis

After you have installed JavaThemis
(for [Android](../installation-android/) or [desktop](../installation-desktop/) development),
it is ready to use in your application!

## Using Themis

In order to use JavaThemis,
you need to import classes for relevant cryptosystems:

```kotlin
import com.cossacklabs.themis.*
```

## Key generation

### Asymmetric keypairs

Themis supports both Elliptic Curve and RSA algorithms for asymmetric cryptography.
Algorithm type is chosen according to the generated key type.
Asymmetric keys are used by [Secure Message](#secure-message)
and [Secure Session](#secure-session) objects.

For learning purposes,
you can play with [Themis Interactive Simulator](/themis/debugging/themis-server/)
to use the keys and simulate the whole client-server communication.

{{< hint warning >}}
**Warning:**
When using public keys of other peers, make sure they come from trusted sources
to prevent Man-in-the-Middle attacks.

When handling private keys of your users, make sure the keys are sufficiently protected.
You can find [key management guidelines here](/themis/crypto-theory/key-management/).
{{< /hint >}}

To generate asymmetric keypairs, use:

```kotlin
import com.cossacklabs.themis.AsymmetricKey
import com.cossacklabs.themis.KeypairGenerator

// EC keys are used by default. Use AsymmetricKey constants to explicitly
// specify key type: AsymmetricKey.KEYTYPE_EC or or AsymmetricKey.KEYTYPE_RSA.
val keypair = KeypairGenerator.generateKeypair()
val privateKey = keypair.privateKey
val publicKey = keypair.publicKey
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

```kotlin
import com.cossacklabs.themis.SymmetricKey

val masterKey = SymmetricKey()
```

## Secure Cell

[**Secure Сell**](/themis/crypto-theory/crypto-systems/secure-cell/)
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

    [KDF]: /themis/crypto-theory/crypto-systems/secure-cell/#key-derivation-functions

Secure Cell supports 3 operation modes:

  - **[Seal mode](#seal-mode)** is the most secure and easy to use.
    Your best choice most of the time.
    This is also the only mode that supports passphrases at the moment.

  - **[Token Protect mode](#token-protect-mode)** is just as secure, but a bit harder to use.
    This is your choice if you need to keep authentication data separate.

  - **[Context Imprint mode](#context-imprint-mode)** is a length-preserving version of Secure Cell
    with no additional data stored. Should be used carefully.

Read more about
[Secure Cell cryptosystem design](/themis/crypto-theory/crypto-systems/secure-cell/)
to understand better the underlying considerations, limitations, and features of each mode.

<!-- TODO: uncomment this when API docs are hosted there (T1682)
See [full API reference here](/themis/api/kotlin/latest/secure_cell/).
-->

### Seal mode

[**Seal mode**](/themis/crypto-theory/crypto-systems/secure-cell/#seal-mode)
is the most secure and easy to use mode of Secure Cell.
This should be your default choice unless you need specific features of the other modes.

Initialise a Secure Cell with a secret of your choice to start using it.
Seal mode supports [symmetric keys](#symmetric-keys) and passphrases.

{{< hint info >}}
Each secret type has its pros and cons.
Read about [Key derivation functions](/themis/crypto-theory/crypto-systems/secure-cell/#key-derivation-functions) to learn more.
{{< /hint >}}

```kotlin
import com.cossacklabs.themis.SecureCell
import com.cossacklabs.themis.SymmetricKey

val symmetricKey = SymmetricKey()
val cell = SecureCell.SealWithKey(symmetricKey)

// OR

val cell = SecureCell.SealWithPassphrase("a password")
```

Now you can encrypt your data using the `encrypt` method:

```kotlin
ByteArray plaintext = ...
ByteArray context = ...

ByteArray encrypted = cell.encrypt(plaintext, context)
```

The _associated context_ argument is optional and can be omitted.

Seal mode produces encrypted cells that are slightly bigger than the input:

```kotlin
assert(encrypted.length > plaintext.length)
```

You can decrypt the data back using the `decrypt` method:

```kotlin
import com.cossacklabs.themis.SecureCellException

try {
    ByteArray decrypted = cell.decrypt(encrypted, context)
    // process decrypted data
}
catch (e: SecureCellException) {
    // handle decryption failure
}
```

Make sure to initialise the Secure Cell with the same secret
and provide the same associated context as used for encryption.
Secure Cell will throw an exception if those are incorrect or if the encrypted data was corrupted.

### Token Protect mode

[**Token Protect mode**](/themis/crypto-theory/crypto-systems/secure-cell/#token-protect-mode)
should be used if you cannot allow the length of the encrypted data to grow
but have additional storage available elsewhere for the authentication token.
Other than that,
Token Protect mode has the same security properties as the Seal mode.

Initialise a Secure Cell with a secret of your choice to start using it.
Token Protect mode supports only [symmetric keys](#symmetric-keys).

```kotlin
import com.cossacklabs.themis.SecureCell
import com.cossacklabs.themis.SymmetricKey

val symmetricKey = SymmetricKey()

val cell = SecureCell.TokenProtectWithKey(symmetricKey)
```

Now you can encrypt the data using the `encrypt` method:

```kotlin
ByteArray plaintext = ...
ByteArray context = ...

val (encrypted, authToken) = cell.encrypt(plaintext, context)
```

The _associated context_ argument is optional and can be omitted.

Token Protect mode produces encrypted text and authentication token separately.
Encrypted data has the same size as the input:

```kotlin
assert(encrypted.length == plaintext.length)
```

You need to save both the encrypted data and the token, they are necessary for decryption.
Use the `decrypt` method for that:

```kotlin
import com.cossacklabs.themis.SecureCellException

try {
    ByteArray decrypted = cell.decrypt(encrypted, authToken, context)
    // process decrypted data
}
catch (e: SecureCellException) {
    // handle decryption failure
}
```

Make sure to initialise the Secure Cell with the same secret
and provide the same associated context as used for encryption.
Secure Cell will throw an exception if those are incorrect
or if the data or the authentication token was corrupted.

### Context Imprint mode

[**Context Imprint mode**](/themis/crypto-theory/crypto-systems/secure-cell/#context-imprint-mode)
should be used if you absolutely cannot allow the length of the encrypted data to grow.
This mode is a bit harder to use than the Seal and Token Protect modes.
Context Imprint mode also provides slightly weaker integrity guarantees.

Initialise a Secure Cell with a secret of your choice to start using it.
Context Imprint mode supports only [symmetric keys](#symmetric-keys).

```kotlin
import com.cossacklabs.themis.SecureCell
import com.cossacklabs.themis.SymmetricKey

val symmetricKey = SymmetricKey()

val cell = SecureCell.ContextImprintWithKey(symmetricKey)
```

Now you can encrypt the data using the `encrypt` method:

```kotlin
ByteArray plaintext = ...
ByteArray context = ...

ByteArray encrypted = cell.encrypt(plaintext, context)
```

{{< hint info >}}
**Note:**
Context Imprint mode **requires** associated context for encryption and decryption.
For the highest level of security, use a different context for each data piece.
{{< /hint >}}

Context Imprint mode produces encrypted text of the same size as the input:

```kotlin
assert(encrypted.length == plaintext.length)
```

You can decrypt the data back using the `decrypt` method:

```kotlin
ByteArray decrypted = cell.decrypt(encrypted, context)
if (!correct(decrypted)) {
    // handle decryption failure
}
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

## Secure Message

[**Secure Message**](/themis/crypto-theory/crypto-systems/secure-message/)
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
[Secure Message cryptosystem design](/themis/crypto-theory/crypto-systems/secure-message/)
to understand better the underlying considerations, limitations, and features of each mode.

<!-- TODO: uncomment this when API docs are hosted there (T1682)
See [full API reference here](/themis/api/kotlin/latest/secure_message/).
-->

### Signature mode

[**Signature mode**](/themis/crypto-theory/crypto-systems/secure-message/#signed-messages)
only adds cryptographic signatures over the messages,
enough for anyone to authenticate them and prevent tampering
but without additional confidentiality guarantees.

To begin, the sender needs to generate an [asymmetric keypair](#asymmetric-keypairs).
The private key stays with the sender and the public key should be published.
Any recipient with the public key will be able to verify messages
signed by the sender which owns the corresponding private key.

The **sender** initialises Secure Message using their private key:

```kotlin
import com.cossacklabs.themis.KeypairGenerator
import com.cossacklabs.themis.SecureMessage

val keypair = KeypairGenerator.generateKeypair()
// Publish "keypair.publicKey"

val secureMessage = SecureMessage(keypair.privateKey)
```

Messages can be signed using the `sign` method:

```kotlin
ByteArray message = ...

ByteArray signedMessage = secureMessage.sign(message)
```

To verify messages, the **recipient** first has to obtain the sender's public key.
Secure Message should be initialised using the public key:

```kotlin
import com.cossacklabs.themis.PublicKey

PublicKey peerPublicKey = ...

val secureMessage = SecureMessage(peerPublicKey)
```

Now the receipent may verify messages signed by the sender using the `verify` method:

```kotlin
import com.cossacklabs.themis.SecureMessageWrapException

try {
    ByteArray verifiedMessage = secureMessage.verify(signedMessage)
    // process verified data
}
catch (e: SecureMessageWrapException) {
    // handle verification failure
}
```

Secure Message will throw an exception if the message has been modified since the sender signed it,
or if the message has been signed by someone else, not the expected sender.

### Encryption mode

[**Encryption mode**](/themis/crypto-theory/crypto-systems/secure-message/#encrypted-messages)
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

```kotlin
import com.cossacklabs.themis.KeypairGenerator
import com.cossacklabs.themis.SecureMessage

val aliceKeypair = KeypairGenerator.generateKeypair()
val alicePrivateKey = aliceKeypair.privateKey
// Publish "aliceKeypair.publicKey"
val bobPublicKey = PublicKey(...) // received securely

val aliceSecureMessage = SecureMessage(alicePrivateKey, bobPublicKey)
```

Now Alice can encrypt messages for Bob using the `wrap` method:

```kotlin
ByteArray message = ...

ByteArray encryptedMessage = aliceSecureMessage.wrap(message)
```

**Bob** initialises Secure Message with his private key and Alice's public key:

```kotlin
val bobKeypair = KeypairGenerator.generateKeypair()
val bobPrivateKey = bobKeypair.privateKey
// Publish "bobKeypair.publicKey"
val alicePublicKey = PublicKey(...) // received securely

val bobSecureMessage = SecureMessage(bobPrivateKey, alicePublicKey)
```

With this, Bob is able to decrypt messages received from Alice
using the `unwrap` method:

```kotlin
import com.cossacklabs.themis.SecureMessageWrapException

try {
    ByteArray decryptedMessage = bobSecureMessage.unwrap(encryptedMessage)
    // process decryped data
}
catch (e: SecureMessageWrapException) {
    // handle decryption failure
}
```

Bob's Secure Message will throw an exception
if the message has been modified since Alice encrypted it;
or if the message was encrypted by Carol, not by Alice;
or if the message was actually encrypted by Alice but *for Carol* instead, not for Bob.

## Secure Session

[**Secure Session**](/themis/crypto-theory/crypto-systems/secure-session/)
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

Secure Session supports two operation modes:

  - [**Secure Socket**](#secure-socket-api)
    which adds Secure Session layer to exiting Java socket API.
  - [**Buffer-aware API**](#buffer-aware-api)
    in which encrypted messages are handled explicitly, with data buffers you provide.
<!-- (That's an alternative that exists, but does not work correctly now.)
  - [**Callback-oriented API**](#callback-oriented-api)
    in which Secure Session handles buffer allocation implicitly
    and uses callbacks to notify about incoming messages or request sending outgoing messages.
-->

Read more about
[Secure Session cryptosystem design](/themis/crypto-theory/crypto-systems/secure-session/)
to understand better the underlying considerations,
get an overview of the protocol and its features,
etc.

<!-- TODO: uncomment this when API docs are hosted there (T1682)
See [full API reference here](/themis/api/kotlin/latest/secure_session/).
-->

### Setting up Secure Session

Secure Session has two parties called “client” and “server” for the sake of simplicity,
but they could be more precisely called “initiator” and “acceptor” –
the only difference between the two is in who starts the communication.
After the session is established, either party can send messages to their peer whenever it wishes to.

{{< hint info >}}
Take a look at code samples in the [Java Examples](https://github.com/cossacklabs/themis-java-examples)
and [Secure Mobile WebSocket](https://github.com/cossacklabs/mobile-websocket-example)
repositories on GitHub.
There you can find examples of Secure Session setup and usage in all modes.
{{< /hint >}}

First, both parties have to generate [asymmetric keypairs](#asymmetric-keypairs)
and exchange their public keys.
The private keys should never be shared with anyone else.

Each party should also choose a unique *peer ID* –
arbitrary byte sequence identifying their public key.
Read more about peer IDs in [Secure Session cryptosystem overview](/themis/crypto-theory/crypto-systems/secure-session/#peer-ids-and-keys).
The peer IDs need to be exchanged along with the public keys.

To identify peers, Secure Session uses a **callback interface**.
It calls the `getPublicKeyForId` method to locate a public key associated with presented peer ID.
Typically, each peer keeps some sort of a database of known public keys
and fulfills Secure Session requests from that database.

```kotlin
import com.cossacklabs.themis.ISessionCallbacks
import com.cossacklabs.themis.PublicKey
import com.cossacklabs.themis.SecureSession

val sessionCallbacks: ISessionCallbacks = object : ISessionCallbacks {
    override fun getPublicKeyForId(session: SecureSession, id: ByteArray): PublicKey? {
        // Retrieve public key for peer "id" from the trusted storage.
        if (!found) {
            return null
        }
        return publicKey
    }

    override fun stateChanged(session: SecureSession) {
        // Informational callback method, it is called when Secure Session
        // changes state. Use it, for example, to update UI indication
        // based on session.state value.
    }
}
```

Each peer initialises Secure Session with their ID, their private key,
and an instance of the callback interface:

```kotlin
ByteArray peerID = ...
PrivateKey privateKey = ...

val session = SecureSession(peerID, privateKey, sessionCallbacks)
```

{{< hint info >}}
**Note:**
The same callback interface may be shared by multiple Secure Session instances,
provided it is correctly synchronised.
Read more about [thread safety of Secure Session](/themis/debugging/thread-safety/#shared-secure-session-transport-objects).
{{< /hint >}}

When you no longer need the session, close it using the `close` method:

```kotlin
session.close()
```

This frees up system resources associated with Secure Session.
You cannot use the session object after this call.

<!--
(This API exists, but it does not work correctly. Let's hide it for now.)

#### Transport callbacks

If you wish to use the **callback-oriented API** of Secure Session,
you have to implement two additional methods of the callback interface:

```kotlin
import com.cossacklabs.themis.ITransportSessionCallbacks

val transportCallbacks: ITransportSessionCallbacks = object : ITransportSessionCallbacks {
    override fun write(buffer: ByteArray) {
        // Send "buffer" to the peer over the network.
        // You may throw an exception if that fails.
    }

    override fun read(): ByteArray {
        // Receive a message for peer from the network.
        // Return a buffer with the data.
        // You may throw an exception if that fails.
    }

    // ITransportSessionCallbacks inherits from ISessionCallbacks,
    // so you have to implement two other methods as well.
}
```

{{< hint warning >}}
**Warning:**
In send–receive mode, each Secure Session needs its own instance of transport callback interface.
The same instance cannot be shared by multiple sessions.
Read more about [thread safety of Secure Session](/themis/debugging/thread-safety/#shared-secure-session-transport-objects).
{{< /hint >}}

You also have to construct a subclass of Secure Session to use the callback API:

```kotlin
import com.cossacklabs.themis.SecureTransportSession

ByteArray peerID = ...
PrivateKey privateKey = ...

val session = SecureTransportSession(peerID, privateKey, transportCallbacks)
```
-->

### Secure Socket API

If your application already uses Java sockets for communication,
you can easily make them more secure by using `SecureSocket` and `SecureServerSocket`.

{{< hint info >}}
**Note:**
Secure Socket protocol is currently exclusive to JavaThemis.
Please [send us an email](mailto:dev@cossacklabs.com)
if you need to support other platforms.
{{< /hint >}}

Instantiate client sockets like this:

```kotlin
import com.cossacklabs.themis.SecureSocket
import java.net.Socket

ByteArray clientID = ...
PrivateKey privateKey = ...
ISessionCallbacks sessionCallbacks = ...

val clientSocket = SecureSocket(clientID, privateKey, sessionCallbacks)
```

Server socket should be created like this:

```kotlin
import com.cossacklabs.themis.SecureServerSocket
import java.net.ServerSocket

ByteArray serverID = ...
PrivateKey privateKey = ...
ISessionCallbacks sessionCallbacks = ...

val serverSocket = SecureServerSocket(serverID, privateKey, sessionCallbacks)
```

Use Secure Sockets just like you would use regular Java sockets.

### Buffer-aware API

[**Buffer-aware API**](/themis/crypto-theory/crypto-systems/secure-session/#buffer-aware-api)
(aka *wrap–unwrap* mode)
is easier to integrate into existing application with established network processing path.
Here the application handles message buffers explicitly.

#### Establishing connection

The client initiates the connection and sends the first request to the server:

```kotlin
ByteArray connectionRequest = session.generateConnectRequest()

sendToServer(connectionRequest)
```

Then both parties communicate to negotiate the keys and other details
until the connection is established:

```kotlin
while (!session.isEstablished()) {
    ByteArray request = receiveFromPeer()
    val result = session.unwrap(request)
    if (result.dataType == SecureSession.SessionDataType.PROTOCOL_DATA) {
        // Negotiation continues...
        ByteArray reply = result.data
        sendToPeer(reply)
    }
}
```

#### Exchanging messages

After the session is established,
the parties can proceed with actual message exchange.
At this point the client and the server are equal peers –
they can both send and receive messages independently, in a duplex manner.

In buffer-aware API, the messages are wrapped into Secure Session protocol and sent separately:

```kotlin
ByteArray message = ...

ByteArray encryptedMessage = session.wrap(message)

sendToPeer(encryptedMessage)
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

```kotlin
ByteArray encryptedMessage = receiveFromPeer()

try {
    val decryptedMessage = session.unwrap(request).data
    // process a message
}
catch (e: SecureSessionException) {
    // handle corrupted messages
}
```

Secure Session ensures message integrity and will throw an exception
if the message has been modified in-flight.
It will also detect and report protocol anomalies,
such as unexpected messages, outdated messages, etc.

<!--
(This API exists, but it's currently broken so we hide this section.)

### Callback-oriented API

[**Callback-oriented API**](/themis/crypto-theory/crypto-systems/secure-session/#callback-oriented-api)
(aka *send–receive* mode)
uses Secure Session as a framework for network communication, handling data buffers implicitly.
It allows for simpler messaging code at an expense of more complex setup code.

{{< hint info >}}
**Note:**
Remember to [configure transport callbacks](#transport-callbacks) for Secure Session,
they are required to use the callback-oriented API.
{{< /hint >}}

#### Establishing connection

The client initiates the connection and sends the first request to the server.
Then they communicate to negotiate the keys and other details
until the connection is established:

```kotlin
clientSession.connect()
while (!clientSession.isEstablished()) {
    clientSession.read()
}
```

Conversely, the server accepts the connection request and communicates with the client
until the connection is established from the other side too:

```kotlin
while (!serverSession.isEstablished()) {
    serverSession.read()
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
using the `write` method:

```kotlin
ByteArray message = ...;

session.write(message)
```

Secure Session encrypts the message, wraps it into the protocol,
and synchronously calls the `write` transport callback to ship the message out.
Networking errors are reported by throwing appropriate exceptions.

The receiving side uses the `read` method to receive messages:

```kotlin
ByteArray message = session.read()
```

Secure Session synchronously calls the `read` transport callback
to wait for the next message, then unwraps and decrypts it,
and returns already decrypted message to the application.

Secure Session ensures message integrity and will throw an exception
if the message has been modified in-flight.
It will also detect and report protocol anomalies,
such as unexpected messages, outdated messages, etc.
-->

## Secure Comparator

[**Secure Comparator**](/themis/crypto-theory/crypto-systems/secure-comparator/)
is an interactive protocol for two parties that compares whether they share the same secret or not.
It is built around a [_Zero-Knowledge Proof_][ZKP]-based protocol
([Socialist Millionaire's Protocol][SMP]),
with a number of [security enhancements][paper].

[ZKP]: https://www.cossacklabs.com/zero-knowledge-protocols-without-magic.html
[SMP]: https://en.wikipedia.org/wiki/Socialist_millionaire_problem
[paper]: https://www.cossacklabs.com/files/secure-comparator-paper-rev12.pdf

Secure Comparator is transport-agnostic.
That is, the implementation handles all intricacies of the protocol,
but the application has to supply networking capabilities to exchange the messages.

Read more about
[Secure Comparator cryptosystem design](/themis/crypto-theory/crypto-systems/secure-comparator/)
to understand better the underlying considerations,
get an overview of the protocol, etc.

<!-- TODO: uncomment this when API docs are hosted there (T1682)
See [full API reference here](/themis/api/kotlin/latest/secure_comparator/).
-->

### Comparing secrets

Secure Comparator has two parties called “client” and “server” for the sake of simplicity,
but the only difference between the two is in who initiates the comparison.

Both parties start by initialising Secure Comparator with the secret they need to compare:

```kotlin
import com.cossacklabs.themis.SecureCompare

ByteArray sharedSecret = ...

val comparison = SecureCompare(sharedSecret)
```

The client initiates the protocol and prepares the first message:

```kotlin
var message: ByteArray = comparison.begin()
```

Now, each peer waits for a message from the other one,
passes it to Secure Comparator, and gets a response that needs to be sent back,
until the comparison is complete:

```kotlin
import com.cossacklabs.themis.SecureCompareException

try {
    while (comparison.result == SecureCompare.CompareResult.NOT_READY) {
        sendToPeer(message)
        message = receiveFromPeer()

        message = comparison.proceed(message)
    }
}
catch (e: SecureCompareException) {
    // handle protocol failure
}
```

Secure Comparator performs consistency checks on the protocol messages
and will throw an exception if they were corrupted.

Once the comparison is complete, you can get the results (on each side):

```kotlin
if (comparison.result == SecureCompare.CompareResult.MATCH) {
    // shared secrets match
}
```

If the other party fails to demonstrate that it has a matching secret,
Secure Comparator will return a `NO_MATCH` result.
