---
weight: 4
title:  Features
---

# Features of RbThemis
<a id="importing-themis"></a>
## Using Themis

In order to use Themis, you need to import it first.

Add the following to your code:

```ruby
require 'rbthemis'
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

```ruby
generator = Themis::SKeyPairGen.new

# Keys are strings containing binary data
private_key, public_key = generator.ec
private_key, public_key = generator.rsa
```

#### Symmetric key generation

Themis uses highly efficient and secure AES algorithm for symmetric cryptography.
A symmetric key is necessary for [Secure Cell](/pages/secure-cell-cryptosystem/) objects.

> **NOTE:** Symmetric key generation API will become available for rbthemis starting with Themis 0.13.0. For now, use common sense or consult [the wisdom of the Internet](https://stackoverflow.com/search?q=generate+cryptographically+secure+keys).


<!--
> ⚠️ **WARNING:**
> When you store generated keys, make sure they are sufficiently protected.
> You can find the guidelines [here](/pages/documentation-themis/#key-management).

To generate symmetric keys, use:

```ruby
# Keys are strings containing binary data
master_key = Themis::gen_sym_key
```
-->

### Secure Message

The Secure Message functions provide a sequence-independent, stateless, contextless messaging system. This may be preferred in cases that don't require frequent sequential message exchange and/or in low-bandwidth contexts. This is secure enough to exchange messages from time to time, but if you'd like to have Perfect Forward Secrecy and higher security guarantees, consider using [Secure Session](#secure-session) instead.

The Secure Message functions offer two modes of operation:

In **Sign/Verify** mode, the message is signed using the sender's private key and is verified by the receiver using the sender's public key. The message is packed in a suitable container and ECDSA is used by default to sign the message (when RSA key is used, RSA+PSS+PKCS#7 digital signature is used).

In **Encrypt/Decrypt** mode, the message will be encrypted with a randomly generated key (in RSA) or a key derived by ECDH (in ECDSA), via symmetric algorithm with Secure Cell in seal mode (keys are 256 bits long).

The mode is selected by using appropriate methods. For encrypt/decrypt mode use `wrap` and `unwrap` methods of the `Smessage` class. A valid public key of the receiver and a private key of the sender are required in this mode. For sign/verify mode `s_sign` and `s_verify` functions should be used. They only require a private key for signing and a public key for verification respectively.

Read more about the Secure Message's cryptographic internals [here](/pages/secure-message-cryptosystem/).


#### Secure Message interface:

```ruby
class Smessage
  def initialize(private_key, peer_public_key)
  def wrap(message)
  def unwrap(message)
end

def s_sign(private_key, message)
def s_verify(peer_public_key, message)
```

_Description_:

`class SMessage` provides Secure Message encryption:

  - `initialize(private_key, peer_public_key)`<br/>
    Initialise encrypted Secure Message object with **private_key** and **peer_public_key**.<br/>
    Raises **ThemisError** on failure.

  - `wrap(message)`<br/>
    Encrypt **message**.<br/>
    Returns encrypted Secure Message container as a binary string.<br/>
    Raises **ThemisError** on failure.

  - `unwrap(message)`<br/>
    Decrypt binary **message**.<br/>
    Returns decrypted message as a binary string.<br/>
    Raises **ThemisError** on failure.

Secure Message signing is provided by standalone functions:

  - `s_sign(private_key, message)`<br/>
    Sign **message** with **private_key**.<br/>
    Returns signed Secure Message container as a binary string.<br/>
    Raises **ThemisError** on failure.

  - `s_verify(peer_public_key, message)`<br/>
    Verify **message** with **peer_public_key**.<br/>
    Returns original message without signature as a binary string.<br/>
    Raises **ThemisError** on failure.

> **NOTE**: For verifying the message, use public key from the same keypair as private key used for signing.

#### Example

For a detailed explanation of Secure Message, see [Secure Message description](/pages/secure-message-cryptosystem/).

Initialise encrypter:

```ruby
smessage = Themis::Smessage.new(private_key, peer_public_key)
```

Encrypt message:

```ruby
begin
  encrypted_message = smessage.wrap(message)
rescue ThemisError => e
  # error occured
end
```

Decrypt message:

```ruby
begin
  decrypted_message = smessage.unwrap(encrypted_message)
rescue ThemisError => e
  # error occured
end
```
Sign message:

```ruby
begin
  signed_message = Themis.s_sign(private_key, message)
rescue ThemisError => e
  # error occured
end
```

Verify message:

Peer public key should be from the same keypair as private key.

```ruby
begin
  message = Themis.s_verify(peer_public_key, message_signed_by_peer)
