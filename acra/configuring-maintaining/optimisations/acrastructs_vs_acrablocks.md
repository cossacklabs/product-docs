---
title: AcraStructs vs AcraBlocks
weight: 3
---

# AcraStructs vs AcraBlocks

There are two different "crypto containers" AcraServer can use to store encrypted value in.
Then, these containers are stored in database and decrypted back by AcraServer when needed.

History
* `AcraStruct` is our "old" one, though we're not going to remove it any time soon.
* `AcraBlock` on the other hand is new and proposes some extra features.

Encryption with a key
* `AcraStruct` uses key provided from somewhere outside (by Acra) to encrypt the value.
* `AcraBlock` uses random key to encrypt the value, then encrypts this key with another key, this time provided from outside.
  That first key is called DEK (data encryption key) and the second one is called KEK (key encryption key).

Key rotation (when you need re-encrypt data with a new key)
* With `AcraStruct`, the value has to be decrypted completely, then encrypted with a new key.
* With `AcraBlock`, only DEK should be re-encrypted, leaving the encrypted value the same.
  And this may have a big impact on performance when rotating keys for a large amount of encrypted data.

Storage overhead (not counting encrypted data length)
* `AcraStruct` takes about `189` additional bytes
* `AcraBlock` takes about `138` additional bytes

You can read more about them on their pages:
[AcraStruct]({{< ref "acra/acra-in-depth/data-structures/_index.md#acrastruct" >}}) and
[AcraBlock]({{< ref "acra/acra-in-depth/data-structures/_index.md#acrablock" >}}) respectively.
