---
weight: 5
title:  Features
---

# Features of JavaThemis

<a id="importing-themis"></a>
## Using Themis

In order to use Themis, you need to import it.

Import Themis packages into your Java files:

```java
import com.cossacklabs.themis.*;
```

### Key generation

#### Asymmetric keypair generation

Themis supports both Elliptic Curve and RSA algorithms for asymmetric cryptography.
The algorithm type is chosen according to the generated key type.
Asymmetric keys are necessary for [Secure Message](/pages/secure-message-cryptosystem/) and [Secure Session](/pages/secure-session-cryptosystem/) objects.

For learning purposes, you can play with [Themis Interactive Simulator](/simulator/interactive/) to get the keys and simulate the whole client-server communication.

> ⚠️ **WARNING:**
> When you distribute private keys to your users, make sure the keys are sufficiently protected.
> You can find the guidelines [here](/pages/documentation-themis/#key-management).

> **NOTE:** When using public keys of other peers, make sure they come from trusted sources.

You can generate asymmetric keypairs the following way:

```java
// Generate EC keys by default. Use AsymmetricKey.KEYTYPE_EC
// or AsymmetricKey.KEYTYPE_RSA to specify the type explicitly.
Keypair pair = KeypairGenerator.generateKeypair();
PrivateKey privateKey = pair.getPrivateKey();
PublicKey publicKey = pair.getPublicKey();
```

#### Symmetric key generation

Themis uses highly efficient and secure AES algorithm for symmetric cryptography.
A symmetric key is necessary for [Secure Cell](/pages/secure-cell-cryptosystem/) objects.

> **NOTE:** Symmetric key generation API will become available for Java and Android starting with Themis 0.13.0. For now, use common sense or consult [the wisdom of the Internet](https://stackoverflow.com/search?q=generate+cryptographically+secure+keys).

<!--

> ⚠️ **WARNING:**
> When storing generated keys, make sure they are sufficiently protected.
> See the guidelines [here](/pages/documentation-themis/#key-management).

To generate symmetric keys, use:

```java
SymmetricKey masterKey = new SymmetricKey();
```

-->

### Secure Message

The Secure Message functions provide a sequence-independent, stateless, contextless messaging system. This may be preferred in cases that don't require frequent sequential message exchange and/or in low-bandwidth contexts. This is secure enough to exchange messages from time to time, but if you'd like to have Perfect Forward Secrecy and higher security guarantees, consider using [Secure Session](#secure-session) instead.

The Secure Message functions offer two modes of operation:

In **Sign/Verify** mode, the message is signed using the sender's private key and is verified by the receiver using the sender's public key. The message is packed in a suitable container and ECDSA is used by default to sign the message (when RSA key is used, RSA+PSS+PKCS#7 digital signature is used).

In **Encrypt/Decrypt** mode, the message will be encrypted with a randomly generated key (in RSA) or a key derived by ECDH (in ECDSA), via symmetric algorithm with Secure Cell in seal mode (keys are 256 bits long).

The mode is selected by using appropriate methods. The sender uses `wrap` and `unwrap` methods for encrypt/decrypt mode. A valid public key of the receiver and a private key of the sender are required in this mode. For sign/verify mode `sign` and `verify` methods should be used. They only require a private key for signing and a public key for verification respectively.

Read more about the Secure Message's cryptographic internals [here](/pages/secure-message-cryptosystem/).

#### Sending many messages to the same recipient

**1.** Create a Secure Message object with your PrivateKey and recipient's PublicKey:

```java
SecureMessage encryptor = new SecureMessage(yourPrivateKey, peerPublicKey);
```

**2.** Encrypt each outgoing message:

```java
byte[] encryptedMessage = encryptor.wrap(messageToSend);
```

**3.** Decrypt each incoming message:

```java
byte[] receivedMessage = encryptor.unwrap(wrappedMessage);
```

#### Sending messages to many recipients

**1.** Create Secure Message object with your PrivateKey:

```java
SecureMessage encryptor = new SecureMessage(yourPrivateKey);
```

**2.** Encrypt each outgoing message specifying recipients' PublicKey:

```java
byte[] encryptedMessage = encryptor.wrap(messageToSend, peerPublicKey);
```

**3.** Decrypt each incoming message specifying the sender's PublicKey:

```java
byte[] receivedMessage = encryptor.unwrap(wrappedMessage, peerPublicKey);
```

#### Signing messages

**1.** Create Secure Message object with your PrivateKey:

```java
SecureMessage signer = new SecureMessage(yourPrivateKey);
```

**2.** Sign one or more messages:

```java
byte[] signedMessage = signer.sign(message);
```

#### Verifying the signed messages

**1.** Create Secure Message object with your PublicKey. Remember to use PublicKey from the same keypair as Private key you used for signing message.

```java
SecureMessage verifier = new SecureMessage(yourPublicKey);
```

**2.** Verify the messages received from your peer:

```java
try {
    byte[] verifiedMessage = verifier.verify(signedMessage);
} catch (SecureMessageWrapException e) {
    // invalid signature or other error occurred
}
```

### Secure Cell

The **Secure Сell** functions provide the means of protection for arbitrary data contained in stores, i.e. database records or filesystem files. These functions provide both strong symmetric encryption and data authentication mechanisms.

The general approach is that given:

- _input_: some source data to protect,
- _key_: secret byte array,
- _context_: plus an optional “context information”,

Secure Cell functions will produce:

- _cell_: the encrypted data,
- _authentication tag_: some authentication data.

The purpose of the optional “context information” (i.e. a database row number or file name) is to establish a secure association between this context and the protected data. In short, even when the secret is known, if the context is incorrect, the decryption will fail.

The purpose of the authentication data is to verify that given a correct key (and context), the decrypted data is indeed the same as the original source data.

The authentication data must be stored somewhere. The most convenient way is to simply append it to the encrypted data, but this is not always possible due to the storage architecture of an application. The Secure Cell functions offer different variants that address this issue.

By default, the Secure Cell uses the AES-256 encryption algorithm. The generated authentication data is 16 bytes long.

Secure Cell is available in 3 modes:

- **[Seal mode](#secure-cell-seal-mode)**: the most secure and user-friendly mode. Your best choice most of the time.
- **[Token protect mode](#secure-cell-token-protect-mode)**: the most secure and user-friendly mode. Your best choice most of the time.
- **[Context imprint mode](#secure-cell-context-imprint-mode)**: length-preserving version of Secure Cell with no additional data stored. Should be used with care and caution.

You can learn more about the underlying considerations, limitations, and features [here](/pages/secure-cell-cryptosystem/).

#### Initialising Secure Cell

Create Secure Cell using `key` as a byte array.

```java
// Keep this key secret.
String base64key = "b2doYWVwYWVyb3U0cGhpZDVwaG9XZWlnOGVleDFjYW8K";
byte[] masterKey = Base64.Decoder.decode(base64key);

SecureCell cell = new SecureCell(masterKey);
```

> **NOTE:**
> When unspecified, Secure Cell will use `SecureCell.MODE_SEAL` by default.
> Read more about the Secure Cell modes and which mode to choose
> [here](/pages/secure-cell-cryptosystem/).

#### Secure Cell Seal Mode

Initialise cell:

```java
SecureCell cell = new SecureCell(masterKey, SecureCell.MODE_SEAL);
```

Encrypt:

```java
// context is optional
SecureCellData cellData = cell.protect(context, data);
```

The result of the function call is `SecureCellData` object, which is a simple container for protected data. You may get the actual protected data:

```java
byte[] protectedData = cellData.getProtectedData();
```

Decrypt:

The context should be the same as in the protect function call for successful decryption.

```java
// context is optional
byte[] data = cell.unprotect(context, cellData);
```

#### Secure Cell Token-protect Mode

Initialise cell:

```java
SecureCell cell = new SecureCell(masterKey, SecureCell.MODE_TOKEN_PROTECT);
```

Encrypt:

```java
// context is optional
SecureCellData cellData = cell.protect(context, data);
```

In this mode, the result holds additional data (opaque to the user, but necessary for successful decryption):

```java
byte[] protectedData = cellData.getProtectedData();

if (cellData.hasAdditionalData()) {
    byte[] additionalData = cellData.getAdditionalData();
}
```

Decrypt:

```java
// context is optional
byte[] data = cell.unprotect(context, cellData);
```

#### Secure Cell Context-Imprint Mode

Initialise cell:

```java
SecureCell cell = new SecureCell(masterKey, SecureCell.MODE_CONTEXT_IMPRINT);
```

Encrypt:

```java
// context required
SecureCellData cellData = cell.protect(context, data);

byte[] protectedData = cellData.getProtectedData();
```

Decrypt:

> **NOTE:**
> For successful decryption, the context should be the same as in the protect function call.

```java
// context is required
byte[] data = cell.unprotect(context, cellData);
```

You can also use one object to encrypt different data with different keys:

```java
SecureCellData cellData1 = cell.protect(key1, context1, data1);
...
SecureCellData cellData2 = cell.protect(key2, context2, data2);
...
```

### Secure Session

Secure Session is a sequence- and session- dependent, stateful messaging system. It is suitable for protecting long-lived peer-to-peer message exchanges where the secure data exchange is tied to a specific session context.

Secure Session operates in two stages:
* **session negotiation** where the keys are established and cryptographic material is exchanged to generate ephemeral keys and
* **data exchange** where exchanging of messages can be carried out between peers.

You can read a more detailed description of the process [here](/pages/secure-session-cryptosystem/).

Put simply, Secure Session takes the following form:

- Both clients and server construct a Secure Session object, providing:
    - an arbitrary identifier,
    - a private key, and
    - a callback function that enables it to acquire the public key of the peers with which they may establish communication.
- A client will generate a "connect request" and by whatever means it will dispatch that to the server.
- A server will enter a negotiation phase in response to a client's "connect request".
- Clients and servers will exchange messages until a "connection" is established.
- Once a connection is established, clients and servers may exchange secure messages according to whatever application-level protocol was chosen.

#### Secure Session Workflow

Secure Session has two parties called "client" and "server" for the sake of simplicity, but they could be more precisely called "initiator" and "acceptor" — the only difference between them is in who starts the communication.

Secure Session relies on the user's passing a number of callback functions to send/receive messages — and the keys are retrieved from local storage (see more in [Secure Session cryptosystem description](/pages/secure-session-cryptosystem/)).

#### Secure Sockets

If your application already uses Java sockets for communication, you can easily add/increase security by replacing them with our `SecureSocket` and `SecureServerSocket`.

**1.** Implement `ISessionCallbacks` interface:

  * `getPublicKeyForId` will return the peer's trusted public key when it is needed by the system.

  * `stateChanged` is just a notification callback. You may use it for informational purpose, to update your UI, or just to create a dummy (do-nothing) implementation.


Example using anonymous class:

```java
ISessionCallbacks callbacks = new ISessionCallbacks() {
    @Override
    public PublicKey getPublicKeyForId(SecureSession session, byte[] id) {
        // get trusted PublicKey of user id
        PublicKey publicKey = getUserPublicKeyFromDatabaseOrOtherStorageOrSource(id);
        return publicKey; // or null if key is not found
    }

    @Override
    public void stateChanged(SecureSession session) {
       // update UI: for example, draw a nice padlock signaling to the user that his/her communication is now secured
    }
}
```

**2.** Replace all of your sockets with our secure versions:

**On client:**

```java
// Socket clientSocket = new Socket(...);
Socket clientSocket = new SecureSocket(..., clientId, clientPrivateKey, callbacks);
```

**On server:**

```java
// ServerSocket serverSocket = new ServerSocket(...);
ServerSocket serverSocket = new SecureServerSocket(..., serverId, serverPrivateKey, callbacks);
```

**3.** Enjoy!

#### Basic Secure Session

This API is useful when your application has an already established network processing path and this path is doing more than just use sockets. In this case, you would just want to add some function calls that wrap/unwrap the outgoing/incoming data buffers.

**1.** Similarly to the case with Secure Sockets — implement `ISessionCallbacks` interface:

```java
ISessionCallbacks callbacks = new ISessionCallbacks() {
    @Override
    public PublicKey getPublicKeyForId(SecureSession session, byte[] id) {
        // get trusted PublicKey of user id
        PublicKey publicKey = getUserPublicKeyFromDatabaseOrOtherStorageOrSource(id);
        return publicKey; // or null if key is not found
    }

    @Override
    public void stateChanged(SecureSession session) {
       // update UI: for example, draw a nice padlock indicating to the user that his/her communication is now secured
    }
}
```

**2.** Create a `SecureSession` object:

```java
SecureSession session = new SecureSession(yourId, yourPrivateKey, callbacks);
```

**3.** On the client side, initiate the Secure Session negotiation by generating and sending a connection request:

```java
byte[] connectRequest = session.generateConnectRequest();
// send connectRequest to the server
```

**4.** Start receiving and parsing incoming data on both sides:

```java
// receive some data and store it in receiveBuffer
SecureSession.UnwrapResult result = session.unwrap(receiveBuffer);

switch (result.getDataType()) {
    case USER_DATA:
        // this is the actual data that was encrypted by your peer using SecureSession.wrap
        byte[] data = result.getData();
        // process the data according to your application's flow for incoming data
        break;
    case PROTOCOL_DATA:
        // this is the internal Secure Session protocol data. An opaque response was generated, just send it to your peer
        byte[] data = result.getData();
        // send the data to your peer as is
        break;
    case NO_DATA:
        // this is the internal Secure Session protocol data, but no response is needed (this usually takes place on the client side when protocol negotiation completes)
        // do nothing
        break;
}
```

**5.** When the protocol negotiation is completed, you may send the encrypted data to your peer:

```java
byte[] wrappedData = session.wrap(yourData);
// send wrappedData to your peer
```

#### Secure Session with transport callbacks

This API is useful when you want to clearly decouple the security from the network communication in your application:

**1.** Implement `ITransportSessionCallbacks` interface. This interface extends `ISessionCallbacks` interface, which means you have to implement two additional functions:

```java
ITransportSessionCallbacks callbacks = new ITransportSessionCallbacks() {
    // implement getPublicKeyForId and stateChanged as in basic ISessionCallbacks
    ...

    @Override
    public void write(byte[] buffer) {
        // it will be called when Secure Session needs to send something to your peer
        // just send buffer to your peer
    }

    @Override
    public byte[] read() {
        // here you should issue a read request to your underlying transport (for example, read data from socket or pipe)
        // return the buffer with read data
    }
}
```

**2.** Create a `SecureTransportSession` object:

```java
SecureTransportSession session = new SecureTransportSession(yourId, yourPrivateKey, callbacks);
```

**3.** On the client side, initiate the Secure Session negotiation by sending a connection request:

```java
session.connect();
```

**4.** When the negotiation is complete, you may send/receive the data on both sides:

```java
// sending data
session.write(dataToSend);

...

// receiving data (probably, through a receive loop)
byte[] receivedData = session.read();
```

That's it!

See the [tests](https://github.com/cossacklabs/themis/tree/stable/tests/themis/wrappers/android/com/cossacklabs/themis/test) and [Mobile WebSocket Example](https://github.com/cossacklabs/mobile-websocket-example) to get a more complete understanding of how Secure Session works.

### Secure Comparator

Secure Comparator is an interactive protocol for two parties that compares whether they share the same secret or not. It is built around a [Zero Knowledge Proof](https://www.cossacklabs.com/zero-knowledge-protocols-without-magic.html)-based protocol ([Socialist Millionaire's Protocol](https://en.wikipedia.org/wiki/Socialist_millionaires)), with a number of [security enhancements](https://www.cossacklabs.com/files/secure-comparator-paper-rev12.pdf).

Secure Comparator is transport-agnostic and only requires the user(s) to pass messages in a certain sequence. The protocol itself is ingrained into the functions and requires minimal integration efforts from the developer.

#### Secure Comparator workflow

Secure Comparator has two parties — called "client" and "server" — the only difference between them is in who starts the comparison.

#### Secure Comparator client

```java
byte[] compareData = ... // shared secret to compare
SecureCompare client = new SecureCompare(compareData);

// Initiating secure compare (client, step1)
byte[] peerData = client.begin();

while (client.getResult() == SecureCompare.CompareResult.NOT_READY) {
    // send data on server and receive response
    sendDataOnServer(peerData);
    peerData = receiveFromServer();

    // proceed and send again
    peerData = client.proceed(peerData);
}
```

After the loop ends, the comparison is over and its result can be checked by calling `getResult`:

```java
if (client.getResult() == SecureCompare.CompareResult.MATCH) {
    // secrets match
} else {
    // secrets don't match
}
```

#### Secure Comparator server

The server part can be described in any language, but let's pretend here that both client and server are using Java:

```java
byte[] compareData = // shared secret to compare
SecureCompare server = new SecureCompare(compareData);

// Initiating secure compare (client, step1)
byte[] peerData = new byte[0];

while (server.getResult() == SecureCompare.CompareResult.NOT_READY) {
    // receive from client
    peerData = receiveFromClient();

    // proceed and send again
    peerData = server.proceed(peerData);
    sendDataOnClient(peerData);
}
```

After the loop finishes, the comparison is over and its result can be checked by calling `getResult`:

```java
if (server.getResult() == SecureCompare.CompareResult.MATCH) {
    // secrets match
} else {
    // secrets don't match
}
```
