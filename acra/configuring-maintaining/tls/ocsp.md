---
weight: 2
title: OCSP
bookCollapseSection: true
---

# TLS certificate validation using OCSP

OCSP-related flags and their description. Works for `acra-connector`, `acra-server` and `acra-translator`.

* `--tls_ocsp_url=<url>`

  URL of OCSP service.
  Empty by default.

  Should point to HTTP server that accepts `application/ocsp-request` MIME type
  and responds with `application/ocsp-response`.

  For `acra-server` it will work like `--tls_ocsp_client_url` and `--tls_ocsp_database_url`
  passed simultaneously with same value.

  For `acra-connector` and `acra-translator` (that can only work as TLS clients)
  it will set OCSP's URL for validation of certificates sent by the server.

* `--tls_ocsp_client_url=<url>`

  OCSP service URL for incoming TLS connections to check client certificates.
  Empty by default. Supported on AcraServer only.

* `--tls_ocsp_database_url=<url>`

  OCSP service URL for outcoming TLS connections to check database certificates.
  Empty by default. Supported on AcraServer only.

* `--tls_ocsp_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and
    continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration

* `--tls_ocsp_from_cert=<policy>`

  How to treat OCSP server URL described in certificate itself.

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--tls_ocsp_*_url` flags.

* `--tls_ocsp_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no OCSP's URL configured and there is no OCSP's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know whom to ask about them.

## Including OCSP's URL while signing CSR

An additional extension with URL(s) of OCSP service(s) can be included into certificate while signing Certificate Signing Requests via `openssl`:
```
# in section that contains used X.509 v3 extensions
authorityInfoAccess = @ocsp_section

# section that describes OCSP service URL(s)
[ ocsp_section ]
OCSP;URI.0 = http://127.0.0.1:8080
# OCSP;URI.1 = http://host:port and so on for additional OCSP's URLs
```

## Running `openssl ocsp` server

You can launch simple, yet completely functional OCSP server, following provided [certificate generation example](generate-certificate-with-openssl)
```
openssl ocsp \
    -port 8080 \
    -index index.txt \
    -rsigner ocsp-responder.crt.pem \
    -rkey ocsp-responder.crt.key \
    -CA ca.crt.pem \
    -ignore_err
```
Flags `-rsigner` and `-rkey` describe certificate and private key of OCSP responder. The key will be used to sign the response.
OCSP responder should be a certificate signed by the same CA that signed certificates we are responding about.
In openssl configuration it should have `extendedKeyUsage = OCSPSigning` property.
Also, CA certificate+key can be used instead of dedicated responder certificate+key.
Flag `-CA` describes CA certificate that signed certificates we are answering about.

And here is how to perform OCSP request, also using openssl:
```
openssl ocsp \
    -CAfile ca.crt.pem \
    -issuer ca.crt.pem \
    -cert some_certificate.crt.pem \
    -url http://127.0.0.1:8080
```
