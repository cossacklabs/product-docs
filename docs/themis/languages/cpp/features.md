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

### Setting up Secure Session

Secure Session has two parties called “client” and “server” for the sake of simplicity,
but they could be more precisely called “initiator” and “acceptor” –
the only difference between the two is in who starts the communication.
After the session is established, either party can send messages to their peer whenever it wishes to.

{{< hint info >}}
Take a look at code samples in the [`docs/examples/c++`](https://github.com/cossacklabs/themis/tree/master/docs/examples/c++) directory on GitHub.
There you can find examples of Secure Session setup and usage in all modes.
{{< /hint >}}

First, both parties have to generate [asymmetric keypairs](#asymmetric-keypairs)
and exchange their public keys.
The private keys should never be shared with anyone else.

Each party should also choose a unique *peer ID* –
arbitrary byte sequence identifying their public key.
Read more about peer IDs in [Secure Session cryptosystem overview](/docs/themis/crypto-theory/crypto-systems/secure-session/#peer-ids-and-keys).
The peer IDs need to be exchanged along with the public keys.

To identify peers, Secure Session uses a **callback interface**.
It calls the `get_pub_key_by_id` method to locate a public key associated with presented peer ID.
Typically, each peer keeps some sort of a database of known public keys
and fulfills Secure Session requests from that database.

```cpp
#include <themispp/secure_session.hpp>

class session_callbacks : public themispp::secure_session_callback_interface_t {
public:
    session_callbacks(...)
    {
        // Initialise trusted public key storage (file directory, DB, etc.)
    }

    std::vector<uint8_t> get_pub_key_by_id(const std::vector<uint8_t>& id) override
    {
        // Retrieve public key for peer "id" from the trusted storage.
        // Return an empty vector if there is no associated key.
        return public_key;
    }
};
```

Each peer initialises Secure Session with their ID, their private key,
and an instance of the callback interface:

```cpp
#include <themispp/secure_session.hpp>

std::vector<uint8_t> peer_id = ...;
std::vector<uint8_t> private_key = ...;

auto session_callbacks = std::make_shared<session_callbacks>(...);

auto session = themispp::secure_session_t(peer_id, private_key,
                                          std::move(session_callbacks));
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

```cpp
#include <themispp/secure_session.hpp>

class transport_callbacks : public themispp::secure_session_callback_interface_t {
public:
    void send(const std::vector<uint8_t>& data) override
    {
        // Send "data" to the peer over the network.
        // You may throw an exception if that fails.
    }

    const std::vector<uint8_t>& receive() override
    {
        // Receive a message for peer and store it in the transport object.
        // You may throw an exception if that fails.
        // Return a reference to the transport object field.
        return this->received_message;
    }

    // ...
};
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

The client initiates the connection and sends the first request to the server.
Then they communicate to negotiate the keys and other details
until the connection is established:

```cpp
std::vector<uint8_t> negotiation_message = client_session.init();
do {
    send_to_server(negotiation_message);
    negotiation_message = receive_from_server();
    negotiation_message = client_session.unwrap(negotiation_message);
} while (!client_session.is_established());
```

Conversely, the server accepts the connection request and communicates with the client
until the connection is established from the other side too:

```cpp
while (!server_session.is_established()) {
    std::vector<uint8_t> request = receive_from_client();
    std::vector<uint8_t> reply = server_session.unwrap(request);
    send_to_client(reply);
}
```

#### Exchanging messages

After the session is established,
the parties can proceed with actual message exchange.
At this point the client and the server are equal peers –
they can both send and receive messages independently, in a duplex manner.

In buffer-aware API, the messages are wrapped into Secure Session protocol and sent separately:

```cpp
std::vector<uint8_t> message = ...;

std::vector<uint8_t> encrypted_message = session.wrap(message);

send_to_peer(encrypted_message);
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

```cpp
std::vector<uint8_t> encrypted_message = receive_from_peer();

try {
    std::vector<uint8_t> decrypted_message = session.unwrap(encrypted_message);
    // process a message
}
catch (const themispp::exception_t& e) {
    // handle corrupted messages
}
```

Secure Session ensures message integrity and will throw an exception
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

The client initiates the connection and sends the first request to the server.
Then they communicate to negotiate the keys and other details
until the connection is established:

```cpp
client_session.connect();
while (!client_session.is_established()) {
    client_session.receive();
}
```

Conversely, the server accepts the connection request and communicates with the client
until the connection is established from the other side too:

```cpp
while (!server_session.is_established()) {
    server_session.receive();
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

```cpp
std::vector<uint8_t> message = ...;

session.send(message);
```

Secure Session encrypts the message, wraps it into the protocol,
and synchronously calls the `send` transport callback to ship the message out.
Networking errors are reported by throwing appropriate exceptions.

The receiving side uses the `receive` method to receive messages:

```cpp
std::vector<uint8_t> message = session.receive();
```

Secure Session synchronously calls the `receive` transport callback
to wait for the next message, then unwraps and decrypts it,
and returns already decrypted message to the application.

Secure Session ensures message integrity and will throw an exception
if the message has been modified in-flight.
It will also detect and report protocol anomalies,
such as unexpected messages, outdated messages, etc.

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
