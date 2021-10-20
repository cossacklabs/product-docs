---
title: Logging & events
bookCollapseSection: true
weight: 9
---

## Security logging

Acra’s security log is specifically pre-configured to be helpful to SIEM/SOC operators in building analytics and automation around security events. Acra logs internal and external activity.

Refer to [Security logging](/acra/security-controls/security-logging-and-events/security-logging/) page to learn about supported ways, formats and available logs.

## Audit logging

To ensure that security log is secure itself, Acra provides cryptographic protection/validation of exported logs to prevent tampering. Acra’s audit log covers access, security events, ties sessions to consumers and extends application-level audit log with strong evidence.

Refer to [Audit logging](/acra/security-controls/security-logging-and-events/audit-logging/) page to learn how to configure and use cryptographically-protected audit logging.


## Security events

Acra produces security events related to its internal and external activities – encryption/decryption errors, database connection errors, unauthorized connections, blocked queiries from Acra's Request Firewall and so on.

Refer to [Security events](/acra/security-controls/security-logging-and-events/security-events/) page to see the whole list of security events and their metadata.


## Integration with SIEM/SOCs

A list of events might be useless if noone analyses it. Fetch Acra's logs and events and direct them into your SIEM/SOC systems. 

Refer to [SIEM/SOC integration page](/acra/security-controls/security-logging-and-events/siem-soc-integration/) to read about SIEM/SOC integration and anomaly detection suggestions.


## Programmatic reactions

Configure Acra to fight back by selecting one of pre-defined reactions or your custom one. Send forged data, wake up your Ops team or even shutdown Acra cluster in case of suspicious activity.

Refer to [Programmatic reactions](/acra/security-controls/security-logging-and-events/programmatic-reactions/) page.

