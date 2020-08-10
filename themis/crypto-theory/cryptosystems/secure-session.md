---
weight: 4
title:  Secure Session
---

# Secure Session

**Secure Session** is a lightweight mechanism for securing any kind of network communication
(both private and public networks, including the Internet).
It is protocol-agnostic and operates on the 5th layer of the network OSI model.

Some of the features of Secure Session are:

  - secure end-to-end communication
  - perfect forward secrecy
  - strong mutual peer authentication
  - replay protection
  - low negotiation round-trip
  - use of strong cryptography (including ECC)
  - simplicity, user-friendliness
  - ease of integration into existing applications

{{< hint info >}}
**Note:**
You may also want to read [this comment](https://github.com/cossacklabs/themis/issues/529#issuecomment-531731507)
on comparing the design goals and usage of
[Secure Session](../secure-session/)
and [Secure Comparator](../secure-comparator/)
with [SRP](https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol).
{{< /hint >}}

## Availability in Themis

Secure Session is available in all languages supported by Themis:

  - [C++](/themis/languages/cpp/features/#secure-session)
  - [Go](/themis/languages/go/features/#secure-session)
  - [JavaScript (WebAssembly)](/themis/languages/wasm/features/#secure-session)
  - [JavaScript (Node.js)](/themis/languages/nodejs/features/#secure-session)
  - [Java](/themis/languages/java/features/#secure-session)
  - [Kotlin](/themis/languages/kotlin/features/#secure-session)
  - [Objective-C](/themis/languages/objc/features/#secure-session)
  - [Swift](/themis/languages/swift/features/#secure-session)
  - [PHP](/themis/languages/php/features/#secure-session)
  - [Python](/themis/languages/python/features/#secure-session)
  - [Ruby](/themis/languages/ruby/features/#secure-session)
  - [Rust](/themis/languages/rust/features/#secure-session)

## Protocol description

Communication over Secure Session consists of 2 stages:

 1. Negotiation (key agreement)
 2. Data exchange

### Negotiation stage

During the negotiation stage,
peers exchange their cryptographic material and authenticate each other.
After successful mutual authentication,
each peer derives a session-shared secret and other auxiliary data
from the session (session ID, initial vectors, etc.)

{{< hint info >}}
**Note:**
Session ID is random and is derived from the negotiated cryptographic material
by each peer independently.
There is no way for a specific value to be enforced by any of the peers.
{{< /hint >}}

![](/files/wiki/secure_session_negotiation.png)

### Data exchange stage

During the data exchange stage,
peers securely exchange data provided by higher layer protocols.

The session parameters (state) can be saved and restored at any time.
This means that the lifetime of the Session can exceed the underlying environment's power cycle.

{{< hint danger >}}
**Warning:**
Secure Session state contains sensitive information and should be stored and handled in a secure manner.
For example, [Secure Cell](../secure-cell/) may be used.
{{< /hint >}}

![](/files/wiki/secure_session_message.png)

## Usage model

Secure Session only provides security services and doesn't do actual network communication.
In fact, Secure Session is decoupled and independent from any networking implementation.
It is your responsibility to provide an actual network transport for Secure Session to use.

There are two types of APIs available for easy integration and implementation:
the _buffer-aware_ API and the _callback_ API.

### Buffer-aware API

This API is more flexible and useful for integrating Secure Session with an application
that has its own sophisticated established network processing path.
You only need to add some calls to Secure Session somewhere in this path.
These calls will be operating with client-provided buffers directly.

![](/files/wiki/secure_session_buffer_aware_api.png)

### Callback-oriented API

Instead of integrating Secure Session into network processing path you can do the reverse:
implement a set of simple callback methods and register them within the Secure Session framework.
These callbacks are simple send/receive methods which will be called by Secure Session as necessary.

![](/files/wiki/secure_session_callback_api.png)

#### Mixed scenarios

It is possible to mix buffer-aware and callback APIs together and use them simultaneously
when your specific application requires it.
For example, you can:

  - use buffer-aware API to receive data, but use callback API to send it back
  - use callback API in negotiation stage, but use buffer-aware API for data exchange
  - switch from callback API to buffer-aware API and back again in the run-time
    based on some specific conditions

## Implementation details

Secure Session interface is described in
[`src/themis/secure_session.h`](https://github.com/cossacklabs/themis/blob/master/src/themis/secure_session.h).

#### Lifetime management

New Secure Sessions are created by the `secure_session_create()` function
and has to be destroyed with `secure_session_destroy()`:

```c
secure_session_t* secure_session_create(
    const void* peer_id,
    size_t      peer_id_length,
    const void* private_key,
    size_t      private_key_length,
    const secure_session_user_callbacks_t* user_callbacks);

themis_status_t secure_session_destroy(secure_session_t* ctx);
```

#### Peer IDs and keys

Secure Session uses public-key cryptography for peer identification.
Within a group of communicating Secure Sessions,
every peer has at least one _peer ID_ and a corresponding _keypair_ associated with it.

**Peer ID** is an arbitrary non-empty byte array identifying a particular keypair.
It is used by the transport callbacks to look up the corresponding public key.
Peer ID is public information transmitted in plaintext during the negotiation stage.
All Secure Session clients should know IDs of their peers.

There are no specific restrictions on peer ID content or length.
You can use whatever is suitable for your application,
for example:

  - a static string: `"Client"`, `"Server"`
  - hash sum of your public key: `74fa0f30262d...`
  - GUID: `e3e7b306-c358-469a-a339-82671b651f78`

The only requirement for peer ID is that it cannot be empty
and it must uniquely identify the public key used by a peer.

**Keypairs** can be securely generated with Themis key generation functions.
Secure Session only supports EC keys. RSA support is available per request only.
Please [contact us](mailto:dev@cossacklabs.com) if you need to use RSA or other key types.

The API is described in
[`src/themis/secure_keygen.h`](https://github.com/cossacklabs/themis/blob/master/src/themis/secure_keygen.h):

```c
themis_status_t themis_gen_ec_key_pair(
    uint8_t* private_key,
    size_t*  private_key_length,
    uint8_t* public_key,
    size_t*  public_key_length);
```

{{< hint info >}}
**Note:**
Themis does not support importing pre-existing keys generated elsewhere.
This makes it much harder to use weak keys, unknowingly or intentionally provided by third-parties.
{{< /hint >}}

The resulting private key must be kept secret by the peer.
It is passed to Secure Session during construction.
The public key should be known to the other communication peers,
it will be requested during the key negotiation stage of Secure Session.

{{< hint info >}}
Please consult the [key management guidelines](/themis/crypto-theory/key-management/)
to learn more about storing and exchanging keys securely after you have generated them.
{{< /hint >}}

#### Transport callbacks

Secure Session requires a transport callback object for operation.
The transport object is represented by the following structure:

```c
struct secure_session_user_callbacks_type {
    send_protocol_data_callback     send_data;
    receive_protocol_data_callback  receive_data;
    protocol_state_changed_callback state_changed;
    get_public_key_for_id_callback  get_public_key_for_id;

    void* user_context;
};
```

The callback function signatures are:

```c
typedef ssize_t (*send_protocol_data_callback)(
    const uint8_t* data,
    size_t         data_length,
    void*          user_context);

typedef ssize_t (*receive_protocol_data_callback)(
    uint8_t*       data,
    size_t         data_length,
    void*          user_context);

typedef void (*protocol_state_changed_callback)(
    int         event,
    void*       user_context);

typedef int (*get_public_key_for_id_callback)(
    const void* peer_id,
    size_t      peer_id_length,
    void*       public_key_out,
    size_t      public_key_out_length,
    void*       user_context);
```

The `get_public_key_for_id_callback` is the only required callback.
It is used to get the public key corresponding to a peer ID during the negotiation stage.
Without it Secure Session will have no means for authenticating the key exchange.

The `send_protocol_data_callback` and `receive_protocol_data_callback`
enable to callback API.
They are used to send and receive data over the communication channel.
These callbacks are called by the `secure_session_send()`, `secure_session_receive()`,
and `secure_session_connect()` functions
when they need to communicate.
If these callbacks are not set,
Secure Session can still be used in wrap/unwrap mode (see below).

The `protocol_state_changed_callback` is optional.
It delivers Secure Session state transitions to the client application.
You can not set it if you are not interested in state change notifications.

#### Wrap/Unwrap mode (buffer-aware API)

In this mode data exchange callbacks are not used.
You have to provide message buffers directly to Secure Session.

Initiate the connection with `secure_session_generate_connect_request()`
and send the message to the peer.

```c
themis_status_t secure_session_generate_connect_request(
    secure_session_t* ctx,
    void*   request_out,
    size_t* request_out_length);
```

For each next message that you wish to send,
wrap it with `secure_session_wrap()` and send the result to your peer.
Each recieved message must be unwrapped with `secure_session_unwrap()`.

```c
themis_status_t secure_session_wrap(
    secure_session_t* ctx,
    const void* message,
    size_t      message_length,
    void*       wrapped_message,
    size_t*     wrapped_message_length);

themis_status_t secure_session_unwrap(
    secure_session_t* ctx,
    const void* wrapped_message,
    size_t      wrapped_message_length,
    void*       message,
    size_t*     message_length);
```

#### Send/Receive mode (callback API)

In this mode Secure Session manages communication channel on its own
using the data exchange callbacks provided by you.

Initiate the connection with `secure_session_connect()`.

```c
themis_status_t secure_session_connect(secure_session_t* session_ctx);

bool secure_session_is_established(const secure_session_t* session_ctx);
```

Secure Session will invoke `send_protocol_data_callback` and `receive_protocol_data_callback`
as necessary to negotiate the connection.

Once `secure_session_is_established()`,
you can use `secure_session_send()` and `secure_session_receive()`
to send and receive messages.
Again, Secure Session will invoke required callbacks with wrapped messages as necessary.

```c
ssize_t secure_session_send(
    secure_session_t *ctx,
    const void* message,
    size_t      message_length);

ssize_t secure_session_receive(
    secure_session_t* ctx,
    void*       message,
    size_t      message_length);
```

## Thread safety

Secure Session requires additional synchronisation to be used concurrently from multiple threads.
Read more about [Themis thread safety guarantees](/themis/debugging/thread-safety/).

## Themis Server simulator

[Themis Server](/themis/debugging/themis-server/)
is an interactive simulator that can be used as a remote debugging aid.
We built this server to help engineers understand Themis.
It can come in handy if you're just starting out with this library.

Using the Themis Server, you can avoid spending a lot of time and effort
to build your own client and server, make sure you get the keys right, etc.
With a simple “remote party simulator” you can try out Secure Session interactively.

Themis Server supports
[Secure Message](../secure-message/) and [Secure Cell](../secure-cell/)
cryptosystems as well.
