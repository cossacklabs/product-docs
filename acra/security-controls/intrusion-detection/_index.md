---
title: Intrusion detection
bookCollapseSection: true
weight: 8
---

# Intrusion Detection

Let’s imagine that the client application generates requests and sends them through the chain of Acra’s services to receive decrypted plaintext in the end.

What if the attackers compromise the app deeply and badly enough so they are able to alter its behaviour? From a simple SQL injection to remote/local code execution errors, there are threats, which make your application a source of risk once it's been compromised. Our idea is that since AcraServer is the only entity that decrypts sensitive data and sees all the requests addressed to it, it is AcraServer's responsibility to tell the good behaviour from bad and to take appropriate action.

For intrusion detection, Acra uses poison records, also known as honey tokens.

## Poison records

Poison records are specifically designed to sit quietly in the database and not be queried by legitimate users under normal circumstances. They look like any other encrypted records, and it's impossible to distinguish them from `normal data`. Technically speaking, poison records are data (**binary**, **strings**, **int** or whatever suits your database design), placed in particular tables/columns/cells.

However, poison records will only be included in the outputs of requests from malicious applications that read more data than they should, i.e. using `SELECT *` requests. The goal of using poison records is simple — to detect adversaries trying to download full tables/database from the application server or trying to run full scans in their injected queries. AcraServer will inform user (system administrator) of untypical behaviour and can block suspicious requests.

For more technical details you can check out other blog posts related poison records:

- [Explain Like I’m Five: Poison Records (Honeypots for Database Tables)](https://hackernoon.com/poison-records-acra-eli5-d78250ef94f)
- [Poison Records In Acra – Database Honeypots For Intrusion Detection](https://www.cossacklabs.com/blog/acra-poison-records.html)


## Command line flags

AcraServer has a set of flags for more precise work configuration with Poison records.


* `--poison_detect_enable={true|false}`

  Turn on poison record detection, if server shutdown is disabled, AcraServer logs the poison record detection and returns decrypted data.
  Default is `true`.  


* `--poison_shutdown_enable={true|false}`

  On detecting poison record: log about poison record detection, stop and shutdown.
  Default is `false`.

* `--poison_run_script_file=<scriptpath>`

  On detecting poison record: log about poison record detection, execute script, return decrypted data.


## Usage example


AcraServer's key storage contains a special key, which is used for recognition of poison records. This key is generated either after a query passes through AcraServer, or upon running poison record generation utility [`acra-pisonrecordmaker`]({{< ref "acra/configuring-maintaining/general-configuration/acra-poisonrecordmaker" >}}) (but you will have to move the keys into AcraServer's key directory manually).

Before running any commands, make sure you have [installed]({{< ref "acra/configuring-maintaining/installing/installing-from-repository.md" >}}) `acra-poisonrecordmaker` utility and **`ACRA_MASTER_KEY`** stored as an environmental variable.

If you haven't generated keys before, checkout out [key generation]({{< ref "acra/security-controls/key-management/operations/generation" >}}) instructions. After generating **`ACRA_MASTER_KEY`**, assign it to a variable like this:

```
export ACRA_MASTER_KEY=$(echo -n "My_Very_Long_Key_Phrase_ge_32_chars" | base64)
```

Running simple `acra-poisonrecordmaker` binary command: 

```
acra-poisonrecordmaker
```

Your output will be a base64-encoded poison record that you should decode and insert into your database as binary data. It will look something like this:

```
IiIiIiIiIiJVRUMyAAAALQ82fbECADRBA5i8JVvnrhnoazCXTtw2pce45Yo5su+HNDEOD5EgJwQmVAAAAAABAUAMAAAAEAAAACAAAABebWIj5GhhfAQ0lLAUrahrjcuI9Yjb14QFGaPBamWDVuq/EiAu8peBK17tpzuD+EDhOnyn1A5dUVAvhIlwAAAAAAAAAAABAUAMAAAAEAAAAEQAAACVs0EIAERyZhAD4FKSAaJqyMUTZ1tt97XDSxIwG+A5Njvd5q7aISgVQmhD6Fdgsnp98OkRSqSbK3ykgPwBIlFhCwm/Zcz5DRCDu+LV+1LDBPHwSgPS3o+OnOck5CXz8r0=
```

{{< hint warning >}}
**NOTE**: The `acra-poisonrecordmaker` key folder must have proper permissions (as set originally by [acra-keymaker]({{< ref "acra/configuring-maintaining/general-configuration/acra-keymaker" >}})):

- folder 700
- private keys 600
{{< /hint >}}

{{< hint info >}}
The [Acra Poison Records Demo](https://github.com/cossacklabs/acra-poison-records-demo) illustrates how to use intrusion detection functionality of Acra data protection suite.
{{< /hint >}}
