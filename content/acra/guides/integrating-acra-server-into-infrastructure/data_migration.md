---
title: Data migration
bookCollapseSection: true
weight: 3
---

# Data migration

How to prepare a database to work with AcraServer

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
