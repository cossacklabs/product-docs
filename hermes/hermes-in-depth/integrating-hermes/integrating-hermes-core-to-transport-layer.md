---
weight: 8
title: Hermes-core Transport
---

# Hermes-core Transport

The Transport in Hermes-core provides communication between the components.

As an abstract framework, Hermes-core doesn't include any communication and storage components, only interfaces. Communication and storage entities (Data store, Credential store, Keystore) must be implemented before using Hermes-core.

There is only one requirement towards the communication between the components of Hermes-core — security.

For this reason, Hermes-core has a built-in wrapper that creates [Themis Secure Session](https://docs.cossacklabs.com/pages/secure-session-cryptosystem/) communication channel under the abstract transport that needs to be implemented by the user. Such transport can be created using any available mechanism and it must be able to implement the following interface (`include/hermes/rpc/transport.h`):

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

There is an already implemented Secure Session transport interface in `include/hermes/secure_transport/transport.h`

```
typedef struct secure_transport_type {
    // transport that will be wrapped
    hm_rpc_transport_t* user_transport;
    // secure session for this connection
    secure_session_t* session;
    secure_session_user_callbacks_t* session_callback;

} secure_transport_t;

uint32_t destroy_secure_transport(secure_transport_t** transport_);
uint32_t destroy_rpc_secure_transport(hm_rpc_transport_t** transport_);
hm_rpc_transport_t* create_secure_transport(
        const uint8_t *user_id, size_t user_id_length,
        const uint8_t *private_key, size_t private_key_length,
        const uint8_t *public_key, size_t public_key_length,
        const uint8_t *public_key_id, size_t public_key_id_length,
        hm_rpc_transport_t* user_transport,
        bool is_server);

hm_rpc_transport_t* create_secure_transport_with_callback(
        const uint8_t *user_id, size_t user_id_length,
        const uint8_t *private_key, size_t private_key_length,
        secure_session_user_callbacks_t* callback,
        hm_rpc_transport_t* user_transport,
        bool is_server);
```

A simple TCP/IP socket transport implementation can be found in the following examples:
`docs/examples/c/mid_hermes/common/transport.h`
`docs/examples/c/mid_hermes/common/transport.c`

Here are the examples of the way to wrap a simple transport into Secure Session: 
`docs/examples/c/mid_hermes/client/hermes_client.c` 
`docs/examples/c/mid_hermes/credential_store_service/main.c` 
`docs/examples/c/mid_hermes/key_store_service/main.c` 
`docs/examples/c/mid_hermes/data_store_service/main.c`

To check out the transport interfaces for Python and Go, see the corresponding examples: - Python examples: [docs/examples/python/hermes_client.py](https://github.com/cossacklabs/hermes-core/blob/master/docs/examples/python/hermes_client.py), - Golang examples: [docs/examples/go/hermes_client.go](https://github.com/cossacklabs/hermes-core/blob/master/docs/examples/go/hermes_client.go).

Alternatively, you may choose to implement transport using your own preferred means (i.e. TLS or an unencrypted connection).

To see the step-by-step instruction of implementing transport between all the Hermes-core components that need to be connected using transport (with Secure Session) and create your own Hermes-based app, see [Create your client server app](https://docs.cossacklabs.com/pages/create-your-client-server-app-step-by-step/) document.
