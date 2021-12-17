---
title: Tracing
weight: 11
---

# Enabling tracing

Acra services provide some traces for Jaeger when configured to do so. This includes
[AcraConnector](/acra/configuring-maintaining/general-configuration/acra-connector/#tracing-jaeger),
[AcraServer](/acra/configuring-maintaining/general-configuration/acra-server/#tracing-jaeger),
[AcraTranslator](/acra/configuring-maintaining/general-configuration/acra-translator/#tracing-jaeger).

## Traces

Acra services collect the following traces and their subtraces.

<!-- decryptor/postgresql/pg_decryptor.go and decryptor/mysql/response_proxy.go -->
* `ProxyClientConnection`
  time of processing incoming connection from a client, from the moment when SecureSession/TLS
  handshake was done to the moment when connection was closed

  * `ProxyClientConnectionLoop` — corresponds to one exact database packet being checked and processed

    * `censor` — corresponds to the stage when query is being checked by AcraCensor

<!-- decryptor/postgresql/pg_decryptor.go -->
* `PgDecryptStream` (PostgreSQL-specific)
  like `ProxyClientConnection` but tracks time needed to process data from database back to client;
  this trace starts after first response from PostgreSQL database

  * `PgDecryptStreamLoop` (PostgreSQL-specific) — corresponds to one query response being processed

<!-- decryptor/mysql/response_proxy.go -->
* `ProxyDatabaseConnection`
  MySQL-specific alternative to PgDecryptStream,
  but the trace starts after connection to MySQL database was established

  * `ProxyDatabaseConnectionLoop` MySQL-specific alternative to PgDecryptStreamLoop

<!-- network/trace.go -->
<!-- * `HTTPApiConnection` _TODO_ -->

<!-- network/proxy.go -->
* `ProxyWithTracing` (AcraConnector-specific)
  traces how much time connection was proxied, starting after client→AcraConnector SecureSession/TLS
  handshake was done and AcraConnector→AcraServer connection was established

<!-- cmd/acra-connector/acra-connector.go -->
* `handleConnection` (AcraConnector-specific)
  similar to `ProxyWithTracing` but starts as soon as TCP socket client→AcraConnector was created,
  so it's roughly the lifetime of TCP stream

  * `WrapClient` — only includes SecureSession/TLS handshake time

<!-- cmd/acra-server/common/client_commands_session.go -->
* `HandleSession` (AcraServer-specific)
  tracks time taken by processing HTTP API requests; since HTTP server does not support keep-alives,
  this trace measures processing time for all requests

<!-- cmd/acra-server/common/listener.go -->
* `WrapServer` (AcraServer-specific)
  tracks time of SecureSession/TLS handshakes for incoming connections

  * `<function>`
    * if `handleCommandsConnection` — tracks processing time of requests to HTTP API.
