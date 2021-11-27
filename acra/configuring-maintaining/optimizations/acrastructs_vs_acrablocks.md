---
title: AcraStructs vs AcraBlocks
weight: 3
---

# AcraStructs vs AcraBlocks

Acra services support two types of cryptographic containers: [AcraStruct](/acra/acra-in-depth/data-structures/acrastruct/) and [AcraBlock](/acra/acra-in-depth/data-structures/acrablock/). Plaintext data is encrypted using one container or another. Then, encrypted data is stored in the database and decrypted back by AcraServer/AcraTranslator when needed.

Always prefer using AcraBlocks except when data is encrypted on client-side using AcraWriter. AcraStructs use asymmetric cryptography and are generally slower. 

Read more on [When use AcraBlocks and when AcraStructs](/acra/acra-in-depth/data-structures/#when-use-acrablocks-and-when-acrastructs).

### Storage overhead (in addition to encrypted data length)

* `AcraStruct` adds about `189` extra bytes
* `AcraBlock` adds about `138` extra bytes

### Key rotation (when you need re-encrypt data with a new key)

Both cryptographic containers have ability to re-encrypt DEK without touching the encrypted data.



However, AcraStruct will generally be slower because it has to perform more computations to decrypt the DEK and encrypt it again with another ephemeral keypair. As it was mentioned above, this is because of asymmetric cryptography being used (need to compute
shared ECDH secret, generate ECDH keypair, etc).


### AcraStruct re-encryption

AcraStruct is the main cryptographic container to encrypt data on the client-side. AcraStructs use ephemeral asymmetric keys to enable applications to encrypt the data but never decrypt it – the private key stays on the AcraServer/AcraTranslator which are the only ones capable of decryption.

You can configure AcraServer to re-encrypt AcraStructs that were generated on the application side.

This way, you can be sure that:

1) even if application used outdated (rotated) key, the data stored in database is encrypted with a fresh key
2) in case one gets access to database, he won't be able to find relation between encrypted data
   in application and any table row, as the re-encrypted data looks completely different
