---
title: General configuration
bookCollapseSection: true
weight: 1
---

# General configuration

Acra contains a set of special CLI utilities and services for specialized use cases.


## Services

* [`acra-connector`](/acra/configuring-maintaining/general-configuration/acra-connector/)
  Service providing an encrypted and authenticated connection to AcraServer via [Themis](/themis/) with [Secure Cell](/themis/crypto-theory/cryptosystems/secure-cell)

* [`acra-server`](/acra/configuring-maintaining/general-configuration/acra-server/)
  Main component, responsible for holding all the secrets required to actual data processing

* [`acra-translator`](/acra/configuring-maintaining/general-configuration/acra-translator/)
  API server, that exposes most of Acra’s features as HTTP / gRPC API with client SDKs and traffic protection

* [`acra-webconfig`](/acra/configuring-maintaining/general-configuration/acra-webconfig/)
  Simple web application providing web UI for AcraServer's runtime configuration


## Utilities

* [`acra-keys`](/acra/configuring-maintaining/general-configuration/acra-keys/)
  Utility used for different keys operations especially for `v2` keystore

* [`acra-tokens`](/acra/configuring-maintaining/general-configuration/acra-tokens/)
  Utility used for different token operations

* [`acra-addzone`](/acra/configuring-maintaining/general-configuration/acra-addzone/)
  Utility used for generation of new [Zone keys](/acra/security-controls/zones/) for AcraBlocks/AcraStructs

* [`acra-authmanager`](acra/configuring-maintaining/general-configuration/acra-authmanager/)
  Utility used for [acra-webconfig](/acra/configuring-maintaining/general-configuration/acra-webconfig/) user management.

* [`acra-backup`](/acra/configuring-maintaining/general-configuration/acra-backup/)
  Utility used for storing and managing the keystore [backups](/acra/security-controls/key-management/operations/backup)

* [`acra-keymaker`](/acra/configuring-maintaining/general-configuration/acra-keymaker/)
  Utility used for different keys operations

* [`acra-log-verifier`](/acra/configuring-maintaining/general-configuration/acra-log-verifier/)
  Utility that verifies secure logs dumped from AcraServer/AcraTranslator/AcraConnector

* [`acra-poisonrecordmaker`](/acra/configuring-maintaining/general-configuration/acra-poisonrecordmaker/)
  Utility that generates new [poison records](/acra/security-controls/intrusion-detection) for intrusion detection

* [`acra-rollback`](/acra/configuring-maintaining/general-configuration/acra-rollback/)
  Utility that help you to generate a clean SQL dump from an existing protected one

* [`acra-rotate`](/acra/configuring-maintaining/general-configuration/acra-rotate/)
  Utility that rotates private/[Zone](/acra/security-controls/zones) keys and re-encrypt data stored in database or as files