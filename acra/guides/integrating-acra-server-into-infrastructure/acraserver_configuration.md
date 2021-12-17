---
title: AcraServer configuration
bookCollapseSection: true
weight: 1
---

# AcraServer configuration

Here we describe how to set up AcraServer to reach a state where it can process queries.

List of all command line flags for AcraServer is located
[here]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md" >}}).

## Configuration file

There are two ways of configuring AcraServer:
* via command line flags
* via configuration file

The YAML file is passed with `--config_file=path/to/config.yml` flag.
To use this file as configuration source, you simply move flags into it,
`--foo=1` will become `foo: 1` and `--bar=test` will become `bar: "test"`.

Different configuration sources can be mixed if that makes sense in your situation.

## Listener

AcraServer will be listening on some default ports (API on `9090`, SQL proxy on `9393`) if not configured to do otherwise.
Related flags are located [here]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#network" >}}).
As a simple example we can set both host and port like this: `--incoming_connection_string=tcp://127.0.0.1:13306`.

It is also important to [configure TLS]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#tls" >}}),
so the application/clients will have secure connection to AcraServer.
In some cases, you may want to use AcraConnector + Themis Secure Session instead of TLS.

## Database

How to let Acra know which DBMS you are using and how to connect to it.

If you are using MySQL or MariaDB, add `--mysql_enable=true` flag.

If you are using PostgreSQL, add `--postgresql_enable=true` flag.

Then, configure the database address with `--db_host` and `--db_port`.
Don't forget to also [configure TLS]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#tls" >}}):
set up additional root CA if needed, client certificates and so on.
