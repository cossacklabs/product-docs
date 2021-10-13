---
title: DBs
bookCollapseSection: true
weight: 4
---

# Key storage

Is used to store encrypted keys and tokens.

## How it works

A dedicated database (we currently support Redis for this purpose) is brought up.
AcraServer and/or AcraTranslator are configured to connect to it and use it for key/token storage.

When AcraServer or AcraTranslator need a key for specific client ID or zone, they ask key storage for it.
When tokenization is performed, the key storage will contain data needed for consistent tokenization
(return same result for same input next time) and for detokenization (reverse operation).

## Which FRs/NFRs does it implement

* Encryption key storage (more flexible than filesystem key store)
* Tokenization data storage (more scalable and stable than an in-memory store)

---

* Works with a popular in-memory database (Redis)

## How it connects to other parts

Components like AcraServer and AcraTranslator can connect to key storage database to read keys, read/write tokenization data.

## What are architectural considerations?

If you already use Redis for some purposes, it is not recommended to use it for key storage too.
Instead, hosting new instance on a separate machine will provide better security guarantees.

# KMS

Is used to store master-password. Can be used to store all the keys, but might be quite expensive and might become performance bottleneck.

## How it works

Most Acra tools (including services like Server or Translator) can read master key from environment var.
But they can read it from KMS as well.
Right now we support HashiCort Vault for this purposes.

## Which FRs/NFRs does it implement

* Secure storage of master key

## How it connects to other parts

All Acra binaries that need master key for some purpose, may get it from KMS.

## What are the security considerations?

If you want to use KMS for master key storage/distribution, you already know that it is quite important
to ensure that the KMS is properly configured, well isolated and there are policies that limit what clients can request.
You can, for example, limit who can read master key to only machines that actually need it.

## What are architectural considerations?

_TODO_
