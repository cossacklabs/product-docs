---
title: LRU cache
weight: 8
---

# LRU cache

Caching is an essential part when we talk about getting best performance from network services.
Acra tools provide caching for few things that would otherwise be requested every time:

* Keystore cache

  In order to encrypt/decrypt data, AcraServer needs keys.
  With configured Redis database that stores the keys, we can make AcraServer cache them in memory
  with `--keystore_cache_size` flag and get better encryption/detection performance.
  For more info see [AcraServer keystore flags]({{< ref "acra/configuring-maintaining/general-configuration/acra-server/_index.md#keystore" >}}).

* CRL caching

  When using TLS connection with certificate validation using Certificate Revocation Lists,
  it is possible to enable caching for CRLs and thus improve TLS handshake speed.
  For more info see [CRL-related flags]({{< ref "acra/configuring-maintaining/tls/crl" >}}),
  appliable to AcraServer, AcraConnector and AcraTranslator.
