---
weight: 3
title: "Guides"
bookCollapseSection: true
---

# Guides

Consider checking out full tutorials to understand how to add and update blocks, grant READ and UPDATE access right for users, revoke access rights.

Following tutorials that use already built apps:

* [Python tutorial](/hermes/guides/python-tutorial/), where Hermes app is C-based, but client code runs on Python.
* [Go tutorial](/hermes/guides/go-tutorial/), where Hermes app is C-based, but client code runs on Go.
* [C tutorial](/hermes/guides/c-tutorial/), where both Hermes and client app are written in C.
* [Local CLI tutorial](/hermes/guides/local-cli-example/) how to build and use example CLI apps.

Creating your own Hermes-based app 
* [Integrating Hermes-core](/hermes/guides/integrating-hermes/).
* [Short tutorial](/hermes/guides/creating-your-own-hermes-based-app-short/).
* [Long step-by-step tutorial](/hermes/guides/creating-your-own-hermes-based-app-long/).


## Using Hermes-core

Hermes is a cryptography-based method of providing protected data storage and sharing that allows enforcing cryptographically checked CRUD permissions to data blocks and doesn't let server that's running Hermes do anything worse than DoS. In other words, Hermes enables collaboration and distributed data sharing through enforcing access control with the help of cryptographic methods. This section is a brief explanation of how you can achieve this.

To use Hermes-core, 4 components need to be implemented: 3 storage entities and a transport interface. The storage entities require databases (generic or specialised) and some “driver” that will act as a point of communication with Hermes-core.

### Databases

1. **Data database** — data storage entity, which implements the `hm_ds_db_t interface` (see `include/hermes/data_store/db.h`).
2. **Credential database** — data storage entity, which implements `the hm_cs_db_t` interface (see `include/hermes/credential_store/db.h`).
3. **Keystore database** — data storage entity, which implements `the hm_ks_db_t` interface (see `include/hermes/key_store/db.h`).

### Transport

The transport interface is basically the API. Transport(s) is the `transport_t` interface (see `include/hermes/rpc/transport.h`). In fact, each instance of communication between the components of the system can be implemented with the help of different transports (i.e. sockets). Transport interfaces primarily need to be able to carry out the `receive` and `send` functionality.

### Assembling Hermes-core

After implementing the 4 components mentioned above, the assembly of parts of Hermes-core follows. These are the entities you’ll need to implement:

**On Client:** 

1. Client. It consists of `mid_hermes` (with all corresponding dependencies) and transport.

**On Server:**

1. Credential store. It includes Credential database, transport, and Credential store server (see `include/hermes/credential_store/server.h`).
2. Data store. It includes Data database, transport, and Data store server (see `include/hermes/data_store/server.h`).
3. Keystore. It includes Keystore database, transport, and Keystore server (see `include/hermes/key_store/server.h`).