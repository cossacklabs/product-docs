---
weight: 2
title: CRL
bookCollapseSection: true
---

# TLS certificate validation using CRL

Only [CRL v1](https://datatracker.ietf.org/doc/html/rfc5280#section-4.1.2.1) with basic fields is currently supported.
This means Acra will be able to download CRL, verify it, and search for a certificate serial number there.
But more advanced features like [CRL extensions](https://datatracker.ietf.org/doc/html/rfc5280#section-5.2)
(including [delta CRLs](https://datatracker.ietf.org/doc/html/rfc5280#section-5.2.4)) are not handled yet.

CRL-related flags and their description. Work in `acra-connector`, `acra-server` and `acra-translator`.

* `--tls_crl_url=<url>`

  URL of the Certificate Revocation List (CRL) to use.
  Empty by default.

  Can be either `http://` or `file://` (for local files).
  When using local file, Acra will simply read the file and won't monitor filesystem for changes afterwards.
  Usual caching rules apply (see `--tls_crl_cache_time`).

  For `acra-server` it will work like `--tls_crl_client_url` and `--tls_crl_database_url`
  passed simultaneously with same value.

  For `acra-connector` and `acra-translator` (that can only work as TLS clients)
  it will set CRL URL for validation of certificates sent by server.

* `--tls_crl_client_url=<url>`

  CRL URL for incoming TLS connections to check client certificates.
  Empty by default.
  {{< hint warning >}}
  Only for `acra-server`
  {{< /hint >}}

* `--tls_crl_database_url=<url>`

  CRL URL for outcoming TLS connections to check database certificates.
  Empty by default.
  {{< hint warning >}}
  Only for `acra-server`
  {{< /hint >}}

* `--tls_crl_from_cert=<policy>`

  How to treat CRL URL described in certificate itself

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--tls_crl_*_url` flags.

* `--tls_crl_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

* `--tls_crl_cache_size=<count>`

  How many CRLs to cache in memory.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.

* `--tls_crl_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.

## Make `openssl` include CRL URL when signing CSR

When using `openssl` to sign Certificate Signing Requests,
an extension can be added to make certificate include CRL URL:
```
# in section that contains used X.509 v3 extensions
crlDistributionPoints = @crl_section

# section that describes CRL file URL
[ crl_section ]
URI.0 = http://127.0.0.1:8080/crl.pem
```

## Generating CRL file with `openssl`

If you have custom openssl configuration file, if you are able to run command like
`openssl ca ...` and have signed certificates appear in certificate database (usually called `index.txt`),
you can also use `openssl` to generate CRL v1:
```
openssl ca -gencrl -config openssl.cnf -crldays 1 -out crl.pem
```
Then, tell Acra to use it with `-tls_crl_url=file:///path/to/crl.pem`.

Or launch HTTP server and make it host the CRL file.
