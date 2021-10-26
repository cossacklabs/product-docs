---
title: AnyProxy [ENTERPRISE]
bookCollapseSection: true
weight: 4
---

# AnyProxy

{{< hint info >}}
This feature is available in [Acra Enterprise Edition](/acra/enterprise-edition/) only.
{{< /hint>}}

AnyProxy is an API server that works between several API-driven microservices/applications. 

AnyProxy can transparently forward requests/responses so your applications stay "thin clients". AnyProxy works between several API-driven microservices/applications, and is, in fact, a remote API party for them.

The exact feature set of AnyProxy is defined by you and we shape it for you.

Refer to [Acra Enterprise Edition](/acra/enterprise-edition/) to learn how it can your data protected, your Ops relaxed, and your life better.


## What AnyProxy does

AnyProxy encapsulates other Acra's services. You want to encrypt data transparently for your app into MongoDB but AcraServer doens't support NoSQL databases? No worries, AnyProxy makes it possible. 

AnyProxy performs different [data protection operations](/acra/acra-in-depth/security-features/), like [encryption/decryption](/acra/security-controls/encryption), [searchable encryption](/acra/security-controls/searchable-encryption/), [masking/demasking](/acra/security-controls/masking/), [tokenization/detokenization](/acra/security-controls/tokenization/). 

It supports [intrusion detection](/acra/security-controls/intrusion-detection/), [programmatic reactions on security incidents](/acra/security-controls/security-logging-and-events/programmatic-reactions/), and provides full-on monitoring: [security logging & audit logging](/acra/security-controls/security-logging-and-events/), security events, metrics, traces, etc.

Refer to a [Acra security features](/acra/acra-in-depth/security-features/) to learn the full list.


## Dataflows

We outlined some examples of dataflows for AnyProxy and DAO in [the Dataflow](/acra/acra-in-depth/data-flow/#anyproxy) chapter.

For example, once we built AnyProxy for MongoDB: we wrote client-side SDK in JS for client app written on NodeJS. The client app just called AnyProxy SDK with encrypt/decrypt commands. SDK then connected to the AcraTranslator to perform operations, received encrypted data and stored it in the MongoDB.


## How it connects to other parts

AnyProxy connects to the same parts, as [AcraServer](/acra/acra-in-depth/architecture/acraserver/) and [AcraTranslator](/acra/acra-in-depth/architecture/acratranslator/).

The exact feature set of AnyProxy is defined by you and we shape it for you.

