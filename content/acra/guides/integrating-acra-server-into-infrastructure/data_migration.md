---
title: Data migration
bookCollapseSection: true
weight: 3
---

# Data migration

How to prepare a database to work with AcraServer.

## Data migration strategies in general

Any data migration strategies have two main steps: (1) migrate data schema and (2) encrypt existing data.

Schema migration includes changing column's types to `binary` (`bytea`/`blob`) for using data encryption via Acra (not required for tokenization).

There are several approaches for **schema migration**:

- A. Stop application and producing data, change column's types with ALTER TABLE, resume the application.
- B. Create neighbour column “neighbour_column_name" with required column type, migrate here all existing data with type converting, lock database and switch columns with each other. Rename “column_name" to “_column_name" and “neighbour_column_name" to “column_name".
- C. Create new database with required schema, migrate current data with type converting, lock the current database and migrate the remaining data. Switch to a new database.

**Encrypting the existing data**:

- A. Write script that will query data from database and then pass them through Acra via UPDATE command. Acra will change plaintext in UPDATE command with ciphertext transparently. 
- B. Write a script that queries data from the database, encrypts it using AcraTranslator Bulk API and saves encrypted data to the database. It will require temporary launching AcraTranslator instance, and destroying it after migration.
- C. [Acra EE only](/acra/enterprise-edition/) Use [acra-rotate utility](/acra/configuring-maintaining/general-configuration/acra-rotate/), write a script that iterates over all tables that need encryption, and passes `SELECT` query that fetches plaintext and `UPDATE` query that replaces the same data in the table with encrypted. AcraRotate will query plaintext data, encrypt it and use `UPDATE` query to save it in database.

Each approach has its pros and cons: more/less downtime, more/less app changes, more/less duplicated storage volume, more/less preparations.

## Binary columns

Although in most cases data stored in a database is either a string or a number,
encrypted data is always a randomly looking array of bytes.
So, all the columns that will be used to store encrypted data should be transformed into binary ones
(types like `bytea`, `BLOB`, `VARBINARY`, depending on which database you are using).
Numbers should be transformed to strings so that they can be encrypted like a text.

One more thing to take into account is that encryption has a storage overhead.
Limiting column size to the length of data you will encrypt and store there will likely cause data corruption.
[Here](/acra/configuring-maintaining/optimizations/acrastructs_vs_acrablocks#storage-overhead-in-addition-to-encrypted-data-length/)
you can see rough estimations.

The number of extra bytes may vary depending on multiple factors:
* which [crypto envelope](/acra/acra-in-depth/data-structures/) is used (AcraStruct or AcraBlock)
* which [storage model](/acra/acra-in-depth/data-structures/storage-models/)
  is used (InjectedCell may have even larger overhead if multiple encrypted pieces are concatenated in a single column)
