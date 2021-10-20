---
title: Searchable encryption
bookCollapseSection: true
weight: 2
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

One more thing to take into account is that you can send AcraStructs instead of plaintext
in `SELECT` queries as well, AcraServer will decrypt them and search for decrypted value.

## AcraServer configuration

Searchable encryption can be configured for individual columns in `--encryptor_config_file`.
For example:

<!-- Config struct lives in encryptor/config/encryptionSettings.go -->
```yaml
schemas:
  - table: table_name
    columns:
      # ...
      - searchable_encrypted_column_name

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

## Limitations

Open Source (CE) version does offer core search functionality, which is sufficiently secure for usage in non-security-critical workloads. 

* Rotating searchable encryption keys (not a very big problem unless you use SE really a lot) 
* Entropy management - CE allows you to generate search indexes as insecure as you want, without warning you. 
* Ability to store search hashes separate from ciphertext (coming eventually), so search in CE limits you to databases that support functional indexes.
* Performance optimisations - the way data is fetched, stored and processed is as straightforward as possible, which has certain performance costs. 
* No data normalization - in open-source version, data normalization duties are laid on database administrator / application developer, thus index efficiency is completely dependent on end-user. 

# Searchable encryption EE

AcraEE features extended tooling to make use of searchable encryption in production environments with heavy security risks. This section will feature description of additional tooling of EE version once updated documentation is finalized. 

