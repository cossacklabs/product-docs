---
title: Security logging
weight: 1
---

## Security logging

Acra services log tons of activities – incoming connections, SQL firewall actions, encryption/decryption errors, key accesses and many more. Logs from AcraServer and AcraTranslator follow the same structure and format, but can have slightly different content (for example, AcraTranslator won't have SQL Request Firewall related logs and it doesn't have integrated SQL Request Firewall module.)

Acra services support logging in different formats (including CEF), and can log to the file or stream.

Refer to the [Configuring and maintaining / Logging](/acra/configuring-maintaining/logging/) to learn more about logging formats, files, log configurations, etc.

### What Acra logs actually

Startup and initialization process of AcraServer and AcraTranslator, issues with host system:

* If configuration files are not tampered or malformed or present;
* If keys are accessible;
* If security checks of host machine are valid;
* Handling signals like SIGTERM or SIGINT, shutdown and restart.

Information related to network connections:

* Which `hosts:ports` Acra service is listening on, which transport encryption is selected;
* New clients connected to Acra;
* Problems with TLS certificates on client/database side;
* Database connection errors, and issues with database protocol.

Key management and key access events:

* Reading Acra Master Key from environment or KMS (i.e. HashiCorp Vault);
* Loading [storage, transport, search, audit log keys](/acra/security-controls/key-management/) from filesystem or key DB (i.e. Redis);
* Missing keys.

Issues with a database schema:

* Unexpected column types;
* Issues with encryptor config for AcraServer (when encryptor config doesn't match the database schema).

SQL queries (only AcraServer):

* Filtered and blocked queries by Acra Request Firewall;
* All SQL queries (actual data is masked) if Acra Request Firewall is configured to "log everything";
* Unparsed SQL queries if Acra Request Firewall is configured to them into separate log stream.

Refer to Acra's SQL Firewall [section](/acra/security-controls/sql-firewall) to find out about specific log streams provided by AcraCensor.

Additionally, refer to [Security events](/acra/security-controls/security-logging-and-events/security-events/) that Acra produces.


## Typical logging approaches

* Set up appropriate log coverage configuration. 
* Write all security events to the remote storage, or [connect SIEM](/acra/security-controls/security-logging-and-events/siem-soc-integration/).
* Enable [cryptographic tamper-proof audit logging](/acra/security-controls/security-logging-and-events/audit-logging/).