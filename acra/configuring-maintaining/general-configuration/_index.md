---
title: General configuration
bookCollapseSection: true
weight: 2
---

### General configuration

- Generate [master key]({{< ref "acra/security-controls/key-management/operations/generation.md#11-generating-master-keys" >}})
  and [encryption keys]({{< ref "acra/security-controls/key-management/operations/generation.md#12-generating-transport-and-encryption-keys" >}})

- [Configure AcraServer]({{< ref "acra/guides/integrating-acra-server-into-infrastructure/acraserver_configuration.md" >}})

  - Don't forget to [enable TLS]({{< ref "acra/configuring-maintaining/tls/" >}})

- [Deploy AcraServer]({{< ref "acra/configuring-maintaining/installing/#installing" >}}) to a separate machine

- (optional, enterprise only) Integrate AcraWriter closely following the [examples](https://github.com/cossacklabs/acra/tree/master/examples),
  try generating AcraStruct with it

- Test everything:

  1. Connect to AcraServer instead of the database.
  2. Send a regular request.

  _Result_: If you see the answer, AcraServer was configured properly and is able to process requests.
  It means that the network and the keys are fine.

- Thoroughly read the documentation.
- Use Acra!
- P.S. Feel free to raise an [Issue](https://github.com/cossacklabs/acra/issues)
  or contact us at [info@cossacklabs.com](mailto:info@cossacklabs.com).
