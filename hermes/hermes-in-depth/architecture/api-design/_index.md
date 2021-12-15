---
title: API design
---

# API description and processes

Hermes-core API is a convenient library, which exposes the high-level functions of Hermes-core to consumer applications.

Internally, it is a small wrapper around the Hermes-core remote APIs: it serialises requests from the consumer applications and forwards them to Hermes-core via communication channels. Since the requests may contain sensitive data, the communication channel between Hermes API and Hermes-core should be encrypted and mutually authenticated. This can be done using the 
[Secure Session](https://docs.cossacklabs.com/pages/secure-session-cryptosystem/) from our 
[Themis cryptographic library](https://github.com/cossacklabs/themis) with our 
[wrapper](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/secure_transport/transport.h) over raw transport. 
Since Secure Session is a stream-oriented protocol, the channel will be also protected from replay attacks and request reordering. 
Alternatively, you may choose to leave the communication channel unencrypted (which is not recommended for the reasons outlined above) or use a secure transport method of your choice (i.e. TLS, etc.).

Hermes-core operates on blocks that are stored in the Data store's database. Operations on blocks in Hermes-core come down to 4 classic data manipulation algorithms (CRUD) and their rights management:

* Document creation — CREATE block with special content;
* Reading document structure — READ block;
* Adding a block to a document — UPDATE block;
* Deleting block from a document — UPDATE block;
* Updating the document structure — UPDATE block;
* Deleting a block — DELETE block;
* Revoking access — REVOKE READ/UPDATE permissions from users who have those permissions by other users who have those permissions;
* Rotating data and keys — rotation means re-encrypting the data using new keys.

The distribution of CRUD permissions to data blocks in Hermes-core is carried out cryptographically and described in details below.

## Processes

You can find this code in `include/hermes/mid_hermes/mid_hermes.h`.

#### CREATE (and grant access)

The CREATE process for a Hermes-core block consists of two phases: 1. Encrypting blocks of the data and putting it into an appropriate place of the Data store; 2. Distributing access control policy for that specific block.

**Create block**

```
hermes_status_t mid_hermes_create_block(
        mid_hermes_t *mid_hermes,
        uint8_t **id, size_t *id_length,
        const uint8_t *block, const size_t block_length,
        const uint8_t *meta, const size_t meta_length);
```

#### Read

READ access — a permission for a user to READ a block, decrypting it with a READ key. It’s assumed that the user is in the possession of the private part of its credential before performing the READ operation.

To READ a block, user performs the following operations:

* downloads and unwraps READ key from the associated Keystore;
* downloads and decrypts the encrypted block from the Data store using READ key.

User does not download (nor is permitted to download) the block’s update tag, which is considered to be a sensitive information with respect to the user with READ access.

**Read block**

```
hermes_status_t mid_hermes_read_block(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t block_id_length,
        uint8_t **block, size_t *block_length,
        uint8_t **meta, size_t *meta_length);
```

**Grant read access**

```
hermes_status_t mid_hermes_grant_read_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);
```

**Update**

To UPDATE a block, user performs the following operations:

* downloads and unwraps wrapped READ and UPDATE keys from the associated Keystore;
* downloads and decrypts the encrypted block from the Data store using READ key;
* calculates current update tag for the current block using UPDATE key;
* processes the block;
* calculates a new update tag for the updated block using UPDATE key;
* encrypts the updated block with READ key using READ key;
* uploads 1) current update tag, 2) new update tag and 3) encrypted updated block to the Data store.

Upon receiving the abovementioned data, the Data store will verify that the user performing the UPDATE possesses a valid UPDATE key by comparing the current update tag received from the user with the stored update tag associated with the block. If they are equal, the Data store will overwrite the stored encrypted block with the received encrypted updated block and the stored update tag with a new update tag. This way the Data store never processes the blocks in plain text.

**Update block**

```
hermes_status_t mid_hermes_update_block(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t block_id_length,
        const uint8_t *block, const size_t block_length,
        const uint8_t *meta, const size_t meta_length);
```

**Grant update access**

```
hermes_status_t mid_hermes_grant_update_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);
```

#### Delete

Deleting blocks is a particular simplified case of block UPDATE, where updated block is NULL, so there is no need for the updater to calculate and send encrypted updated block.

**Delete block**

```
hermes_status_t mid_hermes_delete_block(
        mid_hermes_t *mid_hermes, 
        const uint8_t *block_id, const size_t block_id_length);
```

#### Revoke access

Abstractly speaking, if user A (with READ/UPDATE permissions) wants to revoke READ (READ/UPDATE) permissions from user B to some block, A should reconstruct current access control policy to this block, then revoke all the READ (READ/UPDATE) permissions for each users who have certain permissions, and finally set a new access control policy to block, based on the former policy.

**Revoke read access**

```
hermes_status_t mid_hermes_deny_read_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);
```

**Revoke update access**

```
hermes_status_t mid_hermes_deny_update_access(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t bloc_id_length,
        const uint8_t *user_id, const size_t user_id_length);
```

#### Rotate data and keys

The process of rotating data and keys generates new READ and UPDATE keys for a block, re-encrypts a block using new keys, and replaces the old keys with the new ones (i.e. those users who only had READ permissions will get a new READ key, and the users who had READ and UPDATE permissions, will get new READ and UPDATE keys).

**Rotate block**

```
hermes_status_t mid_hermes_rotate_block(
        mid_hermes_t *mid_hermes,
        const uint8_t *block_id, const size_t block_id_length);
```

See the Hermes scientific paper - [Hermes – a framework for cryptographically assured access control and data security](https://www.cossacklabs.com/files/hermes-theory-paper-rev1.pdf) and Hermes' implementation paper [Implementing Hermes-based Security Systems](https://www.cossacklabs.com/hermes/implementing-hermes-based-systems/) for more details and illustrations for the processes described above.