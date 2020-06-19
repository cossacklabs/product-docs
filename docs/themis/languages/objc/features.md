---
weight: 5
title:  Features
---

# Features of ObjCThemis

<a id="importing-themis"></a>
## Using Themis

In order to use Themis, you need to import it first.

The header file is a bit different with each dependency manager. For **CocoaPods** use the following header:

```objc
#import <objcthemis/objcthemis.h>
```

If you install Themis via **Carthage**, please use this one:

```objc
#import <themis/themis.h>
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

To generate symmetric keys, use:

```objc
// Use TSKeyGenAsymmetricAlgorithmRSA to generate RSA keys instead
TSKeyGen *keypair = [[TSKeyGen alloc] initWithAlgorithm:TSKeyGenAsymmetricAlgorithmEC];

NSData *privateKey = keypair.privateKey;
NSData *publicKey = keypair.publicKey;
```

#### Symmetric key generation

Themis uses highly efficient and secure AES algorithm for symmetric cryptography.
A symmetric key is necessary for [Secure Cell](/pages/secure-cell-cryptosystem/) objects.

> **NOTE:** Symmetric key generation API will become available for objc-themis starting with Themis 0.13.0. For now, use common sense or consult [the wisdom of the Internet](https://stackoverflow.com/search?q=generate+cryptographically+secure+keys).

<!--
> ⚠️ **WARNING:**
> When you store generated keys, make sure they are sufficiently protected.
> See the guidelines [here](/pages/documentation-themis/#key-management).

To generate symmetric keys, use:

```objc
NSData *masterKey = TSGenerateSymmetricKey()
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

To encrypt a message, use client private key and server public key, and convert them to `NSData`:

```objc
// base64 encoded keys
NSString *serverPublicKeyString = @"VUVDMgAAAC2ELbj5Aue5xjiJWW3P2KNrBX+HkaeJAb+Z4MrK0cWZlAfpBUql";
NSString *clientPrivateKeyString = @"UkVDMgAAAC13PCVZAKOczZXUpvkhsC+xvwWnv3CLmlG0Wzy8ZBMnT+2yx/dg";

NSData *serverPublicKey =
    [[NSData alloc] initWithBase64EncodedString:serverPublicKeyString
                                        options:NSDataBase64DecodingIgnoreUnknownCharacters];
NSData *clientPrivateKey =
    [[NSData alloc] initWithBase64EncodedString:clientPrivateKeyString
                                        options:NSDataBase64DecodingIgnoreUnknownCharacters];
```

Initialise encrypter:

```objc
TSMessage *encrypter = [[TSMessage alloc] initInEncryptModeWithPrivateKey:clientPrivateKey
                                                            peerPublicKey:serverPublicKey];
```

Encrypt message:

```objc
NSString *message = @"All your base are belong to us!";

NSError *themisError;
NSData *encryptedMessage = [encrypter wrapData:[message dataUsingEncoding:NSUTF8StringEncoding]
                                         error:&themisError];
if (themisError) {
    NSLog(@"failed to encrypt: %@", themisError);
    return;
}
NSLog(@"encrypted message: %@", encryptedMessage);
```

