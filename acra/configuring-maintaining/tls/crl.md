---
weight: 2
title: CRL
bookCollapseSection: true
---

# TLS certificate validation using CRL

CRL-related flags and their description. Work in `acra-connector`, `acra-server` and `acra-translator`.

* `--tls_crl_cache_size=<count>` default `16`

  How many CRLs to cache in memory. Use `0` to disable caching. Maximum is `1000000`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy

* `--tls_crl_cache_time=<seconds>` default `0`

  How long to keep CRLs cached, in seconds. Use `0` to disable caching. Maximum is `300` seconds

* `--tls_crl_check_only_leaf_certificate=<true|false>` default `false`

  This flag controls behavior of validator in cases when certificate chain contains more than two certificates (leaf + CA).
  `true` will make validator only verify leaf certificate while `false` will make it check all certificates up to CA
  (not including CA since it's already trusted).

* `--tls_crl_client_url=""` default (empty)

  CRL URL for incoming TLS connections to check client certificates.
  Only available for `acra-server` where we have both client and server TLS connections.

* `--tls_crl_database_url=""` default (enpty)

  CRL URL for outcoming TLS connections to check database certificates.
  Only available for `acra-server` where we have both client and server TLS connections.

* `--tls_crl_from_cert=<use|trust|prefer|ignore>` default `prefer`

  How to treat CRL URL described in certificate itself

  * `use`: try URL(s) from certificate after the one from configuration (if set)
  * `trust`: try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer`: try URL(s) from certificate before the one from configuration (if set)
  * `ignore`: completely ignore CRL URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--tls_crl_*_url` flags

* `--tls_crl_url`

  URL of the Certificate Revocation List (CRL) to use.

  For `acra-server` it will work like `--tls_crl_client_url` and `--tls_ocsp_database_url`
  passed simultaneously with same value.

  For `acra-connector` and `acra-translator` (that can only work as TLS clients)
  it will set CRL URL for validation of certificates sent by server.
