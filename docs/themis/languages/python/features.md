---
weight: 4
title:  Features
---

# Features of JsThemis

<a id="importing-themis"></a>
## Using Themis

In order to use Themis, you need to import it first.

Add to your code:

```python
import pythemis
```

Now you're good to go!

You can also import only a certain module (keypair generation, for example):

```python
from pythemis import skeygen
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

```python
from pythemis.skeygen import GenerateKeyPair, KEY_PAIR_TYPE

# Use KEY_PAIR_TYPE.RSA to generate RSA keys instead
keypair = GenerateKeyPair(KEY_PAIR_TYPE.EC)

# Keys are "bytes" in Python 3 and "str" in Python 2
private_key = keypair.export_private_key()
public_key = keypair.export_public_key()
```

#### Symmetric key generation
Themis uses highly efficient and secure AES algorithm for symmetric cryptography.
A symmetric key is necessary for [Secure Cell](/pages/secure-cell-cryptosystem/) objects.

> **NOTE:** Symmetric key generation API will become available for pythemis starting with starting with 0.13.0. For now, use common sense or consult [the wisdom of the Internet](https://stackoverflow.com/search?q=generate+cryptographically+secure+keys).


<!--
> ⚠️ **WARNING:**
> When you store generated keys, make sure they are sufficiently protected.
> You can find the guidelines [here](/pages/documentation-themis/#key-management).

To generate symmetric keys, use:

```python
from pythemis.skeygen import GenerateSymmetricKey

# Keys are "bytes" in Python 3 and "str" in Python 2
master_key = GenerateSymmetricKey()
```
-->

### Secure Message

The Secure Message functions provide a sequence-independent, stateless, contextless messaging system. This may be preferred in cases that don't require frequent sequential message exchange and/or in low-bandwidth contexts. This is secure enough to exchange messages from time to time, but if you'd like to have Perfect Forward Secrecy and higher security guarantees, consider using [Secure Session](#secure-session) instead.

The Secure Message functions offer two modes of operation:

In **Sign/Verify** mode, the message is signed using the sender's private key and is verified by the receiver using the sender's public key. The message is packed in a suitable container and ECDSA is used by default to sign the message (when RSA key is used, RSA+PSS+PKCS#7 digital signature is used).

In **Encrypt/Decrypt** mode, the message will be encrypted with a randomly generated key (in RSA) or a key derived by ECDH (in ECDSA), via symmetric algorithm with Secure Cell in seal mode (keys are 256 bits long).

The mode is selected by using appropriate methods. For encrypt/decrypt mode use `wrap` and `unwrap` methods of `SMessage` class. A valid public key of the receiver and a private key of the sender are required in this mode. For sign/verify mode `ssign` and `sverify` functions should be used. They only require a private key for signing and a public key for verification respectively.

Read more about the Secure Message's cryptographic internals [here](/pages/secure-message-cryptosystem/).

#### Secure Message interface

```python
class SMessage(object):
   def __init__(self, private_key: bytes, peer_public_key: bytes)
   def wrap(self, message) -> bytes
   def unwrap(self, message) -> bytes

def ssign(private_key: bytes, message: bytes) -> bytes
def sverify(public_key: bytes, message: bytes) -> bytes
```

_Description_:

`class SMessage` provides Secure Message encryption:

  - `__init__(self, private_key: bytes, peer_public_key: bytes)`<br/>
    Initialise Secure Message object with **private_key** and **peer_public_key**.<br/>
    Throws **ThemisError** on failure.

  - `wrap(self, message: bytes) -> bytes`<br/>
    Encrypt **message**.<br/>
    Returns encrypted Secure Message container as a binary string.<br/>
    Throws **ThemisError** on failure.

  - `unwrap(self, message: bytes) -> bytes`<br/>
    Decrypt encrypted **message**.<br/>
    Returns decrypted message as a binary string.<br/>
    Throws **ThemisError** on failure.

Secure Message signing is provided by standalone functions:

  - `ssign(private_key: bytes, message: bytes) -> bytes`<br/>
    Sign **message** with **private_key**.<br/>
    Returns signed Secure Message container as a binary string.<br/>
    Throws **ThemisError** on failure.

  - `sverify(public_key: bytes, message: bytes) -> bytes`<br/>
    Verify signed **message** with **public_key**.<br/>
    Returns original message without signature as a binary string.<br/>
    Throws **ThemisError** on failure.

> **NOTE**: For verifying the message, use public key from the same keypair as private key used for signing.


#### Example

Initialise encrypter:

```python
from pythemis.skeygen import KEY_PAIR_TYPE, GenerateKeyPair
from pythemis.smessage import SMessage, ssign, sverify
from pythemis.exception import ThemisError

