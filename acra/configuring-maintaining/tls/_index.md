---
title: TLS
bookCollapseSection: true
---

# TLS

## Common TLS flags

(common for `acra-connector`, `acra-server`, `acra-translator`)

* `--tls_auth=<mode>`

  Set authentication mode that will be used for TLS connection.

  * `0` — do not request client certificate, ignore it if received
  * `1` — request client certificate, but don't require it
  * `2` — expect to receive at least one certificate to continue the handshake
  * `3` — don't require client certificate, but validate it if client actually sent it
  * `4` — (default) request and validate client certificate

  These values correspond to [crypto.tls.ClientAuthType](https://golang.org/pkg/crypto/tls/#ClientAuthType).

* `--tls_key=<filename>`

  Path to private key that will be used for TLS handshake.
  Should correspond to the certificate configured with `--tls_cert`.
  Empty by default.

* `--tls_cert=<filename>`

  Path to TLS certificate that will be sent to other peers during handshake.
  Empty by default.

  In case of AcraServer, it will be sent to clients (AcraConnector, AcraTranslator) and to server (database).

* `--tls_ca=<filename>`

  Path to additional CA certificate for AcraConnector and database certificate validation.
  Empty by default.

  In case of AcraServer, it will be used to validate both client (AcraConnector, AcraTranslator) certificates
  and server (database) ones.

## AcraConnector specific flags

* `--acraserver_tls_transport_enable={true|false}`

  Enable TLS to encrypt transport between AcraConnector and AcraServer.
  Default is `false` which means "use SecureSession instead".

## AcraServer specific flags

* `--acraconnector_tls_transport_enable={true|false}`

  Enable TLS to encrypt transport between AcraConnector and AcraServer.
  Default is `false` which means "use SecureSession instead".

* `--tls_client_auth=<mode>`

  Set authentication mode that will be used for TLS connection with AcraConnector.
  Possible values are the same as for `--tls_auth`.
  Default is `-1` which means "take value of `--tls_auth`".

  Overrides the `--tls_auth` setting.

* `--tls_client_key=<filename>`

  Path to private key of the TLS certificate presented to AcraConnectors (see `--tls_client_cert`).
  Empty by default.

* `--tls_client_cert=<filename>`

  Path to server TLS certificate presented to AcraConnectors (overrides `--tls_cert`).
  Empty by default.

* `--tls_client_ca=<filename>`

  Path to additional CA certificate for AcraConnector certificate validation (setup if AcraConnector certificate CA is different from database certificate CA).
  Empty by default.

* `--tls_client_id_from_cert={true|false}`

  Extract clientID from TLS certificate.
  Take TLS certificate from AcraConnector's connection if `--acraconnector_tls_transport_enable` is `true`;
  otherwise take TLS certificate from application's connection if `--acraconnector_transport_encryption_disable` is `true`.
  Can't be used with `--tls_client_auth=0` or `--tls_auth=0`.
  Default is `false`.

* `--tls_database_auth=<mode>`

  Set authentication mode that will be used for TLS connection with database.
  Possible values are the same as for `--tls_auth`.
  Overrides the `--tls_auth` setting.
  Default is `-1` which means "take value of `--tls_auth`".

* `--tls_database_key=<filename>`

  Path to private key that will be used for TLS handshake with database.
  Should correspond to the certificate configured with `--tls_database_cert`.
  Empty by default.

* `--tls_database_cert=<filename>`

  Path to client TLS certificate shown to database during TLS handshake (overrides `--tls_cert`).
  Empty by default.

* `--tls_database_ca=<filename>`

  Path to additional CA certificate for database certificate validation
  (setup if database certificate CA is different from AcraConnector certificate CA).
  Empty by default.

* `--tls_database_sni=<SNI>`

  Expected Server Name (SNI) from database.
  Empty by default which means "don't check the SNI sent by database".

* `--tls_db_sni=<SNI>`

  Expected Server Name (SNI) from database (deprecated, use `--tls_database_sni` instead).

## Other TLS flags

* `--tls_identifier_extractor_type=<type>`

  Decide which field of TLS certificate to use as ClientID.

  * `distinguished_name` — (default) certificate Distinguished Name (DN)
  * `serial_number` — certificate serial number

  {{< hint warning >}}
  Only for `acra-server` and `acra-translator`
  {{< /hint >}}

## Certificate validation for revocation

Acra services can be configured to validate other peers certificate during TLS handshake.

This feature is currently implemented for `acra-connector`, `acra-server` and `acra-translator`.

There are two methods for certificate validation.
They are configured separately and can be enabled simultaneously.
Or disabled completely.
* [OCSP (Online Certificate Status Protocol)](ocsp)
* [CRL (Certificate Revocation List)](crl)

By dafault Acra will perform validation only if the certificate itself contains OCSP or CRL metadata.
And if certificate does not contain OCSP URLs, it won't be validated using OCSP protocol. Same applies for CRL.

## PKI

We have a dedicated page about public key infrastructure, located [here](/acra-in-depth/security-design/pki-INVALID).
