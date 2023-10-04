---
title: acra-keys
bookCollapseSection: true
weight: 6
---

## acra-keys

`acra-keys` is a command-line utility used for different keys operations for `v1`/`v2` keystores. 

Each functionality is implemented as a separate subcommand:

* [`list`](/acra/configuring-maintaining/general-configuration/acra-keys/list/) - lists available keys in the keystore;

* [`generate`](/acra/configuring-maintaining/general-configuration/acra-keys/generate/) - generates new keys;

* [`read`](/acra/configuring-maintaining/general-configuration/acra-keys/read/) - reads and prints key material in a plaintext;

* [`export`](/acra/configuring-maintaining/general-configuration/acra-keys/export/) - exports keys from the keystore (`v1` keystore is supported since 0.95.0 ,`v2` keystore is supported since 0.90.0);

* [`import`](/acra/configuring-maintaining/general-configuration/acra-keys/import/) - imports keys into the keystore (`v1` keystore is supported since 0.95.0 ,`v2` keystore is supported since 0.90.0);

* [`migrate`](/acra/configuring-maintaining/general-configuration/acra-keys/migrate/) - migrates keystore to a different format;

* [`destroy`](/acra/configuring-maintaining/general-configuration/acra-keys/destroy/) - destroys key material;

* [`extract-client-id`](/acra/configuring-maintaining/general-configuration/acra-keys/extract-client-id/) - extracts ClientID from TLS certificate.
