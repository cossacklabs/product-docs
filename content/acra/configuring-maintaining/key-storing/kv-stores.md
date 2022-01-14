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

#### Example

One of the easiest ways to launch a Redis instance is to use Docker.
Examples below only illustrate how Acra would interact with Redis,
the actual configuration (including TLS, authentication, networking) is up to you.

In one console you run `docker run --net=host -it redis:6`, then in another

```
# All the commands below use Keystore v1

# Generate a new master key (or use existing one)
$ acra-keys generate --keystore=v1 --master_key_path /tmp/key
$ export ACRA_MASTER_KEY="$(cat /tmp/key | base64)"
$ echo "$ACRA_MASTER_KEY"
dhczcKb9icej9rz6xlEG51Kri4BUolg3Lg4MCctTB00=

# Generate encryption keys and store them in Redis
# acrawriter — for AcraStructs
# symmetric_storage — for AcraBlocks
$ acra-keymaker \
    --keystore=v1 \
    --client_id=user1 \
    --generate_acrawriter_keys \
    --generate_symmetric_storage_key \
    --redis_host_port=127.0.0.1:6379
INFO[0000] Initializing ACRA_MASTER_KEY loader...
INFO[0000] Initialized default env ACRA_MASTER_KEY loader
Generated storage encryption keypair
Generated storage symmetric key for clientID

# Alternative way to generate a key, with `acra-keys generate`;
# here we create a zone and an associated key
$ acra-keys generate \
    --keystore=v1 \
    --client_id=user1 \
    --zone \
    --redis_host_port=127.0.0.1:6379
INFO[0000] Initializing ACRA_MASTER_KEY loader...
INFO[0000] Initialized default env ACRA_MASTER_KEY loader
{"id":"DDDDDDDDfzhMeyiZaAxBoWcl","public_key":"VUVDMgAAAC2tr5pqA2Xq9quGTq8kOGNjfwoPHiLgebVIn2aeTW9qowiVVM3G"}
INFO[0000] Generated new Acra zone

# Make sure they appear in Redis
$ redis-cli --scan --pattern '*'
".acrakeys/user1_storage"
".acrakeys/DDDDDDDDfzhMeyiZaAxBoWcl_zone.pub"
".acrakeys/user1_storage_sym"
".acrakeys/DDDDDDDDfzhMeyiZaAxBoWcl_zone"
".acrakeys/user1_storage.pub"

# Read recently created keys
$ acra-keys read \
    --public \
    --redis_host_port=127.0.0.1:6379 \
    client/user1/storage \
    | hexdump -C
INFO[0000] Initializing ACRA_MASTER_KEY loader...
INFO[0000] Initialized default env ACRA_MASTER_KEY loader
00000000  55 45 43 32 00 00 00 2d  23 91 d0 96 02 5c 32 00  |UEC2...-#....\2.|
00000010  71 75 e7 71 2e b1 71 21  97 1f c6 04 da ed d8 bb  |qu.q..q!........|
00000020  e5 d9 63 c0 e2 4d 8a d8  bc a5 4c 74 1b           |..c..M....Lt.|
0000002d
$ ./acra-keys read \
    --private \
    --redis_host_port=127.0.0.1:6379 \
    zone/DDDDDDDDfzhMeyiZaAxBoWcl/storage \
    | hexdump -C
INFO[0000] Initializing ACRA_MASTER_KEY loader...
INFO[0000] Initialized default env ACRA_MASTER_KEY loader
00000000  52 45 43 32 00 00 00 2d  df 0b d9 7b 00 c9 f4 a1  |REC2...-...{....|
00000010  80 54 20 b9 fd 38 d1 57  2f 26 c2 94 32 0d 5e 5d  |.T ..8.W/&..2.^]|
00000020  29 da 9c 5f a5 0e 95 b1  ad 6c 8f ef ff           |).._.....l...|
0000002d
```

That's how you generate data encryption keys and store them in Redis at the same time.
Don't forget about other `--redis_*` flags that can be used to configure credentials and/or database number.

On the side of AcraServer or AcraTranslator, you use the same flags to make them pull keys from Redis instead of filesystem by default.

### BoltDB

Alternative storage for tokenization (cannot be used to store keys).
Single-file embedded database.
Enabled with `--token_db` flag.
Scales well, has logarithmic access time complexity, allows multiple reads or single write at the same time.

### Files

Default keystore, configured with `--keys_dir` flag.
Although you can use some additional service to sync keys' directory from somewhere, this method is not that flexible.
You may want to use filesystem keystore if the amount of keys is small, and they are not added/rotated often.

### In-memory

Alternative storage for tokenization (cannot be used to store keys).
Stores all token/plaintext pairs in process memory (and forgets everything after process exit).
Default storage for tokenization if not configured otherwise.
