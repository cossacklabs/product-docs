---
title: Architecture
---

# Architecture

This section is dedicated to describing the architecture of Hermes-core components. Hermes-core uses a typical Client-Server interaction.

## Client

The Client-side is represented by the user-facing app or service. The main Client-side components are implemented by `mid_hermes_t` 
class (can be found in `mid_hermes/mid_hermes.h` and `mid_hermes/client/hermes_client.c`) and carry out all the operations necessary 
for the functioning of Hermes-core. Moreover, the [hermes-core repository](https://github.com/cossacklabs/hermes-core) includes wrappers 
for implementing Hermes-based applications with [Python](https://github.com/cossacklabs/hermes-core/tree/master/pyhermes) and [Go](https://github.com/cossacklabs/hermes-core/tree/master/gohermes).

Read in more details what actions are possible for client app in [Hermes-core Client](https://docs.cossacklabs.com/pages/documentation-hermes/#hermes-core-client) section.

## Server

By default, the Server-side part of Hermes-core is represented by 3 physically independent standalone servers: Data store, Keystore, and Credential store. For more abstraction, Hermes-core doesn't include thread-dependent mechanisms. This is done because we assume that a Hermes-based application may be created using any modern programming language, most of which include more comfortable and portable thread control mechanisms than plain POSIX threads.

Read in more details what actions are possible for server app in [Building app Server](https://docs.cossacklabs.com/pages/documentation-hermes/#hermes-core-server) section.

## Client-server communication

For the reasons of abstraction, Hermes-core doesn't include predefined communication mechanisms. 
Instead, Hermes-core contains an interface `hm_rpc_transport_t` (see `include/hermes/rpc/transport.h`), which includes the following function definitions:

```
typedef uint32_t(*hm_rpc_transport_send_t)(void *transport, const uint8_t *buffer, const size_t buffer_length);

typedef uint32_t(*hm_rpc_transport_recv_t)(void *transport, uint8_t *buffer, size_t buffer_length);

typedef uint32_t(*hm_rpc_transport_get_remote_id_t)(void *transport, uint8_t **id, size_t *id_length);

typedef struct hm_rpc_transport_type {
    hm_rpc_transport_send_t send;
    hm_rpc_transport_recv_t recv;
    hm_rpc_transport_get_remote_id_t get_remote_id;
    void *user_data;
} hm_rpc_transport_t;
```

It also includes a wrapper for transport implementations that uses [Themis' Secure Session](https://docs.cossacklabs.com/pages/secure-session-cryptosystem/) 
(see `include/hermes/secure_transport/transport.h`). This is done to provide a way to use another (non-Secure Sesion) means of secure transport (i.e. SSL/TLS).

* **Communication**
  
    Implementation of this interface is enough for Hermes-core to function correctly.

* **Remote Procedure Call**

    For abstraction and simplicity, all the components of Hermes-core use internal remote procedure call protocol.

Don't want to implement your own transport layer? Check [Building app Transport](https://docs.cossacklabs.com/pages/documentation-hermes/#hermes-core-transport) section.