---
title: Security controls
bookCollapseSection: true
weight: 7
---

# Acra's security controls

Acra delivers different layers of defence for different parts and stages of the data lifecycle. Typically, developers configure several security controls that are useful for their use case. We recommend combining reactive, proactive and detective controls (see [Acra in depth / Security features](/acra/acra-in-depth/security-features/)).

This section describes how Acra's features are working and how to use them properly. Select a feature depending on your use case.

## Protect the data

Encrypt data before putting it into your database/datastore.

* [Encryption](/acra/security-controls/encryption/). Use encryption if your goal is to protect confidentiality and integrity of sensitive data fields. Acra will encrypt data fields and allow you to store them encrypted as binary blobs in your database/datastore. This is the main feature most Acra users use.

* [Searchable encryption](/acra/security-controls/searchable-encryption/). If you want to run EQUAL queries (`if email=<anna@acme.com>`) over encrypted fields, use searchable encryption. It has certain limitations but allows searching without revealing data to the database.

* [Masking](/acra/security-controls/masking/). Use masking if your goal is to encrypt and hide data, but leave a part of it in a plaintext (`annXXXXX@acme.com`). Your application controls how to show data – in plaintext for trusted connections, or as a mask for untrusted ones.

* [Tokenization](/acra/security-controls/tokenization/). Use tokenization for data fields when you can't change data column format. Acra will create a data token with the same format (int, string, or even email-looking) and store it in the database. Acra will encrypt the data fields and store them in separate storage.


## Protect and filter network connections

Protect data-in-transit, authenticate connections, allow/deny specific SQL requests.

* [Transport security](/acra/security-controls/transport-security/). Configure TLS connections or use special Acra's transport security service for hostile environments.

* [SQL firewall](/acra/security-controls/sql-firewall). Configure Acra's SQL Request Firewall to verify all SQL queries to the database against a set of rules and reactions. Deny suspicious queries and alert the Ops team.


## Control the keys

Connect Acra to your KMS or follow BYOK to encrypt customers’ data with their keys.

* [Key management](/acra/security-controls/key-management). Learn how to generate encryption keys and connect Acra to your KMS. Acra allows using different set of keys for each of your applications, or per customer.

* [Zones](/acra/security-controls/zones) (deprecated since 0.94.0, will be removed in 0.95.0). Configure even more precise access control - only connections from a certain _zone_ can decrypt data related to that Zone. 


## Detect anomalies and prevent attacks

* [Programmatic reactions on security events](/acra/security-controls/security-logging-and-events/programmatic-reactions/). Configure Acra's behaviour in case of security event detection – send alerts to your Ops team, respond with intentionally falsified data or even shut down Acra.

* [SQL firewall](/acra/security-controls/sql-firewall). Configure Acra's Request Firewall as conventional DLP for the database, making sure that chosen patterns or data blocks will never pass Acra without an alarm.

* [Intrusion detection](/acra/security-controls/intrusion-detection/). Generate and place honeytokens/honeypots inside your database. Acra will trigger security alarm if these records are read.

* [SIEM/SOC integration](/acra/security-controls/security-logging-and-events/siem-soc-integration/). Connect Acra to your SIEM/SOC and analyse behaviour of your whole system at once.


## Recover from incidents and gather evidence

* [SQL query logging](/acra/security-controls/sql-firewall#logging-and-masking-queries/). Configure Acra's Request Firewall to keep a log of all incoming SQL queries for further analysis and validation.

* [Security logging](/acra/security-controls/security-logging-and-events/). Configure security logs and security events.

* [Audit logging](/acra/security-controls/security-logging-and-events/audit-logging). Setup cryptographically-signed logs to detect if someone tried tampering or removing log messages.

