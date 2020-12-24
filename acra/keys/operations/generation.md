---
weight: 1
title: Key generation
bookCollapseSection: true
---

# Key generation

During the inital setup of Acra you will need to generate new keys for all components involved.
The procedure is performed in three steps:

  1. Generate AcraServer or AcraTranslator keys.
  2. Generate AcraConnector keys.
  3. Exchange public keys between components.

## Master keys

Acra uses many keys and most of them are private and thus stored in encrypted form.
There are very special **master keys** that are used by each Acra component to decrypt private keys as necessary.
Look after the master keys very carefully!
If you lose them, all your data is gone.

{{< hint info >}}
**Note:**
Due to security reasons,
AcraServer, AcraTranslator, and AcraConnector all need to have *different* master keys.
{{< /hint >}}

Current keystore version 1 uses one master key called `ACRA_MASTER_KEY`.
It is used only to encrypt the stored private keys.

New keystore version 2 uses two distinct master keys:
one is used to encrypt private key material,
the other one is used to sign public keystore data.
Both of them are still encoded as a single `ACRA_MASTER_KEY` value.

## 1. Setting up AcraServer

Keys for AcraTranslator are generated in the same fashion as for AcraServer.

### 1.1. Generating master keys

Use `acra-keymaker` utility to generate a new master key and save it into a file.
By default, Acra components retrieve master keys from environment variables as base64-encoded strings.
[Acra Enterprise Edition](https://www.cossacklabs.com/acra/#pricing) supports more options,
such as hardware security modules (HSM) and key management services (KMS).

Generate a new key and assign it to the environment variable on the corresponding server:

```shell
acra-keymaker --keystore=v1 --generate_master_key=master.key

export ACRA_MASTER_KEY=$(cat master.key | base64)
```

With keystore version 2 you will need to use `acra-keymaker --keystore=v2`.

{{< hint info >}}
**Note:**
If you are using Acra 0.85 or earlier,
please omit the `--keystore` parameter here and onward.
{{< /hint >}}

### 1.2. Generating transport and encryption keys

After you set up the master keys,
all private keys generated by `acra-keymaker` will be encrypted before they are written to disk.

Now, let’s generate keypairs for Acra’s components:

```shell
acra-keymaker --keystore=v1 --client_id=Alice --generate_acraserver_keys
acra-keymaker --keystore=v1 --client_id=Alice --generate_acratranslator_keys
acra-keymaker --keystore=v1 --client_id=Alice --generate_acrawriter_keys
acra-keymaker --keystore=v1 --client_id=Alice --generate_acrawebconfig_keys
```

Carry out these operations on the machine running AcraServer or AcraTranslator
to make sure that the private keys for Acra never leak outside from the server.

`acra-keymaker` will generate and place the resulting keys into the `.acrakeys` directory
(you can change the name with the `--keys_output_dir` option):

```
.acrakeys
├── auth_key
├── Alice_server
├── Alice_server.pub
├── Alice_storage
├── Alice_storage.pub
├── Alice_translator
└── Alice_translator.pub
```

{{< hint info >}}
**Note:**
Stored keys should not be world-readable.
`acra-keymaker` creates keys with proper access permissions:

- `rwx------` (700) for `.acrakeys` directory
- `rw-------` (600) for private key files

AcraServer and AcraTranslator check this and will refuse to launch if access to the keys is not properly restricted.
{{< /hint >}}

If you are running Acra 0.86+ and wish to try the new [keystore version 2](../versions/),
use `--keystore=v2` option when generating the keys:

```shell
acra-keymaker --keystore=v2 --client_id=Alice --generate_acraserver_keys
acra-keymaker --keystore=v2 --client_id=Alice --generate_acratranslator_keys
acra-keymaker --keystore=v2 --client_id=Alice --generate_acrawriter_keys
acra-keymaker --keystore=v2 --client_id=Alice --generate_acrawebconfig_keys
```

In this case the directory layout will be a bit different:

```
.acrakeys
├── authentication.keyring
├── client
│   └── Alice
│       ├── storage.keyring
│       └── transport
│           ├── server.keyring
│           └── translator.keyring
└── version
```

## 2. Setting up AcraConnector

### 2.1. Generating master keys

Generate a second set of master keys for AcraConnector in the same way,
but on the server that runs AcraConnector:

```shell
acra-keymaker --keystore=v1 --generate_master_key=master.key

export ACRA_MASTER_KEY=$(cat master.key | base64)
```

(Or with `--keystore=v2` to set up for keystore version 2.)

{{< hint info >}}
**Note:**
If you are using Acra 0.85 or earlier,
please omit the `--keystore` parameter here and onward.
{{< /hint >}}

### 2.2. Generating transport keys

Similarly, generate transport key for AcraConnector:

```shell
acra-keymaker --keystore=v1 --client_id=Alice --generate_acraconnector_keys
```

Carry out this operation on the machine running AcraConnector to make sure that the private key of AcraConnector never leaks outside it.

`acra-keymaker` will generate and place 2 keys into the `.acrakeys` directory
(you can change the name with the `--keys_output_dir` option):

```
.acrakeys
├── Alice
└── Alice.pub
```

{{< hint info >}}
**Note:**
Stored keys should not be world-readable.
`acra-keymaker` creates keys with proper access permissions:

- `rwx------` (700) for `.acrakeys` directory
- `rw-------` (600) for private key files

AcraConnector checks this and will refuse to launch if access to the keys is not properly restricted.
{{< /hint >}}

If you are running Acra 0.86+ and wish to try the new [keystore version 2](../versions/),
use `--keystore=v2` option when generating the keys:

```shell
acra-keymaker --keystore=v2 --client_id=Alice --generate_acraconnector_keys
```

In this case the resulting directory layout will be a bit different:

```
.acrakeys
├── client
│   └── Alice
│       └── transport
│           └── connector.keyring
└── version
```

## 3. Exchanging public keys

Components that need to communicate should have each other's public key.
This allows the components to authenticate each other when establishing a Secure Session.
AcraWriter also needs the public storage key generated by AcraServer or AcraTranslator
to encrypt the user data for storage.

The rules of key exchange are simple:

  - private keys should stay where they were generated
  - public keys should be shared with the peers which need to communicate

### Exporting and importing keys

<!--
TODO: How about teaching "acra-keys import" and "acra-keys export" to work with keystore v1?
That way you will need to explain this only once.
-->

Key exchange process is a bit different for current keystore version 1 and the new version 2.

With keystore version 1 you simply copy a file with `*.pub` extension from `.acrakeys` directory.
For example, `.acrakeys/Alice_server.pub` is a public key of the client `Alice` on AcraServer,
this file needs to be copied to corresponding `.acrakeys` directory of AcraConnector.

Keystore version 2 makes this process more secure
by ensuring that the key file cannot be tampered while en route between the server.
First, the public key has to be _exported_ from AcraServer:

```shell
acra-keys export --key_bundle_file "encrypted-keys.dat" \
                 --key_bundle_secret "access-keys.json" \
    client/Alice/transport/server
```

then `encrypted-keys.dat` and `access-keys.json` files should be transferred by separate channels to AcraConnector
where they are combined to import the key into the keystore:

```shell
acra-keys import --key_bundle_file "encrypted-keys.dat" \
                 --key_bundle_secret "access-keys.json"
```

{{< hint warning >}}
**Note:**
It is not possible to transfer keys of keystore version 2 by simple copying.
The public key data is signed with a different key and will not be accepted.
{{< /hint >}}

### 3.1. AcraConnector and AcraServer

Place public key of AcraServer on AcraConnector and place public key of AcraConnector on AcraServer.

| Component | should contain key | named like this |
| --------- | ------------------ | --------------- |
| AcraConnector | transport public key of AcraServer     | `.acrakeys/Alice_server.pub` |
| AcraConnector | transport private key of AcraConnector | `.acrakeys/Alice` |
| AcraServer    | transport public key of AcraConnector  | `.acrakeys/Alice.pub` |
| AcraServer    | transport private key of AcraServer    | `.acrakeys/Alice_server` |

With keystore version 2 you need to export the following keys:

```shell
# On AcraServer
acra-keys export --key_bundle_file "server-encrypted-keys.dat" \
                 --key_bundle_secret "server-access-keys.json" \
    client/Alice/transport/server

# On AcraConnector
acra-keys export --key_bundle_file "connector-encrypted-keys.dat" \
                 --key_bundle_secret "connector-access-keys.json" \
    client/Alice/transport/connector

# On AcraServer
acra-keys import --key_bundle_file "connector-encrypted-keys.dat" \
                 --key_bundle_secret "connector-access-keys.json"

# On AcraConnector
acra-keys import --key_bundle_file "server-encrypted-keys.dat" \
                 --key_bundle_secret "server-access-keys.json"
```

### 3.2. AcraConnector and AcraTranslator

Place public key of AcraTranslator on AcraConnector and public key of AcraConnector on AcraTranslator.

| Component | should contain key | named like this |
| --------- | ------------------ | --------------- |
| AcraConnector  | transport public key of AcraTranslator  | `.acrakeys/Alice_translator.pub` |
| AcraConnector  | transport private key of AcraConnector  | `.acrakeys/Alice` |
| AcraTranslator | transport public key of AcraConnector   | `.acrakeys/Alice.pub` |
| AcraTranslator | transport private key of AcraTranslator | `.acrakeys/Alice_translator` |

With keystore version 2 you need to export the following keys:

```shell
# On AcraTranslator
acra-keys export --key_bundle_file "translator-encrypted-keys.dat" \
                 --key_bundle_secret "translator-access-keys.json" \
    client/Alice/transport/translator

# On AcraConnector
acra-keys export --key_bundle_file "connector-encrypted-keys.dat" \
                 --key_bundle_secret "connector-access-keys.json" \
    client/Alice/transport/connector

# On AcraTranslator
acra-keys import --key_bundle_file "connector-encrypted-keys.dat" \
                 --key_bundle_secret "connector-access-keys.json"

# On AcraConnector
acra-keys import --key_bundle_file "translator-encrypted-keys.dat" \
                 --key_bundle_secret "translator-access-keys.json"
```

### 3.3. AcraWriter and AcraServer or AcraTranslator

Place public key of AcraServer or AcraTranslator to AcraWriter.

| Component | should contain key | named like this |
| --------- | ------------------ | --------------- |
| AcraWriter     | storage public key  | `.acrakeys/Alice_storage.pub` |
| AcraServer     | storage private key | `.acrakeys/Alice_storage` |
| AcraTranslator | storage private key | `.acrakeys/Alice_storage` |

With keystore version 2 you need to export the following keys:

```shell
# On AcraServer or AcraTranslator
acra-keys export --key_bundle_file "encrypted-keys.dat" \
                 --key_bundle_secret "access-keys.json" \
    client/Alice/storage

# On AcraWriter
acra-keys import --key_bundle_file "encrypted-keys.dat" \
                 --key_bundle_secret "access-keys.json"
```

If you need to access the public key in plain for AcraWriter,
use `acra-keys read`:

```shell
acra-keys read --client_id=Alice storage-public > public-key.dat
```

### Exchanging zone keys

Generating zone keys is different from generating usual AcraStruct encryption keys.
You should run `acra-addzone` on AcraServer or AcraTranslator to generate a zone:

```shell
acra-addzone
```

This creates a new zone and you get a JSON object like this:

```
{"id":"DDDDDDDDQHpbUSOgYTzqCktp","public_key":"VUVDMgAAAC3yMBGsAmK/wBXZkL8iBv/C+7hqoQtSZpYoi4fZYMafkJbWe2dL"}
```

AcraWriter will need both the zone ID (returned as is) and the public key (returned in base64)
to generate AcraStructs for the new zone.

Zone keys are placed into the keystore too:

| Component | should contain key | named like this |
| --------- | ------------------ | --------------- |
| AcraWriter     | zone public key  | `.acrakeys/DDDDDDDDQHpbUSOgYTzqCktp_zone.pub` |
| AcraServer     | zone private key | `.acrakeys/DDDDDDDDQHpbUSOgYTzqCktp_zone` |
| AcraTranslator | zone private key | `.acrakeys/DDDDDDDDQHpbUSOgYTzqCktp_zone` |

With keystore version 2 you can import and export zone keys too:

```shell
# On AcraServer or AcraTranslator
acra-keys export --key_bundle_file "encrypted-keys.dat" \
                 --key_bundle_secret "access-keys.json" \
    zone/DDDDDDDDQHpbUSOgYTzqCktp/storage

# On AcraWriter
acra-keys import --key_bundle_file "encrypted-keys.dat" \
                 --key_bundle_secret "access-keys.json"
```

Read more about using zones in the [AcraWriter guide](https://docs.cossacklabs.com/pages/documentation-acra/#acraconnector-and-acrawriter#writing).