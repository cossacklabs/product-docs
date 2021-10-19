---
title: Security logging & events
bookCollapseSection: true
weight: 9
---

# Security logging and events

## What Acra can log

**TODO: Extend with list of events Acra can log/emit, then hand to someone like Eugene to explain security context**

# Typical logging schemes

## Audit trail

* Set up appropriate log coverage configuration. 
* Write all security events to remote storage.
* Use tamper-proof protection.
* ? 

## Security events

Acra can export security events to your SIEM. Don't hesitate to use it. **TODO: expand**

## Anomaly detection 

You can use certain data streams to detect anomalous security events. To get some ideas where to start: 

* Stream of all SQL queries (value-sanitized or not) could hint you at both insider attacks and SQL injections. 
* Access events, when correlated with other network and access data, can give you good idea about probing Acra by potential attackers. 
* TODO: More?


# Tamper-proofing the logs

Acra has tooling that enables tamper protection for the logs. It is outlined in [Secure Logging]({{< ref "/acra/security-controls/security-logging-and-events/secure_logging.md" >}}) document. **TODO: Maybe we should rename this to "tamper-proof" logging**
