---
title: Building Example
---

# Building example apps

The Hermes-core application architecture requires the four main system components: 1. **Credential Store**, 2. **Data Store**, 3. **Keystore**, 4. **Client**.

Hermes-core repository currently includes usage examples in C, Python, and Go for Client side and an example in C for Credential/Data/Keystore.

The examples in Hermes-core use the file system as a storage entity (backend) for Credential store, Keystore, and Data store. The examples use simple TCP/IP socket communication as transport layer.

## Building examples

The examples can be found in [docs/examples/](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples) folder of repository, and they consist of: 1. `credential_store_service` — Credential store (in C). 2. `data_store_service` — Data store (in C). 3. `key_store_service` — Keystore (in C). 4. `client` — Hermes client (in [C](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/mid_hermes/client), [Python](https://github.com/cossacklabs/hermes-core/blob/master/docs/examples/python/hermes_client.py), and [Go](https://github.com/cossacklabs/hermes-core/blob/master/docs/examples/go/hermes_client.go)).

Running examples require you to have Hermes-core library installed on your system.

You can build it manually from source, or install from available package manager.

* Building Hermes-core from source: [Building Hermes core](https://docs.cossacklabs.com/pages/documentation-hermes/#building-hermes).
* Installing from package manager: [Installing from repository](https://docs.cossacklabs.com/pages/documentation-hermes/#installation-from-repository).

#### Download Hermes-core

{{< hint info >}}
Note: Hermes-core should be already installed on your system for you to be able to build examples.
{{< /hint>}}

Download Hermes-core repo if you haven't done so already:

```
git clone https://github.com/cossacklabs/hermes-core
cd hermes-core
make
```

#### Build examples

...and compile examples:

```make examples```

The command above will build C, Python, and Go examples in the corresponding folders.

Your ```hermes-core/docs``` folder structure will look similar to this one:

```
hermes-core/
L-- docs/examples/
    +-- c/
    ¦   +-- key_gen/
    ¦   L-- mid_hermes/
    ¦       +-- client
    ¦       +-- credential_store_service/
    ¦       +-- data_store_service/
    ¦       L-- key_store_service/
    +-- python/
    ¦   L-- hermes_client.py
    L-- go/
        L-- hermes_client.go
```

## Using example apps

Working with examples consists of the following steps:

* generate keypairs for several users (`user1`, `user2`, `user3`);
* create a file;
* run services: credential_store_service, data_store_service and key_store_service;
* run the Client: using the keys belonging to `user1`, encrypt and add a new file to the database;
* grant READ/UPDATE permissions to the file to other users;
* add new files, update file content;
* revoke permissions;
* remove files.

Each of these operations illustrates the usage of the Hermes-core and the actions it can perform.

Consider checking out the full tutorials to gain a better understanding of how to add and update blocks, grant READ and UPDATE access rights for users and revoke access rights.