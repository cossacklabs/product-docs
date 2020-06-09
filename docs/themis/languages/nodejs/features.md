---
weight: 4
title:  Features
---

# Features of JsThemis

## Using Themis

In order to use Themis, you need to import it first.

Add to your code:

```javascript
const themis = require('jsthemis')
```

and you're good to go!

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

// Keys are Buffers
let privateKey = keypair.private()
let publicKey = key_pair.public()
```

#### Symmetric key generation

Themis uses highly efficient and secure AES algorithm for symmetric cryptography.
A symmetric key is necessary for [Secure Cell](/pages/secure-cell-cryptosystem/) objects.

> **NOTE:** Symmetric key generation API will become available for jsthemis starting with Themis  0.13.0. For now, use common sense or consult [the wisdom of the Internet](https://stackoverflow.com/search?q=generate+cryptographically+secure+keys).

<!--
> ⚠️ **WARNING:**
> When you store generated keys, make sure they are sufficiently protected.
> You can find the guidelines [here](/pages/documentation-themis/#key-management).

To generate symmetric keys, use:

```javascript
// Keys are Buffers
let masterKey = new themis.SymmetricKey()
```
-->

### Secure Message

The Secure Message functions provide a sequence-independent, stateless, contextless messaging system. This may be preferred in cases that don't require frequent sequential message exchange and/or in low-bandwidth contexts. This is secure enough to exchange messages from time to time, but if you'd like to have Perfect Forward Secrecy and higher security guarantees, consider using [Secure Session](/pages/secure-session-cryptosystem/) instead.

The Secure Message functions offer two modes of operation:

In **Sign/Verify** mode, the message is signed using the sender's private key and is verified by the receiver using the sender's public key. The message is packed in a suitable container and ECDSA is used by default to sign the message (when RSA key is used, RSA+PSS+PKCS#7 digital signature is used).

In **Encrypt/Decrypt** mode, the message will be encrypted with a randomly generated key (in RSA) or a key derived by ECDH (in ECDSA), via symmetric algorithm with Secure Cell in seal mode (keys are 256 bits long).

The mode is selected by using appropriate methods. The sender uses `wrap` and `unwrap` methods for encrypt/decrypt mode. A valid public key of the receiver and a private key of the sender are required in this mode. For sign/verify mode `sign` and `verify` methods should be used. They only require a private key for signing and a public key for verification respectively.

Read more about the Secure Message's cryptographic internals [here](/pages/secure-message-cryptosystem/).

#### Secure Message interface:

```javascript
function SecureMessage(private_key, peer_public_key) {
   function encrypt(message);
   function decrypt(message);
   function sign(message);
   function verify(message);
}
```

_Description_:

- `new SecureMessage(private_key, peer_public_key)`<br/>
  Create a new Secure Message with **private_key** and **peer_public_key**.<br/>
  Raises **Error** on failure.

- `encrypt(message)`<br/>
  Encrypt **message**, return encrypted Secure Message container as _Buffer_.<br/>
  Requires both **private_key** and **peer_public_key** to be set.<br/>
  Raises **Error** on failure.

- `decrypt(message)`<br/>
  Decrypt **message**, return decrypted original message as _Buffer_.<br/>
  Requires both **private_key** and **peer_public_key** to be set.<br/>
  Raises **Error** on failure.

- `sign(message)`<br/>
  Sign **message**, return signed Secure Message container as _Buffer_.<br/>
  Requires **private_key** to be set.<br/>
  Raises **Error** on failure.

- `verify(message)`<br/>
  Verify **message** signature, return _Buffer_ with original message.<br/>
  Requires **peer_public_key** to be set. Peer public key should be from the same keypair as private key.<br/>
  Raises **Error** on failure.

#### Example

Initialise encrypter:

```javascript
var smessage = new themis.SecureMessage(private_key, peer_public_key)
// or
var smessage = new themis.SecureMessage(new Buffer(private_key, "base64"),
                                        new Buffer(peer_public_key, "base64"))
