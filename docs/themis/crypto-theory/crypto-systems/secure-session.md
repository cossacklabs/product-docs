---
weight: 4
title: "Secure Session"
---

## Secure Session

**Secure Session** is a lightweight mechanism for securing any kind of network communication (both private and public networks, including the Internet). It is protocol-agnostic and operates on the 5th layer of the network OSI model. 

Some of the features of Secure Session are:

- secure end-to-end communication;
- perfect forward secrecy;
- strong mutual peer authentication;
- replay protection;
- low negotiation round-trip;
- use of strong cryptography (including ECC);
- simplicity, user-friendliness;
- ease of integration into existing applications.


Communication over Secure Session consists of 2 stages:

- negotiation stage (key agreement);
- actual data exchange.

{{< hint info >}}
**Note:** You may also want to read [this comment](https://github.com/cossacklabs/themis/issues/529#issuecomment-531731507) on comparing the design goals and usage of [Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session/) and [Secure Comparator](/docs/themis/crypto-theory/crypto-systems/secure-comparator/) with [SRP](https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol). 
{{< /hint >}}


### Negotiation stage

During the negotiation stage, peers exchange their cryptographic material and authenticate each other. After successful mutual authentication, each peer derives a session-shared secret and other auxiliary info from the session (session ID, initial vectors, etc.).

{{< hint info >}}
**Note:** Session ID is random and is derived from the negotiated cryptographic material by each peer independently. There is no way for a specific value to be enforced by one of the peers.
{{< /hint >}}


![](/files/wiki/secure_session_negotiation.png)


### Data exchange stage

During the data exchange stage, peers securely exchange data provided by higher layer protocols. The session parameters (state) can be saved and restored at any time. This means that the lifetime of the Session extends to the underlying environment's power cycle.

{{< hint warning >}}
**⚠️ Warning:** The Session state contains sensitive information and should be stored and handled in a secure manner. For example, [Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/) may be used.
{{< /hint >}}


Here is how the data is protected within the Session:

![](/files/wiki/secure_session_message.png)


## Integration scenarios 

Secure Session only provides security services and doesn't do actual network communication. In fact, Secure Session is decoupled and independent from any networking implementation. It becomes the caller's responsibility to provide an actual network transport for Secure Session to use. There are two types of APIs available for easy integration and implementation: _callback API_ and _buffer-aware API_.

### Callback API

The easiest way to quickly leverage Secure Session in your solution is to implement a set of simple callback methods and register them within the Secure Session framework. These callbacks are a little more than just simple send/receive methods, but this is the interface that will bind the generic Secure Session communication with your actual networking implementation.

![](/files/wiki/secure_session_callback_api.png)


### Buffer-aware API

This type of API is useful for integrating Secure Session with an application that has its own sophisticated established network processing path. You only need to add some calls to Secure Session somewhere in this path. These calls will be operating with client-provided buffers rather than using callbacks.

![](/files/wiki/secure_session_buffer_aware_api.png)


### Complex scenarios

It is possible to mix the Callback API and the Buffer-aware API together and use them simultaneously when neither of the above simple cases is applicable for a specific solution. For example, if you:  

* use buffer-aware API for receiving data, but use callback API for sending data;
* use callback API in negotiation stage, but use buffer-aware API on the data exchange stage;
* switch from callback API to buffer-aware API and back again in the run-time based on some specific conditions;
* etc.

{{< hint warning >}}
**⚠️ Warning:** Invoking any Secure Session API in the same Secure Session context should be **synchronised** with the respect to that context.
{{< /hint >}}


## Implementation details

### Creating Secure Sessions

Secure Session's interface is described in [src/themis/secure_session.h](https://github.com/cossacklabs/themis/blob/master/src/themis/secure_session.h).

Secure Session is constructed by `secure_session_create` function and has to be destroyed by `secure_session_destroy`:

```c
secure_session_t* secure_session_create(
        const void* id,
        size_t      id_length,
        const void* sign_key,
        size_t      sign_key_length,
        const secure_session_user_callbacks_t* user_callbacks);

themis_status_t secure_session_destroy(secure_session_t* session_ctx);
```

### Peer IDs and keys

Secure Session uses public-key cryptography for peer identification. Within a group of communicating Secure Sessions, every peer has at least one _peer ID_ and a corresponding _key pair_ associated with it.

**Peer ID** is an arbitrary non-empty byte array used for identifying a particular key pair.
It is used by transport callbacks to look up the corresponding public key.
Peer ID is public information transmitted in plaintext during the key negotiation phase.
All Secure Session clients should know IDs of their peers.

There are no specific restrictions on peer ID content or length.
You can use whatever is suitable for your application,
for example:

- static strings: `"Client"`, `"Server"`,    
- hash sums of public keys: `74fa0f30262d...`,    
- GUIDs: `e3e7b306-c358-469a-a339-82671b651f78`.     

The only requirement for peer ID is that it cannot be empty and it must uniquely identify the public key used by a peer.

**Key pairs** can be securely generated with Themis key generation functions. Themis's key generation is simple: select RSA or ECC, and get a keypair. 
 The API is described in [src/themis/secure_keygen.h](https://github.com/cossacklabs/themis/blob/master/src/themis/secure_keygen.h):

```c
themis_status_t themis_gen_ec_key_pair(
        uint8_t* private_key,
        size_t* private_key_length,
        uint8_t* public_key,
        size_t* public_key_length);

themis_status_t themis_gen_rsa_key_pair(
        uint8_t* private_key,
        size_t* private_key_length,
        uint8_t* public_key,
        size_t* public_key_length);
```

{{< hint info >}}
**Note:** Themis does not support importing pre-existing keys generated elsewhere. Which makes it much harder to use weak keys, unknowingly or intentionally provided by third parties.
{{< /hint >}}


The resulting private key must be kept secret by the peer; it is passed to Secure Session during construction. The public key should be known to the other communication peers, it will be requested during the key negotiation phase of Secure Session.

Please consult the [key management guidelines](/docs/themis/crypto-theory/key-management/) to learn more about storing and exchanging keys securely after you have generated them.

### Transport callbacks

Secure Session requires a transport callback object for operation.
The transport object is represented by the following structure:

```c
struct secure_session_user_callbacks_type {
        send_protocol_data_callback     send_data;
        receive_protocol_data_callback  receive_data;
        protocol_state_changed_callback state_changed;
        get_public_key_for_id_callback  get_public_key_for_id;

        void* user_data;
};
```

The callbacks' function pointers are:

```c
typedef ssize_t (*send_protocol_data_callback)(
                const uint8_t*  data,
                size_t          data_length,
                void*           user_data);

typedef ssize_t (*receive_protocol_data_callback)(
                uint8_t*  data,
                size_t    data_length,
                void*     user_data);

typedef void (*protocol_state_changed_callback)(
                int   event,
                void* user_data);

typedef int (*get_public_key_for_id_callback)(
                const void* id,
                size_t      id_length,
                void*       key_buffer,
                size_t      key_buffer_length,
                void*       user_data);
```

Function `get_public_key_for_id_callback` is used for getting the public key for client ID, so this callback is mandatory. Without it, Secure Session will have no means for authenticating the key exchange.

Functions `send_protocol_data_callback` and `receive_protocol_data_callback` are used for sending and receiving data from the communication channel. When set, `send_protocol_data_callback` may be triggered by the key exchange when the Session is established. Functions `send_protocol_data_callback` and `receive_protocol_data_callback` will both be triggered by `secure_session_send` and `secure_session_receive` to communicate over an actual communication channel. If these functions are not set Secure Session object can still be used in wrap/unwrap mode (see below).

Function `protocol_state_changed_callback` is an optional callback that delivers Secure Session state transitions to client applications. You can keep it unimplemented if you are not interested in state change notifications. 

### Usage modes

Secure Session object may be used in three modes.

#### Send/Receive
 
In this mode, the Secure Session object manages communication channel on its own, with the help of `send_protocol_data_callback` and `receive_protocol_data_callback` methods.

```c
ssize_t secure_session_send(secure_session_t *session_ctx,
                            const void *message,
                            size_t message_length);

ssize_t secure_session_receive(secure_session_t *session_ctx,
                               void *message,
                               size_t message_length);
```

#### Wrap/Unwrap

In this mode, `send_protocol_data_callback` and `receive_protocol_data_callback` methods are not used. A wrapped message will be returned to the user in a buffer. 

```c
themis_status_t secure_session_wrap(secure_session_t *session_ctx,
                                    const void *message,
                                    size_t message_length,
                                    void *wrapped_message,
                                    size_t *wrapped_message_length);

themis_status_t secure_session_unwrap(secure_session_t *session_ctx,
                                      const void *wrapped_message,
                                      size_t wrapped_message_length,
                                      void *message,
                                      size_t *message_length);
```

#### Mixed mode

Any combination of the three modes may work, too. For example, `send_protocol_data_callback` may be set, while `secure_session_send` is used for sending the data and `secure_session_unwrap` decrypts the data in the application's "receive" path.

## Secure Session across Themis wrappers 

To see how Secure Session is implemented in each language supported by Themis, go straight to the language wrapper that interests you:  

* [Secure Session in C++](/docs/themis/languages/cpp/#secure-session)
* [Secure Session in Go](/docs/themis/languages/go/#secure-session)
* [Secure Session in Java Android](/docs/themis/languages/java-android/#secure-session)
* [Secure Session in Kotlin Android](/docs/themis/languages/kotlin-android/#secure-session) 
* [Secure Session in Java Desktop](/docs/themis/languages/java-desktop/#secure-session)
* [Secure Session in Javascript (WebAssembly)](/docs/themis/languages/wasm/#secure-session)
* [Secure Session in Node.js](/docs/themis/languages/nodejs/#secure-session)
* [Secure Session in Objective-C](/docs/themis/languages/objc/#secure-session) (iOS, macOS)
* [Secure Session in Swift](/docs/themis/languages/swift/#secure-session) (iOS, macOS)
* [Secure Session in PHP](/docs/themis/languages/php/#secure-session)
* [Secure Session in Python](/docs/themis/languages/python/#secure-session)
* [Secure Session in Ruby](/docs/themis/languages/ruby/#secure-session)
* [Secure Session in Rust](/docs/themis/languages/rust/#secure-session)



## Thread Safety

Secure Session is not safe to use concurrently from multiple threads (e.g., negotiate connection or send/receive messages from different threads). Read more about Themis thread safety guarantees [in the documentation](/docs/themis/debugging/thread-safety/).

## Themis Server Simulator

[Themis Server](/docs/themis/debugging/themis-server/) is an interactive simulator that can be used as a remote debugging server for Themis. It is aimed at helping engineers understand Themis. It can come in handy if you're just starting out with this encryption library. 

It can come in handy if you're just starting out with Themis. Using the Themis Serer, you can avoid spending a lot of time and effort building your own client and server, making sure you get the keys right, etc. Using a simple 'remote party simulator' you can try out [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/) (and [Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session/) in an interactive mode and use copying and pasting to test encryption/decryption of containers with [Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/).