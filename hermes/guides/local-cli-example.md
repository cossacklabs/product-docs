---
weight: 4
title: Local CLI examples
---

# Local CLI examples

## Building and running local CLI example   

This is an example of using low-level functions of Hermes-core in order to implement all of Hermes-core's Server parts (Data store, Credential store, and Keystore) through a single app, which also serves as a Client entity.    

The main Hermes-core client class is `mid_hermes_t` which can be found in [`include/hermes/mid_hermes/mid_hermes.h`](https://github.com/cossacklabs/hermes-core/blob/master/include/hermes/mid_hermes/mid_hermes.h). We recommend using only this class for Hermes-core applications. 
However, in some cases, the usage of low-level [`mid_hermes`](https://github.com/cossacklabs/hermes-core/tree/master/include/hermes/mid_hermes_ll) might be more comfortable.

### Low-level mid_hermes
The low-level interface of [`mid_hermes`](https://github.com/cossacklabs/hermes-core/tree/master/include/hermes/mid_hermes_ll) includes the following 4 classes:

1. `mid_hermes_ll_block_t` - main data block type
2. `mid_hermes_ll_buffer_t` - {data, size} type
3. `mid_hermes_ll_user_t` - user type
4. `mid_hermes_ll_tocken_t` - read/update token type


> Note: The use of low-level interface requires all the communication, data, keys, and token storages to be controlled by the user. Use it very carefully.


Hermes-core repository includes an usage example for low-level mid_hermes in [docs/examples/c/mid_hermes_low_level](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/mid_hermes_low_level) directory.
This example doesn't use any communication and assumes that all of the parts of Hermes are on a local machine.     

## Building low-level example

### Installing Hermes-core

First of all, install Hermes-core with dev packages using [Installation guide](#installation-from-repository), or compile [Hermes-core from source](#building-hermes).

### Running example

You can try Hermes-core using a local example that contains all the storage entities Hermes-core needs for correct work.
This local example can be found in `docs/examples/c/mid_hermes_low_level` folder of the repository.

* Before using this local example you need to register some "users" in Hermes.   
To register a user with id "USER", type this into the command line:
```console
cd docs/examples/c/mid_hermes_low_level
make
mkdir -p ./db/credential_store
../key_gen/key_pair_gen USER.priv ./db/credential_store/$(echo -n USER | base64)
```
* Create first file `file.1block`:
```console
echo "smth" > file1.block
```
* Add the block `file1.block` with meta "first block in HERMES" to Hermes-core as a USER, using the following command:

```console
./hermes_client_ll add_block USER $(cat USER.priv | base64) file1.block "first block in Hermes"
```
* Now you can see some new files in the Hermes-core storages:    

```console
./db/data_store/ZmlsZTEuYmxvY2s=/data                - encrypted block
./db/data_store/ZmlsZTEuYmxvY2s=/mac                 - UPDATE TAG
./db/data_store/ZmlsZTEuYmxvY2s=/meta                - block meta
./db/key_store/ZmlsZTEuYmxvY2s=/VVNFUg==/r/token     - read token
./db/key_store/ZmlsZTEuYmxvY2s=/VVNFUg==/r/owner     - read token owner
./db/key_store/ZmlsZTEuYmxvY2s=/VVNFUg==/w/token     - update token
./db/key_store/ZmlsZTEuYmxvY2s=/VVNFUg==/w/owner     - update token owner
```    

Where:    

`ZmlsZTEuYmxvY2s=` - base64 encoded string "file1.block"

`VVNFUg==` - base64 encoded string "USER".

* Find the list of all the other commands supported by the example using the following command:    

```console
docs/examples/c/mid_hermes_low_level/hermes_client_ll --help
usage: hermes_client_ll <command> <user id> <base64 encoded user private key> <name of file for proceed> <meta> <for user>.
           <command>                         - executes the command to be performed by the client, see below;
           <user id>                         - user identifier (user needs to be registered in Credential store);
           <base64 encoded user private key> - base64 encoded private key of the user;
           <name of file to be processed>    - filename of the file to be processed (file name is used as block ID in Hermes);
           <meta>                            - some data associated with a file that is stored in the database in plaintext;
           <for user>                        - identifier of the user for which permissions are provided/revoked from (this information is needed by some commands).

commands:
           add_block - add <name of file to be processed> block with <meta> to Hermes system
           read_block - read <name of file to be processed> block with <meta> from Hermes system
           update_block - update <name of file to be processed> block with <meta> in Hermes system
           delete_block - delete <name of file to be processed> block from Hermes system
           grant_read - grant read access for <for user> to <name of file to be processed> block in Hermes system
           grant_update - grant update access for <for user> to <name of file to be processed> block in Hermes system
           revoke_read - deny read access for <for user> to <name of file to be processed> block in Hermes system
           revoke_update - deny update access for <for user> to <name of file to be processed> block in Hermes system
```

Congratulations! Hermes-core is working.


Also, see the Tutorials section for a step-by-step explanation of how to build your own Hermes client-server app.