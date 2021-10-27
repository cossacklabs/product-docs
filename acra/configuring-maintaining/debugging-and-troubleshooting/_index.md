---
title: Debugging and troubleshooting
weight: 12
---

# Debugging and troubleshooting

## Verbose logging

In order to get more logs from AcraConnector, AcraServer or AcraTranslator, you can add `-v` (or even `-d`) flags to their configuration.
You can also switch `-d` flag in running AcraServer using [acra-webconfig](/acra/configuring-maintaining/general-configuration/acra-webconfig/).

A lot of things may become clear:
* wrong hosts/ports in configuration
* problems with TLS certificates
* inability to find keys for clients/zones

## Tracing

When requests are taking much more time that you have expected,
[analyzing traces](/acra/configuring-maintaining/tracing/) may give you hints about which place is the bottleneck.


## PostgreSQL data types

AcraServer only supports storing AcraStructs/AcraBlocks in `bytea` column types and supports 3 types of binary data encoding from PostgreSQL: [hex](https://www.postgresql.org/docs/current/datatype-binary.html#AEN5755), [escape](https://www.postgresql.org/docs/current/datatype-binary.html#AEN5764), and `binary` (when client libraries use [extended query protocol](https://www.postgresql.org/docs/current/protocol-overview.html#PROTOCOL-QUERY-CONCEPTS) with the [binary](https://www.postgresql.org/docs/current/protocol-overview.html#PROTOCOL-FORMAT-CODES) format).