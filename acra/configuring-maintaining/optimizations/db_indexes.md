---
title: DB indexes
weight: 4
---

# DB indexes

Indexing the right columns is very important for good database performance.
Apart from the fact that you should index columns (or their combinations) that are frequently used in query filters,
there are few things specific for Acra.

## Searchable encryption

When a column is configured to be "encrypted and searchable", AcraServer will store its value as `HMAC(data) + encrypt(data)`.
This `HMAC(data)` is a hash that actually gets searched for by the database, instead of the encrypted data which can only be decrypted by AcraServer.
For this search to be efficient, there should be a special index in the database that indexes only **the first 32 bytes** of encrypted-searchable column.
`32` is the output length of the hash function used by Acra (HMAC-SHA-256).

In PostgreSQL the index would look something like
```sql
CREATE INDEX searchable_email ON users (SUBSTR(email, 1, 33))
```
where `users` is a table containing column `email` that is being used for searchable encryption.

Also, please note that creating indexes for non-searchable encrypted columns won't give any benefit.
For database, they are just arrays of pseudo-random bytes, with no relation to a value being searched.
It will even slow down database a bit as it will have to update index on insert/update.
