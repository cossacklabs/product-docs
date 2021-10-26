---
title: Controls configuration on AcraTranslator
bookCollapseSection: true
weight: 4
---

# Controls configuration on AcraTranslator

Features are configured with CLI flags ([see whole list]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#command-line-flags">}})).
`--config_file <options.yml>` may be used instead, AcraTranslator will read options from a file.

* [Key management]({{<ref "acra/security-controls/key-management/_index.md" >}})

  Telling Acra where the keys are stored so it can perform crypto-related things.

  The main key, ["master key"]({{< ref "acra/security-controls/key-management/operations/generation.md#master-keys" >}})
  is read from `ACRA_MASTER_KEY` environment var, but can also be
  [fetched from HashiCorp Vault]({{< ref "acra/configuring-maintaining/general-configuration/acra-translator.md#hashicorp-vault" >}}).

  Then, there are client- and zone-specific keys, AcraTranslator can read them
  [from filesystem (`--keys_dir`)]({{< ref "acra/configuring-maintaining/general-configuration/acra-translator.md#keystore" >}}) or
  [from Redis (`--redis_*` flags)]({{< ref "acra/configuring-maintaining/general-configuration/acra-translator.md#command-line-flags" >}}).

* [Audit logging](/acra/security-controls/security-logging-and-events/audit-logging/)

  Ensuring that log produced by AcraTranslator itself is not altered/corrupted/truncated in any way.

  Enabled with `--audit_log_enable`. Requires
  [additional preparation](/acra/security-controls/security-logging-and-events/audit-logging#how-setup-secure-logging).
  Produced logs should be checked with
  [acra-log-verifier]({{< ref "acra/configuring-maintaining/general-configuration/acra-log-verifier.md" >}}).

* [Transport security]({{<ref "acra/security-controls/transport-security/_index.md" >}})

  Configuring secure connection between AcraTranslator and clients.

  For TLS, there are a plenty of
  [`--tls_*` options]({{< ref "acra/configuring-maintaining/general-configuration/acra-translator.md#tls" >}}).
  You can use either TLS (for direct connections from clients) or Secure Session (when using AcraConnector).
  Also, make sure you know what [client ID]({{< ref "acra/guides/integrating-acra-server-into-infrastructure/client_id.md" >}})
  is as it's something Acra-related, not a part of TLS or SQL.
  There are multiple ways of specifying client ID, including TLS certificate metadata, AcraConnector CLI flag, or
  simply passing it in RPC requests.
