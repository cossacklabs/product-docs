---
weight: 4
title:  Features
---

# Features of JsThemis

## Using Themis

In order to use Themis, you need to import it first.

Add the following lines to your code:

```javascript
const themis = require('wasm-themis')

themis.initialized.then(function() {
    // You may use Themis once this promise is resolved.
})
```

> ⚠️ **IMPORTANT:** WebAssembly code is loaded and compiled asynchronously so you have to wait for the `themis.initialized` promise to complete before using any Themis functions. If Themis is called too early, you will see an error message like this:
>
> ```
> Assertion failed: you need to wait for the runtime to be ready (e.g. wait for main() to be called)
> ```

### Key generation

#### Asymmetric keypair generation

Themis supports both Elliptic Curve and RSA algorithms for asymmetric cryptography.
Algorithm type is chosen according to the generated key type.
Asymmetric keys are necessary for [Secure Message](/pages/secure-message-cryptosystem/) and [Secure Session](/pages/secure-session-cryptosystem/) objects.

For learning purposes, you can play with [Themis Interactive Simulator](/simulator/interactive/) to get the keys and simulate the whole client-server communication.

> ⚠️ **WARNING:**
> When you distribute private keys to your users, make sure the keys are sufficiently protected.
> You can find the guidelines [here](/pages/documentation-themis/#key-management).

> **NOTE:** When using public keys of other peers, make sure they come from trusted sources.

To generate asymmetric keypairs, use:

```javascript
let keypair = new themis.KeyPair()

// Keys are Uint8Arrays
let privateKey = keypair.privateKey
let publicKey = keypair.publicKey
```

#### Symmetric key generation

Themis uses highly efficient and secure AES algorithm for symmetric cryptography.
A symmetric key is necessary for [Secure Cell](/pages/secure-cell-cryptosystem/) objects.

> **NOTE:** Symmetric key generation API will become available for WasmThemis starting with Themis 0.13.0. For now, use common sense or consult [the wisdom of the Internet](https://stackoverflow.com/search?q=generate+cryptographically+secure+keys).

<!--
> ⚠️ **WARNING:**
> When you store generated keys, make sure they are sufficiently protected.
> You can find the guidelines [here](/pages/documentation-themis/#key-management).

To generate symmetric keys, use:

```javascript
// Keys are Uint8Arrays
let masterKey = new themis.SymmetricKey()
```
-->

### Secure Message

The Secure Message functions provide a sequence-independent, stateless, contextless messaging system. This may be preferred in cases that don't require frequent sequential message exchange and/or in low-bandwidth contexts. This is secure enough to exchange messages from time to time, but if you'd like to have Perfect Forward Secrecy and higher security guarantees, consider using [Secure Session](/pages/secure-session-cryptosystem/) instead.

The Secure Message functions offer two modes of operation:

In **Sign/Verify** mode, the message is signed using the sender's private key and is verified by the receiver using the sender's public key. The message is packed in a suitable container and ECDSA is used by default to sign the message (when RSA key is used, RSA+PSS+PKCS#7 digital signature is used).

In **Encrypt/Decrypt** mode, the message will be encrypted with a randomly generated key (in RSA) or a key derived by ECDH (in ECDSA), via symmetric algorithm with Secure Cell in seal mode (keys are 256 bits long).

The mode is selected at construction time. _SecureMessage_ objects provide `encrypt` and `decrypt` methods for encrypt/decrypt mode. A valid public key of the receiver and a private key of the sender are required in this mode. For sign/verify mode _SecureMessageSign_ and _SecureMessageVerify_ objects provide `sign` and `verify` methods respectively. They only require a private key for signing and a public key for verification.

Read more about the Secure Message's cryptographic internals [here](/pages/secure-message-cryptosystem/).

#### Secure Message interface

##### Encrypt/Decrypt mode

```javascript
class SecureMessage {
    constructor(keyPair)
    constructor(privateKey, publicKey)
    encrypt(message)
    decrypt(message)
}
```

_Description_:

- `new themis.SecureMessage(keyPair)`<br/>
  Create a new Secure Message with **keyPair** holding your private key and public key of the peer.<br/>
  Raises **ThemisError** on failure.

- `new themis.SecureMessage(privateKey, publicKey)`<br/>
  Create a new Secure Message with your **privateKey** and **publicKey** of the peer separately.<br/>
  Raises **ThemisError** on failure.

- `encrypt(message)`<br/>
  Encrypt **message**, return encrypted Secure Message container as _Uint8Array_.<br/>  Raises **ThemisError** on failure.

- `decrypt(message)`<br/>
  Decrypt **message**, return decrypted original message as _Uint8Array_.<br/>
  Raises **ThemisError** on failure.

##### Sign/Verify mode

```javascript
class SecureMessageSign {
    constructor(privateKey)
    sign(message)
}
class SecureMessageVerify {
    constructor(publicKey)
    verify(message)
}
```

_Description_:

- `new themis.SecureMessageSign(privateKey)`<br/>
  Create a new Secure Message for signing with your **privateKey**.<br/>
  Raises **ThemisError** on failure.

- `sign(message)`<br/>
  Sign **message**, return signed Secure Message container as _Uint8Array_.<br/>
  Raises **Error** on failure.

- `new themis.SecureMessageVerify(publicKey)`<br/>
  Create a new Secure Message for verifying with **publicKey** of the peer.<br/>
  Raises **ThemisError** on failure.

- `verify(message)`<br/>
  Verify **message** signature, return _Uint8Array_ with original message.<br/>
  Raises **ThemisError** on failure.

#### Example

##### Encrypt/Decrypt mode

Initialise encrypter and decypter:

```javascript
let smessage_alice = new themis.SecureMessage(alice.privateKey, bob.publicKey)

let smessage_bob = new themis.SecureMessage(bob.privateKey, alice.publicKey)
```

Always make sure that you use keys from the same keypair.
For decryption, you need to use a private key matching the public one used for encryption.

Encrypt message:

```javascript
try {
    let encryptedMessage = smessage_alice.encrypt(message)
} catch (error) {
    // See error.message for a human-readable text message
    // and error.code for integer code like themis.ThemisErrorCode.FAIL
}
```

Decrypt message:

```javascript
try {
    let message = smessage_bob.decrypt(encryptedMessage)
} catch (error) {
    // See error.message for a human-readable text message
    // and error.code for integer code like themis.ThemisErrorCode.FAIL
}
```

##### Sign/Verify mode

Initialise signer and verifier:

```javascript
let smessage_sign = new themis.SecureMessageSign(alice.privateKey)

let smessage_verify = new themis.SecureMessageVerify(alice.publicKey)
```

Always make sure that you use keys from the same keypair. You need to use a matching public key to verify messages signed by the private key.

Sign message:

```javascript
try {
    let signedMessage = smessage_sign.sign(message)
} catch (error) {
    // See error.message for a human-readable text message
    // and error.code for integer code like themis.ThemisErrorCode.FAIL
}
```

Verify message:

```javascript
try {
    let message = smessage_verify.verify(signedMessage)
} catch (error) {
    // See error.message for a human-readable text message
    // and error.code for integer code like themis.ThemisErrorCode.INVALID_SIGNATURE
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

- **[Seal mode](/pages/secure-cell-cryptosystem/#seal-mode)**: the most secure and user-friendly mode. Your best choice most of the time.
- **[Token protect mode](/pages/secure-cell-cryptosystem/#token-protect-mode)**: the most secure and user-friendly mode. Your best choice most of the time.
- **[Context imprint mode](/pages/secure-cell-cryptosystem/#context-imprint-mode)**: length-preserving version of Secure Cell with no additional data stored. Should be used with care and caution.

You can learn more about the underlying considerations, limitations, and features [here](/pages/secure-cell-cryptosystem/).

#### Secure Cell interface

##### Seal mode

```javascript
class SecureCellSeal {
    constructor(masterKey)
    encrypt(message)
    encrypt(message, context)
    decrypt(message)
    decrypt(message, context)
}
```

_Description_:

- `new themis.SecureCellSeal(masterKey)`<br/>
  Create a Secure Cell in _seal mode_ with **masterKey** (a non-empty _Uint8Array_).<br/>
  Raises **ThemisError** on failure.

- `encrypt(message)`, `encrypt(message, context)`<br/>
  Encrypt **message** with additional **context** (optional argument).<br/>
  Returns encrypted message as _Uint8Array_.<br/>
  Raises **ThemisError** on failure.

- `decrypt(message)`, `decrypt(message, context)`<br/>
  Decrypt **message** with additional **context** (optional argument).<br/>
  Returns original message as _Uint8Array_.<br/>
  Raises **ThemisError** on failure.

##### Tokan Protect mode

```javascript
class SecureCellTokenProtect {
    constructor(masterKey)
    encrypt(message)
    encrypt(message, context)
    decrypt(message, token)
    decrypt(message, token, context)
}
```

_Description_:

- `new themis.SecureCellTokenProtect(masterKey)`<br/>
  Create a Secure Cell in _token-protect mode_ with **masterKey** (a non-empty _Uint8Array_).<br/>
  Raises **ThemisError** on failure.

- `encrypt(message)`, `encrypt(message, context)`<br/>
  Encrypt **message** with additional **context** (optional argument).<br/>
  Returns an object with two _Uint8Array_ fields: encrypted message (`data`) and authentication token (`token`).<br/>
  Raises **ThemisError** on failure.

- `decrypt(message, token)`, `decrypt(message, token, context)`<br/>
  Decrypt **message** with **token** and additional **context** (optional argument).<br/>
  Returns original message as _Uint8Array_.<br/>
  Raises **ThemisError** on failure.

##### Context Imprint mode

```javascript
class SecureCellContextImprint {
    constructor(masterKey)
    encrypt(message, context)
    decrypt(message, context)
}
```

_Description_:

- `new themis.SecureCellSeal(masterKey)`<br/>
  Create a Secure Cell in _context-imprint mode_ with **masterKey** (a non-empty _Uint8Array_).<br/>
  Raises **ThemisError** on failure.

- `encrypt(message, context)`<br/>
  Encrypt **message** with mandatory **context** argument.<br/>
  Returns encrypted message as _Uint8Array_.<br/>
  Raises **ThemisError** on failure.

- `decrypt(message, context)`<br/>
  Decrypt **message** with mandatory **context** argument.<br/>
  Returns original message as _Uint8Array_.<br/>
  Raises **ThemisError** on failure.

#### Examples

Secure Cell seal mode

```javascript
let base64Key = 'eGJIVlBFRmdHck04Z0tsdmxpTEtJbTA0cWs1MGk1WUQK'
let masterKey = Base64ToUint8Array(base64Key)

let scell = new themis.SecureCellSeal(masterKey)

let encrypted_message = scell.encrypt(message, context)
let decrypted_message = scell.decrypt(encrypted_message, context)
```

Secure Cell token-protect mode:

```javascript
let scell = new themis.SecureCellTokenProtect(masterKey)

let encrypted = scell.encrypt(message, context)
let encrypted_message = encrypted.data
let encrypted_token = encrypted.token

let decrypted_message = scell.decrypt(encrypted.data, encrypted.token, context)
```

Secure Cell context-imprint mode:

```javascript
let scell = new themis.SecureCellContextImprint(masterKey)

// "context" is mandatory for context-imprint mode
let encrypted_message = scell.encrypt(message, context)
let decrypted_message = scell.decrypt(encrypted_message, context)
```

### Secure Session

Secure Session is a sequence- and session- dependent, stateful messaging system. It is suitable for protecting long-lived peer-to-peer message exchanges where the secure data exchange is tied to a specific session context.

Secure Session operates in two stages:

* **session negotiation** where the keys are established and cryptographic material is exchanged to generate ephemeral keys,
* and **data exchange** where exchanging of messages can be carried out between peers.

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

#### Secure Session interface

```javascript
class SecureSession {
    constructor(sessionID, privateKey, keyCallback)
    destroy()
    established()
    connectionRequest()
    negotiateReply(message)
    wrap(message)
    unwrap(message)
}
```

_Description_:

- `new themis.SecureSession(sessionID, privateKey, keyCallback)`<br/>
  Create Secure Session with **sessionID**, **privateKey** and a **keyCallback**.<br/>
  The callback is `function(peerID)` that gets a _Uint8Array_ with remote session ID and should return either the _PublicKey_ of the peer, or `null` if the peer is unknown.<br/>
  Raises **ThemisError** on failure.

- `destroy()`<br/>
  Destroy Secure Session and deallocate resources used by it.<br/>
  You _must_ call this method when Secure Session is no longer needed.

- `established()`<br/>
  Returns `true` if the connection has been established and messages can be exchanged.

- `connectionRequest()`<br/>
  Initiate connection. This is the first method to be called by the client. Send result to the server.<br/>
  Returns _Uint8Array_ with connection initialisation message.<br/>
  Raises **ThemisError** on failure.

- `negotiateReply(message)`<br/>
  Process connection initialisation or negotiation message. Send result to the peer if `established()` returns `false`.<br/>
  Returns _Uint8Array_ with connection negotation message.<br/>
  Raises **ThemisError** on failure.

- `wrap(message)`<br/>
  Encrypts **message** and returns a _Uint8Array_ with encrypted message.<br/>
  Raises **ThemisError** on failure.

- `unwrap(message)`<br/>
  Decrypts encrypted **message** and returns the original one as _Uint8Array_.<br/>
  Raises **ThemisError** on failure.

#### Secure Session workflow

Secure Session has two parties called "client" and "server" for the sake of simplicity, but they could be more precisely called "initiator" and "acceptor" — the only difference between them is in who starts the communication.

Secure Session relies on a callback functions to retrieve the keys from local storage (see more in [Secure Session cryptosystem description](/pages/secure-session-cryptosystem/)).

#### Secure Session client

First you need to prepare a session:

```javascript
let clientSession = new themis.SecureSession(clientID, clientPrivateKey,
    function(peerID) {
        // Get public key for the specified ID from local storage,
        // read it from file, etc.
        if (!found) {
            return null
        }
        return serverPublicKey
    })

var request = clientSession.connectionRequest()
while (!clientSession.established()) {
    // Send "request" to the server, receive "reply"
    request = clientSession.negotiateReply(reply)
}
```

After the loop finishes, Secure Session is established and is ready to be used.

To encrypt the outgoing message, use:

```javascript
var encryptedMessage = clientSession.wrap(message)
// Send "encryptedMessage" to the server
```

To decrypt the received message, use:

```javascript
// Receive "encryptedMessage" from the server
var message = clientSession.unwrap(encryptedMessage)
```

#### Secure Session server

First you need to prepare a session:

```javascript
let serverSession = new themis.SecureSession(serverID, serverPrivateKey,
    function(peerID) {
        // Get public key for the specified ID from local storage,
        // read it from file, etc.
        if (!found) {
            return null
        }
        return clientPublicKey
    })

while (!serverSession.established()) {
    // Receive "request" from the client
    reply = serverSession.negotiateReply(request)
    // Send "reply" to the client
}
```

Secure Session is ready. See the full example available in [docs/examples/js](https://github.com/cossacklabs/themis/tree/master/docs/examples/js)

### Secure Comparator

Secure Comparator is an interactive protocol for two parties that compares whether they share the same secret or not. It is built around a [Zero Knowledge Proof](https://www.cossacklabs.com/zero-knowledge-protocols-without-magic.html)-based protocol ([Socialist Millionaire's Protocol](https://en.wikipedia.org/wiki/Socialist_millionaires)), with a number of [security enhancements](https://www.cossacklabs.com/files/secure-comparator-paper-rev12.pdf).

Secure Comparator is transport-agnostic and only requires the user(s) to pass messages in a certain sequence. The protocol itself is ingrained into the functions and requires minimal integration efforts from the developer.

#### Secure Comparator interface

```javascript
class SecureComparator {
    constructor(sharedSecret...)
    destroy()
    append(secret)
    begin()
    proceed(request)
    complete()
    compareEqual()
}
```

_Description_:

- `new themis.SecureComparator(sharedSecret...)`<br/>
  Prepare a new secure comparison of **sharedSecrets** which are _Uint8Arrays_ of data to compare.<br/>
  Specifying multiple secrets is the same as calling `append()` for them sequentially.<br/>
  You _must_ provide at least one byte of data to be compared.<br/>
  Raises **ThemisError** on failure.

- `destroy()`<br/>
  Destroy Secure Comparator and deallocate resources used by it.<br/>
  You _must_ call this method when Secure Comparator is no longer needed.

- `append(secret)`<br/>
  Append more **secret** data to be compared before you begin the comparison.<br/>
  Raises **ThemisError** on failure.

- `begin()`<br/>
  Return a _Uint8Array_ with initial client message. Send it to the server.<br/>
  Raises **ThemisError** on failure.

- `proceed(request)`<br/>
  Process **request** and return a _Uint8Array_ with reply. Send it to the peer.<br/>
  Raises **ThemisError** on failure.

- `complete()`<br/>
  Returns `true` if the comparison is complete.

- `compareEqual()`<br/>
  Returns boolean result of the comparison.<br/>
  Raises **ThemisError** is the comparison is not complete.

#### Secure Comparator workflow

Secure Comparator has two parties — called "client" and "server" — the only difference between them is in who starts the comparison.

#### Secure Comparator client

```javascript
let clientComparison = new themis.SecureComparator(new Buffer("shared secret"))

// Client initiates comparison
var request = clientComparison.begin()
while (!clientComparison.complete()) {
    // Send "request" to server and receive "reply"
    request = clientComparison.proceed(reply)
}
```

After the loop finishes, the comparison is over and you can check if the secrets `compareEqual()`:

```javascript
if (clientComparison.compareEqual()) {
    // secrets match
} else {
    // secrets don't match
}
```

#### Secure Comparator server

The server part can be described in any language, but let's pretend here that both client and server are using JavaScript.

```javascript
let serverComparison = new themis.SecureComparator(new Buffer("shared secret"))

while (!serverComparison.complete()) {
    // Receive "request" from the client
    reply = serverComparison.proceed(request)
    // Send "reply" to the client
}
```

After the loop finishes, the comparison is over and you can check if the secrets `compareEqual()`:

```javascript
if (serverComparison.compareEqual()) {
    // secrets match
} else {
    // secrets don't match
}
```

This is it. See the full examples in [docs/examples/js](https://github.com/cossacklabs/themis/tree/master/docs/examples/js).
