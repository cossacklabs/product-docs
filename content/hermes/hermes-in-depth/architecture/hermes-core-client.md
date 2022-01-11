---
weight: 2
title: Hermes-core client
---

# Hermes-core client

The Client for Hermes-core needs to have access to all the 3 Stores (Data store, Credential store, Keystore). The key (token) used by the Client must be present in the Credential store on the Server side of Hermes-core to allow for further operations on documents.

It's also recommended that you take a look at the example Clients written in [C](https://github.com/cossacklabs/hermes-core/blob/master/docs/examples/c/mid_hermes/client/hermes_client.c), [Python](https://github.com/cossacklabs/hermes-core/blob/master/docs/examples/python/hermes_client.py), and [Go](https://github.com/cossacklabs/hermes-core/blob/master/docs/examples/go/hermes_client.go) before proceeding with building your own.

To create your own Hermes-based app (the one that includes Server, Client, and Transport between the components), use the detailed instruction in [Creating your own Hermes-based app (long tutorial)](/hermes/guides/creating-your-own-hermes-based-app-long/).

## Hermes-core client API interface

The Client-side component of Hermes-core is called `mid_hermes_t` and is declared in `hermes/mid_hermes/mid_hermes.h`.

`mid_hermes_t` represents all the Hermes-core's functions as a simple CRUD interface to an abstract remote storage.

## Interface

`include/hermes/mid_hermes/mid_hermes.h`:

```bash
typedef struct mid_hermes_type mid_hermes_t;

mid_hermes_t *mid_hermes_create(
        const uint8_t *user_id, const size_t user_id_length,
        const uint8_t *private_key, const size_t private_key_length,
        hm_rpc_transport_t *key_store_transport,
        hm_rpc_transport_t *data_store_transport,
        hm_rpc_transport_t *credential_store_transport);

hermes_status_t mid_hermes_destroy(mid_hermes_t **mh);

hermes_status_t mid_hermes_create_block(
        mid_hermes_t *mid_hermes,
        uint8_t **id, size_t *id_length,
        const uint8_t *block, const size_t block_length,
        const uint8_t *meta, const size_t meta_length);

hermes_status_t mid_hermes_read_block(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t block_id_length,
        uint8_t **block, size_t *block_length,
        uint8_t **meta, size_t *meta_length);

hermes_status_t mid_hermes_update_block(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t block_id_length,
        const uint8_t *block, const size_t block_length,
        const uint8_t *meta, const size_t meta_length);

hermes_status_t mid_hermes_delete_block(
        mid_hermes_t *mid_hermes, const uint8_t *block_id, const size_t block_id_length);

hermes_status_t mid_hermes_rotate_block(
        mid_hermes_t *mid_hermes, const uint8_t *block_id, const size_t block_id_length);

hermes_status_t mid_hermes_grant_read_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);

hermes_status_t mid_hermes_grant_update_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);

hermes_status_t mid_hermes_deny_read_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);

hermes_status_t mid_hermes_deny_update_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);
```

To construct the `mid_hermes_t` instance function `mid_hermes_create`, in addition to the user id and the user private key, three transports instances to Credential store, Data store, and Keystore are needed respectively.

You can check client the implementation in `docs/examples/c/mid_hermes/client/hermes_client.c`

First, you need to connect to all the services of Credential store, Data store, and Keystore, and create a Secure Session between them using the Hermes wrapper (unless you want to use non-secure unencrypted open transports like TCP/UDP/Websocket or want to implement your own means of supporting encryption like TLS/SSL).

Create a connection to Credential store:

```bash
transports_container_t container = {NULL, NULL, NULL, NULL, NULL, NULL};
container.raw_credential_store_transport = server_connect(CREDENTIAL_STORE_IP, CREDENTIAL_STORE_PORT);
```

Here calling the function `server_connect(CREDENTIAL_STORE_IP, CREDENTIAL_STORE_PORT)` must return the implementation of the transport interface defined in `include/hermes/rpc/transport.h`.

A simple TCP/IP socket transport implementation can be found in the following examples: `docs/examples/c/mid_hermes/common/transport.h` `docs/examples/c/mid_hermes/common/transport.c`

The transport needs to be wrapped into [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/) by calling the `create_secure_transport` function from `include/hermes/secure_transport/transport.h` and passing the user's id, user's public key that will be used for establishing the session, ID of the service we're connecting to (in this case it is Credential store), the service's public key, and the transport that's being wrapped.

The type of connection that needs to be established must also be indicated here - either the server type (then the last parameter will be `true`) or the client type (the last parameter will be `false`).

The necessity to indicate the connection type is due to the fact that the session is always initialized by the Client who needs to send a request for establishing a session. You can read more about [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/).

```bash
container.credential_store_transport = create_secure_transport(
        user_id, user_id_length, 
        user_private_key, user_private_key_length, 
        credential_store_pk, sizeof(credential_store_pk),
        credential_store_id, strlen((char*)credential_store_id), 
        container.raw_credential_store_transport, 
        false);
```

The connection with Data store and Keystore is created in a similar manner `1`, `2`.

Now the `mid_hermes` object can be created and the requests to the API will be sent through it. When creating the `mid_hermes` object, the following parameters need to be passed - `user_id` and its `private_key`, as well as the 3 connections to the services, created earlier:

```bash
mh = mid_hermes_create(
    user_id, user_id_length,
    user_private_key, user_private_key_length,
    container.key_store_transport,
    container.data_store_transport,
    container.credential_store_transport)
```

After a successful creation of an instance of `mid_hermes_t`, all the instances of the interface method can be called. Each `mid_hermes_t` interface method represents one of the Hermes operations:

### 1. CREATE block

```bash
hermes_status_t mid_hermes_create_block(
        mid_hermes_t *mid_hermes,
        uint8_t **id, size_t *id_length,
        const uint8_t *block, const size_t block_length,
        const uint8_t *meta, const size_t meta_length);
```

### 2. READ block

```bash
hermes_status_t mid_hermes_read_block(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t block_id_length,
        uint8_t **block, size_t *block_length,
        uint8_t **meta, size_t *meta_length);
```

### 3. UPDATE block

```bash
hermes_status_t mid_hermes_update_block(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t block_id_length,
        const uint8_t *block, const size_t block_length,
        const uint8_t *meta, const size_t meta_length);
```

### 4. DELETE block

```bash
hermes_status_t mid_hermes_delete_block(
        mid_hermes_t *mid_hermes, 
        const uint8_t *block_id, const size_t block_id_length);
```

### 5. ROTATE block

```bash
hermes_status_t mid_hermes_rotate_block(
        mid_hermes_t *mid_hermes, 
        const uint8_t *block_id, const size_t block_id_length);
```

### 6. GRANT read access

```bash
hermes_status_t mid_hermes_grant_read_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);
```

### 7. GRANT update access

```bash
hermes_status_t mid_hermes_grant_update_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);
```

### 8. DENY read access

```bash
hermes_status_t mid_hermes_deny_read_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);
```

### 9. DENY update access

```bash
hermes_status_t mid_hermes_deny_update_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);
```