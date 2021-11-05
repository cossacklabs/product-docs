---
title: Controls configuration on AcraTranslator
weight: 4
---

# Controls configuration on AcraTranslator

AcraTranslator's features can be configured via CLI flags ([see the whole list](/acra/configuring-maintaining/general-configuration/acra-server/#command-line-flags)).

Alternatively, `--config_file <options.yml>` may be used instead, and AcraTranslator will read options from a file.

* [Key management](/acra/security-controls/key-management/)

  Telling Acra where the keys are stored so it can perform crypto-related things.

  The main key, ["Acra Master Key"](/acra/security-controls/key-management/operations/generation/#master-keys)
  is read from `ACRA_MASTER_KEY` environment var, but can also be
  [fetched from HashiCorp Vault](/acra/configuring-maintaining/general-configuration/acra-translator/#hashicorp-vault) or [other KMS](/acra/configuring-maintaining/key-storing/kms-integration/).

  Then, there are client- and zone-specific keys, AcraTranslator can read them
  [from filesystem (`--keys_dir`)](/acra/configuring-maintaining/general-configuration/acra-translator/#keystore) or
  [from Redis (`--redis_*` flags)](/acra/configuring-maintaining/general-configuration/acra-translator/#command-line-flags).

* [Audit logging](/acra/security-controls/security-logging-and-events/audit-logging/)

  Ensuring that log produced by AcraTranslator itself is not altered/corrupted/truncated in any way.

  Enabled with `--audit_log_enable`. Requires
  [additional preparation](/acra/security-controls/security-logging-and-events/audit-logging#how-setup-secure-logging).
  Produced logs should be checked with
  [acra-log-verifier](/acra/configuring-maintaining/general-configuration/acra-log-verifier/).

* [Transport security](/acra/security-controls/transport-security/)

  Configuring secure connection between AcraTranslator and clients.

  For TLS, there are a plenty of
  [`--tls_*` options](/acra/configuring-maintaining/general-configuration/acra-translator/#tls).
  You can use either TLS (for direct connections from clients) or Themis Secure Session (when using AcraConnector).
  Also, make sure you know what [client ID](/acra/guides/integrating-acra-server-into-infrastructure/client_id/)
  is as it's something Acra-related, not a part of TLS or SQL.
  There are multiple ways of specifying client ID, including TLS certificate metadata, AcraConnector CLI flag, or
  simply passing it in RPC requests.
