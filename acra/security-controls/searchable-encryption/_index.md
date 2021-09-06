---
title: Searchable encryption
bookCollapseSection: true
---

# Searchable encryption

Search for database rows knowing exact value of their encrypted column.

Searchable encryption makes it possible to have column whose value is encrypted, but nevertheless,
you will be able to find it **if and only if you know its exact value**.
Even the smallest mismatch between searched and encrypted values will now work.

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
