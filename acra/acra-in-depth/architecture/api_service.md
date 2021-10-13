---
title: AcraTranslator - encryption-as-a-service daemon
bookCollapseSection: true
weight: 3
---

# How it works

AcraTranslator provides an API (either gRPC or HTTP) for applications giving them the ability to:
* Encrypt/decrypt data
* [Tokenize/detokenize]({{< ref "acra/security-controls/tokenization/_index.md" >}})
* [Mask/unmask]({{< ref "acra/security-controls/masking/_index.md" >}})
* Generate HMAC for searchable encryption
<!-- TODO add links to translator examples, not to more AcraServer-related examples -->

# Which FRs/NFRs does it implement

* Data encryption/decryption
* Tokenization/detokenization (kind of anonymization, [read more]({{< ref "acra/security-controls/tokenization/_index.md" >}}))
* Encryption/decryption with masking (leaving some part of data unencrypted,
  [read more]({{< ref "acra/security-controls/tokenization/_index.md" >}}))
* HMAC calculation for search of encrypted value in a database
* Encrypted data will remain protected and useless unless AcraTranslator has access to encryption keys
* All cryptographic operations are performed on AcraTranslator side,
  application won't have to deal with the keys at all

---

* Two RPC protocols: gRPC and HTTP
* Available as a package for common server Linux distros, available as docker image

# How it connects to other parts

Redis — another storage for keys.
When configured, AcraTranslator will request keys it cannot find in keystore (directory in filesystem) from Redis.
It can also use Redis to store data needed for [tokenization feature]({{< ref "acra/security-controls/tokenization/_index.md" >}}) to work.

# What are architectural considerations?

Just like with AcraServer, it is recommended to host AcraTranslator on a
different machine (virtual or physical), isolated from client applications.
