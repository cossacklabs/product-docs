---
weight: 7
title: "Long: creating your own Hermes-based app"
---

# Creating your own Hermes-based app (long tutorial)


Hermes-based application architecture requires 4 main system components:

1. **Credential Store**: a trusted source of user/service public credentials.

2. **Data Store**: a physical or logical unit for storing system data.

3. **Keystore**: a physical or logical unit for storing data access control keys.

These three components are considered to be Server side.

4. **Client**: an active entity in the architecture that produces or consumes the data.

All the system components need to be physically distributed to different servers for security reasons (Keystore and Data Store can theoretically be placed together). Client and Server (as well as the Server components) need to have some form of communication between them (transport layer).

{{< hint info >}}
Note: A quick reminder that Hermes-core currently includes examples with tutorials in C, Python, and Go - you may choose to familiarise yourself with those first before proceeding.
{{< /hint >}}

## Architecture and design

As an abstract framework, Hermes-core doesn't include any communication and storage components, only interfaces. Communication and storage entities (Data store, Credential store, Keystore) must be implemented before using Hermes-core.

### Communication (Transport)

Transport is a means of providing connection and communication between the Server and the Client, as well as between the separate Server components. There is only one requirement towards the communication between the components of Hermes-core — security.

For this reason, Hermes-core has a built-in wrapper that creates [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session) communication channel under the abstract transport that needs to be implemented by the user. Such transport can be created using any available mechanism and it must be able to implement the following interface (`include/hermes/rpc/transport.h`):

```c
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

There is an already implemented Secure Session transport interface in `include/hermes/secure_transport/transport.h`.

```c
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

* `docs/examples/c/mid_hermes/common/transport.h`
* `docs/examples/c/mid_hermes/common/transport.c`

Here are the examples of the way to wrap a simple transport into Secure Session: 

* `docs/examples/c/mid_hermes/client/hermes_client.c` 
* `docs/examples/c/mid_hermes/credential_store_service/main.c` 
* `docs/examples/c/mid_hermes/key_store_service/main.c` 
* `docs/examples/c/mid_hermes/data_store_service/main.c`

To check out the transport interfaces for Python and Go, see the corresponding examples:

