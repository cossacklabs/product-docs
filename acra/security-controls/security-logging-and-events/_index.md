---
title: Logging & events
bookCollapseSection: true
weight: 9
---
# Logging & events

This section describes Acra's logging facilities from security perspectives. Logging subsystem is quite important part of any secure software or hardware.
Logs record noteworthy events happened in the past, and they provide a valuable view of past and current state of the system. In conjunction with appropriate tools
and procedures, logs can be used to reconstruct events, detect intrusions and help while identifying security problems. We highly understand high forensic value of system logs,
so Acra is designed with comprehensive state-of-the-art security-oriented approach regarding its logging mechanism.

## Security logging

Acra’s security log is specifically pre-configured to be helpful to SIEM/SOC operators in building analytics and automation around security events. Acra logs internal and external activity.

Refer to [Security logging](/acra/security-controls/security-logging-and-events/security-logging/) page to learn about supported ways, formats and available logs.

## Audit logging

To ensure that security log is secure itself, Acra provides cryptographic protection/validation of exported logs to prevent tampering. Acra’s audit log covers access, security events, ties sessions to consumers and extends application-level audit log with strong evidence.

Refer to [Audit logging](/acra/security-controls/security-logging-and-events/audit-logging/) page to learn how to configure and use cryptographically-protected audit logging.


## Security events

Acra produces security events related to its internal and external activities – encryption/decryption errors, database connection errors, unauthorized connections, blocked queries from Acra's Request Firewall and so on.

Refer to [Security events](/acra/security-controls/security-logging-and-events/security-events/) page to see the whole list of security events and their metadata.


## Integration with SIEM/SOCs

A list of events might be useless if they can't be analyzed effectively and efficiently. Fetch Acra's logs and events and direct them into your SIEM/SOC systems.

Refer to [SIEM/SOC integration page](/acra/security-controls/security-logging-and-events/siem-soc-integration/) to read about SIEM/SOC integration and anomaly detection suggestions.


## Programmatic reactions

Configure Acra to fight back by selecting one of pre-defined reactions or your custom one. Send forged data, wake up your Ops team or even shutdown Acra cluster in case of suspicious activity.

Refer to [Programmatic reactions](/acra/security-controls/security-logging-and-events/programmatic-reactions/) page.