rescue ThemisError => e
  # error occured
end
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

#### Secure Cell interface:

```ruby
class Scell
  def initialize(key, mode)
  def encrypt(message, context = nil)
  def decrypt(message, context = nil)
end
```

_Description_:

- `initialize(key, mode)`<br/>
  Initialise Secure Cell object with master **key** and **mode**. Where _mode_ is one of:

    - `SEAL_MODE` – for Seal mode.
    - `TOKEN_PROTECT_MODE` – for Token-Protect mode.
    - `CONTEXT_IMPRINT_MODE` – for Context-Imprint mode.

- `encrypt(message, context = nil)`<br/>
  Encrypt **message** with optional **context**.<br/>
  Returns encrypted binary string in _seal_ and _context-imprint_ modes.<br/>
  Returns an array of two strings (encrypted string and token) in _token-protect_ mode.<br/>
  Raises **ThemisError** on failure.

- `decrypt(message, context = nil)`<br/>
  Decrypt **message** with optional **context**.<br/>
  (For _token-protect_ mode pass an array of message and token.)<br/>
  Returns decrypted binary string.<br/>
  Raises **ThemisError** on failure.

#### Examples

```ruby
base64_key = 'cURxVjQ1WlFQSFN1Y0Fwa1lINmlUUjBKUFNOSGQwa0sK'
master_key = Base64.decode64(base64_key)
```

##### Secure Cell Seal Mode

```ruby
scell_seal = Themis::Scell.new(master_key, Themis::Scell::SEAL_MODE)

encrypted_message = scell_seal.encrypt(message, context)

decrypted_message = scell_seal.decrypt(encrypted_message, context)
```

##### Secure Cell Token-Protect Mode

```ruby
scell_token = Themis::Scell.new(master_key, Themis::Scell::TOKEN_PROTECT_MODE)

encrypted_message, token = scell_token.encrypt(message, context)

decrypted_message = scell_token.decrypt([encrypted_message, token], context)
```

##### Secure Cell Context-Imprint Mode

> **NOTE:**
> Context is _required_ in context-imprint mode.

```ruby
scell_context = Themis::Scell.new(master_key, Themis::Scell::CONTEXT_IMPRINT_MODE)

encrypted_message = scell_context.encrypt(message, context)

decrypted_message = scell_context.decrypt(encrypted_message, context)
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

```ruby
class Ssession
  def initialize(id, private_key, transport)
  def established?
  def connect_request
  def wrap(message)
  def unwrap(message)
end
```

_Description_:

- `initialize(id, private_key, transport)`<br/>
  Initialize Secure Session object with peer **id**, **private_key** and a **transport**.<br/>
  Raises **ThemisError** on failure.<br/>
  Transport must be a callback object with the following interface:
```ruby
class transport < Themis::Callbacks
  def get_pub_key_by_id(id)
  # - return public_key associated with id
end
```

- `established?`<br/>
  Checks whether the connection has been established.<br/>
  Raises **ThemisError** on failure.

- `connect_request`<br/>
  Create connection initialisation message, send it to the peer.<br/>
  Raises **ThemisError** on failure.

- `wrap(message)`<br/>
  Encrypts user **message** for sending.<br/>
  Raises **ThemisError** on failure.

- `unwrap(message)`<br/>
  Decrypts **message** from the peer.<br/>
  Returns a pair of status code and message. If the status is `Themis::SEND_AS_IS`, the returned message is a connection reply that must be sent to the peer without any corrections. Otherwise it is a decrypted user message received from the peer.<br/>
  Raises **ThemisError** on failure.

#### Secure Session Workflow

Secure Session can be used in two ways:

- _send/receive_ – when communication flow is fully controlled by a Secure Session object.
- _wrap/unwrap_ – when communication is controlled by the user.

> **NOTE:**
> We consider **wrap/unwrap** more fit for typical Ruby frameworks
> (we've looked into Ruby on Rails and Eventmachine),
> so currently Secure Session supports wrap/unwrap mode only.
> However, if you find that a fully-automatic send/receive mode might be a good use case for something,
> [let us know](mailto:dev@cossacklabs.com).

Secure Session has two parties called "client" and "server" for the sake of simplicity, but they could be more precisely called "initiator" and "acceptor" — the only difference between them is in who starts the communication.

Secure Session relies on the user's passing a number of callback functions to send/receive messages — and the keys are retrieved from local storage (see more in [Secure Session cryptosystem description](/pages/secure-session-cryptosystem/)).

#### Wrap/Unwrap

Initialise callbacks:

```ruby
class CallbacksForThemis < Themis::Callbacks
  def get_pub_key_by_id(id)
    # retrieve public_key for id from trusted storage (file, db, etc.)
    return public_key
  end
