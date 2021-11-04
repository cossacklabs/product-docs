---
title: Necessary preparations
weight: 2
---

# Necessary preparations (keys, ports, etc.)

## Acra Master Key

Most Acra services require Acra Master Key in order to work and perform cryptographic operations.
It is used, for example, to encrypt Acra's intermediate keys in their keyrings.

These keys are then used in more specific tasks
(encrypt data in database, hash data for searchable encryption).

The exact procedure is described in
[Generating Acra Master Key]({{< ref "acra/security-controls/key-management/operations/generation.md#11-generating-acra-master-key" >}}).

This key should then be base64-encoded and passed to Acra services in `ACRA_MASTER_KEY` environment variable.

Like this: `ACRA_MASTER_KEY="$(cat /tmp/master_key | base64)" acra-server ...`

{{< hint warning >}}
Make sure the master key is stored in a safe place.
It's more important than any other key.
{{< /hint >}}

There are other kinds of keys, for example [ones specific for AcraTranslator](/acra/configuring-maintaining/general-configuration/acra-translator/#keys).
You will find more about these keys on their page.

## Ports

Acra services that run as daemons (such as AcraServer, AcraTranslator, AcraConnector) listen for incoming
connections on configured ports in order to process requests.
When launching them, these ports should be exposed to other components of your infrastructure
that act as clients for Acra services.

Default ports (`9191` and `9494` for AcraConnector, `9090` and `9393` for AcraServer, `9595` and `9696` for AcraTranslator)
are already exposed in our docker containers.

You can configure listen host/port with `--incoming_connection_*` flags.

And for AcraServer specifically, you tell it to proxy MySQL/MariaDB protocol with `--mysql_enable` or PostgreSQL one with `--postgresql_enable`.
Address of the actual database behind AcraServer is configured with `--db_host=<host>` and `--db_port=<port>`.