Result (the encryption result on the same data chunk is different every time and can't be used as a test):

```
encrypted message: <20270426 53000000 00010140 0c000000 10000000 1f000000 ad443c21 d6d7df98 a101e48b b3757b04 c5710e04 5720b3c2 fe674f54 73e10ad4 ee722d3e 42244b6d c5099ac4 89dfda90 75fae62a aa733872 c8180d>
```

#### Decryption

Use server private key and client public key for decryption:

```objc
// base64 encoded keys
NSString *serverPrivateKeyString = @"UkVDMgAAAC1FsVa6AMGljYqtNWQ+7r4RjXTabLZxZ/14EXmi6ec2e1vrCmyR";
NSString *clientPublicKeyString = @"VUVDMgAAAC1SsL32Axjosnf2XXUwm/4WxPlZauQ+v+0eOOjpwMN/EO+Huh5d";

NSData *serverPrivateKey =
    [[NSData alloc] initWithBase64EncodedString:serverPrivateKeyString
                                        options:NSDataBase64DecodingIgnoreUnknownCharacters];
NSData *clientPublicKey =
    [[NSData alloc] initWithBase64EncodedString:clientPublicKeyString
                                        options:NSDataBase64DecodingIgnoreUnknownCharacters];
```

Initialise decrypter:

```objc
TSMessage *decrypter = [[TSMessage alloc] initInEncryptModeWithPrivateKey:serverPrivateKey
                                                            peerPublicKey:clientPublicKey];
```

Decrypt message:

```objc
NSError *themisError;
NSData *decryptedMessage = [decrypter unwrapData:encryptedMessage
                                           error:&themisError];
if (themisError) {
    NSLog(@"failed to decrypt: %@", themisError);
    return;
}

NSString *resultString = [[NSString alloc] initWithData:decryptedMessage
                                               encoding:NSUTF8StringEncoding];
NSLog(@"decrypted message: %@", resultString);
```

Result:

```
decrypted message: All your base are belong to us!
```

#### Sign / Verify

The only code difference from encrypt/decrypt mode is the initialiser methods:

```objc
TSMessage *signer = [[TSMessage alloc] initInSignVerifyModeWithPrivateKey:privateKey
                                                            peerPublicKey:nil];

TSMessage *verifier = [[TSMessage alloc] initInSignVerifyModeWithPrivateKey:nil
                                                              peerPublicKey:publicKey];
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

In order to initialise Secure Cell object, you will need to provide master key as NSData:

```objc
NSString *masterKeyString = @"SEl4eVMzd084SUVMbVlxQzBhTnVCVW1TdlRBb0p0ZnIK";
NSData *masterKeyData =
    [[NSData alloc] initWithBase64EncodedString:masterKeyString
                                        options:NSDataBase64DecodingIgnoreUnknownCharacters];
```

#### Secure Cell Seal Mode

Initialise encrypter/decrypter:

```objc
TSCellSeal *cellSeal = [[TSCellSeal alloc] initWithKey:masterKeyData];
```

Encrypt:

```objc
NSString *message = @"All your base are belong to us!";
NSString *context = @"For great justice";

// "context" is an optional parameter and may be omitted
NSError *themisError;
NSData *encryptedMessage = [cellSeal wrapData:[message dataUsingEncoding:NSUTF8StringEncoding]
                                      context:[context dataUsingEncoding:NSUTF8StringEncoding]
                                        error:&themisError];
if (themisError) {
    NSLog(@"failed to encrypt: %@", themisError);
    return;
}
NSLog(@"encrypted message: %@", encryptedMessage);
```

Decrypt:

```objc
NSError *themisError;
NSData *decryptedMessage = [cellSeal unwrapData:encryptedMessage
                                        context:[context dataUsingEncoding:NSUTF8StringEncoding]
                                          error:&themisError];
if (themisError) {
    NSLog(@"failed to decrypt: %@", themisError);
    return;
}

NSString *resultString = [[NSString alloc] initWithData:decryptedMessage
                                               encoding:NSUTF8StringEncoding];
NSLog(@"decrypted message: %@", resultString);
```

#### Secure Cell Token-Protect Mode

Initialise encrypter/decrypter:

```objc
TSCellToken *cellToken = [[TSCellToken alloc] initWithKey:masterKeyData];
```

Encryption:

```objc
NSString *message = @"Roses are grey. Violets are grey.";
NSString *context = @"I'm a dog";

// "context" is an optional parameter and may be omitted
NSError *themisError;
TSCellTokenEncryptedData *encryptedMessage =
    [cellToken wrapData:[message dataUsingEncoding:NSUTF8StringEncoding]
                context:[context dataUsingEncoding:NSUTF8StringEncoding]
                  error:&themisError];

if (themisError) {
    NSLog(@"failed to encrypt: %@", themisError);
    return;
}
NSLog(@"encrypted message: %@", encryptedMessage.cipherText);
NSLog(@"authentication token: %@", encryptedMessage.token);
```

Decryption:

```objc
NSError *themisError;
NSData *decryptedMessage = [cellToken unwrapData:encryptedMessage
                                         context:[context dataUsingEncoding:NSUTF8StringEncoding]
                                           error:&themisError];
if (themisError) {
    NSLog(@"failed to decrypt: %@", themisError);
    return;
}

NSString *resultString = [[NSString alloc] initWithData:decryptedMessage
                                               encoding:NSUTF8StringEncoding];
NSLog(@"decrypted message: %@", resultString);
```

#### Secure Cell Context-Imprint Mode

Initialise encrypter/decrypter:

```objc
TSCellContextImprint *contextImprint = [[TSCellContextImprint alloc] initWithKey:masterKeyData];
```

Encryption:

```objc
NSString *message = @"Roses are red. My name is Dave. This poem have no sense";
NSString *context = @"Microwave";

// "context" is a REQUIRED parameter for context-imprint mode
NSError *themisError;
NSData *encryptedMessage = [contextImprint wrapData:[message dataUsingEncoding:NSUTF8StringEncoding]
                                            context:[context dataUsingEncoding:NSUTF8StringEncoding]
                                              error:&themisError];
if (themisError) {
    NSLog(@"failed to encrypt: %@", themisError);
    return;
}

NSLog(@"encrypted message: %@", encryptedMessage);
```

Decryption:

```objc
NSError *themisError;
NSData *decryptedMessage = [contextImprint unwrapData:encryptedMessage
                                              context:[context dataUsingEncoding:NSUTF8StringEncoding]
                                                error:&themisError];
if (themisError) {
    NSLog(@"failed to decrypt: %@", themisError);
    return;
}

NSString *resultString = [[NSString alloc] initWithData:decryptedMessage
                                               encoding:NSUTF8StringEncoding];
NSLog(@"decrypted message: %@", resultString);
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

#### Secure Session workflow

Secure Session has two parts that are called client and server for the sake of simplicity, but they could be more precisely called initiator and acceptor - the only difference between them is in who starts the communication.

Secure Session relies on the user's passing a number of callback functions to send/receive messages - and the keys are retrieved from local storage (see more in [Secure Session cryptosystem description](/pages/secure-session-cryptosystem/)).



#### Initialise Secure Session

Client ID can be obtained from the server or generated by the client. You can play with [Themis Interactive Simulator (Themis Server)](/simulator/interactive/) to get the keys and simulate the whole client-server communication.

```objc

NSString *userId = [UIDevice currentDevice].name;

Transport *transport = [Transport new];
TSSession *session = [[TSSession alloc] initWithUserId:[userId dataUsingEncoding:NSUTF8StringEncoding]
                                            privateKey:privateKey
                                             callbacks:transport];
```

##### Transport interface

Implement transport interface to return server's public key. Transport layer simply returns server public key for requests using server ID.

```objc
NSString *const kServerKey = @"VUVDMgAAAC11WDPUAhLfH+nqSBHh+XGOJBHL/cCjbtasiLZEwpokhO5QTD6g";

@implementation Transport

- (NSData *)publicKeyFor:(NSData *)binaryId error:(NSError **)error {
    NSString *stringFromData = [[NSString alloc] initWithData:binaryId
                                                     encoding:NSUTF8StringEncoding];
    if ([stringFromData isEqualToString:@"server"]) {
        return [[NSData alloc] initWithBase64EncodedString:kServerKey
                                                   options:NSDataBase64DecodingIgnoreUnknownCharacters];
    }
    return nil;
}

@end
```

#### Connect Secure Session

```objc
NSError *error;
NSData *sessionEstablishingData = [session connectRequest:&error];
if (error) {
    NSLog(@"failed to generate connection request: %@", error);
    return;
}
// send "sessionEstablishingData" to the server
```

Client should send `sessionEstablishingData`, get response and check if `isSessionEstablished` before sending payload.

```objc
NSData *responseData = ... // received server response data after sending "sessionEstablishingData"

NSError *error;
NSData *unwrappedData = [session unwrapData:responseData error:&wrappingError];
if (error) {
    NSLog(@"failed to negotiate: %@", error);
    return;
}

if ([session isSessionEstablished]) {
    // session is established, break out of the loop
}

// session is NOT established yet
// send "unwrappedData" to the server again
```

After the loop finishes, Secure Session is established and is ready to be used.

#### Send and receive data

```objc
NSString *message = @"message to send";

NSError *error;
NSData *wrappedData = [session wrapData:[message dataUsingEncoding:NSUTF8StringEncoding]
                                  error:&error];
if (error) {
    NSLog(@"failed to encrypt: %@", error);
    return;
}

// send "wrappedData" using NSURLSession or any other kind of transport

...

NSData *receivedData = ...; // receive data from network here

NSError *error;
NSData *unwrappedMessage = [session unwrapData:receivedData error:&error];

if (error) {
    NSLog(@"failed to decrypt: %@", error);
    return;
}

NSString * receivedMessage = [[NSString alloc] initWithData:unwrappedMessage
                                                   encoding:NSUTF8StringEncoding];
// process "receivedMessage"
```

That's it!

See the [docs/examples/Themis-server/Obj-C](https://github.com/cossacklabs/themis/tree/master/docs/examples/Themis-server/Obj-C) project to gain a full understanding and overview of how Secure Session works.



### Secure Comparator

Secure Comparator is an interactive protocol for two parties that compares whether they share the same secret or not. It is built around a [Zero Knowledge Proof](https://www.cossacklabs.com/zero-knowledge-protocols-without-magic.html)-based protocol ([Socialist Millionaire's Protocol](https://en.wikipedia.org/wiki/Socialist_millionaires)), with a number of [security enhancements](https://www.cossacklabs.com/files/secure-comparator-paper-rev12.pdf).

Secure Comparator is transport-agnostic and only requires the user(s) to pass messages in a certain sequence. The protocol itself is ingrained into the functions and requires minimal integration efforts from the developer.

#### Secure Comparator workflow

Secure Comparator has two parties — called "client" and "server" — the only difference between them is in who starts the comparison.

#### Secure Comparator client

```objc
NSString *sharedSecret = @"shared secret";
NSData *sharedSecretData = [sharedSecret dataUsingEncoding:NSUTF8StringEncoding];

TSComparator *client = [[TSComparator alloc] initWithMessageToCompare:sharedSecretData];

NSError *error;
NSData *data = [client beginCompare:&error];

while ([client status] == TSComparatorNotReady) {
    // send data to the server, receive response, and process it
    [self sendDataToServer:data];
    data = [self receiveResponseFromServer];
    data = [client proceedCompare:data error:&error];
}
```

After the loop finishes, the comparison is over and its result can be checked by calling `status`:

```objc
if ([client status] == TSComparatorMatch) {
    // secrets match
    NSLog(@"SecureComparator secrets match");
} else {
    // secrets don't match
    NSLog(@"SecureComparator secrets don't match");
}
```

#### Secure Comparator server

The server part can be described in any language, but let's pretend here that both client and server are using Objective-C.

```objc
NSString *sharedSecret = @"shared secret";
NSData *sharedSecretData = [sharedSecret dataUsingEncoding:NSUTF8StringEncoding];

TSComparator *server = [[TSComparator alloc] initWithMessageToCompare:sharedSecretData];

NSError *error;
while ([server status] == TSComparatorNotReady) {
    // receive from client, process, and send reply
    NSData *data = [self receiveFromClient];
    data = [server proceedCompare:data error:&error];
    [self sendDataToClient:data];
}
```

After the loop finishes, the comparison is over and its result can be checked by calling `status`:

```objc
if ([server status] == TSComparatorMatch) {
    // secrets match
    NSLog(@"SecureComparator secrets match");
} else {
    // secrets don't match
    NSLog(@"SecureComparator secrets do not match");
}
```
