---
title: Cryptography and key management
bookCollapseSection: true
weight: 7
---

## Cryptography in Acra

Cryptography widely used in all Acra services for:
* data protection: via [encryption]({{< ref "/acra/security-controls/encryption/#INVALID" >}}), 
  [searchable encryption]({{< ref "/acra/security-controls/searchable-encryption/#INVALID" >}}), 
  [masking]({{< ref "/acra/security-controls/masking/#INVALID" >}}) or [tokenization]({{< ref "/acra/security-controls/tokenization/#INVALID" >}}) with encryption source data
* transport protection: via Secure Session or TLS
* [authentication]({{< ref "/acra/acra-in-depth/authentication/#INVALID" >}}): via mutual authentication used in 
  [Secure Session]({{< ref "/themis/crypto-theory/cryptosystems/secure-session.md" >}}) or [TLS]({{< ref "/acra/configuring-maintaining/tls/" >}}), 
  authenticated symmetric encryption used to protect user's data via [Secure Cell](({{< ref "/themis/crypto-theory/cryptosystems/secure-cell.md" >}}))
* [secure logging]({{< ref "acra/security-controls/security-logging-and-events/secure_logging.md" >}})
* [password hashing]({{< ref "/acra/configuring-maintaining/general-configuration/acra-authmanager.md#auth-file" >}})
* private keys protection and [key management]({{< ref "/acra/security-controls/key-management/" >}})

Acra does not contain any self-made cryptographic primitives or obscure ciphers and relies on:
* [Themis cryptographic library](https://www.cossacklabs.com/themis/)
* [Golang's TLS implementation](https://pkg.go.dev/crypto/tls)
* [Golang's Argon2 hash function implementation](https://pkg.go.dev/golang.org/x/crypto/argon2)
  
### Themis

Themis implements high-level cryptosystems based on the best available 
[open-source implementations]({{< ref "/themis/crypto-theory/cryptography-donors.md" >}}) of the 
[most reliable ciphers]({{< ref "/themis/architecture/soter.md" >}}).

Themis' cryptographic services, used via Go wrapper in most of the services and utilities and via corresponding language 
wrappers in AcraWriters, are high-level compositions of carefully chosen, well-known cryptographic primitives. 
To deliver its unique guarantees, Acra relies on the combination of well-known ciphers and a smart key management scheme.

Currently, you can build Themis with using OpenSSL, LibreSSL, and Google's BoringSSL (a number of experimental build 
methods for LibSodium, BearSSL, and even CommonCrypto are available, too). They provide better security, use the 
implementations that have passed industry-specific compliance audits, and/or fit the hardware acceleration on your platform.

The [enterprise version of Acra](https://www.cossacklabs.com/acra/#pricing) can run on the certified crypto-libraries 
of your choice (i.e. FIPS, GOST), [drop us an email](mailto:sales@cossacklabs.com) to get a quote.

<table><tbody>
<tr><td> Default crypto-primitive source </td><td> OpenSSL </td></tr>
<tr><td> Supported crypto-primitive sources ᵉ<td> BoringSSL, LibreSSL, FIPS-compliant, GOST-compliant, HSM</td></tr>
<tr><td> Storage encryption </td><td> AES-256-GCM + ECDH </td></tr>
<tr><td> Transport encryption </td><td> TLS v1.2+ / Themis Secure Session </td></tr>
<tr><td> KMS integration ᵉ</td><td> Amazon KMS, Google Cloud Platform KMS, Hashicorp Vault, Keywhiz </td></tr>
</tbody></table>

ᵉ — available in the [Enterprise version of Acra](https://www.cossacklabs.com/acra/#pricing/) only. 
[Drop us an email](mailto:sales@cossacklabs.com) to get a full list of features and a quote.

### TLS

Acra handles TLS connections between: 
* Application and [AcraServer]({{< ref "/acra/configuring-maintaining/general-configuration/acra-server.md" >}}). Used to protect plaintext from application to AcraServer in [Transparent encryption mode](/acra/configuring-maintaining/general-configuration/acra-server.md#transparent-encryption-mode-INVALID), and to 
  protect decrypted plaintext by AcraServer before sending to application
  App <-> AcraServer.
* AcraServer and database. Used to protect other data transmitted through AcraServer to database and to be transparent for 
  strictly configured environment with fully protected communication between applications and databases, with mutual 
  TLS authentication.
* [AcraConnector]({{< ref "/acra/configuring-maintaining/general-configuration/acra-connector.md" >}}) and AcraServer. 
  Used as one of supported transport encryption between AcraConnector and AcraServer for same reasons as for 
  communication between application and AcraServer. AcraConnector may be used with applications that cannot
  be extended with TLS protection.
* Application and [AcraTranslator]({{< ref "/acra/configuring-maintaining/general-configuration/acra-translator.md" >}}). 
  Used as transport encryption in HTTP and gRPC protocols supported by AcraTranslator.
* [Hashicorp Vault](https://www.vaultproject.io/) and AcraServer/AcraTranslator/AcraConnector. All Acra's services use encrypted private keys encrypted
  with symmetric key `ACRA_MASTER_KEY` that may be safely loaded from Hashicorp Vault.

To increase security, we extended [TLS processing]({{< ref "/acra/configuring-maintaining/tls/" >}})
with additional [OCSP]({{< ref "/acra/configuring-maintaining/tls/ocsp.md" >}})/[CRL]({{< ref "/acra/configuring-maintaining/tls/crl.md" >}})
validation that not implemented in standard library. Additionally, Acra's services accept only TLS 1.2+ connections and
cipher suites with [perfect forward secrecy](https://en.wikipedia.org/wiki/Forward_secrecy).

### Argon2

Argon2 hash function used by AcraServer and [AcraAuthManager]({{< ref "/acra/configuring-maintaining/general-configuration/acra-authmanager.md" >}})
for hashing user's passwords stored in the [auth file]({{< ref "/acra/configuring-maintaining/general-configuration/acra-authmanager.md#auth-file" >}}) 
and used in basic authentication on [AcraWebConfig]({{< ref "/acra/configuring-maintaining/general-configuration/acra-webconfig.md" >}}) web UI.