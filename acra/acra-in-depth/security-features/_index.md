---
title: Security features
bookCollapseSection: true
weight: 5
---

**TODO: Extend**

## Security controls

Proactive:
* [Encryption]({{< ref "acra/security-controls/encryption/_index.md" >}}) —
  simply encrypting data to make sure it can only be decrypted with a proper key stored in secure place
* [Masking]({{< ref "acra/security-controls/masking/_index.md" >}}) —
  similar to encryption, but leaves part of plaintext unencrypted
* [Tokenization]({{< ref "acra/security-controls/tokenization/_index.md" >}}) —
  storing confidential data in a separate storage, while main database only contains random data used to access plaintext

Reactive:
* [Intrusion detection]({{< ref "acra/security-controls/intrusion-detection/_index.md" >}}) —
  create honeypot records and perform some action each time that data is accessed
* [Programmatic reactions]({{< ref "acra/security-controls/programmatic-reactions/_index.md" >}}) —
  performing programmed actions in certain situations

Detective:
* [SQL query logging]({{< ref "acra/security-controls/sql-firewall/_index.md#logging-and-masking-queries" >}}) —
  logging SQL queries from clients in AcraServer (all, only denied, etc, depending on configguration)
* [Security logging]({{< ref "acra/security-controls/security-logging-and-events/_index.md" >}}) —
  logging things that happen in AcraConnector/AcraServer/AcraTranslator
* [SIEM/SOC integration]({{< ref "acra/security-controls/siem-soc-integration/_index.md" >}}) —
  integrating logging with _TODO_

## Acra's own internal security

To learn more how we protect Acra while it protects your system, refer to [On Acra security](/acra/on-acra-security/) section.


## More reading

* [Acra's Security design]({{< ref "../security-design/_index.md" >}})
