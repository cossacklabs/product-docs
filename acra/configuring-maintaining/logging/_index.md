---

weight: 1
title: Logging
bookCollapseSection: true
---

# Logging in Acra

Starting with version [`0.77.0`](https://github.com/cossacklabs/acra/releases/tag/0.77.0), Acra supports three different logging formats: plaintext, [CEF](https://kc.mcafee.com/resources/sites/MCAFEE/content/live/CORP_KNOWLEDGEBASE/78000/KB78712/en_US/CEF_White_Paper_20100722.pdf), JSON.

Acra logs are compatible with various external log analysing tools (like [ELK stack](https://www.elastic.co/elk-stack)) and SIEM systems.

Logging mode and verbosity level can be configured for AcraServer, AcraTranslator and AcraWebConfig in the corresponding `yaml` files or passed as CLI parameter.

Possible meanings for `logging_format` (case independent): 
- plaintext
- cef
- json

Verbosity level is enabled by changing `v` to `true`

To see an example of logging, check out the default configuration of AcraServer in [`acra-server.yaml`](https://github.com/cossacklabs/acra-Q12021/blob/master/configs/acra-server.yaml#L99).

{{< hint info >}}
**Note:**
Wondering what different logs, metrics, traces look like in Acra? Check out the [engineering examples](https://github.com/cossacklabs/acra-engineering-demo/)!
{{< /hint >}}