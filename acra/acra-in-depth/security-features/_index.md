---
title: Security features
weight: 5
---

## Security features

Acra delivers different layers of defense for different parts and stages of the data lifecycle. This is what **defence in depth** is – an independent set of security controls aimed at mitigating multiple risks in case of an attacker crossing the outer perimeter.

If you look on Acra as one components in your system from security architecture perspective, it covers data security from different angles – providing proactive, reactive and detective security controls.

Acra's security assumptions, threats and security guarantees are described in [Security design](/acra/acra-in-depth/security-design/) section.


### Proactive controls

Proactive controls prevent risks from happening.

* [Encryption](/acra/security-controls/encryption/) —
  application-level encryption done by either Acra Server (transparent encryption on a proxy) or Acra Translation (encryption-as-a-service). Acra allows you to encrypt only chosen subset of your data to attain optimal performance/security guarantees. Acra encrypts data into cryptographic containers to make sure it can only be decrypted with a proper key stored in secure place.

* [Searchable encryption](/acra/security-controls/searchable-encryption/) —
  encrypt data in a way that it's searchable without decryption. Acra encrypts data securely and builds a special hash ("blind index") for search.
  
* [Masking](/acra/security-controls/masking/) —
  similar to encryption, but leaves a part of plaintext unencrypted. The database stores masked data (`annXXXXX@gmail.com`), your application controls how to shown data – in plaintext for trusted connections, as a mask for untrusted ones.

* [Tokenization](/acra/security-controls/tokenization/) —
  substitute sensitive data with a token and match it to original only when needed. To provide additional security, encrypt sensitive data when stored and decrypt only when token is requested. 

* [Transport security](/acra/security-controls/transport-security/) —
  Acra prevents unauthorized connections, uses only the latest transport security protocols, and provides additional modules for infrastructures deployed in hostile environment.


### Reactive controls

Reactive controls detect suspicious behaviour, and prevents incidents from happening by limiting their damage .

* [Intrusion detection](/acra/security-controls/intrusion-detection/) —
  Acra puts special data blocks (honeytokens / honeypots) in database tables that look like regular encrypted records, but once they’re requested through Acra, it raises security alarm and halts decryption.

* [SQL firewall](/acra/security-controls/sql-firewall) —
  Acra’s Request Firewall enables to verify all queries to database against a set of rules and reactions. Acra can be used as conventional DLP for the database, making sure that chosen patterns or data blocks never pass Acra without an alarm.

* [Programmatic reactions on security events](/acra/security-controls/security-logging-and-events/security-events/programmatic-reactions/) —
  Acra allows to configure certain behaviour on security events. When triggered, they alert Ops team and define a wide gamut of reactions - from shutting down or rejecting the request to providing forged data instead of actual database response.


### Detective controls

Detective controls help to restore the history of events and detect if the system's behaviour was tampered.

* [SQL query logging](/acra/security-controls/sql-firewall/_index.md#logging-and-masking-queries/) —
  Acra's Request Firewall allows to logg all incoming SQL queries from clients in AcraServer to validate it later. It's often used in a combination with "deny" rules when suspicious queries are blocked, and programmatic events – when certain queries trigger alerts.

* [Security logging](/acra/security-controls/security-logging-and-events/) —
  technical logging, security events and cryptographically-signed logs help to restore the history and validate that logs were not tampered.

* [SIEM/SOC integration](/acra/security-controls/security-logging-and-events/security-events/siem-soc-integration/) —
  link a stream of security logs and security events from Acra to your SIEM/SOC and analyse behaviour of your whole system at once.


## Acra's own internal security

To learn more how we protect Acra while it protects your system, refer to [On Acra security](/acra/on-acra-security/) section.

