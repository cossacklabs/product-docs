---
weight: 5
title:  Features
---

# Features of SwiftThemis

<a id="importing-themis"></a>
## Using Themis

In order to use Themis, you need to import it first:

```swift
import themis
```

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

You can easily generate asymmetric keypairs the following way:

```swift
// Use ".RSA" to generate RSA keys instead
let keypairGenerator = TSKeyGen(algorithm: .EC)!

let privateKey: Data = keypairGenerator.privateKey!
let publicKey: Data = keypairGenerator.publicKey!
```

#### Symmetric key generation

Themis uses highly efficient and secure AES algorithm for symmetric cryptography.
A symmetric key is necessary for [Secure Cell](/pages/secure-cell-cryptosystem/) objects.

> **NOTE:** Symmetric key generation API will become available for Swift with Themis 0.13.0. For now, use common sense or consult [the wisdom of the Internet](https://stackoverflow.com/search?q=generate+cryptographically+secure+keys).

<!--
> ⚠️ **WARNING:**
> When you store generated keys, make sure they are sufficiently protected.
> You can find the guidelines [here](/pages/documentation-themis/#key-management).

To generate symmetric keys, use:

```swift
let masterKey: Data = TSGenerateSymmetricKey()!
```

-->

### Secure Message

The Secure Message functions provide a sequence-independent, stateless, contextless messaging system. This may be preferred in cases that don't require frequent sequential message exchange and/or in low-bandwidth contexts. This is secure enough to exchange messages from time to time, but if you'd like to have Perfect Forward Secrecy and higher security guarantees, consider using [Secure Session](#secure-session) instead.

The Secure Message functions offer two modes of operation:

In **Sign/Verify** mode, the message is signed using the sender's private key and is verified by the receiver using the sender's public key. The message is packed in a suitable container and ECDSA is used by default to sign the message (when RSA key is used, RSA+PSS+PKCS#7 digital signature is used).

In **Encrypt/Decrypt** mode, the message will be encrypted with a randomly generated key (in RSA) or a key derived by ECDH (in ECDSA), via symmetric algorithm with Secure Cell in seal mode (keys are 256 bits long).

The mode is selected by using appropriate methods. The sender uses `wrap` and `unwrap` methods for encrypt/decrypt mode. A valid public key of the receiver and a private key of the sender are required in this mode. For sign/verify mode `sign` and `verify` methods should be used. They only require a private key for signing and a public key for verification respectively.

Read more about the Secure Message's cryptographic internals [here](/pages/secure-message-cryptosystem/).

#### Encryption

To encrypt a message use client private key and server public key and convert them to `NSData`:

```swift
// base64-encoded keys
let serverPublicKeyString = "VUVDMgAAAC2ELbj5Aue5xjiJWW3P2KNrBX+HkaeJAb+Z4MrK0cWZlAfpBUql"
let clientPrivateKeyString = "UkVDMgAAAC13PCVZAKOczZXUpvkhsC+xvwWnv3CLmlG0Wzy8ZBMnT+2yx/dg"

guard
    let serverPublicKey = Data(base64Encoded: serverPublicKeyString),
    let clientPrivateKey = Data(base64Encoded: clientPrivateKeyString)
else {
    print("failed to decode base64")
    return
}
```

Initialise encrypter:

```swift
let encrypter = TSMessage(inEncryptModeWithPrivateKey: clientPrivateKey,
                          peerPublicKey: serverPublicKey)!
```

Encrypt message:

```swift
let message = "- Knock, knock.\n- Who’s there?\n*very long pause...*\n- Java."

do {
    let encryptedMessage = try encrypter.wrap(message.data(using: .utf8))
    print("encrypted message: \(encryptedMessage)")
}
catch let error as NSError {
    print("failed to encrypt message: \(error)")
    return
}
```

Result (the encryption result for the same data chunk is different every time and can't be used as a test):

```
encrypted message: <20270426 53000000 00010140 0c000000 10000000 1f000000 ad443c21 d6d7df98 a101e48b b3757b04 c5710e04 5720b3c2 fe674f54 73e10ad4 ee722d3e 42244b6d c5099ac4 89dfda90 75fae62a aa733872 c8180d>
```

#### Decryption

Use the server private key and the client public key for decryption:

```swift
// base64 encoded keys
let serverPrivateKeyString = "UkVDMgAAAC1FsVa6AMGljYqtNWQ+7r4RjXTabLZxZ/14EXmi6ec2e1vrCmyR"
let clientPublicKeyString = "VUVDMgAAAC1SsL32Axjosnf2XXUwm/4WxPlZauQ+v+0eOOjpwMN/EO+Huh5d"

guard
    let serverPrivateKey = Data(base64Encoded: serverPrivateKeyString),
    let clientPublicKey = Data(base64Encoded: clientPublicKeyString)
else {
    print("failed to decode base64")
    return
}

```

Initialise decrypter:

```swift
let decrypter = TSMessage(inEncryptModeWithPrivateKey: serverPrivateKey,
                          peerPublicKey: clientPublicKey)!
```

Decrypt message:

```swift
do {
    let decryptedMessage = try decrypter.unwrapData(encryptedMessage)
    print("decrypted message: \(decryptedMessage)")
}
catch let error as NSError {
    print("failed to decrypt message: \(error)")
    return
}
```

Result:

```
decrypted message: - Knock, knock.\n- Who’s there?\n*very long pause...*\n- Java.!
```

#### Sign / Verify

The only code difference between sign/verify and encrypt/decrypt mode is in the initialiser:

```swift
let signer = TSMessage(inSignVerifyModeWithPrivateKey: privateKey,
                       peerPublicKey: nil)!

let verifier = TSMessage(inSignVerifyModeWithPrivateKey: nil,
                         peerPublicKey: publicKey)!
```

Use private key for signing message and public key from the same keypair for verifying message.

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

In order to initialise Secure Cell object, you will need to provide master key as Data:

```swift
let masterKeyString = "ZG43anZDcWNFNWh6bU8yNWdsZjlsUzhaNlhkdzA1bXgK"
let masterKeyData = Data(base64Encoded: masterKeyString)!
```

#### Secure Cell Seal Mode

Initialise encrypter/decrypter:

```swift
guard let cellSeal = TSCellSeal(key: masterKeyData) else {
    print("failed to initialize seal mode")
    return
}
```

Encryption:

```swift
let message = "all your base are belong to us"
let context = "for the great justice"

do {
    // "context" is an optional parameter and may be omitted
    let encryptedMessage = try cellSeal.wrap(message.data(using: .utf8)!,
                                             context: context.data(using: .utf8)!)
    print("encrypted message: \(encryptedMessage)")
}
catch let error as NSError {
    print("failed to encrypt message: \(error)")
    return
}
```

Decryption:

```swift
do {
    let decryptedMessage = try cellSeal.unwrapData(encryptedMessage,
                                                   context: context.data(using: .utf8)!)
    print("decrypted message: ", String(data: decryptedMessage, encoding: .utf8)!)
}
catch let error as NSError {
    print("failed to decrypt message: \(error)")
    return
}
```

#### Secure Cell Token-Protect Mode

Initialise encrypter/decrypter:

```swift
guard let cellToken = TSCellToken(key: masterKeyData) else {
    print("failed to initialize token-protect mode")
    return
}
```

Encryption:

```swift
let message = "Roses are grey. Violets are grey."
let context = "I'm a dog"

var encryptedMessage: TSCellTokenEncryptedData = TSCellTokenEncryptedData()
do {
    // "context" is an optional parameter and may be omitted
    let encryptedMessage = try cellToken.wrap(message.data(using: .utf8)!,
                                              context: context.data(using: .utf8)!)
    print("encrypted message: \(encryptedMessage.cipherText)")
    print("authentication token: \(encryptedMessage.token)")
}
catch let error as NSError {
    print("failed to encrypt: \(error)")
    return
}
```

Decryption:

```swift
do {
    let decryptedMessage = try cellToken.unwrapData(encryptedMessage,
                                                    context: context.data(using: .utf8)!)
    print("decrypted message: ", String(data: decryptedMessage, encoding: .utf8)!)
}
catch let error as NSError {
    print("failed to decrypt message: \(error)")
    return
}
```

#### Secure Cell Context-Imprint Mode

Initialise encrypter/decrypter:

```swift
guard let contextImprint = TSCellContextImprint(key: masterKeyData) else {
    print("failed to initialize context-imprint mode")
    return
}
```

Encryption:

```swift
let message = "Roses are red. My name is Dave. This poem makes no sense"
let context = "Microwave"

do {
    // "context" is a REQUIRED parameter here
    let encryptedMessage = try contextImprint.wrap(message.data(using: .utf8)!,
                                                   context: context.data(using: .utf8)!)
    print("encrypted message: \(encryptedMessage)")
}
catch let error as NSError {
    print("failed to encrypt message: \(error)")
    return
}
```

Decryption:

```swift
do {
    let decryptedMessage = try contextImprint.unwrapData(encryptedMessage,
                                                         context: context.data(using: .utf8)!)
    print("decrypted message: ", String(data: decryptedMessage, encoding: .utf8)!)
}
catch let error as NSError {
    print("failed to decrypt message: \(error)")
    return
}
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


#### Initialise Secure Session

Client ID can be obtained from the server or is generated by the client. You can play with [Themis Interactive Simulator (Themis Server)](/simulator/interactive/) to get the keys and simulate the whole client-server communication.

```swift
guard
    let clientIdData = clientId.data(using: String.Encoding.utf8),
    let clientPrivateKey = Data(base64Encoded: kClientPrivateKey)
else {
    print("failed to decode base64")
    return
}

var transport = Transport()
transport.setupKeys(kServerId, serverPublicKey: kServerPublicKey)

let session = TSSession(userId: clientIdData, privateKey: clientPrivateKey, callbacks: transport)
```

#### Transport interface

Implement transport interface to return server's public key. Transport layer simply returns server public key for requests using server ID.

```swift
final class Transport: TSSessionTransportInterface {

    fileprivate var serverId: String?
    fileprivate var serverPublicKeyData: Data?

    func setupKeys(_ serverId: String, serverPublicKey: String) {
        self.serverId = serverId
        self.serverPublicKeyData = Data(base64Encoded: serverPublicKey,
                                        options: .ignoreUnknownCharacters)
    }

    override func publicKey(for binaryId: Data!) throws -> Data {
        let error: Error = NSError(domain: "com.themisserver.example", code: -1, userInfo: nil)
        let stringFromData = String(data: binaryId, encoding: String.Encoding.utf8)
        if stringFromData == nil {
            throw error
        }

        if stringFromData == serverId {
            guard let resultData: Data = serverPublicKeyData else {
                throw error
            }
            return resultData
        }

        return Data()
    }
}
```

#### Connect Secure Session

```swift
do {
    guard let connectionMessage = try session!.connectRequest() else {
        throw NSError(domain: "com.themisserver.example", code: -2, userInfo: nil)
    }
    // send "connectionMessage" to server
}
catch let error {
    print("failed to generate connection request: \(error)")
    return
}
```

Client should send `connectionMessage`, get response, and check if `isSessionEstablished` before sending payload.

```swift
let data: Data = ... // received server response data after sending "connectionMessage"

do {
    guard let decryptedMessage = try session!.unwrapData(data) else {
        throw NSError(domain: "com.themisserver.example", code: -4, userInfo: nil)
    }
    if session!.isSessionEstablished() {
        // session is established: break out of loop
    } else {
        // session is NOT established yet
        // send "decryptedMessage" to the server
    }
}
catch let error {
    print("failed to negotiate: \(error)")
    return
}
```

After the loop finishes, Secure Session is established and is ready to be used.


#### Send and receive data

```swift
do {
    guard let encryptedMessage = try session?.wrap(message.data(using: String.Encoding.utf8)) else {
        throw NSError(domain: "com.themisserver.example", code: -5, userInfo: nil)
    }
    // send "encryptedMessage" to the server
} catch let error {
    print("failed to encrypt: \(error)")
    return
}

// ...

do {
    guard let decryptedMessage = try session!.unwrapData(data) else {
        throw NSError(domain: "com.themisserver.example", code: -6, userInfo: nil)
    }
    // "decryptedMessage" contains server response
}
catch let error {
    print("failed to decrypt: \(error)")
    return
}
```

This is it. See the full example in [docs/examples/Themis-server/swift](https://github.com/cossacklabs/themis/tree/master/docs/examples/Themis-server/swift).

### Secure Comparator

Secure Comparator is an interactive protocol for two parties that compares whether they share the same secret or not. It is built around a [Zero Knowledge Proof](https://www.cossacklabs.com/zero-knowledge-protocols-without-magic.html)-based protocol ([Socialist Millionaire's Protocol](https://en.wikipedia.org/wiki/Socialist_millionaires)), with a number of [security enhancements](https://www.cossacklabs.com/files/secure-comparator-paper-rev12.pdf).

Secure Comparator is transport-agnostic and only requires the user(s) to pass messages in a certain sequence. The protocol itself is ingrained into the functions and requires minimal integration efforts from the developer.

#### Secure Comparator workflow

Secure Comparator has two parties — called "client" and "server" — the only difference between them is in who starts the comparison.

#### Secure Comparator client

```swift
let sharedMessage = "shared secret"

let client = TSComparator(messageToCompare: sharedMessage.data(using: .utf8)!)!

var data = try? client.beginCompare()

while (client.status() == TSComparatorStateType.comparatorNotReady) {
    // send data to the server, receive response, and process it
    self.sendDataOnServer(data)
    data = self.receiveServerResponse()
    data = try? client.proceedCompare(data)
}
```

After the loop finishes, the comparison is over and its result can be checked by calling `status`:

```swift
if (client.status() == TSComparatorStateType.comparatorMatch) {
    // secrets match
    print("SecureComparator secrets match")
} else {
    // secrets don't match
    print("SecureComparator secrets do not match")
}
```

#### Secure Comparator server

The server part can be described in any language, but let's pretend here that both client and server are using Swift.

```swift
let sharedMessage = "shared secret"
let server = TSComparator(messageToCompare: sharedMessage.data(using: .utf8)!)!

var data: Data

while (server.status() == TSComparatorStateType.comparatorNotReady) {
    // receive from client, process, and send reply
    data = self.receiveFromClient()
    data = try? server.proceedCompare(data)
    self.sendToClient(data)
}
```

After the loop finishes, the comparison is over and its result can be checked by calling `status`:

```swift
if (server.status() == TSComparatorStateType.comparatorMatch) {
    // secrets match
    print("SecureComparator secrets match")
} else {
    // secrets don't match
    print("SecureComparator secrets do not match")
}
```
