---
title: General configuration
bookCollapseSection: true
weight: 1
---

# General configuration

Acra contains a set of special CLI utilities and services for specialized use cases.


## Services

* [`acra-connector`](/acra/configuring-maintaining/general-configuration/acra-connector/) - provides encrypted and authenticated connection to AcraServer/AcraTranslator via [Themis](/themis/) with [Secure Session](/themis/crypto-theory/cryptosystems/secure-session/)

* [`acra-server`](/acra/configuring-maintaining/general-configuration/acra-server/) - provides Acra's [security controls](/acra/security-controls/) to the data in your SQL database. It is responsible for holding all the secrets required to actual data processing

* [`acra-translator`](/acra/configuring-maintaining/general-configuration/acra-translator/) - provides AAcra's [security controls](/acra/security-controls/) as HTTP / gRPC API with client SDKs

* [`acra-webconfig`](/acra/configuring-maintaining/general-configuration/acra-webconfig/) - provides web UI for AcraServer's runtime configuration


## Utilities

* [`acra-keys`](/acra/configuring-maintaining/general-configuration/acra-keys/)
  - is used for various operations with cryptographic keys especially for `v2` keystore

* [`acra-tokens`](/acra/configuring-maintaining/general-configuration/acra-tokens/)
  - is used for various token operations

* [`acra-addzone`](/acra/configuring-maintaining/general-configuration/acra-addzone/)
  - is used for generating of new [Zone keys](/acra/security-controls/zones/) for AcraBlocks/AcraStructs

* [`acra-authmanager`](/acra/configuring-maintaining/general-configuration/acra-authmanager/)
  - is used for [acra-webconfig](/acra/configuring-maintaining/general-configuration/acra-webconfig/) user management.

* [`acra-backup`](/acra/configuring-maintaining/general-configuration/acra-backup/)
  - is used for storing and managing the keystore [backups](/acra/security-controls/key-management/operations/backup)

* [`acra-keymaker`](/acra/configuring-maintaining/general-configuration/acra-keymaker/)
  - is used for various operations with cryptographic keys

* [`acra-log-verifier`](/acra/configuring-maintaining/general-configuration/acra-log-verifier/)
  - verifies secure logs dumped from AcraServer/AcraTranslator/AcraConnector

* [`acra-poisonrecordmaker`](/acra/configuring-maintaining/general-configuration/acra-poisonrecordmaker/)
  - generates new [poison records](/acra/security-controls/intrusion-detection) for intrusion detection

* [`acra-rollback`](/acra/configuring-maintaining/general-configuration/acra-rollback/)
  - helps you to generate a clean SQL dump from an existing protected one

* [`acra-rotate`](/acra/configuring-maintaining/general-configuration/acra-rotate/)
  - is used for rotating private/[Zone](/acra/security-controls/zones) keys and re-encrypting data stored in database or as a file