keypair1 = GenerateKeyPair(KEY_PAIR_TYPE.EC)
keypair2 = GenerateKeyPair(KEY_PAIR_TYPE.EC)

smessage = SMessage(keypair1.export_private_key(), keypair2.export_public_key())
```

Encrypt message:

```python
try:
    encrypted_message = smessage.wrap(b'some message')
except ThemisError as e:
    print(e)
```

Decrypt message:

```python
try:
    message = smessage.unwrap(encrypted_message)
except ThemisError as e:
    print(e)
```


Sign message:

```python
try:
    signed_message = ssign(keypair1.export_private_key(), b'some message')
except ThemisError as e:
    print(e)
```

> **NOTE**: _For signing/verifying make sure that you use keys from the same keypair: private key for signing the message and public key for verifying it._

Verify message:

```python
try:
    message = sverify(keypair1.export_public_key(), signed_message)
except ThemisError as e:
    print(e)
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

#### Secure Cell Seal mode interface

```python
class SCellSeal(object):
   def __init__(self, key: bytes)
   def encrypt(self, message: bytes, context=None: bytes) -> bytes
   def decrypt(self, message: bytes, context=None: bytes) -> bytes
```

_Description_:

- `__init__(self, key: bytes)`<br/>
  Initialise Secure Cell in _seal mode_ with **key**.

- `encrypt(self, message: bytes, context=None: bytes) -> bytes`<br/>
  Encrypt **message** with an optional **context**.<br/>
  Returns encrypted message.<br/>
  Throws **ThemisError** on failure.

- `decrypt(self, message: bytes, context=None: bytes) -> bytes`<br/>
  Decrypt **message** with an optional **context**.<br/>
  Returns decrypted message.<br/>
  Throws **ThemisError** on failure.

##### Example

Initialise encrypter/decrypter:

```python
from pythemis.scell import SCellSeal

base64Key = b'RWRxVE4zaDFnWk1EaXR5TDRKVVFKYmlNbGpvcktxY0MK'
masterKey = base64.decodebytes(base64Key)

scell = SCellSeal(masterKey)
```

Encrypt:

```python
encrypted_message = scell.encrypt(b'message', b'context')
```

Decrypt:

```python
message = scell.decrypt(encrypted_message, b'context')
```

#### Secure Cell Token-protect Mode

```python
class SCellTokenProtect(object)
   def __init__(self, key: bytes)
   def encrypt(self, message: bytes, context=None: bytes) -> (bytes, bytes)
   def decrypt(self, message: bytes, additional_auth_data: bytes, context=None: bytes) -> bytes
```

_Description_:

- `__init__(self, key)`<br/>
  Initialise Secure Cell in _token protect mode_ with **key**.

- `encrypt(self, message: bytes, context=None: bytes) -> (bytes, bytes)`<br/>
  Encrypt **message** with an optional **context**.<br/>
  Returns two binary strings containing encrypted message and token.<br/>
  Throws **ThemisError** on failure.

- `decrypt(self, message: bytes, token: bytes, context=None: bytes) -> bytes`<br/>
  Decrypt **message** with **token** and an optional **context**.<br/>
  Returns decrypted message.<br/>
  Throws **ThemisError** on failure.

##### Example

Initialise encrypter/decrypter:

```python
from pythemis.scell import SCellTokenProtect

base64Key = b'RWRxVE4zaDFnWk1EaXR5TDRKVVFKYmlNbGpvcktxY0MK'
masterKey = base64.decodebytes(base64Key)

scell = SCellTokenProtect(masterKey)
```

Encrypt:

```python
encrypted_message, additional_auth_data = scell.encrypt(b'message', b'some context')
```

Decrypt:

```python
message = scell.decrypt(encrypted_message, additional_auth_data, b'some context')
```

#### Secure Cell Context-Imprint Mode

```python
class SCellContextImprint(object):
   def __init__(self, key: bytes)
   def encrypt(self, message: bytes, context: bytes) -> bytes
   def decrypt(self, message: bytes, context: bytes) -> bytes
```

_Description_:

- `__init__(self, key: bytes)`<br/>
  Initialise Secure Cell in _context-imprint mode_ with **key**.

- `encrypt(self, message: bytes, context: bytes) -> bytes`<br/>
  Encrypt **message** with **context**.<br/>
  Returns encrypted message.<br/>
  Throws **ThemisError** on failure.

