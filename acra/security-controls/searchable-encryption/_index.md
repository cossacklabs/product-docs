---
title: Searchable encryption
bookCollapseSection: true
---

# Searchable encryption

Search for database rows knowing exact value of encrypted columns.

A trivial way of searching through rows with encrypted columns would require decrypting
all those columns and comparing decrypted values with what is being searched.
Obviously, this is quite inefficient as it requires one to iterate over the whole table.

Searchable encryption makes it much more efficient.
It makes Acra store hash of data next to encrypted data and then uses it during search.
Current implementation is using SHA256-based HMACs and **only finds columns with the values exactly the same as was searched**.
This means only queries like
```
SELECT ... FROM ... WHERE encrypted_column = "value"
```
will work, but not
```
SELECT ... FROM ... WHERE encrypted_column LIKE "prefix%"
```

{{< hint info >}}
The fact that one can only search for exact value is the consequence of using secure hash function.
Such functions are very sensitive to the input and will return completely different result even
with the smallest change of input data (column value in our case).
{{< /hint >}}

## AcraServer configuration

In configuration file, passed by `--encryptor_config_file` flag, you can individually configure
searchable encryption for columns that are configured to be encrypted.
These options are accepted:

<!-- Config struct lives in encryptor/config/encryptionSettings.go -->
```yaml
schemas:
  - table: table_name
    encrypted:
      - column: searchable_encrypted_column_name

        # In order to make column searchable,
        # simply set `searchable` property to `true`,
        # this feature is disabled by default
        searchable: true
```

Searchable encryption supports
both [AcraStructs]({{ ref "/acra/acra-in-depth/data-structures/#acra-struct" }})
and [AcraBlocks]({{ ref "/acra/acra-in-depth/data-structures/#acra-block" }}).

## Database configuration

There are also some considerations to take into account when configuring database column to be be both searchable and encrypted.
See [DB indexes]({{< ref "/acra/configuring-maintaining/optimizations/db_indexes.md#searchable-encryption" >}}) page for more on that.
