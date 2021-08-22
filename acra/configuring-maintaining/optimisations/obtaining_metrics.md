---
title: Obtaining metrics
weight: 9
---

# Obtaining metrics

Acra services provide some metrics for Jaeger when configured to do so. This includes
[AcraConnector]({{< ref "acra/configuring-maintaining/general-configuration/acra_connector/_index.md#jaeger" >}}),
[AcraServer]({{< ref "acra/configuring-maintaining/general-configuration/acra_server/_index.md#jaeger" >}}),
[AcraTranslator]({{< ref "acra/configuring-maintaining/general-configuration/acra_translator/_index.md#jaeger" >}}).

# Metrics

<!-- decryptor/postgresql/pg_decryptor.go and decryptor/mysql/response_proxy.go -->
* `ProxyClientConnection` checks every client request using AcraCensor, if request is allowed, sends it to the database (PostgreSQL or MySQL)
  * `ProxyClientConnectionLoop` corresponds to one exact query being checked and processed
    * `censor` corresponds to the stage when query is being checked by AcraCensor

<!-- decryptor/postgresql/pg_decryptor.go -->
* `PgDecryptStream` (PostgreSQL-specific) processes data (rows) from database
  * `PgDecryptStreamLoop` (PostgreSQL-specific) corresponds to one query response being processed

<!-- decryptor/mysql/response_proxy.go -->
* `ProxyDatabaseConnection` MySQL-specific alternative to PgDecryptStream
  * `ProxyDatabaseConnectionLoop` MySQL-specific alternative to PgDecryptStreamLoop

<!-- network/trace.go -->
* `HTTPApiConnection` TODO

<!-- network/proxy.go -->
* `ProxyWithTracing` TODO

<!-- cmd/acra-connector/acra-connector.go -->
* `handleConnection` TODO
  * `WrapClient` TODO

<!-- cmd/acra-server/common/client_commands_session.go -->
* `HandleSession` TODO

<!-- cmd/acra-server/common/listener.go -->
* `WrapServer` TODO
  * `<function>`
    * if `handleCommandsConnection` — TODO
