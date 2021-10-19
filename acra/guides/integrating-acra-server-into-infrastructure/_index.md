---
title: Integrating Acra Server into infrastructure
bookCollapseSection: true
---

# Integrating Acra Server into infrastructure

Which components should be added to the infrastructure, which components should be changed to behave differently.

* [AcraServer configuration]({{< ref "acra/guides/integrating-acra-server-into-infrastructure/acraserver_configuration.md" >}})
  describes how to configure and launch AcraServer
* [Encryption docs]({{< ref "acra/security-controls/encryption/_index.md" >}})
  is not a part of this guide, but describes how to get working encryption
* [Data migration]({{< ref "acra/guides/integrating-acra-server-into-infrastructure/data_migration.md" >}})
  is about changes in database one should do to help it store encrypted data
* [Client ID]({{< ref "acra/guides/integrating-acra-server-into-infrastructure/client_id.md" >}})
  describes what is client ID, where and how it is used

If you want more ideas about how things could be combined together, feel free to
[explore docker-compose examples](https://github.com/cossacklabs/acra/tree/master/docker).
