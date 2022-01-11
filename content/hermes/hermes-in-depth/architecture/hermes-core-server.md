---
weight: 3
title: Hermes-core server
---

# Hermes-core server

Hermes-core might be also described as a wrapper around a database where the exact database type used does not matter.

We've designed Hermes-core to be used in a fashion where different stores (Credential store, Data store, and Keystore) can be local, remote, unified, or have intentionally different architectures. They are passed to Hermes-core as parameters, and if the implementation fits the interface, anything can be used for storing Hermes-core's data, including with something as esoteric as a possible usage of blockchain for Keystore (i.e. for revocation and validation).

Each of the storage entities for Hermes-core has its own interface: see `include/hermes/data_store/db.h`, `include/hermes/credential_store/db.h`, and `include/hermes/key_store/db.h` respectively.

To create your own Hermes-based app (the one that includes Server, Client, and Transport between the components), use the detailed instructions in [Creating your own Hermes-based app (long tutorial)](/hermes/guides/creating-your-own-hermes-based-app-long/).

## Data store

Hermes-core doesn't have special requirements for the Data store database. Such database needs to be able to implement the following interface.

`include/hermes/data_store/db.h`:

```bash
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

A simple filesystem-based data storage implementation can be found in `docs/examples/c/mid_hermes/data_store_service/db.h` and `docs/examples/c/mid_hermes/data_store_service/db.c`.

## Сredential store

Hermes-core doesn't have special requirements towards the Credential store database. The database needs to be able to implement the following interface — `include/hermes/credential_store/db.h`:

```bash
typedef uint32_t(*hm_cs_db_get_pub_by_id_t)(void *db, const uint8_t *id, const size_t id_length, uint8_t **key, size_t *key_length);

typedef struct hm_cs_db_type {
    void *user_data;
    // get public key by provided user id
    hm_cs_db_get_pub_by_id_t get_pub;
} hm_cs_db_t;
```

A simple filesystem-based Credential store implementation can be found in the following examples: `docs/examples/c/mid_hermes/credential_storage_service/db.h` and `docs/examples/c/mid_hermes/credential_storage_service/db.c`

## Keystore

Hermes-core doesn't have special requirements towards the Keystore database. The database needs to be able to implement the following interface (`include/hermes/key_store/db.h`):

```bash
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

A simple filesystem-based Keystorage implementation can be found in the following examples: `docs/examples/c/mid_hermes/key_storage_service/db.h` and `docs/examples/c/mid_hermes/key_storage_service/db.c`.