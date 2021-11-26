---
title: LRU cache
weight: 8
---

# LRU cache

Caching is an essential part when we talk about getting best performance from network services.
Acra tools provide caching for few things that would otherwise be requested every time:

* Keystore cache

  In order to encrypt/decrypt data, AcraServer needs keys.
  With configured Redis database that stores the keys, we can enable AcraServer to cache them in memory
  with `--keystore_cache_size` flag and get better encryption/decryption performance.
  For more info see [AcraServer keystore flags](/acra/configuring-maintaining/general-configuration/acra-server/#keystore).

* CRL caching

  When using TLS connection with certificate validation using Certificate Revocation Lists,
  it is possible to enable caching for CRLs and thus improve TLS handshake speed.
  For more info see [CRL-related flags](/acra/configuring-maintaining/tls/crl),
  applicable to AcraServer, AcraConnector and AcraTranslator.