end
```

##### Secure Session client

First, initialisation:

```ruby
@callbacks = CallbacksForThemis.new
@session = Themis::Ssession.new(id, client_private_key, @callbacks)

# only the client calls this method
connect_request = @session.connect_request
send_to_server(connect_request)

connection_message = receive_from_server()
res, message = @session.unwrap(connection_message)

while res == Themis::SEND_AS_IS
  send_to_server(message)

  connection_message = receive_from_server()
  res, message = @session.unwrap(connection_message)
end
```

After the loop finishes, Secure Session is established and is ready to be used.

To encrypt an outgoing message use:

```ruby
encrypted_message = @session.wrap(message)
send_to_server(encrypted_message)
```

To decrypt the received message use:

```ruby
encrypted_message = receive_from_server()
message = @session.unwrap(encrypted_message)
```

##### Secure Session server

First, initialise everything:

```ruby
@callbacks = CallbacksForThemis.new
@session = Themis::Ssession.new(id, server_private_key, @callbacks)

# there is not connect_request call - it is a server

# receive message from client
connection_message = receive_from_client()
res, message = @session.unwrap(connection_message)

while res == Themis::SEND_AS_IS
  send_to_client(message)

  connection_message = receive_from_client()
  res, message = @session.unwrap(connection_message)
end
```

Secure Session is ready. Sending and receiving encrypted messages are the same.

Send encrypted:

```ruby
encrypted_message = @session.wrap(message)
send_to_client(encrypted_message)
```

Receive and decrypt:

```ruby
encrypted_message = receive_from_client()
message = @session.unwrap(encrypted_message)
```

That's it! See the full example available in [docs/examples/ruby](https://github.com/cossacklabs/themis/tree/master/docs/examples/ruby).

### Secure Comparator

Secure Comparator is an interactive protocol for two parties that compares whether they share the same secret or not. It is built around a [Zero Knowledge Proof](https://www.cossacklabs.com/zero-knowledge-protocols-without-magic.html)-based protocol ([Socialist Millionaire's Protocol](https://en.wikipedia.org/wiki/Socialist_millionaires)), with a number of [security enhancements](https://www.cossacklabs.com/files/secure-comparator-paper-rev12.pdf).

Secure Comparator is transport-agnostic and only requires the user(s) to pass messages in a certain sequence. The protocol itself is ingrained into the functions and requires minimal integration efforts from the developer.

#### Secure Comparator interface

```ruby
class Scomparator
   def initialize(shared_secret)
   def begin_compare
   def proceed_compare(control_message)
   def result
end
```

_Description_:

- `initialize(shared_secret)`<br/>
  Initialise Secure Comparator object with a **shared_secret** to compare.<br/>
  Raises **ThemisError** on failure.

- `begin_compare`<br/>
  Return a Secure Comparator initialisation message.<br/>
  Raises **ThemisError** on failure.

- `proceed_compare(control_message)`<br/>
  Process **control_message** and return the next one.<br/>
  Raises **ThemisError** on failure.

- `result`<br/>
  Return the status of comparison:

    - `NOT_READY` – continue calling `proceed_compare`
    - `MATCH` or `NOT_MATCH` – comparison result

#### Secure Comparator workflow

Secure Comparator has two parties — called "client" and "server" — the only difference between them is in who starts the comparison.

#### Secure Comparator client

```ruby
@comparator = Themis::Scomparator.new('Test shared secret')

# this call is specific to the client
comparison_message = @comparator.begin_compare

while @comparator.result == Themis::Scomparator::NOT_READY do
    user_send_function(comparison_message)
    comparison_message = user_receive_function()
    comparison_message = @comparator.proceed_compare(comparison_message)
end
```

After the loop finishes, the comparison is over and its result can be checked by calling `@comparator.result`.

#### Secure Comparator server

```ruby
@comparator = Themis::Scomparator.new('Test shared secret')

while @comparator.result == Themis::Scomparator::NOT_READY do
    comparison_message = user_receive_function()
    comparison_message = @comparator.proceed_compare(comparison_message)
    user_send_function(comparison_message)
end
```

After the loop finishes, the comparison is over and its result can be checked by calling `@comparator.result`.

That's it! See the full example available in [docs/examples/ruby](https://github.com/cossacklabs/themis/tree/master/docs/examples/ruby).
