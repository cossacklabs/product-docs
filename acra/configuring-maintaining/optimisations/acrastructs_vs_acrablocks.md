---
title: AcraStructs vs AcraBlocks
weight: 3
---

# AcraStructs vs AcraBlocks

There are two different "crypto containers" AcraServer can use to store encrypted value in.
Then, these containers are stored in database and decrypted back by AcraServer when needed.

`AcraStruct` is the main crypto container for the client-side encryption.
Applications can encrypt with ephemeral asymmetric keys on their side with `AcraStruct`s,
but cannot do this with `AcraBlock`s because of symmetric key encryption.
You can also configure AcraServer to re-encrypt `AcraStruct`s (that were generated on app side)
on AcraServer side, this way data will definitely be encrypted while transmitted between
some client app and AcraServer.

### Encryption with a key

Both containers generate random symmetric data encryption key (DEK) and encrypt the data with it.
This key is then encrypted with another key, and here is the difference:
* `AcraStruct` uses asymmetric cryptography to encrypt DEK, one ephemeral keypair and public key
  for which Acra knows the private key, this private key will then be used to decrypt the data;
  this method is also a bit slower because of the usage of asymmetric cryptography
* `AcraBlock` uses one more symmetric layer to encrypt the DEK, the same key will be used for
  both encryption and decryption

### Key rotation (when you need re-encrypt data with a new key)

Both crypto containers have ability to re-encrypt DEK without touching the encrypted data.
However, `AcraStruct` will generally be slower because it has to perform more computation
to decrypt the DEK and encrypt it again with another ephemeral keypair.
As was mentioned above, this is because of asymmetric cryptography being used (need to compute
shared ECDH secret, generate ECDH keypair etc).

### Storage overhead (not counting encrypted data length)
* `AcraStruct` takes about `189` additional bytes
* `AcraBlock` takes about `138` additional bytes

### Learn more

You can read more about these containers on their pages:
[AcraStruct]({{< ref "acra/acra-in-depth/data-structures/_index.md#acrastruct" >}}) and
[AcraBlock]({{< ref "acra/acra-in-depth/data-structures/_index.md#acrablock" >}}) respectively.
