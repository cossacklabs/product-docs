---
title: Audit logging
weight: 2
---

## Secure logging

Acra supports secure and verifiable logging for [AcraServer]({{< ref "/acra/configuring-maintaining/general-configuration/acra-server.md" >}}), [AcraTranslator]({{< ref "/acra/configuring-maintaining/general-configuration/acra-translator.md" >}}) and [AcraConnector](({{< ref "/acra/configuring-maintaining/general-configuration/acra-connector.md" >}})).

It is designed to prevent (mitigate) the possibility of making any adversarial changes in logs of mentioned services. Our design is based on state-of-the-art [scientific work](https://eprint.iacr.org/2008/185.pdf), where the two cryptographic schemes (based on symmetric / asymmetric keys) of secure logging functionality are described. 

We have chosen a scheme that is based on symmetric keys according to the following reasons: 1) high performance; 2) simple and boring cryptographic design.

Secure logging consists of two parts: **service** that produce secured logs (AcraServer, AcraTranslator and AcraConnector) and **verifier** ([acra-log-verifier]({{< ref "/acra/configuring-maintaining/general-configuration/acra-log-verifier.md" >}})) that checks and validates dump of logs.

### What you will get with secure logging

* Security against log structure modification: symbols changing, removing, addition, permutation of separate log entries.
* Security against truncation attacks - when logs are truncated from the end of stream.
* Acceptable performance: ability to verify big production volumes of protected logs in seconds.
* As early as possible initialization of secure log functionality while service startup — to reduce amount of unprotected log entries in secure log stream.
* Ability of consistent logs verification, with multiply startups / shutdowns of services.
* Possibility to verify «interrupted» log streams — for example if secure log chain starts in one file, but finishes in another.
* Minimal time of initial cryptographic key (used for integrity check computation) storing in memory of service's process.
* Current order and granularity preserving of log messages in the source code of the services.
* Possibility to enable log rotation policy without technical limits.

Our secure logging mechanism is based on [FssAgg](https://eprint.iacr.org/2007/052.pdf) scheme. 
Obviously it inherits FssAgg's cryptographic properties. It means that secure logging requires a trusted 
verifier - `acra_log_verifier`. According to the scheme, logs can only be verified by a designated party holding a HMAC cryptographic key (problem with sharing the HMAC key is out of scope).

### Common description of the scheme

There are two cryptographic primitives used in our **secure log** mechanism. One is keyed hash function (**HMAC**) and second 
is usual hash function (*hash*). In order to use **HMAC** there is a symmetric cryptographic key **K**, 
which is main security parameter, that should be kept secretly. This key hashed on startup by secure logger (and saved as **k[1]**) 
and erased from the memory to minimize time of storing in the service's process memory. 
For each **log entry** that is presented in log stream, we add an element **integrity check**, 
that is computed iteratively by the following "formal" principle:

|Log entry | Temporable key          | Internal state                                 | Integrity check         |
| ---      | ---                     | ---                                            | ---                     |
|`LE[1]`   | `k[1]`                  | `state[1] = HMAC(k[1], LE[1])`                 | `IC[1] = hash(state[1])`|
|`LE[2]`   | `k[2] = hash(k[1])`     | `state[2] = HMAC(k[2], LE[2] || state[1])`     | `IC[2] = hash(state[2])`|
|`LE[3]`   | `k[3] = hash(k[2])`     | `state[3] = HMAC(k[3], LE[3] || state[2])`     | `IC[3] = hash(state[3])`|
| ...      | ...                     | ...                                            | ...|
|`LE[4]`   | `k[n] = hash(k[n – 1])` | `state[n] = HMAC(k[n], LE[n] || state[n – 1])` | `IC[n] = hash(state[n])`| 

As a result, **secure log** will consist from:

- `LE[1] || IC[1]`
- `LE[2] || IC[2]`
- `LE[3] || IC[3]`
- . . .

where **LE[n]** — is a body of n-th entry in log stream, and **IC[n]** — is its **integrity check**.

The value of **IC[n]** depends on **LE[n]** and internal state, that is not presented in log stream but is kept in memory. In this way the value of **IC** can be computed if temporate value of **k** and previous state are known, while values of **IC** do not reveal information about previous entries, internal states, etc.

### How setup secure logging

1. Generate symmetric key for **services** and `acra-log-verifier` by [acra-keymaker]({{< ref "/acra/configuring-maintaining/general-configuration/acra-keymaker.md" >}}) using flag `--generate_log_key`.
2. Run AcraServer/AcraTranslator/AcraConnector with the flag `--audit_log_enable=true` to turn on secure
   logging and save all output into some storage that may be dumped into file or just specify path to file with flag `--log_to_file=<path>` where services will save logs.
3. Configure your environment to verify logs via [acra-log-verifier]({{< ref "/acra/configuring-maintaining/general-configuration/acra-log-verifier.md" >}}) before copying/archiving/backup to be sure that secure log is valid and finalized. 
4. Configure your alerting on any errors from `acra-log-verifier`. Verifier will finish with **non-zero** exit status on any validation errors.

Common pattern in collecting logs is their rotation related with their size, row counts, time of life, etc. 
Most often service continue working and should continue logging. Secure logs are stream of entries where every new entry linked
with previous entry and their content and order fixed into the integrity check signature. For that AcraServer, AcraTranslator and 
AcraConnector handle SIGUSR1 signal that correctly interrupts current chain of entries with final integrity check and starts new chain.

So, you should integrate logs rotation process with secure logs rotation in Acra services. And send signal to services before
rotating files or log stream.


### Recommendation for secure usage

We propose a following practical measures that can significanly improve the security from practical point of view:
* Perform periodical force resetting of the secure log chain (for this purpose Acra services use a SIGUSR1 system signal);
* Perform copying of log file to the separate, phisically independent machine, responsible for audit log collecting;
* Perform periodical key rotation of HMAC cryptographic key;
  {{< hint warning >}}
  Note: that audit logs created on old key can't be verified with a new key
  {{< /hint >}}
* Setup intrusion detection system on audit log collector machine, that will check that new audit log have been successfully 
  copied and verified. It should alert in case of some errors while copying or verification.