- `decrypt(self, message: bytes, context: bytes) -> bytes`<br/>
  Decrypt **message** with **context**.<br/>
  Returns decrypted message.<br/>
  Throws **ThemisError** on failure.

> **NOTE**: Context is _required_ in context-imprint mode.

##### Example

Initialise encrypter/decrypter:

```python
from pythemis.scell import SCellContextImprint

base64Key = b'RWRxVE4zaDFnWk1EaXR5TDRKVVFKYmlNbGpvcktxY0MK'
masterKey = base64.decodebytes(base64Key)

scell = SCellContextImprint(masterKey)
```

Encrypt:

```python
encrypted_message = scell.encrypt(b'test message', b'test context')
```

Decrypt:

```python
message = scell.decrypt(encrypted_message, b'test context')
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

#### Secure Session interface:

```python
class SSession(object):
   def __init__(self, id: bytes, private_key: bytes, transport: TransportStruct)
   def is_established(self) -> bool
   def connect_request(self) -> bytes
   def wrap(self, message: bytes) -> bytes
   def unwrap(self, message: bytes) -> bytes
   def connect(self)
   def send(self, message: bytes) -> int
   def receive(self) -> bytes
```

_Description_:

- `__init__(self, id: bytes, private_key: bytes, transport: TransportStruct)`<br/>
  Initialie Secure Session object with **id**, **private_key** and **transport**.<br/>
  Throws **ThemisError** on failure.

- `is_established(self) -> bool`<br/>
  Check whether Secure Session connection has been established.<br/>
  Throws **ThemisError** on failure.

- `connect(self)`<br/>
  Create and send a Secure Session initialisation message to peer.<br/>
  Returns nothing.<br/>
  Throws **ThemisError** on failure.

- `send(self, message: bytes) -> int`<br/>
  Encrypt **message** and send it to peer.<br/>
  Returns internal status code.<br/>
  Throws **ThemisError** on failure.

- `receive(self) -> bytes`<br/>
  Receive a message from peer, decrypt and return it.<br/>
  Throws **ThemisError** on failure.

- `connect_request(self) -> bytes`<br/>
  Return a Secure Session initialisation message.<br/>
  Throws **ThemisError** on failure.

- `wrap(self, message: bytes) -> bytes`<br/>
  Encrypt **message** for peer.<br/>
  Throws **ThemisError** on failure.

- `unwrap(self, message: bytes) -> bytes`<br/>
  Decrypt **message** from peer.<br/>
  Returned result may contain either decrypted data or a control message. If `is_control` property is true, the message must be sent to peer as is.<br/>
  Throws **ThemisError** on failure.

#### Secure Session Workflow

Secure Session can be used in two ways:

 - _send/receive_ – when communication flow is fully controlled by the Secure Session object.
 - _wrap/unwrap_  – when communication is controlled by the user.

Secure Session has two parties called "client" and "server" for the sake of simplicity, but they could be more precisely called "initiator" and "acceptor" — the only difference between them is in who starts the communication.

Secure Session relies on the user's passing a number of callback functions to send/receive messages — and the keys are retrieved from local storage (see more in [Secure Session cryptosystem description](/pages/secure-session-cryptosystem/)).


#### Communication flow is fully controlled by the Secure Session object

##### Transport class for send/receive

Implement all methods in the callbacks class:

```python
class CustomTransport(object):
    def __init__(self, *args, **kwargs)
        # init communication channel with peer

    def send(self, message):
        # send message to peer

    def receive(self, buffer_length):
        # wait and receive at most buffer_length bytes from peer
        return accepted_message

    def get_pub_key_by_id(self, user_id):
        # retrieve public key for peer user_id from trusted storage (file, db etc.)
        return public_key
```

##### Secure Session client

First, initialise the session:

```python
from pythemis.ssession import SSession
session = SSession(b'some client id', client_private_key, CustomTransport())
session.connect()
while not session.is_established():
    session.receive()
```

After the loop finishes, Secure Session is established and is ready to be used.

To send a message over the established session, use:

```python
session.send(message)
```

To receive a message from the session:

```python
message = ssession.receive()
```

##### Secure Session server

First, initialise the session:

```python
session = SSession(b'some server id', server_private_key, CustomTransport())
# there is no need to call connect() method on the server side
while not session.is_established():
    session.receive()
```

Sending/receiving messages works in a manner similar to the client side after the connection is established.

To encrypt and send an outgoing message to the client use:

```python
session.send(message)
```

To receive and decrypt a message from the client use:

```python
message = session.receive()
```

#### Communication controlled by user

##### Transport class for wrap/unwrap

Implement only required methods in the callback class:

```python
from pythemis.ssession import MemoryTransport


