---
title: Key storage
weight: 3
---

# Key storage

## Key storage's functionality

Acra needs a place for storing intermediate keys (intermediate keys used for all the encryption, masking, tokenization, crypto-signed audit logging and so on). All these keys are encrypted with the Acra Master Key, so it’s OK to store them in some storage available for many hosts. Managing keys becomes harder as the number of them increases, that’s why you may want to find the best key storage for your purposes.

Acra supports several options: Redis, BoltDB, FS-storage (files), and in-memory storage.

Refer to [Configuring and maintaining](/acra/configuring-maintaining/key-storing/kv-stores/) to learn more about supported key storages and how to enable them.

## Where & how

Acra uses key storage to store encrypted keys and tokens for [tokenization](/acra/security-controls/tokenization/) (if used).

| KV storage | Can store keys | Can store tokens |
| :--        | :--:           | :--:             |
| Redis      | ✓              | ✓                |
| BoltDB     |                | ✓                |
| Files      | ✓              |                  |
| In-memory  |                | ✓                |


We recommend to start with "files" (keys are stored in files) and switch to Redis as soon as possible.


## Functional requirements

* External encrypted key storage (Redis) is more flexible than filesystem-based key storage
* External storage (Redis) for tokens is more scalable and stable than an in-memory store

## Non-functional requirements

* External key/token storage is easier to use and sync keys across all Acra instances.

## Architectural considerations

If you already use Redis for some purposes, it is not recommended using it for key storage too.
Instead, hosting new instance on a separate machine will provide better security guarantees.

Key storage should be fast ~~and furious~~ and scalable for better throughput.


## Connection with other parts

We recommend deploying a dedicated Redis database as key storage and token storage, and configure AcraServer, AcraTranslator, AnyProxy to connect to it and use it.

When AcraServer/AcraTranslator/AnyProxy need a key, they ask key storage for it. Each key has its purpose (transport, encryption, audit log, HMAC) and is bound to a specific client ID or zone. Read more about [key management](/acra/security-controls/key-management/).

AcraServer and AcraTranslator will require key storage for tokenization. When [tokenization](/acra/security-controls/tokenization/) is performed, the key storage will contain data needed for consistent tokenization (return same result for same input next time) and for de-tokenization (reverse operation).
