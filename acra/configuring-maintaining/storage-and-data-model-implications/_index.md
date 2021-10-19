---
title: Storage and data model implications
bookCollapseSection: true
---

# Data storage

Based on which Acra components you use, the requirements may differ.

For example, you will most likely want to use AcraServer.
In this case, you are limited by DBMS that use [MySQL](https://dev.mysql.com/doc/internals/en/client-server-protocol.html)
or [PostgreSQL](https://www.postgresql.org/docs/current/protocol.html) wire protocols.
We regularly test MySQL, MariaDB, PostgreSQL to make sure AcraServer works properly with them.

On the other hand, there is AcraTranslator and it does not depend on storage you use.
It's just a side service that performs crypto operations and you are free to store encrypted data in
any other database (including embedded ones), in any key/value storage and so on.
The main requirement for a storage would be support of binary fields (value as array of bytes, blob, etc).
But even in this case you can, for example, base64 encode encrypted data and store it as a string.

# Type compatibility

When encrypting, Acra takes a bytestring and returns a bytestring.
So all the data you wanna protect should be transformed into a bytestring:
1) numbers should be transformed into a string representation\*
2) complex objects should be serialized into a text/binary string, so you got a choice
   between JSON, BSON, MessagePack and many other formats

\* — be aware that length of encrypted data is not protected, and knowing number of digits
could give some hint about value, even though it was encrypted;
to protect from such attacks you can, for example, make all numbers the same length by prepending zero digits
(like `%010d` for `printf`)

The responsibility of performing these kind of conversions will be on the application.

## One way to solve type problem

Instead of encrypting the data you want to protect,
you can use [tokenization]({{< ref "acra/security-controls/tokenization/_index.md" >}}).
In this case plaintext will be stored in a separate storage while the database will contain random unrelated values.
The storage is essentially a key/value database where `key` is the random value and `value` is the actual plaintext.
AcraServer is able to transparently perform the conversion (called tokenization and detokenization respectively).
AcraTranslator also supports this feature, making tokenization/detokenization process available as RPC methods.

This will help keeping column types as before, but the values won't be stored as plaintext anymore.
It's different from encryption, but you may find it useful as well.

# SQL relations

One of the advantages you get from SQL is the ability to specify many filers inside a query,
probably correlate one table field with another table's one.
But the fact that such fields could be encrypted and database does not have a clue about how to decrypt them brings some limitations.

For example, these queries will work:
```sql
-- Row insertion, with transparent encryption
INSERT INTO `records` (`number`, `string`, `encrypted_string`)
VALUES (1, "two", "secret three");

-- Update, filtering by non-encrypted columns,
-- `encrypted_string` will again be transparently encrypted
UPDATE `records` SET `encrypted_string`="something new"
WHERE `string`="two";

-- Select, using exact value of encrypted column
-- (with searchable encryption being enabled for it)
SELECT `number`, `string` FROM `records`
WHERE `encrypted_string`="secret three";

-- Similar to select, AcraServer will slightly modify the
-- request under the hood to make it work like you've expected
UPDATE `records` SET `string`="test"
WHERE `encrypted_string`="secret three";
```

While these won't:
```sql
-- Select, non-exact value, searchable encryption won't help
SELECT `number`, `string` FROM `records`
WHERE `encrypted_string` LIKE "secret %";

-- Use encrypted number in a filter, database still sees this
-- as a random byte array, not even a number (different types)
SELECT * FROM `records`
WHERE `encrypted_number` > 10;

-- Use tokenized number in a filter, this request will be performed but
-- since the tokenized value has no relation with the original number,
-- the results will be completely different from what you expected
SELECT * FROM `records`
WHERE `tokenized_number` > 10;
```
