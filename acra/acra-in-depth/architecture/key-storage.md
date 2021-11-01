---
title: Key storage
bookCollapseSection: true
weight: 4
---

# Key storage and KMS

AcraServer, AcraTranslator and AnyProxy require to access encryption keys. For example, if you place Acra Master Key to KMS, AcraServer should know how to connect to the KMS. Or for syncing intermediate keys (useful when you have a cluster of AcraServers/AcraTranslator) Acra can put them into Redis.

Refer to [Configurting and maintaining](/acra/configuring-maintaining/key-storing/) to learn more about supported key stores and KMS.


## Key storage

### How it works

Acra needs a place for storing intermediate keys (intermediate keys used for all the encryption, masking, tokenization, crypto-signed audit logging and so on). All these keys are encrypted with the Acra Master Key, so it’s OK to store them in some storage available for many hosts. Managing keys becomes harder as the number of them increases, that’s why you may want to find the best key storage for your purposes.

Acra supports several options: FS-storage, in-memory BoltDB or Redis.

Refer to [Configuring and maintaining](/acra/configuring-maintaining/key-storing/kv-stores/) to learn more about supported key storages and how to enable them.

We recommend deploying a dedicated Redis database as key storage and token storage, and configure AcraServer, AcraTranslator, AnyProxy to connect to it and use it.

When AcraServer/AcraTranslator/AnyProxy need a key, they ask key storage for it. Each key has its purpose (transport, encryption, audit log, HMAC) and is bound to a specific client ID or zone. Read more about [key management](/acra/security-controls/key-management/).

AcraServer and AcraTranslator will require key storage for tokenization. When [tokenization](/acra/security-controls/tokenization/) is performed, the key storage will contain data needed for consistent tokenization (return same result for same input next time) and for detokenization (reverse operation).

### Functional requirements

* External encrypted key storage (Redis) is more flexible than filesystem-based key storage
* External storage (Redis) for tokens is more scalable and stable than an in-memory store


### Non-functional requirements

* External key/token storage is easier to use and sync keys across all Acra instances.

### How it connects to other parts

Components like AcraServer and AcraTranslator can connect to key storage database to read keys, read/write tokenization data.

### Architectural considerations

If you already use Redis for some purposes, it is not recommended to use it for key storage too.
Instead, hosting new instance on a separate machine will provide better security guarantees.

---

## KMS

Is used to store Acra Master Key. While KMS can be used to store all the intermediate keys, we strongly don't recommends it, as it might be quite expensive and might become performance bottleneck.

As Acra stores all intermediate keys encrypted, it needs Acra Master Key to decrypt them. 

### How it works

Most Acra tools, like AcraServer, AcraTranslator and AnyProxy can read Acra Master Key from environment variable, but they can read it from KMS as well.

Right now we support HashiCorp Vault for this purposes. Other KMS are supported in [Acra Enterprise Edition](/acra/enterprise-edition/).

Refer to [Configuring and maintaining](/acra/configuring-maintaining/key-storing/kms/) to learn more about supported KMS and how to configure connection.


### Functional requirements

* Secure storage of Acra Master Key


### How it connects to other parts

AcraServer, AcraTranslator and AnyProxy can read Acra Master Key from KMS.


### Security considerations

If you want to use KMS for master key storage/distribution, you already know that it is quite important
to ensure that the KMS is properly configured, well isolated and there are policies that limit what clients can request.

You can, for example, limit who can read Acra Master Key to only machines that actually need it.

We strongly recommend considering backup of Acra Master Key, configuring audit logging on KMS side, and deploying KMS as a cluster (scaling in mind).

