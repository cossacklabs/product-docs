---
weight: 4
title:  Features
---

# Features of RustThemis

After you have [installed RustThemis](../installation/),
it is ready to use in your application!

## Using Themis

In order to use RustThemis,
you need to import modules for relevant cryptosystems:

```rust
use themis::keygen;
use themis::secure_cell;
use themis::secure_message;
use themis::secure_session;
use themis::secure_comparator;
```

## Key generation

### Asymmetric keypairs

Themis supports both Elliptic Curve and RSA algorithms for asymmetric cryptography.
Algorithm type is chosen according to the generated key type.
Asymmetric keys are used by [Secure Message](#secure-message)
and [Secure Session](#secure-session) objects.

For learning purposes,
you can play with [Themis Interactive Simulator](/docs/themis/debugging/themis-server/)
to use the keys and simulate the whole client-server communication.

{{< hint warning >}}
**Warning:**
When using public keys of other peers, make sure they come from trusted sources
to prevent Man-in-the-Middle attacks.

When handling private keys of your users, make sure the keys are sufficiently protected.
You can find [key management guidelines here](/docs/themis/crypto-theory/key-management/).
{{< /hint >}}

To generate asymmetric keypairs, use:

```rust
use themis::keygen;

// Use gen_rsa_key_pair() to generate RSA keys instead.
let key_pair = keygen::gen_ec_key_pair();

let (private_key, public_key) = key_pair.split();
```

### Symmetric keys

Themis uses highly efficient and secure AES algorithm for symmetric cryptography.
A symmetric key is necessary for [Secure Cell](#secure-cell) objects.

{{< hint warning >}}
**Warning:**
When handling symmetric keys of your users, make sure the keys are sufficiently protected.
You can find [key management guidelines here](/docs/themis/crypto-theory/key-management/).
{{< /hint >}}

To generate symmetric keys, use:

```rust
use themis::keys::SymmetricKey;

let master_key = SymmetricKey::new();
```

## Secure Cell

[**Secure Сell**](/docs/themis/crypto-theory/crypto-systems/secure-cell/)
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

    [KDF]: /docs/themis/crypto-theory/crypto-systems/secure-cell/#key-derivation-functions

Secure Cell supports 3 operation modes:

  - **[Seal mode](#seal-mode)** is the most secure and easy to use.
    Your best choice most of the time.
    This is also the only mode that supports passphrases at the moment.

  - **[Token Protect mode](#token-protect-mode)** is just as secure, but a bit harder to use.
    This is your choice if you need to keep authentication data separate.

  - **[Context Imprint mode](#context-imprint-mode)** is a length-preserving version of Secure Cell
    with no additional data stored. Should be used carefully.

Read more about
[Secure Cell cryptosystem design](/docs/themis/crypto-theory/crypto-systems/secure-cell/)
to understand better the underlying considerations, limitations, and features of each mode.

See [full API reference here](https://docs.rs/themis/latest/themis/secure_cell/index.html).

### Seal mode

[**Seal mode**](/docs/themis/crypto-theory/crypto-systems/secure-cell/#seal-mode)
is the most secure and easy to use mode of Secure Cell.
This should be your default choice unless you need specific features of the other modes.

Initialise a Secure Cell with a secret of your choice to start using it.
Seal mode supports [symmetric keys](#symmetric-keys) and passphrases.

{{< hint info >}}
Each secret type has its pros and cons.
Read about [Key derivation functions](/docs/themis/crypto-theory/crypto-systems/secure-cell/#key-derivation-functions) to learn more.
{{< /hint >}}

```rust
use themis::keys::SymmetricKey;
use themis::secure_cell::SecureCell;

let symmetric_key = SymmetricKey::new();
let cell = SecureCell::with_key(&symmetric_key)?.seal();

// OR

let cell = SecureCell::with_passphrase("a password")?.seal();
```

Now you can encrypt your data using the `encrypt_with_context` method:

```rust
let plaintext = b"a message";
let context = b"code sample";

let encrypted = cell.encrypt_with_context(plaintext, context)?;
```

The _associated context_ argument is optional, it can be empty
(or use `encrypt` which accept just the plaintext).

Seal mode produces encrypted cells that are slightly longer than the input:

```rust
assert!(encrypted.len() > plaintext.len());
```

You can decrypt the data back using the `decrypt_with_context` method
(or `decrypt` if there is no associated context):

```rust
match cell.decrypt_with_context(encrypted, context) {
    Ok(decrypted) => {
        // process decrypted data
    }
    Err(error) => {
        // handle decryption failure
    }
}
```

Make sure to initialise the Secure Cell with the same secret
and provide the same associated context as used for encryption.
Secure Cell will return an error if those are incorrect or if the encrypted data was corrupted.

### Token Protect mode

[**Token Protect mode**](/docs/themis/crypto-theory/crypto-systems/secure-cell/#token-protect-mode)
should be used if you cannot allow the length of the encrypted data to grow
but have additional storage available elsewhere for the authentication token.
Other than that,
Token Protect mode has the same security properties as the Seal mode.

Initialise a Secure Cell with a secret of your choice to start using it.
Token Protect mode supports only [symmetric keys](#symmetric-keys).

```rust
use themis::keys::SymmetricKey;
use themis::secure_cell::SecureCell;

let symmetric_key = SymmetricKey::new();

let cell = SecureCell::with_key(&symmetric_key)?.token_protect();
```

Now you can encrypt your data using the `encrypt_with_context` method:

```rust
let plaintext = b"a message";
let context = b"code sample";

let (encrypted, token) = cell.encrypt_with_context(plaintext, context)?;
```

The _associated context_ argument is optional, it can be empty
(or use `encrypt` which accept just the plaintext).

Token Protect mode produces encrypted text and authentication token separately.
Encrypted data has the same length as the input:

```rust
assert!(encrypted.len() == plaintext.len());
```

You need to save both the encrypted data and the token, they are necessary for decryption.
Use the `decrypt_with_context` method for that
(or `decrypt` if there is no associated context):

```rust
match cell.decrypt_with_context(encrypted, token, context) {
    Ok(decrypted) => {
        // process decrypted data
    }
    Err(error) => {
        // handle decryption failure
    }
}
```

Make sure to initialise the Secure Cell with the same secret
and provide the same associated context as used for encryption.
Secure Cell will return an error if those are incorrect
or if the data or the authentication token was corrupted.

### Context Imprint mode

[**Context Imprint mode**](/docs/themis/crypto-theory/crypto-systems/secure-cell/#context-imprint-mode)
should be used if you absolutely cannot allow the length of the encrypted data to grow.
This mode is a bit harder to use than the Seal and Token Protect modes.
Context Imprint mode also provides slightly weaker integrity guarantees.

Initialise a Secure Cell with a secret of your choice to start using it.
Context Imprint mode supports only [symmetric keys](#symmetric-keys).

```rust
use themis::keys::SymmetricKey;
use themis::secure_cell::SecureCell;

let symmetric_key = SymmetricKey::new();

let cell = SecureCell::with_key(&symmetric_key)?.context_imprint();
```

Now you can encrypt your data using the `encrypt_with_context` method:

```rust
let plaintext = b"a message";
let context = b"code sample";

let encrypted = cell.encrypt_with_context(plaintext, context)?;
```

{{< hint info >}}
**Note:**
Context Imprint mode **requires** associated context for encryption and decryption.
For the highest level of security, use a different context for each data piece.
{{< /hint >}}

Context Imprint mode produces encrypted text of the same length as the input:

```rust
assert!(encrypted.len() == plaintext.len());
```

You can decrypt the data back using the `decrypt_with_context` method:

```rust
let decrypted = cell.decrypt_with_context(encrypted, context)?;
if !correct(&decrypted) {
    // handle decryption failure
}
```

{{< hint warning >}}
**Warning:**
In Context Imprint mode, Secure Cell cannot validate correctness of the decrypted data.
If an incorrect secret or context is used, or if the data has been corrupted,
Secure Cell will return garbage output without reporting an error.
{{< /hint >}}

Make sure to initialise the Secure Cell with the same secret
and provide the same associated context as used for encryption.
You should also do some sanity checks after decryption.

## Secure Message

[**Secure Message**](/docs/themis/crypto-theory/crypto-systems/secure-message/)
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
[Secure Message cryptosystem design](/docs/themis/crypto-theory/crypto-systems/secure-message/)
to understand better the underlying considerations, limitations, and features of each mode.

See [full API reference here](https://docs.rs/themis/latest/themis/secure_message/index.html).

### Signature mode

[**Signature mode**](/docs/themis/crypto-theory/crypto-systems/secure-message/#signed-messages)
only adds cryptographic signatures over the messages,
enough for anyone to authenticate them and prevent tampering
but without additional confidentiality guarantees.

To begin, the sender needs to generate an [asymmetric keypair](#asymmetric-keypairs).
The private key stays with the sender and the public key should be published.
Any recipient with the public key will be able to verify messages
signed by the sender which owns the corresponding private key.

The **sender** initialises Secure Message using their private key:

```rust
use themis::keygen;
use themis::secure_message::SecureSign;

let (private_key, public_key) = keygen::gen_ec_key_pair().split();

let secure_message = SecureSign::new(private_key);
```

Messages can be signed using the `sign` method:

```rust
let message = b"example message";

let signed = secure_message.sign(&message)?;
```

To verify messages, the **recipient** first has to obtain the sender's public key.
Secure Message should be initialised with only the public key:

```rust
use themis::keys::PublicKey;
use themis::secure_message::SecureVerify;

let peer_public_key = PublicKey::try_from_slice(...)?;

let secure_message = SecureVerify::new(peer_public_key);
```

Now the receipent may verify messages signed by the sender using the `verify` method:

```rust
match secure_message.verify(&signed) {
    Ok(verified) => {
        // process verified message
    }
    Err(error) => {
        // handle verification failure
    }
}
```

Secure Message will return an error if the message has been modified since the sender signed it,
or if the message has been signed by someone else, not the expected sender.

### Encryption mode

[**Encryption mode**](/docs/themis/crypto-theory/crypto-systems/secure-message/#encrypted-messages)
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
You can find [key management guidelines here](/docs/themis/crypto-theory/key-management/).
{{< /hint >}}

**Alice** initialises Secure Message with her private key and Bob's public key:

```rust
use themis::keys::PublicKey;
use themis::keygen;
use themis::secure_message::SecureSign;

let (alice_private_key, alice_public_key) = keygen::gen_ec_key_pair().split();
let bob_public_key = PublicKey::try_from_slice(...)?; // received securely

let alice_secure_message =
    SecureMessage::new(alice_private_key, bob_public_key);
```

Now Alice can encrypt messages for Bob using the `encrypt` method:

```rust
let message = b"example message";

let encrypted = alice_secure_message.encrypt(message)?;
```

**Bob** initialises Secure Message with his private key and Alice's public key:

```rust
let (bob_private_key, bob_public_key) = keygen::gen_ec_key_pair().split();
let alice_public_key = PublicKey::try_from_slice(...)?; // received securely

let bob_secure_message =
    SecureMessage::new(bob_private_key, alice_public_key);
```

With this, Bob is able to decrypt messages received from Alice
using the `decrypt` method:

```rust
match secure_message.decrypt(&encrypted) {
    Ok(decrypted) => {
        // process decrypted message
    }
    Err(error) => {
        // handle decryption failure
    }
}
```

Bob's Secure Message will return an error
if the message has been modified since Alice encrypted it;
or if the message was encrypted by Carol, not by Alice;
or if the message was actually encrypted by Alice but *for Carol* instead, not for Bob.

## Secure Session

[**Secure Session**](/docs/themis/crypto-theory/crypto-systems/secure-session/)
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

  - [**Buffer-aware API**](#buffer-aware-api)
    in which encrypted messages are handled explicitly, with data buffers you provide.
  - [**Callback-oriented API**](#callback-oriented-api)
    in which Secure Session handles buffer allocation implicitly
    and uses callbacks to notify about incoming messages or request sending outgoing messages.

Read more about
[Secure Session cryptosystem design](/docs/themis/crypto-theory/crypto-systems/secure-session/)
to understand better the underlying considerations,
get an overview of the protocol and its features,
etc.

See [full API reference here](https://docs.rs/themis/latest/themis/secure_session/index.html).

### Setting up Secure Session

Secure Session has two parties called “client” and “server” for the sake of simplicity,
but they could be more precisely called “initiator” and “acceptor” –
the only difference between the two is in who starts the communication.
After the session is established, either party can send messages to their peer whenever it wishes to.

{{< hint info >}}
Take a look at code samples in the [`docs/examples/rust`](https://github.com/cossacklabs/themis/tree/master/docs/examples/rust) directory on GitHub.
There you can find examples of Secure Session setup and usage in all modes.
{{< /hint >}}

First, both parties have to generate [asymmetric keypairs](#asymmetric-keypairs)
and exchange their public keys.
The private keys should never be shared with anyone else.

{{< hint warning >}}
**Note:**
Currently, Secure Session in RustThemis supports only Elliptic Curve keys.
RSA keys are not supported.
[Please tell us](mailto:dev@cossacklabs.com)
if this is a problem for your application.
{{< /hint >}}

Each party should also choose a unique *peer ID* –
arbitrary byte sequence identifying their public key.
Read more about peer IDs in [Secure Session cryptosystem overview](/docs/themis/crypto-theory/crypto-systems/secure-session/#peer-ids-and-keys).
The peer IDs need to be exchanged along with the public keys.

To identify peers, Secure Session uses a **callback interface**.
It calls the `get_public_key_for_id` method to locate a public key associated with presented peer ID.
Typically, each peer keeps some sort of a database of known public keys
and fulfills Secure Session requests from that database.

```rust
use themis::keys::EcdsaPublicKey;
use themis::secure_session::SecureSessionTransport;

struct SessionCallbacks {
    // ...
}

impl SecureSessionTransport for SessionCallbacks {
    fn get_public_key_for_id(&mut self, id: &[u8]) -> Option<EcdsaPublicKey> {
        // Retrieve public key for peer "id" from the trusted storage.
        if !found {
            return None;
        }
        Some(public_key)
    }
}
```

Each peer initialises Secure Session with their ID, their private key,
and an instance of the callback interface:

```rust
use themis::keygen;
use themis::secure_session::SecureSession;

let peer_id = b"Alice";
let (private_key, public_key) = keygen::gen_ec_key_pair().split();
let callbacks = SessionCallbacks::new(...);

let mut session = SecureSession::new(peer_id, private_key, callbacks)?;
```

{{< hint info >}}
**Note:**
The same callback interface may be shared by multiple Secure Session instances,
provided it is correctly synchronised.
Read more about [thread safety of Secure Session](/docs/themis/debugging/thread-safety/#shared-secure-session-transport-objects).
{{< /hint >}}

#### Transport callbacks

If you wish to use the **callback-oriented API** of Secure Session,
you have to implement two additional methods of the callback interface:

```rust
use themis::secure_session::TransportError;

impl SecureSessionTransport for TransportCallbacks {
    fn send_data(&mut self, data: &[u8]) -> Result<usize, TransportError> {
        // Send "data" to the peer over the network.
        // Return an error if that fails.
        Ok(data.len())
    }

    fn receive_data(&mut self, data: &mut [u8]) -> Result<usize, TransportError> {
        // Receive a message for peer into the provided buffer.
        // Return the actual length of the message, or an error.
        Ok(used_bytes_of_data)
    }

    fn get_public_key_for_id(&mut self, id: &[u8]) -> Option<EcdsaPublicKey> {
        // Retrieve public key for peer "id" from the trusted storage.
    }
}
```

{{< hint warning >}}
**Warning:**
In send–receive mode, each Secure Session needs its own instance of transport callback interface.
The same instance cannot be shared by multiple sessions.
Read more about [thread safety of Secure Session](/docs/themis/debugging/thread-safety/#shared-secure-session-transport-objects).
{{< /hint >}}

### Buffer-aware API

[**Buffer-aware API**](/docs/themis/crypto-theory/crypto-systems/secure-session/#buffer-aware-api)
(aka *wrap–unwrap* mode)
is easier to integrate into existing application with established network processing path.
Here the application handles message buffers explicitly.

#### Establishing connection

The client initiates the connection and sends the first request to the server:

```rust
let request = session.connect_request()?

send_to_peer(&requst);
```

Then both parties communicate to negotiate the keys and other details
until the connection is established:

```rust
loop {
    let reply = receive_from_peer();
    let response = session.negotiate_reply(&reply)?;
    if session.is_established() {
        break;
    }
    send_to_peer(&response);
}
```

#### Exchanging messages

After the session is established,
the parties can proceed with actual message exchange.
At this point the client and the server are equal peers –
they can both send and receive messages independently, in a duplex manner.

In buffer-aware API, the messages are wrapped into Secure Session protocol and sent separately:

```rust
let message = b"a message";

let encrypted_message = session.wrap(&message)?;

send_to_peer(&encrypted_message);
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

```rust
let encrypted_message = receive_from_peer();

match session.unwrap(&encrypted_message) {
    Ok(decrypted_message) => {
        // process a message
    }
    Err(error) => {
        // handle corrupted messages
    }
}
```

Secure Session ensures message integrity and will return an error
if the message has been modified in-flight.
It will also detect and report protocol anomalies,
such as unexpected messages, outdated messages, etc.

### Callback-oriented API

[**Callback-oriented API**](/docs/themis/crypto-theory/crypto-systems/secure-session/#callback-oriented-api)
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

```rust
session.connect()?;
```

Then both parties communicate to negotiate the keys and other details
until the connection is established:

```rust
while !session.is_established() {
    session.negotiate()?;
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
using the `send` method:

```rust
let message = b"a message";

session.send(&message)?;
```

Secure Session encrypts the message, wraps it into the protocol,
and synchronously calls the `send` transport callback to ship the message out.

The receiving side uses the `receive` method to receive messages:

```rust
let message = session.receive(MAX_LENGTH)?;
```

Secure Session synchronously calls the `receive` transport callback
to wait for the next message, then unwraps and decrypts it,
and returns already decrypted message to the application.

Secure Session ensures message integrity and will return an erro
if the message has been modified in-flight.
It will also detect and report protocol anomalies,
such as unexpected messages, outdated messages, etc.

## Secure Comparator

[**Secure Comparator**](/docs/themis/crypto-theory/crypto-systems/secure-comparator/)
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
[Secure Comparator cryptosystem design](/docs/themis/crypto-theory/crypto-systems/secure-comparator/)
to understand better the underlying considerations,
get an overview of the protocol, etc.

See [full API reference here](https://docs.rs/themis/latest/themis/secure_comparator/index.html).

### Comparing secrets

Secure Comparator has two parties called “client” and “server” for the sake of simplicity,
but the only difference between the two is in who initiates the comparison.

Both parties start by initialising Secure Comparator with the secret they need to compare:

```rust
use themis::secure_comparator::SecureComparator;

let mut comparison = SecureComparator::new();

comparison.append_secret("shared secret")?;
```

The client initiates the protocol and sends the message to the server:

```rust
let first_message = comparison.begin_compare()?;

send_to_peer(&first_message);
```

Now, each peer waits for a message from the other one,
passes it to Secure Comparator, and gets a response that needs to be sent back.
The comparison is complete when the response is empty:

```rust
while !comparison.is_complete() {
    let request = receive_from_peer();
    let response = comparison.proceed_compare(&request)?;
    if !response.is_empty() {
        send_to_peer(&response);
    }
}
```

Once the comparison is complete, you can get the results (on each side):

```rust
if comparison.result()? {
    // shared secrets match
}
```

Secure Comparator performs consistency checks on the protocol messages
and will return an error if they were corrupted.
But if the other party fails to demonstrate that it has a matching secret,
Secure Comparator will only return a negative result.