```

For signing/verifying make sure that you use keys from the same keypair – private key for signing message and public key for verifying message.

Encrypt message:

```javascript
try {
    var encrypted_message = smessage.encrypt(message)
} catch (error) {
   // handle error
}
```

Decrypt message:

```javascript
try {
   var decrypted_message = smessage.decrypt(encrypted_message)
} catch (error) {
   // handle error
}
```

Sign message:

```javascript
try {
   var signed_message = smessage.sign(message)
} catch (error) {
   // handle error
}
```

Verify message:

```javascript
try {
   var message = smessage.verify(signed_message)
} catch (error) {
   // handle error
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


##### Secure Cell interface:

```javascript
function SecureCellSeal(key) {
   function encrypt(message, [context]);
   function decrypt(message, [context]);
}

function SecureCellTokenProtect(key) {
   function encrypt(message, [context]);
   function decrypt(message, token, [context]);
}

function SecureCellContextImprint(key) {
   function encrypt(message, context);
   function decrypt(message, context);
}
```

_Description_:

- `new SecureCellSeal(key)`<br/>
  Initialise Secure Cell in _seal mode_ with master **key** Buffer (must be non-empty).

  - `encrypt(message, [context])`<br/>
    Encrypt **message** with additional **context** (optional argument).<br/>
    Return encrypted _Buffer_.<br/>
    Raises **Error** on failure.

  - `decrypt(message, [context])`<br/>
    Decrypt **message** with additional **context** (optional argument).<br/>
    Return decrypted _Buffer_.<br/>
    Raises **Error** on failure.

- `SecureCellTokenProtect(key)`<br/>
  Initialise Secure Cell in _token-protect mode_ with master **key** Buffer (must be non-empty).

  - `encrypt(message, [context])`<br/>
    Encrypt **message** with additional **context** (optional argument).<br/>
    Returns an object with two _Buffer_ fields: encrypted message (`data`) and authentication token (`token`).<br/>
    Raises **Error** on failure.

  - `decrypt(message, token, [context])`<br/>
    Decrypt **message** with **token** and additional **context** (optional argument).<br/>
    Return decrypted _Buffer_.<br/>
    Raises **Error** on failure.

- `SecureCellContextImprint(key)`
  Initialise Secure Cell in _context-imprint mode_ with master **key** Buffer (must be non-empty).

  - `encrypt(message, context)`<br/>
    Encrypt **message** with mandatory **context**.<br/>
    Return encrypted _Buffer_.<br/>
    Raises **Error** on failure.

  - `decrypt(message, context)`<br/>
    Decrypt **message** with mandatory **context**.<br/>
    Return decrypted _Buffer_.<br/>
    Raises **Error** on failure.

#### Examples

Secure Cell seal mode

```javascript
var base64Key = 'TExyS2FFNjdSazZ5M084U2NVZ0Q4NzFpTXZnSVRKdHYK'
var masterKey = Buffer.from(base64Key, 'base64')

var scell = new themis.SecureCellSeal(masterKey)

var encrypted_message = scell.encrypt(message, context)
var decrypted_message = scell.decrypt(encrypted_message, context)
```

Secure Cell token-protect mode:

```javascript
var scell = new SecureCellTokenProtect(masterKey)

var encrypted_array  = scell.encrypt(message, context)
var encrypted_message = encrypted_array.data
var encrypted_token = encrypted_array.token

var decrypted_message = scell.decrypt(encrypted_message, encrypted_token, context)
```

Secure Cell context-imprint mode:

```javascript
var scell = new themis.SecureCellContextImprint(masterKey)

// "context" is mandatory for context-imprint mode
var encrypted_message = scell.encrypt(message, context)
var decrypted_message = scell.decrypt(encrypted_message, context)
```

### Secure Session

Secure Session is a sequence- and session- dependent, stateful messaging system. It is suitable for protecting long-lived peer-to-peer message exchanges where the secure data exchange is tied to a specific session context.

Secure Session operates in two stages:

- **session negotiation** where the keys are established and cryptographic material is exchanged to generate ephemeral keys, and
- **data exchange** where exchanging of messages can be carried out between peers.

You can read a more detailed description of the process [here](/pages/secure-session-cryptosystem/).

Put simply, Secure Session takes the following form:

- Both clients and server construct a Secure Session object, providing:
    - an arbitrary identifier,
    - a private key, and
    - a callback function that enables it to acquire the public key of the peers with which they may establish communication.
- A client will generate a "connect request" and by whatever means it will dispatch that to the server.
- A server will enter a negotiation phase in response to a client's "connect request".
- Clients and servers will exchange messages until a "connection" is established.
- Once a connection is established, clients and servers may exchange secure messages according to whatever application level protocol was chosen.

#### Secure Session interface

```javascript
function SecureSession(id, private_key, get_pub_key_by_id) {
  function isEstablished();
  function connectRequest();
  function wrap(message);
  function unwrap(message);
}
```

_Description_:

- `new SecureSession(id, private_key, get_pub_key_by_id)`<br/>
  Initialise Secure Session with peer **id**, **private_key** and a **get_pub_key_by_id** callback.<br/>
  The callback is `function(peer_id)` that gets _Buffer_ with remote peer ID and should returns public key for it (or `null`).<br/>
  Raises **Error** on failure.

- `isEstablished()`<br/>
  Checks if the connection has been established.

- `connectRequest()`<br/>
  Return connection initialisation message as a _Buffer_. Send it to the server.<br/>
  Raises **Error** on failure.

- `wrap(message)`<br/>
  Encrypts **message** and returns encrypted _Buffer_.<br/>
  Raises **Error** on failure.

- `unwrap(message)`<br/>
  Decrypts **message**.<br/>
  Returns _Buffer_ that is either decrypted message (if the connection is established), or a connection message that must be sent as is to the peer.<br/>
  Raises **Error** on failure.

#### Secure Session workflow

Secure Session has two parties called "client" and "server" for the sake of simplicity, but they could be more precisely called "initiator" and "acceptor" — the only difference between them is in who starts the communication.


Secure Session relies on the user's passing a number of callback functions to send/receive messages — and the keys are retrieved from local storage (see more in [Secure Session cryptosystem description](/pages/secure-session-cryptosystem/)).

#### Secure Session client

First, initialisation:

```javascript
var client_session = new themis.SecureSession(client_id, client_keypair.private(),
  function(id) {
      // Get public key for specified ID from file, database, etc.
      return public_key
  });

var data = client_session.connectRequest()
do {
    // send "data" to server, receive "response"
    data = client_session.unwrap(response)
} while (!client_session.isEstablished());
```

After the loop finishes, Secure Session is established and is ready to be used.

To encrypt the outgoing message use:

```javascript
var encrypted_message = client_session.wrap(message)
// send "encrypted_message" by any preferred method
```

To decrypt the received message, use:

```javascript
// receive "encrypted_message" from peer
var message = client_session.unwrap(encrypted_message)
```

#### Secure Session server

First, initialise everything:

```javascript
var server_session = new themis.SecureSession(server_id, server_keypair.private(),
  function(id) {
      // Get public key for specified ID from file, database, etc.
      return public_key
  });

while (!server_session.isEstablished()) {
    // receive "request" from client
    reply = server_session.unwrap(request)
    // send "reply" to client
}
```

Secure Session is ready. See the full example available in [docs/examples/js](https://github.com/cossacklabs/themis/tree/master/docs/examples/js)

### Secure Comparator

Secure Comparator is an interactive protocol for two parties that compares whether they share the same secret or not. It is built around a [Zero Knowledge Proof](https://www.cossacklabs.com/zero-knowledge-protocols-without-magic.html)-based protocol ([Socialist Millionaire's Protocol](https://en.wikipedia.org/wiki/Socialist_millionaires)), with a number of [security enhancements](https://www.cossacklabs.com/files/secure-comparator-paper-rev12.pdf).

Secure Comparator is transport-agnostic and only requires the user(s) to pass messages in a certain sequence. The protocol itself is ingrained into the functions and requires minimal integration efforts from the developer.

#### Secure Comparator interface

```javascript
function SecureComparator(sharedSecret) {
  function beginCompare();
  function proceedCompare(message);
  function isCompareComplete();
  function isMatch();
}
```

_Description_:

- `new SecureComparator(shared_secret)`<br/>
  Initialises secure comparison for provided **shared_secret**.<br/>
  Raises **Error** on failure.

- `beginCompare()`<br/>
  Returns an initial message for the client, send it to the server.<br/>
  Raises **Error** on failure.

- `proceedCompare(message)`<br/>
  Processes **message** and returns a reply to send to the peer.<br/>
  Raises **Error** on failure.

- `isCompareComplete()`<br/>
  Returns `true` if the comparison is complete.

- `isMatch()`<br/>
  Returns boolean result of the comparison.

#### Secure Comparator workflow

Secure Comparator has two parties — called "client" and "server" — the only difference between them is in who starts the comparison.

#### Secure Comparator client

```javascript
var client = new themis.SecureComparator(new Buffer("shared secret"))

// Client initiates comparison
var data = client.beginCompare()

while (!client.isCompareComplete()) {
    // Send data to server and receive response
    sendDataToServer(data)
    data = receiveFromServer()

    // Process response and prepare reply
    data = client.proceedCompare(data)
}
```

After the loop finishes, the comparison is over and its result can be checked by calling `isMatch()`:

```javascript
if (client.isMatch()) {
    // secrets match
} else {
    // secrets don't match
}
```

#### Secure Comparator server

The server part can be described in any language, but let's pretend here that both client and server are using JavaScript.

```javascript
var server = new themis.SecureComparator(new Buffer("shared secret"))

// Receive request, process it, and send back reply (until completion)
while (!server.isCompareComplete()) {
    var data = receiveFromClient()
    data = server.proceedCompare(data)
    sendToClient(data)
}
```

After the loop finishes, the comparison is over and its result can be checked by calling `isMatch`:

```javascript
if (server.isMatch()) {
    // secrets match
} else {
    // secrets don't match
}
```

This is it. See the full examples in [docs/examples/js](https://github.com/cossacklabs/themis/tree/master/docs/examples/js).
