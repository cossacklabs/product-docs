---
title: acra-keys
bookCollapseSection: true
weight: 6
---

## acra-keys

{{< hint info >}}
We recommend using acra-keys for Acra 0.95.0 and newer.
{{< /hint>}}


`acra-keys` is a command-line utility used for different keys operations
especially for `v2` keystore. It consists of several subcommands each of which is responsible for a separate functionality.

* [`list`]({{< ref "acra/configuring-maintaining/general-configuration/acra-keys/list" >}})
  List available keys in the keystore

* [`generate`]({{< ref "acra/configuring-maintaining/general-configuration/acra-keys/generate" >}})
  Generate new keys

* [`read`]({{< ref "acra/configuring-maintaining/general-configuration/acra-keys/read" >}})
  Read and print key material in plaintext

* [`export`]({{< ref "acra/configuring-maintaining/general-configuration/acra-keys/export" >}})
  Export keys from the keystore

* [`import`]({{< ref "acra/configuring-maintaining/general-configuration/acra-keys/import" >}})
  Import keys into the keystore

* [`migrate`]({{< ref "acra/configuring-maintaining/general-configuration/acra-keys/migrate" >}})
  Migrate keystore to a different format

* [`destroy`]({{< ref "acra/configuring-maintaining/general-configuration/acra-keys/destroy" >}})
  Destroy key material

* [`extract-client-id`]({{< ref "acra/configuring-maintaining/general-configuration/acra-keys/extract-client-id" >}})
  Extract ClientID from TLS certificate