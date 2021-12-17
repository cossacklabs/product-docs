---
title: Python tutorial
---

# PYTHON TUTORIAL FOR HERMES-CORE

In this tutorial, we are going to launch storage entities for data, public and encryption keys, and will save/delete/edit the data with the help of a Hermes-core console app, as well as grant/revoke access to the data for other users. All this will be carried out cryptographically.

## Launching the storage entities

The infrastructure of Hermes-core is divided into 3 parts (you can read more about each entity [here](https://docs.cossacklabs.com/pages/documentation-hermes/#abstract-entities-backend-) and in the [scientific paper on Hermes](https://www.cossacklabs.com/files/hermes-theory-paper-rev1.pdf)): - Data store (data storage entity), - Keystore (storage entity for keys with the help of which the data is encrypted), - Credential store (storage entity for the users' public keys with the help of which the authentification and authorization take place).

Besides, we provide keypair generator to generate keys for the users.

## Installing the necessary libraries

Let's install the libraries and utilities that we're going to need.

For Debian the command is:

```
sudo apt-get update && sudo apt-get install build-essential libssl-dev git python3-dev
```

We need `build-essential` for building binary libraries and `libssl` as backend for [Themis](https://github.com/cossacklabs/themis), and `python-dev` for our client written in Python.

If you're using another OS please refer to the [Installation guide](https://docs.cossacklabs.com/pages/documentation-hermes/#installing-or-building-hermes-core).

Let's download and install Themis into your system:

```
git clone https://github.com/cossacklabs/themis
cd themis
make && sudo make install
cd ..
```

Now you should download and install Hermes-core:

```
git clone https://github.com/cossacklabs/hermes-core
cd hermes-core
make && sudo make install
```

## Building all the services necessary for the Hermes-core infrastructure

The next step is building [keypair generator](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/key_gen) and stores: [Keystore](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/mid_hermes/key_store_service), [Credential store](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/mid_hermes/credential_store_service), [Data store](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/mid_hermes/data_store_service).

You can find each component in [docs/examples/c](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/) folder, and run `make` for each of them separately.

However, we recommend building them all at once:

```
make examples
```

## Creating folder structure for the services

With the following command, we are creating a folder structure in which the services we are creating will store the data:

```
# create folder structure
mkdir -p db/credential_store
mkdir -p db/key_store
mkdir -p db/data_store
```

## Register service's keys in the Credential store

The service examples have hardcoded private/public keys. To simplify the first run, we placed the public keys into the repository close to examples. Those files have filenames that are base64-encoded names of services that are declared in `docs/examples/c/mid_hermes/common/config.h` and have binary content of public keys.

```
cp docs/examples/c/service_keys/* db/credential_store/
```

## Generating user keys

`User 1`

```
./docs/examples/c/key_gen/key_pair_gen user1.priv db/credential_store/$(echo -n user1 | base64)
```

Here we are using our key generator and command it to save a private key in a folder with the name `user1.priv`, and put the public key into the folder that will be assigned to/available to Credential store — `db/credential_store`. The filename will be a user identifier in `base64`. In our case, it is going to be `user1`.

{{< hint info >}}
Note: It is important that the filename is in the correct `base64` format as consequently it will be used as the user identifier.
{{< /hint >}}

`User 2`

Let's create another user, this time with `user2` identifier:

```
./docs/examples/c/key_gen/key_pair_gen user2.priv db/credential_store/$(echo -n user2 | base64)
```

## Launching services

Now we need to launch all the necessary services that we have built.

This should be done in separate console tabs:

*Credential store*

```
./docs/examples/c/mid_hermes/credential_store_service/cs
```

*Keystore*

```
./docs/examples/c/mid_hermes/key_store_service/ks
```

*Data store*

```
./docs/examples/c/mid_hermes/data_store_service/ds
```

Now all the parts of Hermes-core are working and we can start using the infrastructure — add data, grant/revoke access, edit, etc.

## Installing Client

The Python client for Hermes-core supports both Python 2 and Python 3 (Python 2.7.x and Python 3.3+). We recommend using Python 3.3, but you can use the version you want.

To install the Python client for Hermes-core, do the following:

```
sudo apt install python3 virtualenv
virtualenv --python=python3 hermes_env
source hermes_env/bin/activate
cd pyhermes
python3 setup.py install
cd -
```

Our Client app is ready to be used. Now, this is where the fun begins.

## Creating the first document

Let's add some data — for example, let's create a file with simple content:

```
echo "some content" > testfile
```

### Folder structure

This is an example folder structure — you probably have something similar right now. Docs/examples/c contains the core components of Hermes-core. The Python client is located in docs/examples/python folder. The database folder db contains encrypted data and access keys / tokens.

```
hermes-core/
├── docs/examples/
|   ├── c/
|   │   ├── key_gen/
|   │   └── mid_hermes/
|   │       ├── credential_store_service/
|   │       ├── data_store_service/
|   │       └── key_store_service/
|   └── python/
|       └── hermes_client.py
└── db/
|   ├── credential_store/
|   ├── data_store/
|   └── key_store/
├── testfile
├── user1.priv
└── user2.priv
```

## Adding data

Let's add the first document into database:

```
python docs/examples/python/hermes_client.py --id user1 --config=docs/examples/python/config.json --private_key user1.priv --doc testfile --add --meta first-file

# output:
added <testfile> with meta <first-file>
done
```

* `--id user1` — specifies the identifier of the user from which we are executing an operation. This ID will tell Hermes-core which public key to use in its operations.
* `--private_key ../user1.priv` — here we're specifying our private key — the `user1.priv key`, convert it to `base64` format and pass as an argument for `--private_key`.
* `--doc testfile` — indicates where to read our file from.
* `--add` — indicates that it is a command for adding data.
* `--meta first-file` — additional metadata that might be used by the current implementation of the Data store.
* `--config=docs/examples/python/config.json` — config file with connection settings and public keys that will be used to establish Secure Session with Credential/Key/Data stores with predefined values for this example.

## Reading data

Let's try to read this data by typing the following:

```
python docs/examples/python/hermes_client.py --id user1 --config=docs/examples/python/config.json --private_key user1.priv --doc testfile --read

# output:
('some content\n', 'first-file')
done
```
The command remains the same, only `--add` was changed to `--read` and this time we don't have to set the `--meta`. In all the following commands, the changes will most often be about changing the command type and the `--meta` parameter will be added/deleted.

So now the content and the meta data we transferred before is displayed for us. All this data is stored as files in the previously created folder `ls db/data_store` which will contain a folder with the name that matches the filename of the added file in `base64` format — `dGVzdGZpbGU=`. This `ls db/data_store/dGVzdGZpbGU=` folder will contain 3 files:

```
data
mac
meta
```

To make sure that your data is truly encrypted, you can display it using:

```
cat db/data_store/dGVzdGZpbGU=/data
```

The output will be unprintable because the encrypted data is in binary state and you will not find the traces of the initial data in it. Currently, only the person (`user`) who had added the data can make can make changes to it.

But let's change the initial file and update it in Hermes-core:

```
echo "some new content" > testfile
```

And let's take another look at what is stored in Hermes-core now. The content is not changed, because we haven't pushed new `testfile` to data store.

```
python docs/examples/python/hermes_client.py --id user1 --config=docs/examples/python/config.json --private_key user1.priv --doc testfile --read

# output:
('some content\n', 'first-file')
```

## Updating the data

Let's now try updating the data while using the identifier (ID) and the key that belong to a different user — `user2`:

```
python docs/examples/python/hermes_client.py --id user2 --config=docs/examples/python/config.json --private_key user2.priv --doc testfile --update --meta first-file

# output:
Traceback (most recent call last):
  File "hermes_client.py", line 110, in <module>
    mid_hermes.updBlock(args.doc_file_name.encode(), block, args.meta.encode())
hermes.error: MidHermes.delBlock error
```

As a result, we get an error. But now let's perform the update on behalf of the previous user — `user1` (who was the entity that added the data in the first place):

```
python docs/examples/python/hermes_client.py --id user1 --config=docs/examples/python/config.json --private_key user1.priv --doc testfile --update --meta first-file

# output:
updated <testfile> with meta <first-file>
done
```

Let's now output (display) the data to make sure it was indeed updated:

```
python docs/examples/python/hermes_client.py --id user1 --config=docs/examples/python/config.json --private_key user1.priv --doc testfile --read

# output:
('some new content\n', 'first-file')
```

And let's make sure that `user2` has no access to the data:

```
python docs/examples/python/hermes_client.py --id user2 --config=docs/examples/python/config.json --private_key user2.priv --doc testfile --read

# output:
Traceback (most recent call last):
  File "hermes_client.py", line 110, in <module>
    print(mid_hermes.getBlock(args.doc_file_name.encode()))
hermes.error: MidHermes.getBlock error
```

As we can see — `user2` indeed has no access to the data.

## Granting READ permissions

Now let's now grant READ permission to `user2`:

```
python docs/examples/python/hermes_client.py --id user1 --config=docs/examples/python/config.json --private_key user1.priv --doc testfile --grant_read --for_user=user2

# output:
granted read access <testfile> for user <user2>
done
```

Here we added a new argument `--for_user=user2` to indicate, which user we are granting the access to (READ permission in this case).

So let's try and read the file using the key belonging to `user2`:

```
python docs/examples/python/hermes_client.py --id user2 --config=docs/examples/python/config.json --private_key user2.priv --doc testfile --read

# output:
('some new content\n', 'first-file')
```

Making sure that `user2` didn't also receive the UPDATE permissions alongside with READ permissions:

```
python docs/examples/python/hermes_client.py --id user2 --config=docs/examples/python/config.json --private_key user2.priv --doc testfile --update --meta first-file

# output:
Traceback (most recent call last):
  File "hermes_client.py", line 110, in <module>
    mid_hermes.updBlock(args.doc_file_name.encode(), block, args.meta.encode())
hermes.error: MidHermes.delBlock error
```

Ok, we got an error so everything is functioning as intended.

## Granting UPDATE permissions

Now, let's grant the permission to UPDATE to `user2`:

```
python docs/examples/python/hermes_client.py --id user1 --config=docs/examples/python/config.json --private_key user1.priv --doc testfile --grant_update --for_user=user2

# output:
granted update access <testfile> for user <user2>
done
```

*Note: only `user1` that already has UPDATE permission can grant UPDATE permission to `user2`.*

Let's update the file and read it:

```
echo "user 2 data" > testfile
```

```
python docs/examples/python/hermes_client.py --id user2 --config=docs/examples/python/config.json --private_key user2.priv --doc testfile --update --meta first-file

# output:
updated <testfile> with meta <first-file>
done
```

```
python docs/examples/python/hermes_client.py --id user2 --config=docs/examples/python/config.json --private_key user2.priv --doc testfile --read

# output:
('user 2 data\n', 'first-file')
done
```

## Adding one more user and distributing permissions further

Let's now add `user3` just as we did before with `user2`, to be able to grant permissions from `user2` to `user3` (using the credentials of `user2`):

Generating keypair for `user3`:

```
./docs/examples/c/key_gen/key_pair_gen user3.priv db/credential_store/$(echo -n user3 | base64)
```

Granting access/permissions from `user2` to `user3`:

```
python docs/examples/python/hermes_client.py --id user2 --config=docs/examples/python/config.json --private_key user2.priv --doc testfile --grant_read --for_user=user3

# output:
granted read access <testfile> for user <user3>
done
```

Let's try to read the data now as the `user3`:

```
python docs/examples/python/hermes_client.py --id user3 --config=docs/examples/python/config.json --private_key user3.priv --doc testfile --read

# output:
('user 2 data\n', 'first-file')
done
```

Making sure that `user3` has no permission to perform UPDATE on the data:

```
python docs/examples/python/hermes_client.py --id user3 --config=docs/examples/python/config.json --private_key user3.priv --doc testfile --update --meta first-file

# output:
Traceback (most recent call last):
  File "hermes_client.py", line 110, in <module>
    mid_hermes.updBlock(args.doc_file_name.encode(), block, args.meta.encode())
hermes.error: MidHermes.delBlock error
```

## ROTATING data and keys

At this step, let's perform data and key(s) rotation as `user2`. This rotation means re-encrypting the data using new keys. To make sure that the key and data rotation indeed takes place (because the data is binary and it would be hard to tell one batch of encrypted data from another), we need to calculate the hash-sum of the encrypted file before and after rotation and check if they match (they shouldn't). If after rotation we read the data again and get the same decrypted data output, it means that the rotation was successful.

Let's calculate and save the hashsum of the ecnrypted file (which is located in `db/data_store/dGVzdGZpbGU=/data`) into a temporary file:

```
sha256sum db/data_store/dGVzdGZpbGU=/data > /tmp/1.sha
```

Perform rotation:

```
python docs/examples/python/hermes_client.py --id user2 --config=docs/examples/python/config.json --private_key user2.priv --doc testfile --rotate

# output:
rotated <testfile>
done
```

and calculate the hashsum again:

```
sha256sum db/data_store/dGVzdGZpbGU=/data > /tmp/2.sha
```

Using the `diff` comand, we'll see that the previous and the new hashsums are different:

```
diff /tmp/1.md5 /tmp/2.md5 
1c1
< 9baad30131be8b6beb4453b0ea3aeef1  db/data_store/dGVzdGZpbGU=/data
---
> c5425afdaf906e4eeec3a70923018e34  db/data_store/dGVzdGZpbGU=/data
```

If the `diff` command provides some text output, it means that the files (hashsums) we are comparing are different. Otherwise, there would be no text output. So the key and data rotation (its re-encryption using new encryption keys) was successful.

To make sure that the data stays the same, let's read the data (as `user3`) again:

```
docs/examples/python/hermes_client.py --id user3 --config=docs/examples/python/config.json --private_key user3.priv --doc testfile --read
```

The resulting data is unchanged. Rotation of keys and data worked as intended.

## Revoking permissions/access

To revoke the read permissions from `user3` (as `user2`), do the following:

```
python docs/examples/python/hermes_client.py --id user2 --config=docs/examples/python/config.json --private_key user2.priv --doc testfile --revoke_read --for_user=user3

# output:
revoked read access <testfile> for user <user3>
done
```

Attempting to read the data now as `user3` will predictably lead to an error:

```
python docs/examples/python/hermes_client.py --id user3 --config=docs/examples/python/config.json --private_key user3.priv --doc testfile --read

# output:
Traceback (most recent call last):
  File "hermes_client.py", line 110, in <module>
    print(mid_hermes.getBlock(args.doc_file_name.encode()))
hermes.error: MidHermes.getBlock error
```

Let's now have some fun and revoke access to the data from both `user3` *and* `user1`*: revoking access from* `user3`

```
python docs/examples/python/hermes_client.py --id user2 --config=docs/examples/python/config.json --private_key user2.priv --doc testfile --revoke_read --for_user=user3

# output:
revoked read access <testfile> for user <user3>
done
```

*revoking access from* `user1`*, the initial data owner*

```
python docs/examples/python/hermes_client.py --id user2 --config=docs/examples/python/config.json --private_key user2.priv --doc testfile --revoke_read --for_user=user1

# output:
revoked read access <testfile> for user <user1>
done
```

Now only the `user2` has the right to READ/UPDATE/etc. the data:

```
python docs/examples/python/hermes_client.py --id user2 --config=docs/examples/python/config.json --private_key user2.priv --doc testfile --read

# output:
('user 2 data\n', 'first-file')
done
```

## Deleting the record

Let's elegantly finish this transfer of rights to the data by deleting the record altogether (acting as `user2`):

```
python docs/examples/python/hermes_client.py --id user2 --config=docs/examples/python/config.json --private_key user2.priv --doc testfile --delete

# output:
deleted <testfile>
done
```

And now, let's make sure that the data is **gone indeed** — if it is, we'll see an error while trying to read it as `user2` (or any other user from this tutorial, for that matter):

```
python docs/examples/python/hermes_client.py --id user2 --config=docs/examples/python/config.json --private_key user2.priv --doc testfile --read

# output:
Traceback (most recent call last):
  File "hermes_client.py", line 110, in <module>
    print(mid_hermes.getBlock(args.doc_file_name.encode()))
hermes.error: MidHermes.getBlock error  
```

The `MidHermes.getBlock error` confirms that it's now impossible to get the block as it had been deleted. So the data is gone, deleted by `user2` who gained all the permissions.

# SUMMARY

As you can see, launching the storage entities for data, public and encryption keys for Hermes-core is easy, and the process of granting/revoking permissions (access) to the data between authorised users in Hermes-core is very straightforward and convenient.

We hope that this tutorial was fun and informative and that you now have gained enough understanding of how the things work with Hermes-core — and that now you’ll try using it or [build a Hermes-based app of your own](https://docs.cossacklabs.com/pages/documentation-hermes/#creating-your-own-hermes-based-app).

Similar tutorials are also available for the [C language](https://docs.cossacklabs.com/pages/c-tutorial-hermes/) and [Golang](https://docs.cossacklabs.com/pages/go-tutorial-hermes/).

