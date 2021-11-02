---
title: General configuration
bookCollapseSection: true
weight: 1
---

# General configuration

- Generate [Acra Master Key](/acra/security-controls/key-management/operations/generation/#11-generating-master-keys)
  and [encryption keys](/acra/security-controls/key-management/operations/generation/#12-generating-transport-and-encryption-keys).

- [Configure AcraServer](/acra/guides/integrating-acra-server-into-infrastructure/acraserver_configuration/).

  - Don't forget to [enable TLS](/acra/configuring-maintaining/tls/).

- [Deploy AcraServer](/acra/getting-started/installing/) to a separate machine.

- Test everything:

  1. Point your client application to a AcraServer instead of the database.
  2. Send a typical SQL request.

  _Result_: If you see the answer, AcraServer was configured properly and is able to process requests.
  It means that the network and the keys are fine.

- Thoroughly read the documentation.
- Use Acra!

- P.S. Feel free to raise an [Issue](https://github.com/cossacklabs/acra/issues)
  or contact us at [info@cossacklabs.com](mailto:info@cossacklabs.com).
