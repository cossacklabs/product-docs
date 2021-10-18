---
title: Client ID
bookCollapseSection: true
weight: 2
---

# Client ID

Every application wishing to interact with AcraServer shoud provide an identifier called client ID.
Based on the client ID, AcraServer will choose corresponding encryption keys to process client requests.

There are two ways of passing client ID from application to AcraServer:
* using AcraConnector as additional proxy between application and AcraServer
* making AcraServer derive identifier from client TLS certificate

Also, one can avoid doing it and set static client ID with `--client_id` flag to Acra.
This way AcraServer will use this ID like it was sent from AcraConnector.

{{< hint info >}}
For AcraTranslator, however, there is one more method: specifying client ID inside RPC requests.
This behavior is controlled by 
[`--acratranslator_client_id_from_connection_enable` flag]({{< ref "acra/configuring-maintaining/general-configuration/acra-translator.md#command-line-flags" >}}).
{{< /hint >}}

## AcraConnector

When using AcraConnector, set the client ID with `--client_id` flag and connect to AcraConnector instead of AcraServer.

See more information [here]({{< ref "/acra/security-controls/transport-security/acra-connector.md" >}}).

## TLS certificate

When AcraServer or AcraTranslator is launched with 
[`--tls_client_id_from_cert` flag]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#tls" >}}),
client IDs will be derived from TLS certificates provided by the client during handshake.

The exact behavior will also depend on value from
[`--tls_identifier_extractor_type` flag]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#tls" >}}),
see its description for more on that.
