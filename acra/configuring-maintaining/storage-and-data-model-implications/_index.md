---
title: Storage and data model implications
weight: 8
---

# Data storage

Based on which Acra components you use, the requirements may differ.

For example, you will most likely want to use AcraServer.
In this case, you are limited by DBMS that use [MySQL](https://dev.mysql.com/doc/internals/en/client-server-protocol.html)
or [PostgreSQL](https://www.postgresql.org/docs/current/protocol.html) wire protocols.
We regularly test MySQL, MariaDB, PostgreSQL to make sure AcraServer works properly with them.

On the other hand, there is AcraTranslator, and it does not depend on the storage type you use.
It's just a side service that performs crypto operations, and you are free to store encrypted data in
any other database (including embedded ones), in any key/value storage and so on.
The main requirement for a storage would be binary fields (value as array of bytes, blob, etc) supporting.
But even in this case you can, for example, base64 encode encrypted data and store it as a string.

## Type compatibility

When encrypting, Acra takes a bytestring and returns a bytestring.
So all the data that you want to protect should be transformed into a bytestring:
1) numbers should be transformed into a string representation\*
2) complex objects should be serialized into a text/binary string, so you got a choice
   between JSON, BSON, MessagePack and many other formats

\* — be aware that length of encrypted data is not protected, and knowing number of digits
could give some hint about value, even though it was encrypted;
to protect from such attacks you can, for example, make all numbers the same length by prepending zero digits
(like `%010d` for `printf`)

An application is responsible for performing mentioned conversions.

## One way to solve type problem

Instead of encrypting the data you want to protect,
you can use [tokenization](/acra/security-controls/tokenization/).
In this case plaintext will be stored in a separate storage while the database will contain random unrelated values.
The storage is essentially a key/value database where `key` is the random value and `value` is the actual plaintext.
AcraServer is able to transparently perform the conversion (called tokenization and de-tokenization respectively).
AcraTranslator also supports this feature, making tokenization/de-tokenization process available as RPC methods.

This will help keeping column types as before, but the values won't be stored as plaintext anymore.
It's different from encryption, but you may find it useful as well.

## SQL relations

One of the advantages you get from SQL is the ability to specify many filters inside a query,
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
```

While these won't:
```sql
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

## Search

The special case is search of an encrypted value stored in a database.
You will be able to find the row only if "searchable encryption" was enabled for the column you use,
and you search for the exact same value that was encrypted and stored in searched column.

What will work:
```sql
-- Select, using exact value of encrypted column
-- (with searchable encryption being enabled for it)
SELECT `number`, `string` FROM `records`
WHERE `encrypted_string`="secret three";

-- Similar to select, AcraServer will slightly modify the
-- request under the hood to make it work like you've expected
UPDATE `records` SET `string`="test"
WHERE `encrypted_string`="secret three";
```

And what will not:
```sql
-- Select, non-exact value, searchable encryption won't help
SELECT `number`, `string` FROM `records`
WHERE `encrypted_string` LIKE "secret %";
```

## Tokenization

[Tokenization](/acra/security-controls/tokenization/) is a feature that stores random number/text/email in the database,
while the actual number/text/email that corresponds to random value is stored in a separate place,
only available for AcraServer and/or AcraTranslator that will perform the conversion.

Not a big problem if you have only one instance of AcraServer or AcraTranslator, but if you have both of them,
or at least two AcraServers/AcraTranslators, things get more complex and for proper tokenization functionality
you will need dedicated K/V database (such as Redis) for tokens available for all services that perform tokenization/detokenization.
