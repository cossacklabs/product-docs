---
weight: 4
title:  Features
---

# Features of GoThemis

## Using Themis

In order to use Themis, you need to import it first.

Add relevant modules to your code:

```go
import "github.com/cossacklabs/themis/gothemis/cell"
import "github.com/cossacklabs/themis/gothemis/compare"
import "github.com/cossacklabs/themis/gothemis/keys"
import "github.com/cossacklabs/themis/gothemis/message"
import "github.com/cossacklabs/themis/gothemis/session"
```

And you're good to go!

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

```golang
// Use keys.TypeRSA to generate RSA keys instead
keypair, err := keys.New(keys.TypeEC)

privateKey := keypair.Private
publicKey := keypair.Public
```

#### Symmetric key generation

Themis uses highly efficient and secure AES algorithm for symmetric cryptography.
A symmetric key is necessary for [Secure Cell](/pages/secure-cell-cryptosystem/) objects.

> **NOTE:** Symmetric key generation API will become available for gothemis starting with Themis 0.13.0. For now, use common sense or consult [the wisdom of the Internet](https://stackoverflow.com/search?q=generate+cryptographically+secure+keys).

<!--
> ⚠️ **WARNING:**
> When you store generated keys, make sure they are sufficiently protected.
> You can find the guidelines [here](/pages/documentation-themis/#key-management).

To generate symmetric keys, use:

```golang
masterKey, err := keys.NewSymmetricKey()
```
-->

### Secure Message

The Secure Message functions provide a sequence-independent, stateless, contextless messaging system. This may be preferred in cases that don't require frequent sequential message exchange and/or in low-bandwidth contexts. This is secure enough to exchange messages from time to time, but if you'd like to have Perfect Forward Secrecy and higher security guarantees, consider using [Secure Session](#secure-session) instead.

The Secure Message functions offer two modes of operation:

In **Sign/Verify** mode, the message is signed using the sender's private key and is verified by the receiver using the sender's public key. The message is packed in a suitable container and ECDSA is used by default to sign the message (when RSA key is used, RSA+PSS+PKCS#7 digital signature is used).

In **Encrypt/Decrypt** mode, the message will be encrypted with a randomly generated key (in RSA) or a key derived by ECDH (in ECDSA), via symmetric algorithm with Secure Cell in seal mode (keys are 256 bits long).

The mode is selected by using appropriate methods. The sender uses `wrap` and `unwrap` methods for encrypt/decrypt mode. A valid public key of the receiver and a private key of the sender are required in this mode. For sign/verify mode `sign` and `verify` methods should be used. They only require a private key for signing and a public key for verification respectively.

Read more about the Secure Message's cryptographic internals [here](/pages/secure-message-cryptosystem/).


#### Processing messages

**1.** Create `SecureMessage` object with your PrivateKey and recipient's PublicKey:

```golang
import "github.com/cossacklabs/themis/gothemis/message"

// for encryption & decryption
encryptor := message.New(yourPrivateKey, peerPublicKey)

// for signing messages
signer := message.New(yourPrivateKey, nil)

// for signature verification
verifier := message.New(nil, peerPublicKey)
```

For signing/verifying make sure that you use keys from the same keypair – private key for signing message and public key for verifying message.

**2.** Process each outgoing message:

```golang
encryptedMessage, err := encryptor.Wrap(messageToSend)
signedMessage, err := signer.Sign(messageToSign)
```

**3.** Process each incoming message:

```golang
receivedMessage, err := encryptor.Unwrap(encryptedMessage)
verifiedMessage, err := verifier.Verify(signedMessage)
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

Create `SecureCell` object to protect your data:

```golang
import "github.com/cossacklabs/themis/gothemis/cell"

secureCell := cell.New(masterKey, cell.ModeSeal)
// or in other modes:
//   - cell.ModeTokenProtect
//   - cell.ModeContextImprint
```

> **NOTE:** Read more about Secure Cell modes and which to choose [here](/pages/secure-cell-cryptosystem/).

#### Secure Cell Seal Mode

Initialise cell:

```golang
secureCell := cell.New(masterKey, cell.ModeSeal)
```

Encrypt:

```golang
// context may be "nil"
protectedData, _, err := secureCell.Protect(data, context)
```

Second result `_` is additional data that is always `nil` in this mode.

Decrypt:

The context should be same as in the protect function call for successful decryption (and may be `nil`).

```golang
data, err := secureCell.Unprotect(protectedData, nil, context)
```

#### Secure Cell Token-Protect Mode

Initialise cell:

```golang
secureCell := cell.New(masterKey, cell.ModeTokenProtect)
```

Encrypt:

```golang
// context may be "nil"
protectedData, additionalData, err := secureCell.Protect(data, context)
```

In this mode, the result has additional data (which is opaque to the user but is necessary for successful decryption).

Decrypt:

The context should be the same as in the protect function call for successful decryption.

```golang
data, err := secureCell.Unprotect(protectedData, additionalData, context)
```

##### Secure Cell Context-Imprint Mode

Initialise cell:

```golang
secureCell := cell.New(masterKey, cell.ModeContextImprint)
```

Encrypt:

```golang
// context is *required* in context-imprint mode
protectedData, _, err := secureCell.Protect(data, context)
```

Second parameter `_` is additional data that is `nil` in this mode.

Decrypt:

The context should be the same as in the protect function call for successful decryption.

```golang
data, err := secureCell.Unprotect(protectedData, nil, context)
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
- Once a connection is established, clients and servers may exchange secure messages according to whatever application level protocol was chosen.

#### Secure Session Workflow

Secure Session has two parties called "client" and "server" for the sake of simplicity, but they could be more precisely called "initiator" and "acceptor" — the only difference between them is in who starts the communication.

Secure Session relies on the user's passing a number of callback functions to send/receive messages — and the keys are retrieved from local storage (see more in [Secure Session cryptosystem description](/pages/secure-session-cryptosystem/)).

#### Using Secure Session

**1.** Implement `session.SessionCallbacks` interface:
  * `GetPublicKeyForId` which will return peer's trusted public key when needed by the system
  * `StateChanged` is just a notification callback. You may use it for informational purpose, to update your UI or just have a dummy (do-nothing) implementation

```golang
import "github.com/cossacklabs/themis/gothemis/session"
import "github.com/cossacklabs/themis/gothemis/keys"

type callbacks struct {
        // ...
}

func (clb *callbacks) GetPublicKeyForId(ss *session.SecureSession, id []byte) (*keys.PublicKey) {
        pub := getPublicKeyFromDatabaseOrSomeOtherStorageOrSource(id)

        return pub // or nil if key was not found
}

func (clb *callbacks) StateChanged(ss *session.SecureSession, state int) {
        // Do something if you wish.
        // state constants:
        //   - session.StateIdle
        //   - session.StateNegotiating
        //   - session.StateEstablished
}
```

**2.** Create `SecureSession` object:

```golang
session, err := session.New(yourId, yourPrivateKey, &callbacks{})
```

**3.** On the client side, initiate Secure Session negotiation by generating and sending connection request:

```golang
connectRequest, err = session.ConnectRequest();
// send connectRequest to the server
```

**4.** Start receiving and parsing incoming data on both sides:

```golang
// receive some data and store it in receiveBuffer

// "receiveBuffer" contains encrypted data from your peer,
// try decrypting it...
data, sendPeer, err := session.Unwrap(receiveBuffer)
if err != nil {
        // handle error
}
if sendPeer {
        // "receiveBuffer" is a part of the negotiation protocol:
        // so "data" contains the response to this protocol,
        // which needs to be forwarded to your peer as is.

        // Just send "data" to your peer.
} else {
        // "data" may be nil on the client when the Secure Session
        // completes connection negotiation.
        if data != nil {
                // Now "data" contains decrypted data.

                // Process "data" according to your application.
        }
}
```

**5.** When the protocol negotiation finishes, you may send the encrypted data to your peer:

```golang
wrappedData, err := session.Wrap(yourData);
// send wrappedData to your peer
```

See[Secure Session test](https://github.com/cossacklabs/themis/blob/master/gothemis/session/session_test.go) and [Secure Session Examples](https://github.com/cossacklabs/themis/tree/master/docs/examples/go) to get the complete vision how Secure Session works.

### Secure Comparator

Secure Comparator is an interactive protocol for two parties that compares whether they share the same secret or not. It is built around a [Zero Knowledge Proof](https://www.cossacklabs.com/zero-knowledge-protocols-without-magic.html)-based protocol ([Socialist Millionaire's Protocol](https://en.wikipedia.org/wiki/Socialist_millionaires)), with a number of [security enhancements](https://www.cossacklabs.com/files/secure-comparator-paper-rev12.pdf).

Secure Comparator is transport-agnostic and only requires the user(s) to pass messages in a certain sequence. The protocol itself is ingrained into the functions and requires minimal integration efforts from the developer.

#### Secure Comparator workflow

Secure Comparator has two parties — called "client" and "server" — the only difference between them is in who starts the comparison.

#### Secure Comparator client

```golang
import "github.com/cossacklabs/themis/gothemis/compare"

// create secure comparator and append secret
scomparator, err := compare.New()
err = scomparator.Append(sharedSecret) // some byte[]

// Client initiates secure comparison.
buffer, err := scomparator.Begin()

for {
        // Stop if the comparison is ready.
        res, err := scomparator.Result()
        if res != compare.NotReady {
                break
        }

        // Send "buffer" to the server and receive "reply".

        // Proceed with comparison...
        buffer, err = scomparator.Proceed(reply)
}

res, err := scomparator.Result()
if err != nil {
        // handle failed comparison
}
if res == compare.Match {
        fmt.Println("match")
} else {
        fmt.Println("not match")
}
```

After the loop finishes, the comparison is over and its result can be checked by calling `scomparator.Result()`.

#### Secure Comparator server

The server part can be described in any language, but let's pretend here that both client and server are using Go.

```golang
import "github.com/cossacklabs/themis/gothemis/compare"

// create secure comparator and append secret
scomparator, err := compare.New()
err = scomparator.Append(sharedSecret) // byte[]

// The server does not initiate connection.

for {
        // Stop if the comparison is ready.
        res, err := scomparator.Result()
        if res != compare.NotReady {
                break
        }

        // Receive "buffer" from the client.

        // Proceed with comparison...
        reply, err = scomparator.Proceed(buffer)

        // Send "reply" back to the client, if not empty.
}

res, err := scomparator.Result()
if err != nil {
        // handle failed comparison
}
if res == compare.Match {
        fmt.Println("match")
} else {
        fmt.Println("not match")
}
```

After the loop finishes, the comparison is over and its result can be checked by calling `scomparator.Result()`.

Check out [Secure Comparator Examples](https://github.com/cossacklabs/themis/tree/master/docs/examples/go) to gain a complete understanding of how Secure Comparator works.
