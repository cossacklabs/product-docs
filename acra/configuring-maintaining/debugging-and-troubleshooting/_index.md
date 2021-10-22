---
title: Debugging and troubleshooting
weight: 12
---

# Debugging and troubleshooting

## Verbose logging

In order to get more logs from AcraConnector, AcraServer or AcraTranslator, you can add `-v` (or even `-d`) flags to their configuration.
You can also switch `-d` flag in running AcraServer using [acra-webconfig]({{< ref "../general-configuration/acra-webconfig" >}}).

A lot of things may become clear:
* wrong hosts/ports in configuration
* problems with TLS certificates
* inability to find keys for clients/zones

## Tracing

When requests are taking much more time that you have expected,
[analyzing traces]({{< ref "../tracing" >}}) may give you hints about which place is the bottleneck.
