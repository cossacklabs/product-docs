---
title: SIEM/SOC integration
weight: 3
---

# Integrating Acra with SIEM systems 

Acra’s security log is specifically pre-configured to be helpful to SIEM/SOC operators in building analytics and automation around security events.

Acra supports logging to stderr or to the file. Then you can grab these logs (f.e. via filebeat sidecar) and send them to service you use.

Acra gives you plenty of in-depth opportunities for logging – you can pull out security events, queries (with masked values), query plans, debug events, via separate or combined log streams.

Supported SIEMs and log management systems: ELK, Graylog, Datadog, AWS logging – basically, any services that supports JSON or CEF.

Read [Security events](/acra/security-controls/security-logging-and-events/security-events/) page to see what kind of security events Acra produces and [Logging and events](/acra/security-controls/security-logging-and-events/security-events/) to learn more about logging formats.
