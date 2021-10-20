---
title: Security controls
bookCollapseSection: true
weight: 7
---

# Acra's security controls

Acra delivers different layers of defence for different parts and stages of the data lifecycle. Typically, developers configure several security controls that are useful for their use case. We recommend combining reactive, proactive and detective controls (see [Acra in depth / Security features](/acra/acra-in-depth/security-features/)).

This section describes how Acra's features and working and how to use them. Select a feature depending on your use case.

## Protect the data

Encrypt data before putting it into your database/datastore.

* [Encryption](/acra/security-controls/encryption/). Use encryption if your goal is to protect sensitive data fields. Acra will encrypt data fields and allow you to store them encrypted as binary blobs in your database/datastore. This is the main feature most Acra users use.

* [Searchable encryption](/acra/security-controls/searchable-encryption/). Use searchable encryption for fields that you want to run EQUAL queries (`if email=<anna@acme.com>`). Searchable encryption has certain limitations but allows to search without decrypting the data.

* [Masking](/acra/security-controls/masking/). Use masking if you goal is to encrypt and hide data, but leave a part of it in plaintext (`annXXXXX@acme.com`). Your application controls how to show data – in plaintext for trusted connections, or as a mask for untrusted ones.

* [Tokenization](/acra/security-controls/tokenization/). Use tokenization for data fields when you can't change data column format. Tokenization will create a data token that has the same format (int, string, or even email-looking) and store it in the database. Acra will encrypt the data fields and store them in a separate storage.


## Protect and filter network connections

Protect data-in-transit, authenticate connections, allow/deny specific SQL requests.

* [Transport security](/acra/security-controls/transport-security/). Configure TLS connections or use special Acra's transport security service for hostile environments.

* [SQL firewall](/acra/security-controls/sql-firewall). Configure Acra's Request Firewall to verify all SQL queries to database against a set of rules and reactions. Deny suspicous connections.


## Key management

Connect Acra to your KMS and encrypt data using different key for your different customers/applications.

* [Key management](/acra/security-controls/key-management). Learn how to generate encryption keys and connect Acra to your KMS. Acra allows using different set of keys for each of your applications or customers.

* [Zones](/acra/security-controls/zones). Configure even more precise access control - only connections from certain _zone_ can decrypt data related to that Zone. 


## Monitor and detect anomalies

* [Programmatic reactions on security events](/acra/security-controls/security-logging-and-events/programmatic-reactions/). Configure Acra's behaviour – send alerts to your Ops team, respond with forget data or even shut down Acra.

* [SQL firewall](/acra/security-controls/sql-firewall). Configure Acra's Request Firewall as conventional DLP for the database, making sure that chosen patterns or data blocks never pass Acra without an alarm.

* [Intrusion detection](/acra/security-controls/intrusion-detection/). Generate and place honeytokens/honeypots inside your database. Acra will trigger security alarm if these records are read.

* [SIEM/SOC integration](/acra/security-controls/security-logging-and-events/siem-soc-integration/). Connect Acra to your SIEM/SOC and analyse analyse behaviour of your whole system at once.

* [Audit logging](/acra/security-controls/security-logging-and-events/audit-logging). Setup cryptographically-signed logs to detect if someone tried tampering log detals or removing log messages.

## Export logs

* [SQL query logging](/acra/security-controls/sql-firewall#logging-and-masking-queries/). Configure Acra's Request Firewall to keep a log of all incoming SQL queries for further analysis and validation.

* [Security logging](/acra/security-controls/security-logging-and-events/). Configure security logs and security events.
