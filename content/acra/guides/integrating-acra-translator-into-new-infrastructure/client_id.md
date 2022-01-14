---
title: Client ID
bookCollapseSection: true
weight: 2
---

# Client ID

Every application wishing to protect their data with AcraTranslator should provide an identifier called client ID.
Based on the client ID, AcraTranslator will choose corresponding encryption keys to process client requests.

The way how application can pass client ID to AcraTranslator depends on API type: gRPC or HTTP.

## gRPC API

By default, application have to specify `client ID` in every request was sent to AcraTranslator except when
`--acratranslator_client_id_from_connection_enable` flag used. Every type of request declared in 
[*.proto file](https://github.com/cossacklabs/acra/blob/stable/cmd/acra-translator/grpc_api/api.proto) has `client_id`
required parameter.

It can be changed with `--acratranslator_client_id_from_connection_enable` flag that configures AcraTranslator to 
extract client ID value from incoming connections. AcraTranslator accepts only TLS connections with mutual authentication
or proxied through AcraConnector

## HTTP API

AcraTranslator uses client ID derived from client's certificates in TLS handshakes (mutual authentication required) or
SecureSession connections through AcraConnector similar to gRPC requests with `--acratranslator_client_id_from_connection_enable`
flag.

## AcraConnector

AcraTranslator will use client ID sent by AcraConnector for HTTP API by default and for gRPC API if launched with
[`--acratranslator_client_id_from_connection_enable`]({{< ref "acra/configuring-maintaining/general-configuration/acra-translator.md#command-line-flags" >}}).

When using AcraConnector, set the client ID with `--client_id` flag and connect to AcraConnector instead of AcraServer.

See more information [here]({{< ref "/acra/security-controls/transport-security/acra-connector.md" >}}).

## TLS certificate

When AcraTranslator is launched with [`--acratranslator_tls_transport_enable`]({{< ref "acra/configuring-maintaining/general-configuration/acra-translator.md#tls" >}}) flag
for HTTP API or additionally with [`--acratranslator_client_id_from_connection_enable`]({{< ref "acra/configuring-maintaining/general-configuration/acra-translator.md#command-line-flags" >}}) 
flag, client IDs will be derived from TLS certificates provided by the client during handshake.

The exact behavior will also depend on value from
[`--tls_identifier_extractor_type`]({{< ref "acra/configuring-maintaining/general-configuration/acra-translator.md#tls" >}}) flag,
see its description for more on that.
