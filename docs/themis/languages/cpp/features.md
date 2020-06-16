---
weight: 4
title:  Features
---

# Features of ThemisPP

## Using Themis

In order to use ThemisPP,
you need to include headers for relevant cryptosystems:

```cpp
#include <themispp/secure_keygen.hpp>
#include <themispp/secure_cell.hpp>
#include <themispp/secure_message.hpp>
#include <themispp/secure_session.hpp>
#include <themispp/secure_comparator.hpp>
```

ThemisPP API is contained within the `themispp` namespace.

Additionally, you need to link Themis Core libraries to your project.
On UNIX systems this is done with the following compiler flags:
`-lthemis -lsoter`.

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

```cpp
#include <themispp/secure_keygen.hpp>

// Use themispp::RSA to generate RSA keys instead
themispp::secure_key_pair_generator_t<themispp::EC> keypair;

std::vector<uint8_t> private_key = keypair.get_priv();
std::vector<uint8_t> public_key = keypair.get_pub();
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

```cpp
#include <themispp/secure_keygen.hpp>

std::vector<uint8_t> master_key = themispp::gen_sym_key();
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

### Seal mode

[**Seal mode**](/docs/themis/crypto-theory/crypto-systems/secure-cell/#seal-mode)
is the most secure and easy to use mode of Secure Cell.
This should be your default choice unless you need specific features of the other modes.

<!-- See API reference here. -->

Initialise a Secure Cell with a secret of your choice to start using it.
Seal mode supports [symmetric keys](#symmetric-keys) and passphrases.

{{< hint info >}}
Each secret type has its pros and cons.
Read about [Key derivation functions](/docs/themis/crypto-theory/crypto-systems/secure-cell/#key-derivation-functions) to learn more.
{{< /hint >}}

```cpp
#include <themispp/secure_keygen.hpp>
#include <themispp/secure_cell.hpp>

std::vector<uint8_t> symmetric_key = themispp::gen_sym_key();
auto cell = themispp::secure_cell_seal_with_key(symmetric_key);

// OR

auto cell = themispp::secure_cell_seal_with_passphrase("a password");
```

Now you can encrypt your data using the `encrypt` method:

```cpp
std::vector<uint8_t> plaintext = ...;
std::vector<uint8_t> context = ...;

std::vector<uint8_t> encrypted = cell.encrypt(plaintext, context);
```

The `encrypt` method has many overloads, supporting other STL containers, iterators, etc.
The _associated context_ argument is optional and can be omitted.

Seal mode produces encrypted cells that are slightly bigger than the input:

```cpp
assert(encrypted.size() > plaintext.size());
```

You can decrypt the data back using the `decrypt` method:

```cpp
try {
    std::vector<uint8_t> decrypted = cell.decrypt(encrypted, context);
    // process decrypted data
}
catch (const themispp::exception_t& e) {
    // handle decryption failure
}
```

Make sure to initialise the Secure Cell with the same secret
and provide the same associated context as used for encryption.
Secure Cell will throw an exception if those are incorrect or if the encrypted data was corrupted.

### Token Protect mode

[**Token Protect mode**](/docs/themis/crypto-theory/crypto-systems/secure-cell/#token-protect-mode)
should be used if you cannot allow the length of the encrypted data to grow
but have additional storage available elsewhere for the authentication token.
Other than that,
Token Protect mode has the same security properties as the Seal mode.

<!-- See API reference here. -->

Initialise a Secure Cell with a secret of your choice to start using it.
Token Protect mode supports only [symmetric keys](#symmetric-keys).

```cpp
#include <themispp/secure_keygen.hpp>
#include <themispp/secure_cell.hpp>

std::vector<uint8_t> symmetric_key = themispp::gen_sym_key();

auto cell = themispp::secure_cell_token_protect_with_key(symmetric_key);
```

Now you can encrypt the data using the `encrypt` method:

```cpp
std::vector<uint8_t> plaintext = ...;
std::vector<uint8_t> context = ...;

auto [encrypted, token] = cell.encrypt(plaintext, context);
// The output type is compatible with std::tuple of std::vector<uint8_t>.
// Use encrypted() and token() methods to access components.
```

The `encrypt` method has many overloads, supporting other STL containers, iterators, etc.
The _associated context_ argument is optional and can be omitted.

Token Protect mode produces encrypted text and authentication token separately.
Encrypted data has the same size as the input:

```cpp
assert(encrypted.size() == plaintext.size());
```

You need to save both the encrypted data and the token, they are necessary for decryption.
Use the `decrypt` method for that:

```cpp
try {
    std::vector<uint8_t> decrypted = cell.decrypt(encrypted, token, context);
    // process decrypted data
}
catch (const themispp::exception_t& e) {
    // handle decryption failure
}
```

Make sure to initialise the Secure Cell with the same secret
and provide the same associated context as used for encryption.
Secure Cell will throw an exception if those are incorrect
or if the data or the authentication token was corrupted.

### Context Imprint mode

[**Context Imprint mode**](/docs/themis/crypto-theory/crypto-systems/secure-cell/#context-imprint-mode)
should be used if you absolutely cannot allow the length of the encrypted data to grow.
This mode is a bit harder to use than the Seal and Token Protect modes.
Context Imprint mode also provides slightly weaker integrity guarantees.

<!-- See API reference here. -->

Initialise a Secure Cell with a secret of your choice to start using it.
Context Imprint mode supports only [symmetric keys](#symmetric-keys).

```cpp
#include <themispp/secure_keygen.hpp>
#include <themispp/secure_cell.hpp>

std::vector<uint8_t> symmetric_key = themispp::gen_sym_key();

auto cell = themispp::secure_cell_context_imprint_with_key(symmetric_key);
```

Now you can encrypt the data using the `encrypt` method:

```cpp
std::vector<uint8_t> plaintext = ...;
std::vector<uint8_t> context = ...;

std::vector<uint8_t> encrypted = cell.encrypt(plaintext, context);
```

The `encrypt` method has many overloads, supporting other STL containers, iterators, etc.

{{< hint info >}}
**Note:**
Context Imprint mode **requires** associated context for encryption and decryption.
For the highest level of security, use a different context for each data piece.
{{< /hint >}}

Context Imprint mode produces encrypted text of the same size as the input:

```cpp
assert(encrypted.size() == plaintext.size());
```

You can decrypt the data back using the `decrypt` method:

```cpp
std::vector<uint8_t> decrypted = cell.decrypt(encrypted, context);
if (looks_correct(decrypted)) {
    // process decrypted data
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

### Signature mode

[**Signature mode**](/docs/themis/crypto-theory/crypto-systems/secure-message/#signed-messages)
only adds cryptographic signatures over the messages,
enough for anyone to authenticate them and prevent tampering
but without additional confidentiality guarantees.

To begin, the sender needs to generate an [asymmetric keypair](#asymmetric-keypairs).
The private key stays with the sender and the public key should be published.
Any recipient with the public key will be able to verify messages
signed by the sender which owns the corresponding private key.

The **sender** initialises Secure Message using their keypair:

```cpp
#include <themispp/secure_keygen.hpp>
#include <themispp/secure_message.hpp>

themispp::secure_key_pair_generator_t<themispp::EC> keypair;
std::vector<uint8_t> private_key = keypair.get_priv();
std::vector<uint8_t> public_key = keypair.get_pub();

auto secure_message = themispp::secure_message_t(private_key, public_key);
```

Messages can be signed using the `sign` method:

```cpp
std::vector<uint8_t> message = ...;

std::vector<uint8_t> signed_message = secure_message.sign(message);
```

The `sign` method has many overloads, supporting iterators, etc.

To verify messages, the **recipient** first has to obtain the sender's public key.
Since the recipient does not need a private key, an empty vector should be used to
initialise Secure Message:

```cpp
std::vector<uint8_t> peer_public_key = ...;

std::vector<uint8_t> empty;
auto secure_message = themispp::secure_message_t(empty, peer_public_key);
```

Now the receipent may verify messages signed by the sender using the `verify` method:

```cpp
try {
    std::vector<uint8_t> verified_message = secure_message.verify(signed_message);
    // process verified data
}
catch (const themispp::exception_t& e) {
    // handle verification failure
}
```

Secure Message will throw an exception if the message has been modified since the sender signed it,
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

```cpp
#include <themispp/secure_keygen.hpp>
#include <themispp/secure_message.hpp>

themispp::secure_key_pair_generator_t<themispp::EC> alice_keypair;
std::vector<uint8_t> alice_private_key = alice_keypair.get_priv();
std::vector<uint8_t> bob_public_key = ...; // received securely

auto alice_secure_message = themispp::secure_message_t(alice_private_key,
                                                       bob_public_key);
```

Now Alice can encrypt messages for Bob using the `encrypt` method:

```cpp
std::vector<uint8_t> message = ...;

std::vector<uint8_t> encrypted_message = alice_secure_message.encrypt(message);
```

The `encrypt` method has many overloads, supporting iterators, etc.

**Bob** initialises Secure Message with his private key and Alice's public key:

```cpp
themispp::secure_key_pair_generator_t<themispp::EC> bob_keypair;
std::vector<uint8_t> bob_private_key = bob_keypair.get_priv();
std::vector<uint8_t> alice_public_key = ...; // received securely

auto bob_secure_message = themispp::secure_message_t(bob_private_key,
                                                     alice_public_key);
```

With this, Bob is able to decrypt messages received from Alice
using the `decrypt` method:

```cpp
try {
    std::vector<uint8_t> decrypted_message =
            bob_secure_message.decrypt(encrypted_message);
    // process decryped data
}
catch (const themispp::exception_t& e) {
    // handle decryption failure
}
```

Bob's Secure Message will throw an exception
if the message has been modified since Alice encrypted it;
or if the message was encrypted by Carol, not by Alice;
or if the message was actually encrypted by Alice but *for Carol* instead, not for Bob.

#### Interface

```cpp
class themispp::secure_message_t
{
     secure_message_t(const std::vector<uint8_t>& private_key,
                      const std::vector<uint8_t>& peer_public_key);

     const std::vector<uint8_t>& encrypt(const std::vector<uint8_t>& data);
     const std::vector<uint8_t>& decrypt(const std::vector<uint8_t>& data);
     const std::vector<uint8_t>& sign(const std::vector<uint8_t>& data);
     const std::vector<uint8_t>& verify(const std::vector<uint8_t>& data);
};
```

Description:

- `secure_message_t(const std::vector<uint8_t>& private_key, const std::vector<uint8_t>& peer_public_key)`<br/>
  Initialise Secure Message object with **private_key** and **peer_public_key** (possibly empty).<br/>
  Throws `themispp::exception_t` on failure.

- `const std::vector<uint8_t>& encrypt(const std::vector<uint8_t>& data)`<br/>
  Encrypt **data**, return encrypted message container.<br/>
  Requires both **private_key** and **peer_public_key** to be set.<br/>
  Throws `themispp::exception_t` on failure.

- `const std::vector<uint8_t>& decrypt(const std::vector<uint8_t>& data)`<br/>
  Decrypt encrypted **data**, return decrypted data.<br/>
  Requires both **private_key** and **peer_public_key** to be set.<br/>
  Throws `themispp::exception_t` on failure.

- `const std::vector<uint8_t>& sign(const std::vector<uint8_t>& data)`<br/>
  Sign **data** with private key, return signed message container.<br/>
  Requires **private_key** to be set.<br/>
  Throws `themispp::exception_t` on failure.

- `const std::vector<uint8_t>& verify(const std::vector<uint8_t>& data)`<br/>
  Verify signed **data** with public key, return verified data.<br/>
  Requires **peer_public_key** to be set. Peer public key should be from the same keypair as private key.<br/>
  Throws `themispp::exception_t` on failure.

All methods provide additional overloads that accept pairs of iterators instead of vector references.

#### Example

Initialise encrypter:

```cpp
themispp::secure_message_t b(private_key, peer_public_key);
```

Encrypt message:

```cpp
try {
    std::vector<uint8_t> encrypted_message = b.encrypt(plaintext_message);
}
catch (const themispp::exception_t& e) {
    e.what();
}
```

Decrypt message:

```cpp
try {
    std::vector<uint8_t> decrypted_message = b.decrypt(encrypted_message);
}
catch (const themispp::exception_t& e) {
    e.what();
}
```

Sign message:

```cpp
try {
    std::vector<uint8_t> signed_message = b.sign(plaintext_message);
}
catch (const themispp::exception_t& e) {
    e.what();
}
```

Verify message:

```cpp
try {
    std::vector<uint8_t> verified_message = b.verify(signed_message);
}
catch (const themispp::exception_t& e) {
    e.what();
}
```

## Secure Session

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

### Secure Session interface

```cpp
class themispp::secure_session_t {
    secure_session_t(const std::vector<uint8_t>& id,
                     const std::vector<uint8_t>& private_key,
                     std::shared_ptr<themispp::secure_session_callback_interface_t> transport);

    bool is_established() const;

    const std::vector<uint8_t>& init();
    const std::vector<uint8_t>& wrap(const std::vector<uint8_t>& data);
    const std::vector<uint8_t>& unwrap(const std::vector<uint8_t>& data);

    void connect();
    const std::vector<uint8_t>& receive();
    void send(const std::vector<uint8_t>& data);
};
```

- `secure_session_t(const std::vector<uint8_t>& id, const std::vector<uint8_t>& private_key, std::shared_ptr<themispp::secure_session_transport_interface_t> transport)`<br/>
  Initialise Secure Session with (non-empty) peer **id**, **private_key**, and **transport** callbacks.<br/>
  Throws `themispp::exception_t` on failure.

- `bool is_established() const`<br/>
  Checks if the session has been established and ready to use.

- `const std::vector<uint8_t>& init()`<br/>
  Return a Secure Session initialisation message, send it to peer.<br/>
  Throws `themispp::exception_t` on failure.

- `const std::vector<uint8_t>& wrap(const std::vector<uint8_t>& data)`<br/>
  Encrypt **data**, return wrapped message that can be sent to peer.<br/>
  Throws `themispp::exception_t` on failure.

- `const std::vector<uint8_t>& unwrap(const std::vector<uint8_t>& data)`<br/>
  Decrypt **data**, return unwrapped message.<br/>
  If `is_established()` returns `false` then send result to peer without modifications. Otherwise, the decrypted message is returned.<br/>
  Throws `themispp::exception_t` on failure.

- `void connect()`<br/>
  Create and send a Secure Session initialisation message to peer.<br/>
  Throws `themispp::exception_t` on failure.

- `void send(const std::vector<uint8_t>& data)`<br/>
  Encrypt **data** and send it to peer.<br/>
  Throws `themispp::exception_t` on failure.

- `const std::vector<uint8_t>& receive()`<br/>
  Receive a message from the peer, decrypt, and return it.<br/>
  If `is_established()` is false then proceed with connection, returns empty message.<br/>
  Throws `themispp::exception_t` on failure.

### Secure Session Workflow

Secure Session can be used in two ways:
 - send/receive - when communication flow is fully controlled by the Secure Session object.
 - wrap/unwrap  - when communication is controlled by the user.

Secure Session has two parties that are called client and server for the sake of simplicity, but they could be more precisely called initiator and acceptor - the only difference between them is in who starts the communication.

Secure Session relies on the user's passing a number of callback functions to send/receive messages - and the keys are retrieved from local storage (see more in [Secure Session cryptosystem description](/pages/secure-session-cryptosystem/)).

### Send/Receive mode

Implement and initialise callbacks:

```cpp
class transport: public themispp::secure_session_callback_interface_t {
public:
    transport(...)
    {
        // Initialize trusted public keys storage.
        // Open communication channel with peer.
    }

    std::vector<uint8_t> get_pub_key_by_id(const std::vector<uint8_t>& id) override
    {
        // Retrieve public key for peer "id" from trusted storage (file, DB, etc.)
        // Return empty vector if there is no associated key.
        return public_key;
    }

    void send(const std::vector<uint8_t>& data) override
    {
        // Send "data" to peer.
    }

    const std::vector<uint8_t>& receive() override
    {
        // Receive a message for peer and store it.
        // Return a reference to the transport object field.
        return this->received_message;
    }
};
```

#### Secure Session client

First, initialise the session:

```cpp
auto t = std::make_shared<transport>(...);
themispp::secure_session_t session(client_id, client_private_key, t);

// Client initiates connection.
session.connect();

while (!session.is_established()) {
    session.receive();
}
```

After the loop finishes, Secure Session is established and is ready to be used.

To send a message over established session use:

```cpp
session.send(message);
```

To receive the message from session:

```cpp
std::vector<uint8_t> message = session.receive();
```

#### Secure Session server

First, initialise the session:

```cpp
auto t = std::make_shared<transport>(...);
themispp::secure_session_t session(server_id, server_private_key, t);

// There is no connect() call for server, just wait for the client.
while (!session.is_established()) {
    session.receive();
}
```

Sending/receiving messages is exactly the same as for the client.

### Wrap/Unwrap mode

Implement and initialise callbacks. You need to implement only one of them:

```cpp
class pub_key_storage: public themispp::secure_session_callback_interface_t
{
public:
    pub_key_storage(...)
    {
        // Initialize trusted public keys storage.
    }

    std::vector<uint8_t> get_pub_key_by_id(const std::vector<uint8_t>& id) override
    {
        // Retrieve public key for peer "id" from trusted storage (file, DB, etc.)
        // Return empty vector if there is no associated key.
        return public_key;
    }
};
```

#### Secure Session client

First, initialisation:

```cpp
auto t = std::make_shared<pub_key_storage>(...);
themispp::secure_session_t session(client_id, client_private_key, t);

// The client initiates connection.
std::vector<uint8_t> message = session.init();
do {
   send_to_server(message);
   message = receive_from_server();
   message = session.unwrap(message);
} while (!session.is_established());
```

After the loop finishes, Secure Session is established and is ready to be used.

To encrypt the outgoing message use:

```cpp
std::vector<uint8_t> encrypted_message = session.wrap(message);
send_to_server(encrypted_message);
```

To decrypt the received message use:

```cpp
std::vector<uint8_t> encrypted_message = receive_from_server();
std::vector<uint8_t> message = session.unwrap(encrypted_message);
```

#### Secure Session server

First, initialise everything:

```cpp
auto t = std::make_shared<pub_key_storage>(...);
themispp::secure_session_t session(server_id, server_private_key, t);

// The server simply waits for the client to arrive.
while (!session.is_established()) {
     std::vector<uint8_t> request = receive_from_client();
     std::vector<uint8_t> reply = session.unwrap(request);
     send_to_client(reply);
}
```

Secure Session is ready.
Send/receive works in the same way as the client's example above. See the full example available in [docs/examples/c++](https://github.com/cossacklabs/themis/tree/master/docs/examples/c%2B%2B).

## Secure Comparator

Secure Comparator is an interactive protocol for two parties that compares whether they share the same secret or not. It is built around a [Zero Knowledge Proof](https://www.cossacklabs.com/zero-knowledge-protocols-without-magic.html)-based protocol ([Socialist Millionaire's Protocol](https://en.wikipedia.org/wiki/Socialist_millionaires)), with a number of [security enhancements](https://www.cossacklabs.com/files/secure-comparator-paper-rev12.pdf).

Secure Comparator is transport-agnostic and only requires the user(s) to pass messages in a certain sequence. The protocol itself is ingrained into the functions and requires minimal integration efforts from the developer.

### Secure Comparator interface

```cpp
class secure_comparator_t
{
   secure_comparator_t(const std::vector<uint8_t>& shared_secret);

   const std::vector<uint8_t>& init();
   const std::vector<uint8_t>& proceed(const std::vector<uint8_t>& data);

   bool get() const;
};
```

Description:

- `secure_comparator_t(const std::vector<uint8_t>& shared_secret)`<br/>
  Initialise Secure Comparator with a **shared_secret** to compare.<br/>
  Throws `themispp::exception_t` on failure.

- `const std::vector<uint8_t>& init()`<br/>
  Start comparison and return an initialisation message to send.<br/>
  Throws `themispp::exception_t` on failure.

- `const std::vector<uint8_t>& proceed(const std::vector<uint8_t>& data)`<br/>
  Process **data** and return the next message to send (empty if comparison is complete). <br/>
  Throws `themispp::exception_t` on failure.

- `bool get() const`<br/>
  Return `true` if compared data matches, `false` otherwise.

### Secure Comparator workflow

Secure Comparator has two parties — called "client" and "server" — the only difference between them is in who starts the comparison.

### Example

```cpp
std::string secret_string("shared_secret");
std::vector<uint8_t> secret_bytes(secret_string.begin(), secret_string.end());

themispp::secure_comparator_t client(secret_bytes);
themispp::secure_comparator_t server(secret_bytes);

// Think of this shared buffer as the network channel.
std::vector<uint8_t> buf;

// The client initiates the comparison.
buf = client.init();

while (!buf.empty()) {
    buf = server.proceed(buf);
    buf = client.proceed(buf);
}

bool result_client = client.get();
bool result_server = server.get();
```

After the loop finishes, the comparison is over and its result can be checked by calling `comparator.get()`.

That's it! See the full example available in [docs/examples/cpp](https://github.com/cossacklabs/themis/tree/master/docs/examples/c%2B%2B).
