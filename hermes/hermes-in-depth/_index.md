---
title: Hermes in depth
weight: 3
bookCollapseSection: true
---

# Hermes usage ideas

This documentation piece can be also subtitled as "Oh the Places You'll Go". The protection provided by Hermes enables developers to implement control mechanisms that limit the classic CRUD set of permissions on any arbitrary chunk of protected data (including with implementing arbitrary status flags, i.e. execution). It is done cryptographically, so no tampering with protected records changes their access rights.

When used correctly, Hermes allows slicing a single data structure into smaller parts and allowing different parties to access various parts of that data structure with different permissions. This significantly limits the attack surface and threat model on the data. What’s more important, no significant alteration of the infrastructure is necessary. The range of tools used by Hermes was built for complementing the existing relationship models, not for coming up with new ones. Built by expert cryptographers and software engineers, it combines strong security guarantees with an API that is easy to use.

#### What's so unique about Hermes

* Access control list (ACL) in Hermes is cryptographic.
* Hermes binds over (almost) any data structure.
* Hermes works with any network/server/client layout (to Hermes it all is just data).

Hermes represents a practical scheme that takes into account a number of important requirements:

* Presence of only strong end-to-end encryption between the entities;
* Provision of enforced security simultaneously with access policy distribution to data, compared to algorithmic ways and operational guidelines;
* Processing of sensitive data in plain text only in user’s context and storage of sensitive data on Server-side entities in encrypted form only.

When at least some of the aforementioned requirements are fulfilled, it significantly increases the security level of the system.

#### Some scenarios for using Hermes

A typical use-case for Hermes: an online medical service where the patients securely interact with the staff of multiple medical institutions. For example, a patient’s records contain a number of results for medical examinations. The patient’s personal physician needs to be able to access all of them, while the employees of the medical institutions need to be able to access only the latest results to adjust their activities towards the patient. Leaving access control management to a medical service opens up a risk of an accidental privilege misplacement or an intentional data leak. Being able to manage the access permissions only from trusted endpoints enables provable security for collaboration of such datasets.

**Enforcing access control cryptographically**

The access control distribution in Hermes is based on possession of cryptographic key and is much stronger than traditional operation guidelines and algorithmic mechanisms.

**Provision of controlled secure data sharing in an environment with limited trust to server**

Hermes allows using servers with limited trust level. A server is only used for storage of encrypted sensitive data.

#### Why Hermes does it better

1. Sensitive data is only ever processed in plain text within the client execution environment. Server-side components only operate with encrypted sensitive data;
2. Compromisation of a single server-side component causes only limited damage;
3. Hermes only uses end-to-end encryption with mutual authentication between the entities;
4. Hermes only uses well-examined, extremely secure cryptographic algorithms.

#### Strong cryptographic base

Hermes (and correspondingly, Hermes-core) is built on top of [Themis](https://github.com/cossacklabs/themis), which is a high-level cryptographic services library that allows you to protect data at rest (in your database, files or wherever you store them in your application) and data in motion (e.g. travelling between client and server, server and server, application and application, etc.).