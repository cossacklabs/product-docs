---
weight: 6
title: Contributing
---

# Contributing to Hermes-core

Hermes-core is open-source software licensed with [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html). It is maintained by [Cossack Labs](https://www.cossacklabs.com/) and we highly encourage you to contribute.

Hermes-core is a complex project. Changing something in Hermes-core is not easy, but quite possible. The following instructions will guide you through the steps necessary to do that.

## Read the papers

Initially, you might want to (re-)read the [scientific paper accompanying Hermes](https://www.cossacklabs.com/files/hermes-theory-paper-rev1.pdf) to understand that all its functions and models are interconnected. 

There is also a document addressing the implementation issues specifically — [Implementing Hermes-based Security Systems](https://www.cossacklabs.com/hermes/implementing-hermes-based-systems/), please read it, too. This will help you a lot.

## When changing data structures, change them everywhere

All the data structures used in Hermes-core are aimed at implementing the current Hermes-core architecture. If you want to extend or change one or more structure, don't forget to change its implementation and the implementation of the component that uses the changed structure. In most parts of Hermes-core, you should use object-oriented approach for implementation of components. Even though Hermes-core is written using C (not an OOP language), we try to use the OOP approach everywhere. This is why, as a rule, declaration of data structures is logically (and often also physically) located "close" to the logic that uses them.

## Processes can be changed discretely

All the processes in Hermes-core are separated into different functions and primitives and can be changed independently if the interface remains unchanged. If the interface changes, the necessity to check and change all the parts it is using will arise.


## "I'd like to help somehow, but don't know what will be useful. What should I do?"

If you're looking for something to contribute to and gain our eternal respect (or something more tangible - you might be in for a surprise when contributing to us, who knows ;), just pick the things in the [list of issues](https://github.com/cossacklabs/hermes-core/issues).

If you'd like to do independent parts (implement new procedures/objects, do a language wrapper or a set of examples for languages or architectures we don't have and don't even plan yet) - just go ahead and let us know when you finish.

We highly encourage you to:

* Report bugs and request features via [GitHub Issues](https://github.com/cossacklabs/hermes-core/issues).
* Report a bug and fix it with a patch via our [GitHub Pull request](https://github.com/cossacklabs/hermes-core/pulls) (after creating a corresponding issue and leaving a link to the pull there).
* Add something new to Hermes-core. There is a certain design scheme according to which we'd like to keep developing Hermes-core. If your contributions fall along with it, we'd be glad to accept some fundamental additions. It's better to discuss the subject using [email](mailto:dev@cossacklabs.com) before taking action.

Every commit that goes into the master branch is audited and reviewed by somebody from Cossack Labs, don't be surprised if the process is long-ish.

If you'd like to participate in the core development more closely and deeply, get in touch.

## Filemap

This table should help you navigate through the Hermes-core sources.

{{< hint info >}}
Note: The following table consists of 3 columns: File, Description, Object.
{{< /hint >}}


| File | Description | Object |
| ---- | ----------- | ------ |
| [include/hermes/rpc/server.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/rpc/server.h), [src/rpc/server.c](https://github.com/cossacklabs/hermes-core/blob/master/src/rpc/server.c) | Server part of RPC | hm_rpc_server_t |
| [include/hermes/rpc/client.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/rpc/client.h), [src/rpc/client.c](https://github.com/cossacklabs/hermes-core/blob/master/src/rpc/client.c) | Client part of RPC | hm_rpc_client_sync_t |
| [include/hermes/rpc/param_pack.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/rpc/param_pack.h), [https://github.com/cossacklabs/hermes-core/blob/master/src/rpc/param_pack.c](https://github.com/cossacklabs/hermes-core/blob/master/src/rpc/param_pack.c) | RPC parameter serialiser | hm_param_pack_t |
| [include/hermes/rpc/buffers_list.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/rpc/buffers_list.h), [src/rpc/buffers_list.c](https://github.com/cossacklabs/hermes-core/blob/master/src/rpc/buffers_list.c)| Buffer list interface and implementation | hm_buffers_list_t |
| [include/hermes/rpc/transport.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/rpc/transport.h) | RPC transport interface | hm_rpc_transport_t |
| [include/hermes/secure_transport/transport.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/secure_transport/transport.h), [src/secure_transport/transport.c](https://github.com/cossacklabs/hermes-core/blob/master/src/secure_transport/transport.c) | Transport wrapper that uses [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session) | secure_transport_t |
| [include/hermes/secure_transport/session_callback.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/secure_transport/session_callback.h), [src/secure_transport/session_callback.c](https://github.com/cossacklabs/hermes-core/blob/master/src/secure_transport/session_callback.c), | Session callback for [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session) | - |
| [include/hermes/common/utils.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/common/utils.h) | Some useful defines |  |
| [include/hermes/common/hash_table.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/common/hash_table.h), [src/common/hm_hash_table.c](https://github.com/cossacklabs/hermes-core/blob/master/src/common/hm_hash_table.c) | Hash table data type | hm_hash_table_t |
| [include/hermes/common/errors.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/common/errors.h) | Definitions and handlers for error codes | - |
| [include/hermes/common/buffer.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/common/buffer.h), [src/common/buffer.c](https://github.com/cossacklabs/hermes-core/blob/master/src/common/buffer.c) | {buffer, size} type | buffer_t |
| [include/hermes/key_store/server.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/key_store/server.h), [src/key_store/server.c](https://github.com/cossacklabs/hermes-core/blob/master/src/key_store/server.c) | Keystore server component | hm_key_store_server_t |
| [include/hermes/key_store/service.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/key_store/service.h), [src/key_store/service.c](https://github.com/cossacklabs/hermes-core/blob/master/src/key_store/service.c) | Keystore service creation helper | hm_key_store_service_t |
| [include/hermes/key_store/client.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/key_store/client.h), [src/key_store/client.c](https://github.com/cossacklabs/hermes-core/blob/master/src/key_store/client.c) | Synchronous Keystore client component | hm_key_store_client_sync_t |
| [include/hermes/key_store/functions.h](https://github.com/cossacklabs/hermes-core/blob/master/src/key_store/functions.h), [src/key_store/functions.c](https://github.com/cossacklabs/hermes-core/blob/master/src/key_store/functions.c) | Keystore functions, proxies, and stubs | - |
| [include/hermes/key_store/db.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/key_store/db.h) | Keystore database interface | hm_ks_db_t |
| [include/hermes/mid_hermes/mid_hermes.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/mid_hermes/mid_hermes.h), [src/mid_hermes/mid_hermes.c](https://github.com/cossacklabs/hermes-core/blob/master/src/mid_hermes/mid_hermes.c) | The main hermes client component | mid_hermes_t |
| [src/mid_hermes/credential_store_impl.h](https://github.com/cossacklabs/hermes-core/blob/master/src/mid_hermes/credential_store_impl.h), [src/mid_hermes/credential_store_impl.c](https://github.com/cossacklabs/hermes-core/blob/master/src/mid_hermes/credential_store_impl.c) | Mid Hermes Credential store bindings | - |
| [src/mid_hermes/data_store_impl.h](https://github.com/cossacklabs/hermes-core/blob/master/src/mid_hermes/data_store_impl.h), [src/mid_hermes/data_store_impl.c](https://github.com/cossacklabs/hermes-core/blob/master/src/mid_hermes/data_store_impl.c) | Mid Hermes Data store bindings | - |
| [src/mid_hermes/key_store_impl.h](https://github.com/cossacklabs/hermes-core/blob/master/src/mid_hermes/key_store_impl.h), [src/mid_hermes/key_store_impl.c](https://github.com/cossacklabs/hermes-core/blob/master/src/mid_hermes/key_store_impl.c) | Mid Hermes Keystore bindings | - |
| [include/hermes/data_store/server.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/data_store/server.h), [src/data_store/server.c](https://github.com/cossacklabs/hermes-core/blob/master/src/data_store/server.c) | Data store server component | hm_data_store_server_t |
| [include/hermes/data_store/service.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/data_store/service.h), [src/data_store/service.c](https://github.com/cossacklabs/hermes-core/blob/master/src/data_store/service.c) | Data store service creation helper | hm_data_store_service_t |
| [include/hermes/data_store/client.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/data_store/client.h), [src/data_store/client.c](https://github.com/cossacklabs/hermes-core/blob/master/src/data_store/client.c) | Synchronous data store client component | hm_data_store_client_sync_t |
| [include/hermes/data_store/db.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/data_store/db.h) | Data store database interface | hm_ds_db_t |
| [include/hermes/data_store/functions.h](https://github.com/cossacklabs/hermes-core/blob/master/src/data_store/functions.h), [src/data_store/functions.c](https://github.com/cossacklabs/hermes-core/blob/master/src/data_store/functions.c) | Data store functions, proxies, and stubs | - |
| [include/hermes/credential_store/server.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/credential_store/server.h), [src/credential_store/server.c](https://github.com/cossacklabs/hermes-core/blob/master/src/credential_store/server.c) | Credential store server component | hm_credential_data_server_t |
| [include/hermes/credential_store/service.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/credential_store/service.h), [src/credential_store/service.c](https://github.com/cossacklabs/hermes-core/blob/master/src/credential_store/service.c) | Credential store service creation helper | hm_credential_store_service_t |
| [include/hermes/credential_store/client.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/credential_store/client.h), [src/credential_store/client.c](https://github.com/cossacklabs/hermes-core/blob/master/src/credential_store/client.c) | Synchronous credential store client component | hm_credential_store_client_sync_t |
| [include/hermes/credential_store/db.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/credential_store/db.h) | Credential store database interface | hm_cs_db_t |
| [include/hermes/credential_store/functions.h](https://github.com/cossacklabs/hermes-core/blob/master/src/credential_store/functions.h), [src/credential_store/functions.c](https://github.com/cossacklabs/hermes-core/blob/master/src/credential_store/functions.c) | Credential store functions, proxies, and stubs | - |
| [include/hermes/mid_hermes_ll/mid_hermes_ll_rights_list.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/mid_hermes_ll/mid_hermes_ll_rights_list.h), [src/mid_hermes_ll/mid_hermes_ll_rights_list.c](https://github.com/cossacklabs/hermes-core/blob/master/src/mid_hermes_ll/mid_hermes_ll_rights_list.c) | Low-level Hermes-core bindings for list of block access rights | mid_hermes_ll_rights_list_t |
| [include/hermes/mid_hermes_ll/mid_hermes_ll_token.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/mid_hermes_ll/mid_hermes_ll_token.h), [src/mid_hermes_ll/mid_hermes_ll_token.c](https://github.com/cossacklabs/hermes-core/blob/master/src/mid_hermes_ll/mid_hermes_ll_token.c) | Low-level Hermes-core READ/UPDATE token class | mid_hermes_ll_token_t |
| [include/hermes/mid_hermes_ll/mid_hermes_ll_block.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/mid_hermes_ll/mid_hermes_ll_block.h), [src/mid_hermes_ll/mid_hermes_ll_block.c](https://github.com/cossacklabs/hermes-core/blob/master/src/mid_hermes_ll/mid_hermes_ll_block.c) | Low-level Hermes-core block class | mid_hermes_ll_block_t |
| [include/hermes/mid_hermes_ll/mid_hermes_ll_buffer.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/mid_hermes_ll/mid_hermes_ll_buffer.h), [src/mid_hermes_ll/mid_hermes_ll_buffer.c](https://github.com/cossacklabs/hermes-core/blob/master/src/mid_hermes_ll/mid_hermes_ll_buffer.c) | Low-level Hermes-core buffer class | mid_hermes_ll_buffer_t |
| [include/hermes/mid_hermes_ll/mid_hermes_ll_user.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/mid_hermes_ll/mid_hermes_ll_user.h), [src/mid_hermes_ll/mid_hermes_ll_user.c](https://github.com/cossacklabs/hermes-core/blob/master/src/mid_hermes_ll/mid_hermes_ll_user.c) | Low-level Hermes-core user class | mid_hermes_ll_user_t |
| [include/hermes/mid_hermes_ll/interfaces/credential_store.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/mid_hermes_ll/interfaces/credential_store.h) | Low-level Hermes-core Credential store interface | hermes_credential_store_t |
| [include/hermes/mid_hermes_ll/interfaces/key_store.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/mid_hermes_ll/interfaces/key_store.h) | Low-level Hermes-core Keystore interface | hermes_key_store_t |
| [include/hermes/mid_hermes_ll/interfaces/data_store.h](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/mid_hermes_ll/interfaces/data_store.h) | Low-level Hermes-core datastore interface | hermes_data_store_t |
| [src/mid_hermes_ll/utils.h](https://github.com/cossacklabs/hermes-core/blob/master/src/mid_hermes_ll/utils.h), [src/mid_hermes_ll/utils.c](https://github.com/cossacklabs/hermes-core/blob/master/src/mid_hermes_ll/utils.c) | Hermes-core main cryptography functions definition | - |
| - | - | - |
| [tests/rpc/rpc_test.c](https://github.com/cossacklabs/hermes-core/blob/master/tests/rpc/rpc_test.c) | Hermes-core PRC tests | - |
| [tests/rpc/param_pack_test.c](https://github.com/cossacklabs/hermes-core/blob/master/tests/rpc/param_pack_test.c) | Hermes-core RPC param_pack test | - |
| [tests/rpc/server_test.c](https://github.com/cossacklabs/hermes-core/blob/master/tests/rpc/server_test.c) | Hermes-core RPC client server test | - |
| [tests/common/test_transport.c](https://github.com/cossacklabs/hermes-core/blob/master/tests/common/test_transport.c) | Common transport test | - |
| [tests/common/test_utils.h](https://github.com/cossacklabs/hermes-core/blob/master/tests/common/test_utils.h) | Tests utils header | - |
| [tests/common/test_utils.c](https://github.com/cossacklabs/hermes-core/blob/master/tests/common/test_utils.c) | Tests utils | - |
| [tests/common/test_key_store_db.h](https://github.com/cossacklabs/hermes-core/blob/master/tests/common/test_data_store_db.h) | Keystore tests | - |
| [tests/common/test_credential_store_db.c](https://github.com/cossacklabs/hermes-core/blob/master/tests/common/test_credential_store_db.c) | Credential store tests | - |
| [tests/common/test_transport.h](https://github.com/cossacklabs/hermes-core/blob/master/tests/common/test_transport.h) | Transport tests | - |
| [tests/common/test_credential_store_db.h](https://github.com/cossacklabs/hermes-core/blob/master/tests/common/test_credential_store_db.h) | Credential store header test | - |
| [tests/common/test_data_store_db.c](https://github.com/cossacklabs/hermes-core/blob/master/tests/common/test_data_store_db.c) | Data store test | - |
| [tests/common/test_data_store_db.h](https://github.com/cossacklabs/hermes-core/blob/master/tests/common/test_data_store_db.h) | Data store header test | - |
| [tests/common/sput.h](https://github.com/cossacklabs/hermes-core/blob/master/tests/common/sput.h) | Test framework | - |
| [tests/common/test_key_store_db.c](https://github.com/cossacklabs/hermes-core/blob/master/tests/common/test_key_store_db.c) | Keystore test | - |
| [tests/key_store/key_store_tests.c](https://github.com/cossacklabs/hermes-core/blob/master/tests/key_store/key_store_tests.c) | Keystore tests | - |
| [tests/data_store/data_store_tests.c](https://github.com/cossacklabs/hermes-core/blob/master/tests/data_store/data_store_tests.c) | Data store tests | - |
| [tests/credential_store/credential_store_tests.c](https://github.com/cossacklabs/hermes-core/blob/master/tests/credential_store/credential_store_tests.c) | Credential store tests | - |
| [tests/mid_hermes/mid_hermes.c](https://github.com/cossacklabs/hermes-core/blob/master/tests/mid_hermes/mid_hermes.c) | Main Hermes client tests | - |
| [tests/mid_hermes_ll/main.c](https://github.com/cossacklabs/hermes-core/blob/master/tests/mid_hermes_ll/main.c) | Entry point for low-level tests | - |
| [tests/mid_hermes_ll/block_tests.h](https://github.com/cossacklabs/hermes-core/blob/master/tests/mid_hermes_ll/block_tests.h) | Low-level Hermes-core block tests header | - |
| [tests/mid_hermes_ll/block_tests.c](https://github.com/cossacklabs/hermes-core/blob/master/tests/mid_hermes_ll/block_tests.c) | Low-level Hermes-core block tests | - |
| - | - | - |
| [pyhermes/pyhermes.c](https://github.com/cossacklabs/hermes-core/blob/master/pyhermes/pyhermes.c) | Python bindings for Hermes | - |
| [pyhermes/setup.py](https://github.com/cossacklabs/hermes-core/blob/master/pyhermes/setup.py) | The main pyHermes setup script | - |
| [pyhermes/transport.h](https://github.com/cossacklabs/hermes-core/blob/master/pyhermes/transport.h) [pyhermes/transport.c](https://github.com/cossacklabs/hermes-core/blob/master/pyhermes/transport.c) | Python bindings for PRC Hermes transport that used internally in extension | - |
| [pyhermes/py_transport.h](https://github.com/cossacklabs/hermes-core/blob/master/pyhermes/py_transport.h) [pyhermes/py_transport.c](https://github.com/cossacklabs/hermes-core/blob/master/pyhermes/py_transport.c) | Wraps user's transport implementation into wrapper that can be used by MidHermes | - |
| [pyhermes/py_secure_transport.h](https://github.com/cossacklabs/hermes-core/blob/master/pyhermes/py_secure_transport.h) [pyhermes/py_secure_transport.c](https://github.com/cossacklabs/hermes-core/blob/master/pyhermes/py_secure_transport.c) | Wraps user's transport implementation using [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session) wrapper from Hermes-core and can be used by MidHermes | - |
| [pyhermes/py_transport_wrapper.h](https://github.com/cossacklabs/hermes-core/blob/master/pyhermes/py_transport_wrapper.h) [pyhermes/py_transport_wrapper.c](https://github.com/cossacklabs/hermes-core/blob/master/pyhermes/py_transport_wrapper.c) | Internal python transport interface that MidHermes expects on initialization | - |
| [pyhermes/py_midhermes.h](https://github.com/cossacklabs/hermes-core/blob/master/pyhermes/py_midhermes.h) [pyhermes/py_midhermes.c](https://github.com/cossacklabs/hermes-core/blob/master/pyhermes/py_midhermes.c) | Hermes client bindings (main data block operations)	 | - |
| - | - | - |
| [gohermes/mid_hermes.go](https://github.com/cossacklabs/hermes-core/blob/master/gohermes/mid_hermes.go) | Hermes client bindings (main data block operations) | - |
| [gohermes/transport.h](https://github.com/cossacklabs/hermes-core/blob/master/gohermes/midhermes/rpc/transport.h) [gohermes/transport.c](https://github.com/cossacklabs/hermes-core/blob/master/gohermes/midhermes/rpc/transport.c) [gohermes/transport.go](https://github.com/cossacklabs/hermes-core/blob/master/gohermes/midhermes/rpc/transport.go) | Go bindings for both PRC and [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session) Hermes transport | - |
| [gohermes/utils.go](https://github.com/cossacklabs/hermes-core/blob/master/gohermes/utils.go) | Some usefil bits | - |
| - | - | - |
| [docs/examples/c/mid_hermes/](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/mid_hermes) | Mid Hermes example in C | - |
| [docs/examples/c/utils/](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/utils) | Some common examples for utils function | - |
| [docs/examples/c/mid_hermes_low_level/](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/mid_hermes_low_level) | Mid Hermes low-level example in C | - |
| [docs/examples/c/key_gen/](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/key_gen) | Key pair generator | - |
| [docs/examples/python/](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/python) | pyHermes example | - |
| [docs/examples/go/](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/go) | Golang example | - |
| [docs/examples/test_keys/](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/test_keys) | Predefined keys used in examples | - |
