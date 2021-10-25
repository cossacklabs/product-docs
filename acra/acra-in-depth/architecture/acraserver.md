---
title: AcraServer, an SQL proxy
bookCollapseSection: true
weight: 2
---

# How it works

AcraServer is a service that acts as proxy between SQL clients and SQL database (MySQL/MariaDB/PostgreSQL).
It performs different [cryptographic operations]({{< ref "acra/security-controls/_index.md" >}}), such as
[transparent encryption/decryption]({{< ref "acra/security-controls/encryption/_index.md" >}}),
[tokenization]({{< ref "acra/security-controls/tokenization/_index.md" >}}),
[masking]({{< ref "acra/security-controls/masking/_index.md" >}}).
AcraServer is the one responsible of transforming random-looking bytes in database into plaintext,
although AcraTranslator can do it as well (manually read from DB, ask Translator to decrypt).

# Which FRs/NFRs does it implement

* Transparent data encryption/decryption
* Transparent tokenization/detokenization (kind of anonymization, [read more]({{< ref "acra/security-controls/tokenization/_index.md" >}}))
* Transparent encryption/decryption with masking (leaving some part of data unencrypted,
  [read more]({{< ref "acra/security-controls/tokenization/_index.md" >}}))
* Encrypted data in the database will remain protected and useless unless AcraServer has access to encryption keys

---

* Easy to integrate into existing infrastructure
* Available as a package for common server Linux distros, available as docker image
* AcraWebConfig as a helper tool for runtime reconfiguration

# How it connects to other parts

AcraConnector — may act as an additional proxy between application (SQL client) and AcraServer.
Works next to the application, takes responsibility of providing secure connection to AcraServer (TLS or Themis Secure Session).

AcraWebConfig — helper tool that provides web UI through which you can reconfigure some AcraServer options at runtime.

Redis — another storage for keys.
When configured, AcraTranslator will request keys from Redis (as an alternative to keystore directory in filesystem).
It can also use Redis to store data needed for [tokenization feature]({{< ref "acra/security-controls/tokenization/_index.md" >}}) to work.

# What are architectural considerations?

It is strictly recommended to host AcraServer on a different machine (virtual or physical),
isolated from both client applications and the database.
This comes from the fact that Acra works with a sensitive data (such as encryption keys) and isolation
will decrease risks of other components doing malicious things with it.

When using AcraServer, it is considered that you trust it but do not trust the database.
Anyway, AcraServer won't be able to decrypt data for which it does not have the encryption keys,
as well as it won't decrypt data for SQL clients not supposed to access it.

In many cases using SQL proxy would be a desired solution as it is
[quite easy to integrate into existing infrastructure]({{< ref "acra/guides/integrating-acra-server-into-infrastructure/_index.md" >}})
and provides a whole complex of data protection stuff.
However, in cases when you need to make application the only component that interacts with plaintext,
AcraServer won't help you, you will have to use use things like [Themis Secure Cell]({{< ref "themis/crypto-theory/cryptosystems/secure-cell.md" >}})
and perform all the operations on application side.
