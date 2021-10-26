---
title: Necessary preparations
bookCollapseSection: true
weight: 1
---

# Necessary preparations (keys, ports, etc.)

## Master key

Most Acra services require master key in order to work and perform cryptographic operations.
It is used, for example, to encrypt other keys in their keyrings.
These keys are then used in more specific tasks
(encrypt data in database, hash data for searchable encryption).

The key could be generated with Acra Keymaker:
```
$ acra-keys generate --master_key_path /tmp/master_key --keystore=v2
$ cat /tmp/master_key
{"encryption":"cgVd5kHock5dy2bBGv6dHmHCgi2Piq3+y43lE7tTgh0=","signature":"fNNgVVBvjaIuL7Ea5lNcs4Ccz8SqLF4bXGhJvLGVL0k="}
```

This key should then be base64-encoded and passed to Acra services in `ACRA_MASTER_KEY` environment variable.

Like this: `ACRA_MASTER_KEY="$(cat /tmp/master_key | base64)" acra-server ...`

{{< hint warning >}}
Make sure the master key is stored in a safe place.
It's more important than any other key.
{{< /hint >}}

There are other kinds of keys, for example [ones specific for AcraTranslator](/acra/configuring-maintaining/general-configuration/acra-translator/#keys).
You will find more about these keys on their page.

## Ports

Acra services that run as daemons (such as Connector, Server, Translator) listen for incoming
connections on configured ports in order to process requests.
When launching them, these ports should be exposed to other components of your infrastructure
that act as clients for Acra services.

Default ports (`9191` and `9494` for AcraConnector, `9090` and `9393` for AcraServer, `9595` and `9696` for AcraTranslator)
are already exposed in our docker containers.

You can configure listen host/port with `--incoming_connection_*` flags.

And for AcraServer specifically, you tell it to proxy MySQL/MariaDB protocol with `--mysql_enable` or PostgreSQL one with `--postgresql_enable`.
Address of the actual database behind AcraServer is configured with `--db_host=<host>` and `--db_port=<port>`.
