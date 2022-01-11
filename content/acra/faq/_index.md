---
title: Frequently asked questions
weight: 11
---

# Frequently asked questions

There are a number of concerns that do not fit other pages, yet are asked by our adopters and customers. Until they gather their logical representation in the menu, they stay in FAQ.

### I need Acra to work with `Feature Y` or `Database Z`. What should I do?

Acra has been designed to be sufficiently extendable. Feel free to contribute your implementation, but consult [Contributing section](/acra/contributing-and-community/) first. If you are looking for someone to implement it, talk to [our sales team](mailto:sales@cossacklabs.com), we're happy to explore different opportunities to make things happen without breaking a budget.


### Acra does not support highly-complex SQL statement in exotic PostgreSQL fork under rare circumstances, what do I do?

We're constantly improving Acra's SQL parser, but we are small company with limited resources. Aside from Acra, problems with wire protocol / SQL support could stem from a database you're using - 100% protocol compatibility is, indeed, rare.


### Does Acra support `.pem`, `.p12`, `.key`, `.pkcs12` and other key storage formats?

No. Acra's keys are tightly bound to data structures it operates and cryptographic protocols that these data structures implement. For performance reasons, Acra's keys are much simpler and straightforward than most widely recognized formats.

### What happens if I lost Acra Master Key?

Uh-oh, we believe that you've backed up the key, and it's stored in KMS. Right? Please refer to [Key management / Troubleshooting guide](/acra/security-controls/key-management/troubleshooting/#losing-the-keys) to learn more.
