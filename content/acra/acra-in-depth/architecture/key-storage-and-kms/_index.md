---
title: Key storage and KMS
bookCollapseSection: true
weight: 5
---

# Key storage and KMS

Key management with key storage is core component of Acra responsible for security guarantees. The whole cryptography 
used in Acra depends on key storage. Without great key management, even strong and correctly used cryptography can't 
guarantee safety for data.

Key management is a set of approaches and processes related to key storing, rotation, distribution, protection, 
compartmentalization. Acra provides tools and pushes the processes in key management in the secure way to cover all 
aspects of keys security and help to reach compliance in data security.


## Key management

Acra uses multiple keys. Each key has its unique purpose and in such way provide compartmentalization of keys duty. Acra provides tools to perform key generation, rotation, and backup.

Refer to [Security controls / Key management](/acra/security-controls/key-management/) to learn about different keys, their usage, and key management operations that Acra supports.


## KMS

Every key that Acra uses is encrypted by Acra Master Key, it can be read from KMS.

Refer to [KMS](/acra/acra-in-depth/architecture/key-storage-and-kms/kms/) to read about KMS flow.


## Key storage

[AcraServer](/acra/acra-in-depth/architecture/acraserver), [AcraTranslator](/acra/acra-in-depth/architecture/acratranslator/) and [AnyProxy](/acra/acra-in-depth/architecture/anyproxy/) require accessing encryption keys.

Acra relies on a lot of keys that generated per user, per purposes. Also, they may be rotated and at the same time
may exist several keys for same purpose. This set of keys should be stored somewhere and should support distributed access
to provide high performance and scalability. 

Acra supports several storages that may be used for key storage.

Refer to [Key storage](/acra/acra-in-depth/architecture/key-storage-and-kms/key-storage/) to read about supported key storages.

