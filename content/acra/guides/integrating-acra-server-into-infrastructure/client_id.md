---
title: Client ID
bookCollapseSection: true
weight: 2
---

# Client ID

Every application wishing to interact with AcraServer should provide an identifier called client ID.
Based on the client ID, AcraServer will choose corresponding encryption keys to process client requests.

To pass client ID from application to AcraServer you should make AcraServer derive identifier from client TLS certificate.
Also, one can avoid doing it and set static client ID with `--client_id` flag to Acra.

{{< hint info >}}
For AcraTranslator, however, there is one more method: specifying client ID inside RPC requests.
This behavior is controlled by 
[`--acratranslator_client_id_from_connection_enable` flag]({{< ref "acra/configuring-maintaining/general-configuration/acra-translator.md#command-line-flags" >}}).
{{< /hint >}}

## TLS certificate

When AcraServer or AcraTranslator is launched with 
[`--tls_client_id_from_cert` flag]({{< ref "acra/configuring-maintaining/general-configuration/acra-server/#tls" >}}),
client IDs will be derived from TLS certificates provided by the client during handshake.

The exact behavior will also depend on value from
[`--tls_identifier_extractor_type` flag]({{< ref "acra/configuring-maintaining/general-configuration/acra-server/#tls" >}}),
see its description for more on that.
