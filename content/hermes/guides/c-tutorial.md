---
weight: 3
title: C tutorial
---

# C tutorial for Hermes-core

In this tutorial, we are going to launch storage entities for data, public and encryption keys, and will save/delete/edit the data with the help of a Hermes-core console app, as well as grant/revoke access to the data for other users. 

All this will be carried out cryptographically.

## Launching the storage entities

The infrastructure of Hermes-core is divided into 3 parts (you can read more about each entity in [Abstract entities](/hermes/hermes-in-depth/architecture/abstract-entities/) and in the [scientific paper on Hermes](https://www.cossacklabs.com/files/hermes-theory-paper-rev1.pdf)): 

- Data store (data storage entity), 
- Keystore (storage entity for keys with the help of which the data is encrypted), 
- Credential store (storage entity for the users' public keys with the help of which the authentification and authorization take place).

Besides, we provide keypair generator to generate keys for the users.

## Installing the necessary libraries

Let's install the libraries and utilities that we're going to need.

For Debian the command is:

```bash
sudo apt-get update && sudo apt-get install build-essential libssl-dev git python3-dev
```

We need `build-essential` for building binary libraries and `libssl` as backend for [Themis](https://github.com/cossacklabs/themis), and `python-dev` for our client written in Python.

If you're using another OS please refer to the [Installation guide](/hermes/getting-started/installing/hermes-from-repository/).

Let's download and install Themis into your system:

```bash
git clone https://github.com/cossacklabs/themis
cd themis
make && sudo make install
cd ..
```

Now you should download and install Hermes-core:

```bash
git clone https://github.com/cossacklabs/hermes-core
cd hermes-core
make && sudo make install
```

## Building all the services necessary for the Hermes-core infrastructure

The next step is building [keypair generator](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/key_gen) and stores: [Keystore](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/mid_hermes/key_store_service), [Credential store](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/mid_hermes/credential_store_service), [Data store](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/mid_hermes/data_store_service).

You can find each component in [docs/examples/c](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/) folder, and run `make` for each of them separately.

However, we recommend building them all at once:

```bash
make examples
```

## Creating folder structure for the services

With the following command, we are creating a folder structure in which the services we are creating will store the data:

```bash
# create folder structure
mkdir -p db/credential_store
mkdir -p db/key_store
mkdir -p db/data_store
```

## Register service's keys in the Credential store

The service examples have hardcoded private/public keys. To simplify the first run, we placed the public keys into the repository close to examples. Those files have filenames that are base64-encoded names of services that are declared in `docs/examples/c/mid_hermes/common/config.h` and have binary content of public keys.

```bash
cp docs/examples/c/service_keys/* db/credential_store/
```

## Generating user keys

`User 1`

```bash
./docs/examples/c/key_gen/key_pair_gen user1.priv db/credential_store/$(echo -n user1 | base64)
```

Here we are using our key generator and command it to save a private key in a folder with the name `user1.priv`, and put the public key into the folder that will be assigned to/available to Credential store — `db/credential_store`. The filename will be a user identifier in `base64`. In our case, it is going to be `user1`.

{{< hint info >}}
Note: It is important that the filename is in the correct `base64` format as consequently it will be used as the user identifier.
{{< /hint >}}

`User 2`

Let's create another user, this time with `user2` identifier:

```bash
./docs/examples/c/key_gen/key_pair_gen user2.priv db/credential_store/$(echo -n user2 | base64)
```

## Launching services

Now we need to launch all the necessary services that we have built.

This should be done in separate console tabs:

*Credential store*

```bash
./docs/examples/c/mid_hermes/credential_store_service/cs
```

*Keystore*

```bash
./docs/examples/c/mid_hermes/key_store_service/ks
```

*Data store*

```bash
./docs/examples/c/mid_hermes/data_store_service/ds
```

Now all the parts of Hermes-core are working and we can start using the infrastructure — add data, grant/revoke access, edit, etc.

## Installing Client

To install the C client for Hermes-core, do the following:

```bash
make mid_hermes_example_client
```

On MacOS you might need to install `argp`:

```bash
brew install argp-standalone
```

Our Client app is ready to be used. Now, this is where the fun begins.

## Creating the first document

Let's add some data — for example, let's create a file with simple content:

```
echo "some content" > testfile
```

### Folder structure

This is an example folder structure — you probably have something similar right now. `Docs/examples/c` contains the core components of Hermes-core. The C client is located in `docs/examples/c/mid_hermes/client` folder. The database folder `db` contains encrypted data and access keys / tokens.

```bash
hermes-core/
├── docs/examples/
|   ├── c/
|       ├── key_gen/
|       └── mid_hermes/
|           ├── client
|           ├── credential_store_service/
|           ├── data_store_service/
|           └── key_store_service/
└── db/
|   ├── credential_store/
|   ├── data_store/
|   └── key_store/
├── somefile
├── user1.priv
└── user2.priv
```

## Adding data

Let's add the first document into database:

```bash
./docs/examples/c/mid_hermes/client/client add_block user1 $(cat user1.priv | base64) "somefile" "first-file"
```

The first 4 parameters for this console client always follow this order:

1. The command `add_block` adds block with to Hermes system.
2. User's identifier (`user1` in the example above).
3. User's private key in the `base64` format (cat `user1.priv | base64` in the example above).
4. The path the file that acts as a block on which all the (Hermes) operations are performed (`somefile` in the example above).

Some commands also have a 5th parameter which accepts the metadata information (`first-file` in the example above).

Find the list of all the other commands supported by the example using help command:

```bash
docs/examples/c/mid_hermes/client/client --help
usage: client <command> <user id> <base64 encoded user private key> <name of file for proceed> <meta> <for user>.
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
           rotate - rotate <name of file to be processed> block from Hermes system
           grant_read - grant read access for <for user> to <name of file to be processed> block in Hermes system
           grant_update - grant update access for <for user> to <name of file to be processed> block in Hermes system
           revoke_read - deny read access for <for user> to <name of file to be processed> block in Hermes system
           revoke_update - deny update access for <for user> to <name of file to be processed> block in Hermes system
```

## Reading data

Let's try to read this data by typing the following:

```bash
./docs/examples/c/mid_hermes/client/client read_block user1 $(cat user1.priv | base64) "somefile"

# output
new content
first-file
```

The command looks the same, it's only that `add_block` was switched for `read_block` and we don't have to set the 5th metadata parameter. In all the following commands we'll most often see the change in the command type and addition/deletion of the 5-th parameter that contains metadata.

So now we're seeing the content and metadata that we'd previously passed. All this data is stored in the folder that was created earlier — `ls db/data_store` which will contain a folder

So now the content and the meta data we transferred before is displayed for us. All this data is stored as files in the previously created folder `ls db/data_store` which will contain a folder with the name that matches the filename of the added file in `base64` format — `c29tZWZpbGU=`. 

This `ls db/data_store/c29tZWZpbGU=` folder will contain 3 files:

```bash
data
mac
meta
```

To make sure that your data is truly encrypted, you can display it using:

```bash
cat db/data_store/c29tZWZpbGU=/data
```

The output will be unprintable because the encrypted data is in binary state and you will not find the traces of the initial data in it. Currently, only the person (`user`) who had added the data can make can make changes to it. But let's change the initial file and update it in Hermes-core:

```bash
echo "some new content" > somefile
```

And let's take another look at what is stored in Hermes-core now. The content is not changed, because we haven't pushed new `somefile` to data store.

```bash
./docs/examples/c/mid_hermes/client/client read_block user1 $(cat user1.priv | base64) "somefile"

# output
new content
first-file
```

## Updating the data

Let's now try updating the data while using the identifier (ID) and the key that belong to a different user — `user2`:

```bash
./docs/examples/c/mid_hermes/client/client update_block user2 $(cat user2.priv | base64) "somefile" "first-file"

# output
error: block adding error
```

As a result, we get an error. But now let's perform the update on behalf of the previous user — `user1` (who was the entity that added the data in the first place):

```bash
./docs/examples/c/mid_hermes/client/client update_block user1 $(cat user1.priv | base64) "somefile" "first-file"
```

Let's now output (display) the data to make sure it was indeed updated:

```bash
./docs/examples/c/mid_hermes/client/client read_block user1 $(cat user1.priv | base64) "somefile"

# output
some new content
first-file
```

And let's make sure that `user2` has no access to the data:

```bash
./docs/examples/c/mid_hermes/client/client read_block user2 $(cat user2.priv | base64) "somefile"

# output
error: block getting error
```

As we can see — `user2` indeed has no access to the data.

## Granting READ permissions

But let's now grant READ permission to `user2`:

```bash
./docs/examples/c/mid_hermes/client/client grant_read user1 $(cat user1.priv | base64) "somefile" "user2"
```

Here the identifier of `user2` was set as the 5th argument.

So let's try and read the file using the key belonging to `user2`:

```bash
./docs/examples/c/mid_hermes/client/client read_block user2 $(cat user2.priv | base64) "somefile"

# output
some new content
first-file
```

Making sure that `user2` didn't also receive the UPDATE permissions alongside with READ permissions:

```bash
./docs/examples/c/mid_hermes/client/client update_block user2 $(cat user2.priv | base64) "somefile" "first-file"

# output
error: block adding error
```

Ok, we got an error so everything is functioning as intended.

## Granting UPDATE permissions

Now, let's grant the permission to UPDATE to `user2`:

```bash
./docs/examples/c/mid_hermes/client/client grant_update user1 $(cat user1.priv | base64) "somefile" "user2"
```

Let's update the file and read it:

```bash
echo "user 2 data" > somefile
```

```bash
./docs/examples/c/mid_hermes/client/client update_block user2 $(cat user2.priv | base64) "somefile" "first-file"
```

```bash
./docs/examples/c/mid_hermes/client/client read_block user2 $(cat user2.priv | base64) "somefile"

# output
user 2 data
first-file
```

## Adding one more user and distributing permissions further

Let's now add `user3` just as we did before with `user2`, to be able to grant permissions from `user2` to `user3` (using the credentials of `user2`):

```bash
./docs/examples/c/key_gen/key_pair_gen user3.priv db/credential_store/`echo -n user3 | base64`
```

Granting access/permissions from `user2` to `user3`:

```bash
./docs/examples/c/mid_hermes/client/client grant_read user2 $(cat user2.priv | base64) "somefile" "user3"
```

Let's try to read the data now as the `user3`:

```bash
./docs/examples/c/mid_hermes/client/client read_block user3 $(cat user3.priv | base64) "somefile"

# output
user 2 data
first-file
```

Making sure that `user3` has no permission to perform UPDATE on the data:

```bash
./docs/examples/c/mid_hermes/client/client update_block user3 $(cat user3.priv | base64) "somefile" "first-file"

# output
error: block adding error
```

## Rotating data and keys

At this step, let's perform data and key(s) rotation as `user2`. This rotation means re-encrypting the data using new keys. To make sure that the key and data rotation indeed takes place (because the data is binary and it would be hard to tell one batch of encrypted data from another), we need to calculate the hash-sum of the encrypted file before and after rotation and check if they match (they shouldn't). If after rotation we read the data again and get the same decrypted data output, it means that the rotation was successful.


Let's calculate and save the hashsum of the ecnrypted file (which is located in `db/data_store/dGVzdGZpbGU=/data`) into a temporary file:

```bash
sha256sum db/data_store/dGVzdGZpbGU=/data > /tmp/1.sha
```

Perform rotation:

```bash
./docs/examples/c/mid_hermes/client/client rotate user1 $(cat user1.priv | base64) "somefile"
```

and calculate the hashsum again:

```bash
sha256sum db/data_store/dGVzdGZpbGU=/data > /tmp/2.sha
```

Using the `diff` comand, we'll see that the previous and the new hashsums are different:

```bash
diff /tmp/1.md5 /tmp/2.md5 
1c1
< 9baad30131be8b6beb4453b0ea3aeef1  db/data_store/dGVzdGZpbGU=/data
---
> c5425afdaf906e4eeec3a70923018e34  db/data_store/dGVzdGZpbGU=/data
```

If the `diff` command provides some text output, it means that the files (hashsums) we are comparing are different. Otherwise, there would be no text output. So the key and data rotation (its re-encryption using new encryption keys) was successful.

To make sure that the data stays the same, let's read the data (as `user3`) again:

```bash
./docs/examples/c/mid_hermes/client/client read_block user3 $(cat user3.priv | base64) "somefile"
```

The resulting data is unchanged. Rotation of keys and data worked as intended.

## Revoking permissions/access

To revoke the read permissions from `user3` (as `user2`), do the following:

```bash
./docs/examples/c/mid_hermes/client/client revoke_read user2 $(cat user2.priv | base64) "somefile" "user3"
```

Attempting to read the data now as `user3` will predictably lead to an error:

```bash
./docs/examples/c/mid_hermes/client/client read_block user3 $(cat user3.priv | base64) "somefile"

# output
error: block getting error
```

Let's now also revoke the UPDATE permissions from the initial data owner — `user1` (acting as `user2`):

```bash
./docs/examples/c/mid_hermes/client/client revoke_update user2 $(cat user2.priv | base64) "somefile" "user1"
```

Checking if the revocation of rights was successful:

```bash
./docs/examples/c/mid_hermes/client/client update_block user1 $(cat user1.priv | base64) "somefile" "first-file"

# output
error: block adding error
```

The attempt to edit (update) the data by `user1` ended with an error, which means that the revocation of rights was successful.

Let's now revoke all rights to the data from `user1`:

```bash
./docs/examples/c/mid_hermes/client/client revoke_read user2 $(cat user2.priv | base64) "somefile" "user1"
```


Now it is only the `user2` who has any rights to the data:

```bash
./docs/examples/c/mid_hermes/client/client read_block user2 $(cat user2.priv | base64) "somefile"

# output
user 2 data
first-file
```

## Deleting the record

Let's elegantly finish this transfer of rights to the data by deleting the record altogether (acting as `user2`):

```bash
./docs/examples/c/mid_hermes/client/client delete_block user2 $(cat user2.priv | base64) "somefile"
```

And now, let's make sure that the data is indeed gone — if it is, we'll see an error while trying to read it as `user2` (or any other user from this tutorial, for that matter):

```bash

./docs/examples/c/mid_hermes/client/client read_block user2 $(cat user2.priv | base64) "somefile"

# output
error: block getting error
```

The `block getting error` confirms that it's now impossible to get the block as it had been deleted. So the data is gone, deleted by `user2` who gained all the permissions.

## Summary

As you can see, launching the storage entities for data, public and encryption keys for Hermes-core is easy, and the process of granting/revoking permissions (access) to the data between authorised users in Hermes-core is very straightforward and convenient.

We hope that this tutorial was fun and informative and that you now have gained enough understanding of how the things work with Hermes-core — and that now you’ll try using it or [build a Hermes-based app of your own](/hermes/guides/creating-your-own-hermes-based-app-short/).

Similar tutorials are also available for the [Python language](/hermes/guides/python-tutorial/) and [Golang](/hermes/guides/go-tutorial/).
