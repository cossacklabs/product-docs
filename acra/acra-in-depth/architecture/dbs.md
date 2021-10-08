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
When tokenization is performed, the key storage will contain data needed for reverse operation, detokenization.

## Which FRs/NFRs does it implement

_TODO_

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

_TODO_

## How it connects to other parts

_TODO_

## What are the security considerations? 

_TODO_

## What are architectural considerations? 

_TODO_
