---
title: Scalable KV storages
bookCollapseSection: true
weight: 3
---

# Scalable KV storages

All the keys are encrypted with the Acra Master Key, so it's OK to store them in some storage available for many hosts.
Managing keys becomes harder as the number of them increases, that's why you may want to find the best KV storage for your purposes.

Acra supports several options: Redis, BoltDB, FS-storage (files), and in-memory storage.

We recommend to start with "files" (keys are stored in files) and switch to Redis as soon as possible.

Refer to [Acra in depth / Key storage and KMS](/acra/acra-in-depth/architecture/key-storage-and-kms/) to learn more about general key storage requirements.

Refer to [Security controls / Key management](/acra/security-controls/key-management/) to learn how to generate encryption keys.


### Redis

Enabled with `--redis_*` flags (configure database address, credentials, choose the bucket).
Will work a bit slower compared to filesystem keystore, but is much more flexible
in terms that you will be able to manage all the keys from a single place.
To mitigate the performance penalty of "doing network requests to get each key" you may use in-memory cache of keys,
configured with `--keystore_cache_size` flag.

### BoltDB

Alternative storage for tokenization (cannot be used to store keys).
Single-file embedded database.
Enabled with `--token_db` flag.
Scales well, has logarithmic acess time complexity, allows multiple reads or single write at the same time.

### Files

Default keystore, configured with `--keys_dir` flag.
Although you can use some additional service to sync keys dir from somewhere, this method is not that flexible.
You may want to use filesystem keystore if the amount of keys is small and they are not added/rotated often.

### In-memory

Alternative storage for tokenization (cannot be used to store keys).
Stores all token/plaintext pairs in process memory (and forgets everything after process exit).
Default storage for tokenization if not configured otherwise.