* Python examples: [docs/examples/python/hermes_client.py](https://github.com/cossacklabs/hermes-core/blob/master/docs/examples/python/hermes_client.py),

* Golang examples: [docs/examples/go/hermes_client.go](https://github.com/cossacklabs/hermes-core/blob/master/docs/examples/go/hermes_client.go).

Alternatively, you may choose to implement transport using your own preferred means (i.e. TLS or an unencrypted connection).

### Data store

Hermes-core doesn't have special requirements for the Data store database. Such database needs to be able to implement the following interface (`include/hermes/data_store/db.h`):

```c
typedef uint32_t(*hm_ds_db_insert_block)(
        void* db, const uint8_t* block, const size_t block_length,
        const uint8_t* meta, const size_t meta_length,
        const uint8_t* mac, const size_t mac_length,
        uint8_t** id, size_t* id_length);
typedef uint32_t(*hm_ds_db_insert_block_with_id)(
        void* db, const uint8_t* id, const size_t id_length,
        const uint8_t* block, const size_t block_length,
        const uint8_t* meta, const size_t meta_length,
        const uint8_t* mac, const size_t mac_length);
typedef uint32_t(*hm_ds_db_get_block)(
        void* db, const uint8_t* id, const size_t id_length,
        uint8_t** block, size_t*  block_length,
        uint8_t** meta, size_t*  meta_length);
typedef uint32_t(*hm_ds_db_update_block)(
        void* db, const uint8_t* id, const size_t id_length,
        const uint8_t* block, const size_t block_length,
        const uint8_t* meta, const size_t meta_length,
        const uint8_t* mac, const size_t mac_length,
        const uint8_t* old_mac, const size_t old_mac_length);
typedef uint32_t(*hm_ds_db_rem_block)(
        void* db, const uint8_t* id, const size_t id_length,
        const uint8_t* old_mac, const size_t old_mac_length);

typedef struct hm_ds_db_type{
    void* user_data;
    //insert block to data store. Will return id of added block
    hm_ds_db_insert_block insert_block; 
    //insert block to data store with predefined id. if block with provided id is already present in data store error will return
    hm_ds_db_insert_block_with_id insert_block_with_id;
    //read block from data store
    hm_ds_db_get_block get_block;
    //update block in data store 
    hm_ds_db_update_block update_block;
    //delete block from data store
    hm_ds_db_rem_block rem_block;
}hm_ds_db_t;
```

A simple filesystem-based data storage implementation can be found in the following examples: `docs/examples/c/mid_hermes/data_store_service/db.h` `docs/examples/c/mid_hermes/data_store_service/db.c`

### Сredential store

Hermes-core doesn't have special requirements towards the Credential store database. The database needs to be able to implement the following interface (`include/hermes/credential_store/db.h`):

```c
typedef uint32_t(*hm_cs_db_get_pub_by_id_t)(void *db, const uint8_t *id, const size_t id_length, uint8_t **key, size_t *key_length);

typedef struct hm_cs_db_type {
    void *user_data;
    // get public key by provided user id
    hm_cs_db_get_pub_by_id_t get_pub;
} hm_cs_db_t;
```

A simple filesystem-based Credential store implementation can be found in the following examples: 

* `docs/examples/c/mid_hermes/credential_storage_service/db.h` 
* `docs/examples/c/mid_hermes/credential_storage_service/db.c`

### Keystore

Hermes-core doesn't have special requirements towards the Keystore database. The database needs to be able to implement the following interface (`include/hermes/key_store/db.h`):

```c
typedef uint32_t(*hm_ks_db_set_token)(
        void* db, const uint8_t* block_id, const size_t block_id_length,
        const uint8_t* user_id, const size_t user_id_length,
        const uint8_t* owner_id, const size_t owner_id_length,
        const uint8_t* read_token, const size_t read_token_length);
typedef uint32_t(*hm_ks_db_get_token)(
        void* db, const uint8_t* block_id, const size_t block_id_length,
        const uint8_t* user_id, const size_t user_id_length,
        uint8_t** write_token, size_t* write_token_id_length,
        uint8_t** owner_id, size_t* owner_id_length);
typedef uint32_t(*hm_ks_db_del_token)(
        void* db, const uint8_t* block_id, const size_t block_id_length,
        const uint8_t* user_id, const size_t user_id_length,
        const uint8_t* owner_id, const size_t owner_id_length);
typedef uint32_t(*hm_ks_db_get_indexed_rights)(
        void* db, const uint8_t* block_id, const size_t block_id_length,
        const size_t index, uint8_t** user_id,
        size_t* user_id_length, uint32_t* rights_mask);

typedef struct hm_ks_db_type{
    void* user_data;
    // set read token
    hm_ks_db_set_token set_rtoken;
    // set update token
    hm_ks_db_set_token set_wtoken;
    // get read token
    hm_ks_db_get_token get_rtoken;
    // get update token
    hm_ks_db_get_token get_wtoken;
    // return user id and user rights mask ("r" or "w") with shift by index 
    hm_ks_db_get_indexed_rights get_indexed_rights;
    // delete read token
    hm_ks_db_del_token del_rtoken;
    // delete update token
    hm_ks_db_del_token del_wtoken;
}hm_ks_db_t;
```

A simple filesystem-based Keystorage implementation can be found in the following examples:
* `docs/examples/c/mid_hermes/key_storage_service/db.h` 
* `docs/examples/c/mid_hermes/key_storage_service/db.c`

## Step by step

After implementing all the necessary interfaces, the necessary Hermes-core components can be created using the following method:

### 1. Credential store, Data store, Keystore

Use an appropriate service helper: `include/hermes/credential_store/service.h` or `include/hermes/data_store/service.h` or `include/hermes/key_store/service.h`, i.e.:

```c
hm_credential_store_service_t* service = hm_credential_store_service_create(transport, db);
```

The `service` is a helper object, which launches an infinite loop after the `start` method has been called to receive a command, execute, send the result, repeat, etc. However, `start` is a blocking method, so for a more efficient implementation, each service needs to be created in a separate thread.

The default Data/Credential/Keystore thread implementation may look like this `docs/examples/c/mid_hermes/data_store_service/main.c`:

```c
void* data_store(void* arg){
    // create transport with credential store to use him as secure session callback for retrieving public keys
    hm_rpc_transport_t* raw_credential_store_transport = server_connect(CREDENTIAL_STORE_IP, CREDENTIAL_STORE_PORT);
    if (!raw_credential_store_transport){
        perror("can't connect to credential store\n");
        return (void*)FAIL;
    }
    hm_rpc_transport_t* credential_store_transport = create_secure_transport(
            data_store_id, strlen((char*)data_store_id), data_store_private_key, sizeof(data_store_private_key),
            credential_store_pk, sizeof(credential_store_pk),
            credential_store_id, strlen((char*)credential_store_id), raw_credential_store_transport, false);
    if(!credential_store_transport){
        perror("can't initialize secure transport to credential store\n");
        transport_destroy(&raw_credential_store_transport);
        perror("can't create connection to credential store\n");
        return (void*)FAIL;
    }

    // create secure transport with new client
    hm_rpc_transport_t* client_transport=transport_create((int)(intptr_t)arg);
    if(!client_transport){
        perror("client transport creation error ...\n");
        return (void*)FAIL;
    }

    secure_session_user_callbacks_t* session_callback = get_session_callback_with_remote_credential_store(
            credential_store_transport);
    hm_rpc_transport_t* secure_client_transport = create_secure_transport_with_callback(
            data_store_id, strlen((char*)data_store_id),data_store_private_key, sizeof(data_store_private_key),
            session_callback, client_transport, true);

  hm_ds_db_t* db=db_create();
  if(!db){
    transport_destroy(&client_transport);
    perror("can't create data store\n");
    return (void*)FAIL;
  }
  hm_data_store_service_t* service=hm_data_store_service_create(secure_client_transport, db);
  if(!service){
    transport_destroy(&client_transport);
    perror("service creation error ...\n");
    return (void*)FAIL;
  }
  fprintf(stderr, "service started ...\n");
  hm_data_store_service_start(service);
  fprintf(stderr, "service stoped ...\n");
  hm_data_store_service_destroy(&service);
  transport_destroy(&client_transport);
  return NULL;
}
```

Data store and Keystore use Credential store to receive the public keys of clients that connect to them. So for processing the clients' requests, they use Credential store as a callback in Secure Session to receive the public key(s). This means that a connection to Credential Store must be created:

```c
hm_rpc_transport_t* raw_credential_store_transport = server_connect(CREDENTIAL_STORE_IP, CREDENTIAL_STORE_PORT);
if (!raw_credential_store_transport){
    perror("can't connect to credential store\n");
    return (void*)FAIL;
}
```

Wrap the connection in Secure Session and indicate that it is the client's connection through the last `false` parameter:

```c
hm_rpc_transport_t* credential_store_transport = create_secure_transport(
        data_store_id, strlen((char*)data_store_id), data_store_private_key, sizeof(data_store_private_key),
        credential_store_pk, sizeof(credential_store_pk),
        credential_store_id, strlen((char*)credential_store_id), raw_credential_store_transport, false);
```

Then create a callback for Secure Session, which will use Credential store for receiving the public keys:

```c
secure_session_user_callbacks_t* session_callback = get_session_callback_with_remote_credential_store(
            credential_store_transport);
```

Wrap the client connection into the corresponding transport interface (see an example here - `docs/examples/c/mid_hermes/common/transport.c`):

```c
// create secure transport with new client
hm_rpc_transport_t* client_transport=transport_create((int)(intptr_t)arg);
```

Wrap the connection into Secure Session:

```c
hm_rpc_transport_t* secure_client_transport = create_secure_transport_with_callback(
        data_store_id, strlen((char*)data_store_id),data_store_private_key, sizeof(data_store_private_key),
        session_callback, client_transport, true);
```

What comes next is the initialization of the service with the transport being passed to it.

This procedure is also applicable for Keystore and Data store that use Credential Store in Secure Session. However, this process will be slightly different for Credential Store because it will have to use itself for the authentication of users:

```c
secure_session_user_callbacks_t* session_callback = get_session_callback_with_local_credential_store(db);

hm_rpc_transport_t* secure_transport = create_secure_transport_with_callback(
      credential_store_id, strlen((char*)credential_store_id),
      credential_store_private_key, sizeof(credential_store_private_key),
      session_callback, client_transport, true);
```

Here a callback is explicitly created with a function for receiving the public key, which will use the Credential store's own mechanics (the 'db' object). The implementation of the functions for receiving the public key can be found here - `src/secure_transport/session_callback.c`. The rest of the process for initializing the service is similar to that described for Data store and Credential store.

### 2. Client

The element of Hermes-core that is the most important for the creation of Client is mid_hermes_t with the following interface (`include/hermes/mid_hermes/mid_hermes.h`):

```c
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

You can check client implementation in `docs/examples/c/mid_hermes/client/hermes_client.c`.

First, you need to connect to all the services of Credential store, Data store, and Keystore, and create a Secure Session between them using the Hermes wrapper (unless you want to use non-secure unencrypted open transports like TCP/UDP/Websocket or want to implement your own means of supporting encryption like TLS/SSL).

Create a connection to Credential store:

```c
transports_container_t container = {NULL, NULL, NULL, NULL, NULL, NULL};
container.raw_credential_store_transport = server_connect(CREDENTIAL_STORE_IP, CREDENTIAL_STORE_PORT);
```

Here calling the function `server_connect(CREDENTIAL_STORE_IP, CREDENTIAL_STORE_PORT)` must return the implementation of the transport interface defined in `include/hermes/rpc/transport.h`.

A simple TCP/IP socket transport implementation can be found in the following examples: `docs/examples/c/mid_hermes/common/transport.h` `docs/examples/c/mid_hermes/common/transport.c`

Transport needs to be wrapped into [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session) by calling the `create_secure_transport` function from `include/hermes/secure_transport/transport.h` and passing the user's id, user's public key that will be used for establishing the session, ID of the service we're connecting to (in this case it is Credential store), the service's public key, and the transport that's being wrapped.

The type of connection that needs to be established must also be indicated here - either the server type (then the last parameter will be `true`) or the client type (the last parameter will be `false`).

The necessity to indicate the connection type is due to the fact that the session is always initialized by the Client who needs to send a request for establishing a session. You can read more in [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session).

```c
container.credential_store_transport = create_secure_transport(
        user_id, user_id_length, 
        user_private_key, user_private_key_length, 
        credential_store_pk, sizeof(credential_store_pk),
        credential_store_id, strlen((char*)credential_store_id), 
        container.raw_credential_store_transport, 
        false);
```

The connection with Data store and Keystore is created in a similar manner `1`, `2`.

Now the `mid_hermes` object can be created, requests to the API will be sent through it. When creating the mid_hermes object, the following parameters need to be passed - `user_id` and its `private_key`

```c
mh = mid_hermes_create(
    user_id, user_id_length,
    user_private_key, user_private_key_length,
    container.key_store_transport,
    container.data_store_transport,
    container.credential_store_transport)
```

After a successful creation of `mid_hermes_t` instance, each instance of the interface method can be called. Each `mid_hermes_t` interface method represents one of the Hermes operations:

#### 1. CREATE block

```c
hermes_status_t mid_hermes_create_block(
        mid_hermes_t *mid_hermes,
        uint8_t **id, size_t *id_length,
        const uint8_t *block, const size_t block_length,
        const uint8_t *meta, const size_t meta_length);
```

#### 2. READ block

```c
hermes_status_t mid_hermes_read_block(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t block_id_length,
        uint8_t **block, size_t *block_length,
        uint8_t **meta, size_t *meta_length);
``` 

#### 3. UPDATE block

```c
hermes_status_t mid_hermes_update_block(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t block_id_length,
        const uint8_t *block, const size_t block_length,
        const uint8_t *meta, const size_t meta_length);
```

#### 4. DELETE block

```c
hermes_status_t mid_hermes_delete_block(
        mid_hermes_t *mid_hermes, 
        const uint8_t *block_id, const size_t block_id_length);
```

#### 5. ROTATE block

```c
hermes_status_t mid_hermes_rotate_block(
        mid_hermes_t *mid_hermes, 
        const uint8_t *block_id, const size_t block_id_length);
```

#### 6. GRANT read access

```c
hermes_status_t mid_hermes_grant_read_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);
```

#### 7. GRANT update access

```c
hermes_status_t mid_hermes_grant_update_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);
```

#### 8. DENY read access

```c
hermes_status_t mid_hermes_deny_read_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);
```

#### 9. DENY update access

```c
hermes_status_t mid_hermes_deny_update_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);
```