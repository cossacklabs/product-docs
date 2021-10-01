---
title: Key storing
bookCollapseSection: true
weight: 1
---

# Key management and key storage in general 

Key management with key storage is core component of Acra responsible for security guarantees. The whole cryptography 
used in Acra depends on key storage. Without great key management, even strong and correctly used cryptography can't 
guarantee safety for data.

Key management is a set of approaches and processes related to key storing, rotation, distribution, protection, 
compartmentalization. Acra provides tools and pushes the processes in key management in the secure way to cover all 
aspects of keys security and help to reach compliance in data security.

## Keys protection

Every private key that stored and used by Acra encrypted with [Secure Cell]({{< ref "/themis/crypto-theory/cryptosystems/secure-cell.md" >}})
that designed and responsible for secure storage. To encrypt all private keys Acra needs master key for symmetric cryptography
under the hood of Secure Cell. This master key may be passed to Acra in two ways:
* environment variable
* KMS
  Passing master key via environment variable as simple as possible. You can find example on our page
  [Necessary preparations]({{< ref "/acra/configuring-maintaining/general-configuration/necessary_prep.md" >}}).

KMS has a lot of implementations and providers. You can find which of them Acra supports on our
[KMS integration]({{< ref "/acra/configuring-maintaining/key-storing/kms.md" >}}) page.

## Key storage

Acra relies on a lot of keys that generated per user, per purposes. Also, they may be rotated and at the same time
may exist several keys for same purpose. This set of keys should be somewhere stored and support distributed access
to provide high performance and scalability. Acra supports several storages that may be used for key storage.
[Read more]({{< ref "/acra/configuring-maintaining/key-storing/kv-stores.md" >}}) about supported key storages.


## Key management

About tools related to key generation, rotation, backup you can read on our page about 
[key management]({{< ref "acra/keys/_index.md" >}}) with describing related tools.

## Compartmentalization

Acra uses distinct keys for each purpose and in such way provide compartmentalization of keys duty. 
More about it you can find on our [Inventory of Acra keys]({{< ref "/acra/keys/inventory.md" >}}) page.
