---
weight: 5
title:  Where we use Themis
---

# Where we use Themis

## Cryptographic backend for Acra

[**Acra** is a database protection suite](https://cossacklabs.com/acra)
that provides numerous functions, like transparent data encryption,
tokenization, search in encrypted data, SQL firewall, etc.
Themis does cryptographic operations for Acra.

Acra is used in protecting data in SQL and NoSQL backends
for companies that work in critical infrastructure, payments processing,
e-commerce, healthcare, and software development.

## Protection of our own web backend

Of course we eat our own dog food too!

We are using Themis on our own web resources to provide encryption
for the contact information belonging to our subscribers:
their names, email addresses, company names, and the "interested in" checkbox responses.
Some infrastructure is protected by [Themis](https://cossacklabs.com/themis) directly,
the data is protected by [Acra](https://cossacklabs.com/acra) (which uses Themis).
