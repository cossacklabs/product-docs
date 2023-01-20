---
weight: 3
title: CRL
bookCollapseSection: true
---

# TLS certificate validation using CRL

Only [CRL v1](https://datatracker.ietf.org/doc/html/rfc5280#section-4.1.2.1) with basic fields is currently supported.
This means Acra will be able to download CRL, verify it, and search for a certificate serial number there.
But more advanced features like [CRL extensions](https://datatracker.ietf.org/doc/html/rfc5280#section-5.2)
(including [delta CRLs](https://datatracker.ietf.org/doc/html/rfc5280#section-5.2.4)) are not handled yet.

CRL-related flags and their descriptions. Works for `acra-connector`, `acra-server` and `acra-translator`.

* `--tls_crl_url=<url>`

  URL of the Certificate Revocation List (CRL) to use.
  Empty by default.

  Can be either `http://` or `file://` (for local files).
  When using local file, Acra will simply read the file and won't monitor filesystem for changes afterwards.
  Usual caching rules apply (see `--tls_crl_cache_time`).

  For `acra-server` it will work like `--tls_crl_client_url` and `--tls_crl_database_url`
  passed simultaneously with same value.

  For `acra-connector` and `acra-translator` (that can only work as TLS clients)
  it will set CRL's URL for validation of certificates sent by the server.

* `--tls_crl_client_url=<url>`

  Works as `--tls_crl_url` flag but applied only for connections between application and AcraServer. If not specified, AcraServer uses value from `--tls_crl_url` flag. **Supported on AcraServer only.**

* `--tls_crl_database_url=<url>`

  Works as `--tls_crl_url` flag but applied only for connections between application and AcraServer. If not specified, AcraServer uses value from `--tls_crl_url` flag. **Supported on AcraServer only.**

* `--tls_crl_from_cert=<policy>`

  How to treat CRL's URL described in a certificate itself

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--tls_crl_*_url` flags.

* `--tls_crl_client_from_cert=<policy>`

  Works as `--tls_crl_from_cert` flag but applied only for connections between application and AcraServer. If not specified, AcraServer uses value from `--tls_crl_from_cert` flag. **Supported on AcraServer only.**

* `--tls_crl_database_from_cert=<policy>`

  Works as `--tls_crl_from_cert` flag but applied only for connections between application and AcraServer. If not specified, AcraServer uses value from `--tls_crl_from_cert` flag. **Supported on AcraServer only.**

* `--tls_crl_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.

* `--tls_crl_client_check_only_leaf_certificate=<policy>`

  Works as `--tls_crl_check_only_leaf_certificate` flag but applied only for connections between application and AcraServer. If not specified, AcraServer uses value from `--tls_crl_check_only_leaf_certificate` flag. **Supported on AcraServer only.**

* `--tls_crl_database_check_only_leaf_certificate=<policy>`

  Works as `--tls_crl_check_only_leaf_certificate` flag but applied only for connections between application and AcraServer. If not specified, AcraServer uses value from `--tls_crl_check_only_leaf_certificate` flag. **Supported on AcraServer only.**

* `--tls_crl_cache_size=<count>`

  How many CRLs to cache in memory.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.

* `--tls_crl_client_cache_size=<policy>`

  Works as `--tls_crl_cache_size` flag but applied only for connections between application and AcraServer. If not specified, AcraServer uses value from `--tls_crl_cache_size` flag. **Supported on AcraServer only.**

* `--tls_crl_database_cache_size=<policy>`

  Works as `--tls_crl_cache_size` flag but applied only for connections between application and AcraServer. If not specified, AcraServer uses value from `--tls_crl_cache_size` flag. **Supported on AcraServer only.**

* `--tls_crl_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.

* `--tls_crl_client_cache_time=<policy>`

  Works as `--tls_crl_cache_time` flag but applied only for connections between application and AcraServer. If not specified, AcraServer uses value from `--tls_crl_cache_time` flag. **Supported on AcraServer only.**

* `--tls_crl_database_cache_time=<policy>`

  Works as `--tls_crl_cache_time` flag but applied only for connections between application and AcraServer. If not specified, AcraServer uses value from `--tls_crl_cache_time` flag. **Supported on AcraServer only.**

## Including CRL's URL while signing CSR

An additional extension with URL(s) of CRL service(s) can be included into certificate while signing Certificate Signing Requests via `openssl`:
```
# in section that contains used X.509 v3 extensions
crlDistributionPoints = @crl_section

# section that describes CRL file URL
[ crl_section ]
URI.0 = http://127.0.0.1:8080/crl.pem
```

## Generating CRL file with `openssl`

You can generate a CRL v1, following provided [certificate generation example](/acra/configuring-maintaining/tls/generate-certificate-with-openssl/):
```
openssl ca -gencrl -config openssl.cnf -crldays 1 -out crl.pem
```
Then, tell Acra to use it with `-tls_crl_url=file:///path/to/crl.pem`.

Or launch HTTP server and make it host the CRL file.
