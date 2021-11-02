---
title: Logging
bookCollapseSection: true
weight: 9
---

# Logging in Acra

Starting with version [`0.77.0`](https://github.com/cossacklabs/acra/releases/tag/0.77.0), Acra supports [multiple logging formats](/acra/configuring-maintaining/logging/formats/)

- plaintext
- CEF
- JSON

Acra logs are compatible with various external log analysis tools (like [ELK stack](https://www.elastic.co/elk-stack)) and SIEM systems.

{{< hint info >}}
**Note:**
Wondering what different logs, metrics, traces look like in Acra? Check out the [engineering examples](https://github.com/cossacklabs/acra-engineering-demo/)!
{{< /hint >}}

## Configuring logging

Logging mode and verbosity level can be configured for AcraServer, AcraConnector, AcraTranslator and AcraWebConfig in the corresponding `yaml` files or passed as CLI parameter.

* `--logging_format`
  
Set the logging format to use.

- `plaintext` (default)
- `cef`
- `json`

  The values are case-insensitive.
  [Learn more about supported formats.](/acra/configuring-maintaining/logging/formats/)

* `-v`

  Enable verbose logging, useful for debugging.

To see an example of logging, check out the default configuration of AcraServer in [`acra-server.yaml`](https://github.com/cossacklabs/acra/blob/master/configs/acra-server.yaml#L99).