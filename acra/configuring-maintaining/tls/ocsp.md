---
weight: 1
title: OCSP
bookCollapseSection: true
---

# TLS certificate validation using OCSP

OCSP-related flags and their description. Work in `acra-connector`, `acra-server` and `acra-translator`.

* `--tls_ocsp_check_only_leaf_certificate=<true|false>` default `false`

  This flag controls behavior of validator in cases when certificate chain contains more than two certificates (leaf + CA).
  `true` will make validator only verify leaf certificate while `false` will make it check all certificates up to CA
  (not including CA since it's already trusted).

* `--tls_ocsp_client_url=""` default (empty)

  OCSP service URL for incoming TLS connections to check client certificates.
  Only available for `acra-server` where we have both client and server TLS connections.

* `--tls_ocsp_database_url=""` default (empty)

  OCSP service URL for outcoming TLS connections to check database certificates.
  Only available for `acra-server` where we have both client and server TLS connections.

* `--tls_ocsp_from_cert=<use|trust|prefer|ignore>` default `prefer`

  How to treat OCSP server URL described in certificate itself

  * `use`: try URL(s) from certificate after the one from configuration (if set)
  * `trust`: try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer`: try URL(s) from certificate before the one from configuration (if set)
  * `ignore`: completely ignore OCSP URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--tls_ocsp_*_url` flags

* `--tls_ocsp_required=<denyUnknown|allowUnknown|requireGood>` default `denyUnknown`

  How to treat situation when OCSP server doesn't know about requested certificate and returns "Unknown"

  `denyUnknown`: consider "Unknown" response an error, certificate validation will fail
  `allowUnknown`: reverse of `denyUnknown`, allow certificates unknown to OCSP server
  `requireGood`: require all known OCSP servers to respond "Good" in order to allow certificate and
  continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration

* `--tls_ocsp_url=""` default (empty)

  OCSP service URL.

  For `acra-server` it will work like `--tls_ocsp_client_url` and `--tls_ocsp_database_url`
  passed simultaneously with same value.

  For `acra-connector` and `acra-translator` (that can only work as TLS clients)
  it will set OCSP URL for validation of certificates sent by server.
