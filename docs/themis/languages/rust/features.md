---
weight: 4
title:  Features
---

# Features of RustThemis

## Using Themis

In order to use Themis, you need to import it first.

Import the necessary modules and you're good to go:

```rust
use themis::*;
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

To generate asymmetric keypairs, use:

```rust
use themis::keygen;

// Use gen_rsa_key_pair to generate RSA keys instead
let key_pair = keygen::gen_ec_key_pair();

let (private_key, public_key) = key_pair.split();
```

#### Symmetric key generation

Themis uses highly efficient and secure AES algorithm for symmetric cryptography.
A symmetric key is necessary for [Secure Cell](/pages/secure-cell-cryptosystem/) objects.

> **NOTE:** Symmetric key generation API will become available for Rust-Themis starting with Themis 0.13.0. For now, use common sense or consult [the wisdom of the Internet](https://stackoverflow.com/search?q=generate+cryptographically+secure+keys).

<!--
> ⚠️ **WARNING:**
> When you store generated keys, make sure they are sufficiently protected.
> You can find the guidelines [here](/pages/documentation-themis/#key-management).

To generate symmetric keys, use:

```rust
use themis::keys::SymmetricKey;

let master_key = SymmetricKey::new();
```
-->

### Secure Message

The Secure Message functions provide a sequence-independent, stateless, contextless messaging system. This may be preferred in cases that don't require frequent sequential message exchange and/or in low-bandwidth contexts. This is secure enough to exchange messages from time to time, but if you'd like to have Perfect Forward Secrecy and higher security guarantees, consider using [Secure Session](#secure-session) instead.

The Secure Message functions offer two modes of operation:

In **Sign/Verify** mode, the message is signed using the sender's private key and is verified by the receiver using the sender's public key. The message is packed in a suitable container and ECDSA is used by default to sign the message (when RSA key is used, RSA+PSS+PKCS#7 digital signature is used).

In **Encrypt/Decrypt** mode, the message will be encrypted with a randomly generated key (in RSA) or a key derived by ECDH (in ECDSA), via symmetric algorithm with Secure Cell in seal mode (keys are 256 bits long).

The mode is selected by using appropriate methods. The sender uses `wrap` and `unwrap` methods for encrypt/decrypt mode. A valid public key of the receiver and a private key of the sender are required in this mode. For sign/verify mode `sign` and `verify` methods should be used. They only require a private key for signing and a public key for verification respectively.

Read more about the Secure Message's cryptographic internals [here](/pages/secure-message-cryptosystem/).

#### Secure Message example

```
use themis::secure_message::SecureMessage;
use themis::keygen::gen_ec_key_pair;

let key_pair = gen_ec_key_pair();

let secure = SecureMessage::new(key_pair);

let encrypted = secure.encrypt(b"message")?;
let decrypted = secure.decrypt(&encrypted)?;
assert_eq!(decrypted, b"message");
```

_Description_:

- `SecureMessage` – Secure Message encryption and decryption.
- `SecureSign` – Secure Message signing.
- `SecureVerify` – Secure Message verification.

> **NOTE:** For signing/verifying make sure that you use keys from the same keypair: private key for signing message and public key for verifying message.


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

#### Secure Cell examples

Here is how you use Secure Cell to seal away your data:

```rust
use themis::secure_cell::SecureCell;

let cell = SecureCell::with_key(&master_key)?.seal();

let encrypted = cell.encrypt(b"source data")?;
let decrypted = cell.decrypt(&encrypted)?;
assert_eq!(decrypted, b"source data");
```

_Description_:

- `SecureCell` – basic Secure Cell.
    - `SecureCellTokenProtect` – Secure Cell in token protect operation mode.
    - `SecureCellContextImprint` – Secure Cell in context imprint operation mode.
    - `SecureCellSeal` – Secure Cell in sealing operation mode.

#### Secure Cell Token-protect Mode

In this mode the input data is mixed with the provided context and encrypted, then the authentication token is computed and returned separately, along with the encrypted container. You will have to provide the authentication token later to decrypt the data, but it can be stored or transmitted separately. The encrypted data has the same length as the original input.

```rust
use themis::secure_cell::SecureCell;

let cell = SecureCell::with_key(&master_key)?.token_protect();

let input = b"test input";
let (output, token) = cell.encrypt(input)?;

assert!(output.len() == input.len());
```

#### Secure Cell Context-Imprint Mode

In this mode, the input data is mixed with the provided context and encrypted, but there is no authentication token. Use this mode when you have no additional storage available for the authentication data and you absolutely need the output data to have the same length as the original input.

```rust
use themis::secure_cell::SecureCell;

let cell = SecureCell::with_key(&master_key)?.context_imprint();

let input = b"test input";
let output = cell.encrypt_with_context(input, b"context")?;

assert!(output.len() == input.len());
```

Note that in context imprint mode you must provide non-empty context. Also keep in mind that Secure Cell cannot verify integrity and correctness of the decrypted data so you have to have some other means in place to validate the output.

#### Secure Cell Seal mode

In this mode the input data is mixed with the provided context and encrypted, then the authentication tag is appended to the data, resulting in a single encrypted and authenticated container. Note that the resulting sealed cell takes more space than the input data.

```rust
use themis::secure_cell::SecureCell;

let cell = SecureCell::with_key(&master_key)?.seal();

let input = b"test input";
let output = cell.encrypt(input)?;

assert!(output.len() > input.len());
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

