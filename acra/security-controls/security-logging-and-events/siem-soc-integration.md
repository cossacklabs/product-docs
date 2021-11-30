---
title: SIEM/SOC integration
weight: 4
---

# Integrating Acra with SIEM systems 

Acra’s security log is specifically pre-configured to be helpful to SIEM/SOC operators in building analytics and automation around security events.

Acra supports logging to stderr or to the file. Then you can grab these logs (f.e. via filebeat sidecar) and send them to service you use.

Acra gives you plenty of in-depth opportunities for logging – you can pull out security events, queries (with masked values), query plans, debug events, via separate or combined log streams.

Supported SIEMs and log management systems: ELK, Graylog, Datadog, AWS logging – basically, any services that supports JSON or CEF.

Read [Security events](/acra/security-controls/security-logging-and-events/security-events/) page to see what kind of security events Acra produces and [Security logging](/acra/security-controls/security-logging-and-events/security-logging/) to learn more about logging formats.


## Anomaly detection suggestions

You can use certain data streams to detect anomalous security events. To get some ideas where to start: 

* Stream of all SQL queries could hint you on both insider attacks and SQL injections.
* Access events, when correlated with other network and access data, can give you good idea about probing Acra by potential attackers. 
* Increased number of decryption errors related to the same ClientID might indicate configuration error of this application or its malicious activity.
* Correlating database connection errors together with database load could suggest suspicious activity in database cluster.

Correlate events from Acra with events from the other part of your system – check CPU/RAM load, monitor for sudden changes in volume of outgoing data from the database – as these might be a signs of data leakage/misconfiguration.
