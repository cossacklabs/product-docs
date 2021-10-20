---
title: Logging & events
bookCollapseSection: true
weight: 9
---

# Security logging and events

## What Acra can log

<!-- grep 'log\.(Error|Warn|Info|Debug)f?\("' in Acra sources -->

Connection-related info:
* Which hosts:ports Acra service is listening on, which transport encryption is selected
* New clients connected to Acra
* Problems with TLS certificates on client/database side

Keystore events:
* Reading master key from environment or KMS (i.e. HashiCorp Vault), possible errors
* Loading other\* keys from filesystem or key DB (i.e. Redis), possible errors

\* — the ones needed for encryption/decryption, HMAC, audit log, basically everythings except the master key

Each keystore event will also include client ID / zone ID that triggered the request to keystore

Issues with a database schema:
* Wrong column types
* Invalid encryptor config (cannot be parsed or does not match with database schema)

Other messages related to the state of running services:
* Validation of configuration files
* Handling signals like SIGTERM or SIGINT
* Shutdown
* Restart

SQL queries (if AcraCensor was enabled and configured to do so).
Includes query structure, the actual data can be hidden.

**TODO: ~~Extend with list of events Acra can log/emit, then~~ hand to someone like Eugene to explain security context**

# Typical logging schemes

## Audit trail

* Set up appropriate log coverage configuration. 
* Write all security events to remote storage.
* Use tamper-proof protection.
* ? 

## Security events

* Poison record access

  Access to data inside database that was not meant to be accessed at all.
  These poison records can be inserted to catch situations like malicious SQL client attempting to dump the whole database.
  AcraTranslator is also able to catch poison record decryption and perform configured action.
  [Read more about intrusion detection]({{< ref "acra/security-controls/intrusion-detection/_index.md" >}}).

Acra can export security events to your SIEM. Don't hesitate to use it. **TODO: expand**

## Anomaly detection 

You can use certain data streams to detect anomalous security events. To get some ideas where to start: 

* Stream of all SQL queries (value-sanitized or not) could hint you at both insider attacks and SQL injections. 
* Access events, when correlated with other network and access data, can give you good idea about probing Acra by potential attackers. 
* TODO: More?


# Tamper-proofing the logs

Acra has tooling that enables tamper protection for the logs. It is outlined in [Audit logging](/acra/security-controls/security-logging-and-events/audit-logging) document. **TODO: Maybe we should rename this to "tamper-proof" logging**
