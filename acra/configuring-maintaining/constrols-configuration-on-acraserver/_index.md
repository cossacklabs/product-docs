---
title: Controls configuration on AcraServer
bookCollapseSection: true
weight: 3
---

# Controls configuration on AcraServer

Depending on which security control we are talking about, the exact way of enabling/configuring it may differ.

## Encryptor config

Features configured in file passed in `--encryptor_config_file` CLI option.
If you need any of these, the encryptor config is a must have.

* [Transparent encryption](/acra/security-controls/encryption/)
* [Searchable encryption](/acra/security-controls/searchable-encryption/)
* [Masking](/acra/security-controls/masking/)
* [Tokenization](/acra/security-controls/tokenization/)
* [Zones](/acra/security-controls/zones)
  (configured in encryptor config, but enabled with `--zonemode_enable`)

## CLI flags

Features configured with CLI flags.
`--config_file <options.yml>` may be used instead, AcraServer will read options from a file.

* [Intrusion detection](/acra/security-controls/intrusion-detection/)

  Detecting abnormal activity of clients trying to access data they were no supposed to access.

  Enabled with `--poison_detect_enable`.
  Configured with [`--poison_*` flags]({{<ref "acra/security-controls/intrusion-detection/_index.md#command-line-flags" >}}).
  Requires special "poison records" inserted in the database in order to have effect
  ([example](/acra/security-controls/intrusion-detection#usage-example").

* [Key management]({{<ref "acra/security-controls/key-management/_index.md" >}})

  Telling Acra where the keys are stored so it can perform crypto-related things.

  The main key, ["master key"]({{< ref "acra/security-controls/key-management/operations/generation.md#master-keys" >}})
  is read from `ACRA_MASTER_KEY` environment var, but can also be
  [fetched from HashiCorp Vault]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#hashicorp-vault" >}}).

  Then, there are client- and zone-specific keys, AcraServer can read them
  [from filesystem (`--keys_dir`)]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#keystore" >}}) or
  [from Redis (`--redis_*` flags)]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#command-line-flags" >}}).

* [Programmatic reactions](/acra/security-controls/security-logging-and-events/programmatic-reactions/)

  Performing configured activity (i.e. running a script/binary)
  on some events (i.e. client attempted to read a poison record).

  Actual configuration depends on the feature you deal with.

* [Audit logging](/acra/security-controls/security-logging-and-events/audit-logging/)

  Ensuring that log produced by AcraServer itself is not altered/corrupted/truncated in any way.

  Enabled with `--audit_log_enable`. Requires
  [additional preparation](/acra/security-controls/security-logging-and-events/audit-logging/#how-setup-secure-logging).
  Produced logs should be checked with
  [acra-log-verifier]({{< ref "acra/configuring-maintaining/general-configuration/acra-log-verifier.md" >}}).

* [SIEM/SOC integration](/acra/security-controls/security-logging-and-events/siem-soc-integration/)

  Export logs and security events as file or direct a stream into your SIEM/SOC software.

* [SQL firewall]({{<ref "acra/security-controls/sql-firewall/_index.md" >}}) (aka AcraCensor)

  Protecting against SQL injections. Whitelisting/blacklisting specific queries. Logging queries.

  Enabled with `--acracensor_config_file <config.yml>`, which also specifies a configuration file for this specific feature.

* [Transport security]({{<ref "acra/security-controls/transport-security/_index.md" >}})

  Configuring secure connection between AcraServer and clients, between AcraServer and the database.

  For TLS, there are a plenty of
  [`--tls_*` options]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#tls" >}}).
  You can use TLS for both sides, but there is also Secure Session you can use if clients
  use AcraConnector to connect to AcraServer.
  Also, make sure you know what [client ID]({{< ref "acra/guides/integrating-acra-server-into-infrastructure/client_id.md" >}})
  is as it's something Acra-related, not a part of TLS or SQL.
