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
shared ECDH secret, generate ECDH keypair, etc). Based on this reason, AcraBlock is the default crypto envelope used by AcraServer.