class CustomSimpleTransport(MemoryTransport):
   def __init__(self, *args, **kwargs)
       # initialize trusted public keys storage
       super(CustomSimpleTransport, self).__init__()

   def get_pub_key_by_id(self, user_id):
       # retreive public key for peer user_id from trusted storage (file, db etc.)
       return public_key
```

##### Secure Session client

First, the initialisation:

```python
session = SSession(b'user_id2', client_private_key, CustomSimpleTransport())
# this call is only made by the client
encrypted_message = session.connect_request()

# send connect request to the peer
response_bytes = user_communication_send_method(encrypted_message)
message = session.unwrap(response_bytes)

# establish the session
while not session.is_established():
    response_bytes = user_communication_send_method(message)
    message = session.unwrap(response_bytes)
```

After the loop finishes, Secure Session is established and is ready to be used.

To encrypt the outgoing message, use:

```python
encrypted_message = session.wrap(message)
# send encrypted_message to peer by any prefered method
```

To decrypt the received message, use:

```python
# receive encrypted_message from peer
message = session.unwrap(encrypted_message)
```

##### Secure Session server

First, initialise everything:

```python
session = SSession(b'server_id_1', server_private_key, CustomSimpleTransport())
# there is no need to call connect() or connect_request() on the server side

encrypted_message = user_communication_recieve_method()
message = session.unwrap(encrypted_message)

# NOTE: The condition is different for the server because we need to send
# the last piece of data to the client after establishing the session.
while message.is_control:
    # just return the unwrapped message to the user
    user_communication_send_method(message)

    encrypted_message = user_communication_recieve_method()
    message = session.unwrap(encrypted_message)
```

Secure Session is ready.

Send/receive works in the same way as the client's example above.


### Secure Comparator

Secure Comparator is an interactive protocol for two parties that compares whether they share the same secret or not. It is built around a [Zero Knowledge Proof](https://www.cossacklabs.com/zero-knowledge-protocols-without-magic.html)-based protocol ([Socialist Millionaire's Protocol](https://en.wikipedia.org/wiki/Socialist_millionaires)), with a number of [security enhancements](https://www.cossacklabs.com/files/secure-comparator-paper-rev12.pdf).

Secure Comparator is transport-agnostic and only requires the user(s) to pass messages in a certain sequence. The protocol itself is ingrained into the functions and requires minimal integration efforts from the developer.

#### Secure Comparator interface

```python
class SComparator:
   def __init__(self, shared_secret: bytes)
   def begin_compare(self) -> bytes
   def proceed_compare(self, message: bytes) -> bytes
   def is_compared(self) -> bool
   def is_equal(self) -> bool
   def result(self)
```

_Description_:

- `__init__(self, shared_secret: bytes)`<br/>
  Initialise Secure Comparator object with a **shared_secret**.<br/>
  Throws **ThemisError** on failure.

- `begin_compare(self)`<br/>
  Start comparison and return a Secure Comparator initialisation message.<br/>
  Throws **ThemisError** on failure.

- `proceed_compare(self, message)`<br/>
  Process **message** and create the next protocol message (when necessary).<br/>
  Throws **ThemisError** on failure.

- `is_compared(self) -> bool`<br/>
  Return True if comparison is finished.<br/>
  Throws **ThemisError** on failure.

- `is_equal(self) -> bool`<br/>
  Return True if comparison is finished _and_ secrets are equal, otherwise return False.<br/>
  Throws **ThemisError** on failure.

- `result(self) -> int`<br/>
  Return the original comparison result code.<br/>
  Throws **ThemisError** on failure.

#### Secure Comparator workflow

Secure Comparator has two parties — called "client" and "server" — the only difference between them is in who starts the comparison.

#### Secure Comparator client

```python
from pythemis.scomparator import SComparator


comparator = SComparator(b'shared_secret')

# this call is specific to the client
comparison_message = comparator.begin_compare()

while not comparator.is_compared():
    user_send_function(comparison_message)
    response = user_recieve_function()
    comparison_message = comparator.proceed_compare(response)
```

After the loop finishes, the comparison is over and its result can be checked by calling `comparator.is_equal()`.

#### Secure Comparator server

```python
from pythemis.scomparator import SComparator


comparator = SComparator(b'shared_secret')

while not comparator.is_compared():
     comparison_message = user_receive_function()
     comparison_message = comparator.proceed_compare(comparison_message)
     user_send_function(comparison_message)
```

After the loop finishes, the comparison is over and its result can be checked by calling `comparator.is_equal()`.
