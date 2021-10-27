---
title: Searchable encryption
weight: 2
---

# Searchable encryption

Store data encrypted in database, yet keep the ability to run simple queries on encrypted fields without decrypting them. 

A trivial way of searching through rows with encrypted columns would require decrypting
all those columns and comparing decrypted values with what is being searched.
Obviously, this is quite inefficient as it requires one to iterate over the whole table.

Searchable encryption makes it much more efficient.

It makes AcraServer/AcraTranslator to generate a hash of data, to store this hash next to encrypted data and then to use it during search.

Current implementation uses hashes created by HMAC-SHA256 and **only finds columns with the values exactly the same as was searched**.

This means only queries like
```
SELECT ... FROM ... WHERE encrypted_column = "value"
```
will work, but not
```
SELECT ... FROM ... WHERE encrypted_column LIKE "prefix%"
```

Under the hood, AcraServer/AcraTranslator will calculate a hash of plaintext data (`blind index`), then actually encrypt the data into AcraStruct/AcraBlock, then return `"blind index|AcraStruct or AcraBlock"` envelope to store in a database. Thus, the actual plaintext data is strongly encrypted, searching is based on hashes.

Two components can provide searchable encryption functionality:

* AcraServer — transparent searchable encryption of fields marked as `searchable` for `INSERT` and `UPDATE` queries,
  calculating hash and searching by hash for `SELECT` queries, with per column configuration.
* AcraTranslator — provides gRPC and HTTP API calls to encrypt data field into searchable form, and to generate searchable hash from plaintext search query.


{{< hint info >}}
The fact that one can only search for exact value is the consequence of using secure hash function.
Such functions are very sensitive to the input and will return completely different result even
with the smallest change of input data (column value in our case).
{{< /hint >}}


<!--One more thing to take into account is that you can send AcraStructs instead of plaintext
in `SELECT` queries as well, AcraServer will decrypt them and search for decrypted value.-->

## AcraServer configuration

Searchable encryption can be configured for individual columns in `--encryptor_config_file`.

For example:

<!-- Config struct lives in encryptor/config/encryptionSettings.go -->
```yaml
schemas:
  - table: table_name
    columns:
      # ...
      - email

    encrypted:
      - column: email

        # In order to make column searchable,
        # simply set `searchable` property to `true`,
        # this feature is disabled by default
        searchable: true
```

Searchable encryption is supported for both [AcraStructs](/acra/acra-in-depth/data-structures/acrastruct) or [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock).

## Database configuration

There are also some considerations to take into account when configuring database column to be be both searchable and encrypted.
See [DB indexes](/acra/configuring-maintaining/optimizations/db_indexes#searchable-encryption/) page for more on that.

## AcraTranslator API

**TODO: put example of AcraTranslator requests to encrypt data searchably and to generate search hash.**


## Limitations

Acra Community Edition does offer core search functionality, which is sufficiently secure for usage in non-security-critical workloads. 

Acra Community Edition limitations in searchable encryption:

* Lack of bloom filters - current Acra Community Edition does not contain bloom-filter based improvements for both security and performance.
* Lack of rotating searchable encryption keys (not a very big problem unless you use searchable encryption really a lot).
* Lack of entropy management - Acra Community Edition allows you to generate search indexes as insecure as you want, without warning you. 
* Inability to store search hashes separate from ciphertext (coming eventually), so search in Acra Community Edition limits you to the databases that support functional indexes.
* Performance optimisations - the way data is fetched, stored and processed is as straightforward as possible, which has certain performance costs. 
* Lack of data normalization - in Acra Community Edition, data normalization duties are laid on database administrator / application developer, thus index efficiency is completely dependent on end-user. 

## Searchable encryption in Acra Enterprise Edition

[Acra Enterprise Edition](/acra/enterprise-edition/) features extended tooling to make use of searchable encryption in production environments with heavy security risks. 

This section will feature description of additional tooling of Acra Enterprise Edition version once updated documentation is finalized. 

