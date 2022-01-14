---
title: AcraTranslator configuration
bookCollapseSection: true
weight: 1
---

# AcraTranslator configuration

Here we describe how to set up AcraTranslator to reach a state where it can process queries.

List of all command line flags for AcraTranslator is located
in [Configuring and maintaining]({{< ref "acra/configuring-maintaining/general-configuration/acra-translator.md" >}}).

## Configuration file

There are two ways of configuring AcraTranslator:
* via command line flags
* via configuration file

The YAML file is passed with `--config_file=path/to/config.yml` flag.
To use this file as configuration source, you simply move flags into it,
`--foo=1` will become `foo: 1` and `--bar=test` will become `bar: "test"`.

Different configuration sources can be mixed if that makes sense in your situation.

## Listener

AcraTranslator will be listening on some default ports (gRPC API on `9696`, HTTP API on `9595`) if not configured to do otherwise.
Related flags are located in [Configuring and maintaining]({{< ref "acra/configuring-maintaining/general-configuration/acra-translator.md" >}}) 
and described for flag names: `incoming_connection_grpc_string` and `incoming_connection_http_string`.
As a simple example we can set both like this: `--incoming_connection_grpc_string=tcp://127.0.0.1:13306` and 
`--incoming_connection_http_string=tcp://127.0.0.1:13307`.

It is also important to [configure TLS]({{< ref "acra/configuring-maintaining/general-configuration/acra-translator.md#tls" >}})
so the application/clients will have secure connection to AcraTranslator.
In some cases, you may want to use AcraConnector + Themis Secure Session instead of TLS.
