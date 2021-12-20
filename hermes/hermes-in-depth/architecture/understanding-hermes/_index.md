---
weight: 1
title: Understanding Hermes
---

# Understanding Hermes

## Hermes model

{{< hint info >}}
Note: The following descriptions are aimed at helping you understand the general concept of Hermes.
{{< /hint >}}

The main goal of Hermes is to cryptographically enforce the data access control policy and to minimise the risks of compromisation of a single Hermes’ component (or a subset of such components). Such enforcements are achieved by:

* reducing the risk of potential damage from a security breach by distributing the components of Hermes;
* limiting/blocking the exposure to sensitive information for each component and in this way securing the perimeter of a potential security breach;
* relying on strong cryptography for proper access control to sensitive information rather than on organisational operational guidelines and proper software implementation and operation;
* using end-to-end encryption to protect communication channels between the components.

## Hermes process

Hermes achieves these security goals by defining cryptographic processes for: - creating new records; - reading records; - updating records; - deleting records; - granting access rights/permissions; - revoking access rights/permissions;

in such a way that Hermes-generated structure can be accessed only through a Hermes Client with corresponding keys (belonging to the users that have corresponding permissions).

By using these processes through high-level API and implementing certain wrappers for Hermes-core abstractions and our databases/PKIs/etc., consumer applications can secure their data using Hermes-based access control.

## Hermes entities

Typical implementations of Hermes include the following entities:

0) **Your application** that provides means for generating and displaying the data.

1) **Client(s)** (system users/services - referred to as `users` in the documentation): these are active entities in the architecture – the only ones that produce or consume the data. The users can be both real users or system processes, communicating with Hermes infrastructure via pre-defined API after presenting the keys.

2) **Data store**: a physical or logical unit for storage and distribution of secure data – for example, a relational database, a collection of documents, a filesystem. It is assumed that all protected data can be divided into pieces (or records). There are no restrictions imposed by Hermes on how to divide the data into records, it is up to the system user/service that creates the data to define and express this policy.

Hermes provides the ability to set individual access policy on a per-record basis. Data store only manipulates the encrypted data and does not have keys to decrypt it. However, the Data store execution environment is responsible for authorising record updates. This is done through storage and verification of a special Update Tag for each record.

{{< hint info >}}
Note: The smallest data entity recognised by Hermes-core is a record (sometimes called "block") that is not further divided into records. In Hermes, recordsets are divided into records or combined into groups/collections of various hierarchical levels.
{{< /hint >}}

3) **Keystore**: a physical or logical unit for storing data access control keys. It implements per-record data access control policy by storing and providing record READ/UPDATE keys. Keys are never processed in plain text and the Keystore itself doesn’t have any credentials that would allow obtaining the keys’ values. Instead, for each record, the Keystore has one or more copies of READ and UPDATE keys, where each copy is wrapped (encrypted with asymmetric ECDH-based scheme) with a public credential of the respective authorised client. It is assumed that UPDATE access implies READ access. The Keystore never denies key delivery to a respective user and always fetches the user’s key if it’s available. It’s expected that the user will unwrap the key using their private credentials before processing the actual data. The Keystore is populated by users upon distributing access control policy for the data they produce.

4) **Credential store**: a trusted source of user/service public credentials (and possible Keystore / Data store public credentials). Users use Credential store to wrap ACKs for specific users while distributing access control policy for their data. It’s expected that other entities communicate with the Credential store via authenticated channels.

You can read about Data store, Keystore, and Credential store in more details in [Abstract entities](https://docs.cossacklabs.com/pages/documentation-hermes/#abstract-entities).

The model of security for Hermes is described in [Security model](https://docs.cossacklabs.com/pages/documentation-hermes/#security-model).

For a deeper understanding of the concepts behind Hermes, read the scientific paper on Hermes - ["Hermes – a framework for cryptographically assured access control and data security"](https://www.cossacklabs.com/files/hermes-theory-paper-rev1.pdf).