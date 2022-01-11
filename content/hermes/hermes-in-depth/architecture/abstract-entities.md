---
weight: 2
title: Abstract entities
---

# Abstract entities

Hermes-core is divided into the 2 core pieces:

* Backend or Server-side (Server/storage), which is outlined in this document, [Hermes-core server](/hermes/hermes-in-depth/architecture/hermes-core-server/) and [Hermes-core transport](/hermes/hermes-in-depth/architecture/hermes-core-transport/).
* Frontend or Client-side (Client), which is outlined in a [Hermes-core client](/hermes/hermes-in-depth/architecture/hermes-core-client/).

## Storage

Storage entity must have 3 separate parts (the parts can be allocated in virtually any way, but an active compartmentalisation on the database's side adds an extra layer of security):

1. Credential store,
2. Data store,
3. Keystore.


### Credential store

Credential store is a trusted source of user/service public credentials (and possible key/data store public credentials). Users use the Credential store to wrap ACKs for specific users while distributing access control policy for their data. It’s expected that other entities communicate with the Credential store via authenticated channels.

Credential store is used for retrieving public keys by the user identifier (user ID). It can be as simple as a function or a table that maps public keys to user IDs to a fully-blown local certificate authority.

Hermes-core does not provide you with Credential store, instead, it suggests integrating with any PKI you've got (i.e. PKI can be a read-only set of keys).

### Data store

Data store is the main global storage entity for storing sensitive information. In Hermes, each record (block) is stored in an appropriate recordset (document), which can be represented by the following fields:

1. document ID
2. block ID
3. private metadata
4. MAC
5. data

### Keystore

Keystore is used for storing access control keys/tokens (per user and block):

1. block ID - ID of the data block for which the token is designated,
2. user ID - ID of the user for which the token is designated,
3. owner ID - ID of the user who issued the token,
4. key/token type (read or update) - type of the permissions granted with the token,
5. key/token - the actual key/token.

Each access control key ("token") is stored as a combination of separate tokens: block ID + user ID + token + owner ID. To be able to use the token, a user with the user ID needs his/her private key and a public user key with the owner ID.


### Storage interfaces

The storage interfaces for Hermes-core are described in detail in the [Hermes-core server](/hermes/hermes-in-depth/architecture/hermes-core-server/).


### Transport

The components of Hermes-core need to have some kind of communication established between them: between Client and Server, between the Server components. This is done with the help of [Hermes-core transport](/hermes/hermes-in-depth/architecture/hermes-core-transport/).