---
title: AcraStructs vs AcraBlocks
weight: 3
---

# AcraStructs vs AcraBlocks

There are two different "crypto containers" AcraServer can use to store encrypted data in.
Then, these containers are stored in database and decrypted back by AcraServer when needed.

AcraStruct is the main crypto container for the client-side encryption.
AcraStructs use ephemeral asymmetric keys to enable applications to encrypt the data but never decrypt it –
the private key stays on the AcraServer which is the only one capable of decryption.

You can also configure AcraServer to re-encrypt AcraStructs (that were generated on app side).
This way, you can be sure that:
1) even if application used outdated (rotated) key, the data stored in database is encrypted with a fresh key
2) in case one gets access to database, he won't be able to find relation between encrypted data
   in application and any table row, as the re-encrypted data looks completely diferent

### Key wrapping

Both containers generate random symmetric data encryption key (DEK) and encrypt the data with it.
This key is then encrypted with another key, and here is the difference:
* AcraStruct uses asymmetric cryptography to encrypt DEK, one ephemeral keypair and public key
  for which Acra knows the private key, this private key will then be used to decrypt the data;
  this method is also a bit slower because of the usage of asymmetric cryptography
* AcraBlock uses one more symmetric layer to encrypt the DEK, the same key will be used for
  both encryption and decryption

### Key rotation (when you need re-encrypt data with a new key)

Both crypto containers have ability to re-encrypt DEK without touching the encrypted data.
However, AcraStruct will generally be slower because it has to perform more computation
to decrypt the DEK and encrypt it again with another ephemeral keypair.
As was mentioned above, this is because of asymmetric cryptography being used (need to compute
shared ECDH secret, generate ECDH keypair etc).

### Storage overhead (in addition to encrypted data length)
* `AcraStruct` adds about `189` extra bytes
* `AcraBlock` adds about `138` extra bytes

### Learn more

You can read more about these containers on their pages:
[AcraStruct]({{< ref "acra/acra-in-depth/data-structures/_index.md#acrastruct" >}}) and
[AcraBlock]({{< ref "acra/acra-in-depth/data-structures/_index.md#acrablock" >}}) respectively.
