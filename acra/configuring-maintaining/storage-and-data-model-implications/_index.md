---
title: Storage and data model implications
bookCollapseSection: true
---

# Data storage

Based on which Acra components you use, the requirements may differ.

For example, you will most likely want to use AcraServer.
In this case, you are limited by supported DBMS, which are MySQL, MariaDB, PostgreSQL.

On the other hand, there is AcraTranslator and it does not depend on storage you use.
It's just a side service that performs crypto operations and you are free to store encrypted data in
any other database (including embedded ones), in any key/value storage and so on.
The main requirement for a storage would be support of binary fields (value as array of bytes, blob, etc).
But even in this case you can, for example, base64 encode encrypted data and store it as a string.

# Type compatibility

When encrypting, Acra takes a bytestring and returns a bytestring.
So all the data you wanna protect should be transformed into a bytestring:
1) text strings can be taken "as is"
2) numbers should be transformed into a string representation\*, then see #1
3) complex objects should be serialized into a text/binary string, so you got a choice
   between JSON, BSON, MessagePack and many other formats

\* — be aware that length of encrypted data is not protected, and knowing number of digits
could give some hint about value, even though it was encrypted;
to protect from such attacks you can, for example, make all numbers the same length by prepending zero digits
(like `%010d` for `printf`)

The responsibility of performing these kind of conversions will be on the application.

## One way to solve type problem

Instead of making everything you wanna encrypt a byte string,
you can use [tokenization]({{< ref "acra/security-controls/tokenization/_index.md" >}}).
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
```

While these won't:
```sql
-- For the database, `encrypted_string` is not "secret three",
-- but some completely different array of bytes
UPDATE `records` SET `string`="test"
WHERE `encrypted_string`="secret three";

-- Select, non-exact value, searchable encryption won't help
SELECT `number`, `string` FROM `records`
WHERE `encrypted_string` LIKE "secret %";

-- Use encrypted number in a filter, database still sees this
-- as a random byte array, not even a number (different types)
SELECT * FROM `records`
WHERE `encrypted_number` > 10;
```
