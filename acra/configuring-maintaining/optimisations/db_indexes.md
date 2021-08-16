---
title: DB indexes
weight: 4
---

# DB indexes

Indexing right columns is very important for good database performance.
Apart from the fact that you should index columns (or their combinations) that are frequently used in query filters,
there are few things specific for Acra.

## Searchable encryption

When some column is configured to be "encrypted and searchable", AcraServer will store its value as `HMAC(value) + encrypt(value)`.
This `HMAC(value)` is the hash of value that is used during search of encrypted value (knowing the `value` exactly).
For this to be efficient, there should be a special index in database that indexes only **first 32 bytes** of encrypted-searchable column.
`32` because of the hash being used (SHA256).

In SQL the index would look something like
```sql
CREATE INDEX searchable_email ON users (SUBSTR(email, 0, 32))
```
where `users` is a table containing column `email` that is being used for searchable encryption.