Secure Session usage is relatively involved so you can see a complete working example in the documentation for [client](https://github.com/cossacklabs/themis/blob/master/docs/examples/rust/secure_session_echo_client.rs) and [server](https://github.com/cossacklabs/themis/blob/master/docs/examples/rust/secure_session_echo_server.rs).

To sum it up, you begin by implementing a `SecureSessionTransport`. You have to implement at least the `get_public_key_for_id` method and may want to implement some others. Then you acquire the asymmetric key pairs and distribute the public keys associated with peer IDs — arbitrary byte strings used to identify communicating Secure Sessions. With that, you can create an instance of SecureSession on both the client and the server.

Next, you go through the negotiation stage using `connect` and `negotiate` methods until the connection `is_established`. After that, the Secure Sessions are ready for data exchange which is performed using `send` and `receive` methods.

There is also an alternative buffer-oriented API.

#### Secure Session callback API

> **NOTE:** SecureSessionTransport is an interface you need to provide for Secure Session operation. The only required method is `get_public_key_for_id`. It is required for public key authentication. Other methods are optional, you can use Secure Session without them, but some functionality may be unavailable.

Secure Session only provides security services and doesn’t do actual network communication. In fact, Secure Session is decoupled and independent from any networking implementation. It is your responsibility to provide network transport for Secure Session using the `SecureSessionTransport` trait. There are two types of APIs available: callback API and buffer-aware API. You can choose whatever API is more suitable for your application, or you can even mix them when appropriate.

##### Callback API

With the callback API, you delegate network communication to Secure Session. In order to use it, you have to implement the `send_data` and `receive_data` callbacks of SecureSessionTransport. Then you use `connect` and `negotiate` methods to negotiate and establish a connection. After that, `send` and `receive` methods can be used for data exchange. Secure Session will synchronously call the provided transport methods when necessary to perform network communication.

There is an [example of server using the callback API](https://github.com/cossacklabs/themis/blob/master/docs/examples/rust/secure_session_echo_server.rs) available.

##### Buffer-aware API

With the buffer-aware API, you are responsible for transporting Secure Session messages between peers. Secure Session does not use `send_data` and `receive_data` callbacks in this mode. Instead, the `connect_request` and `negotiate_reply` methods return and receive data buffers that have to be exchanged between peers via some external transport (e.g., TLS). Similarly, `wrap` and `unwrap` methods are used to encrypt and decrypt data exchange messages after the connection has been negotiated. They too accept plaintext messages and return encrypted containers or vice versa.

There is an [example of a using the buffer-aware API](https://github.com/cossacklabs/themis/blob/master/docs/examples/rust/secure_session_echo_client.rs) available.

### Secure Comparator

Secure Comparator is an interactive protocol for two parties that compares whether they share the same secret or not. It is built around a [Zero Knowledge Proof](https://www.cossacklabs.com/zero-knowledge-protocols-without-magic.html)-based protocol ([Socialist Millionaire's Protocol](https://en.wikipedia.org/wiki/Socialist_millionaires)), with a number of [security enhancements](https://www.cossacklabs.com/files/secure-comparator-paper-rev12.pdf).

Secure Comparator is transport-agnostic and only requires the user(s) to pass messages in a certain sequence. The protocol itself is ingrained into the functions and requires minimal integration efforts from the developer.

#### Secure Comparator workflow

Secure Comparator has two parties — called "client" and "server" — the only difference between them is in who starts the comparison.

Before initiating the protocol both parties should append their secrets to be compared. This can be done incrementally so even multi-gigabyte data sets can be compared with ease.

```
use themis::secure_comparator::SecureComparator;

let mut comparison = SecureComparator::new();

comparison.append_secret(b"999-04-1234")?;
```

After that, the client initiates the comparison and runs a loop:

```rust
let mut request = comparison.begin_compare()?;

while !comparison.is_complete() {
    send(&request);         // This function should send the `request` to the server.
    let reply = receive();  // This function should receive a `reply` from the server.

    request = comparison.proceed_compare(&reply)?;
}

if !comparison.result()? {
    unimplemented!("handle failed comparison here");
}
```

While the server does almost the same thing:

```rust
while !comparison.is_complete() {
    // This function should receive a `request` from the client.
    let request = receive();

    let reply = comparison.proceed_compare(&request)?;

    send(&reply);   // This function should send the `reply` to the client.
}

if !comparison.result()? {
    unimplemented!("handle failed comparison here");
}
```

Both the server and the client use `result` to get the comparison result after it `is_complete`.


## Developing Themis for Rust

Rust-Themis uses standard Cargo tooling
so developing the library itself is equally easy.
Check out the latest source code from GitHub:

```
git clone https://github.com/cossacklabs/themis.git
```

Then you can go ahead and, for example, build and run the test suite:

```
cargo test
```

or build and read the latest API documentation:

```
cargo doc --open
```

You can test your application with your local working copy of Themis
by adding the following override to the application's Cargo.toml file:

```toml
[patch.crates-io]
themis = { path = "/path/to/themis/repo" }
```

We use the following Cargo tools to maintain the quality of the code base:

  - [**rustfmt:**](https://github.com/rust-lang/rustfmt)
    automated code formatting keeps the code style consistent.

  - [**clippy:**](https://github.com/rust-lang/rust-clippy)
    static code analyzer detects possible issues early on.

If you wish to help develop and expand Rust-Themis,
we strongly advise you to install and use these tools.

Please follow the general contribution process
[outlined in our guide](/pages/documentation-themis/#contributing-contacts-assistance).
