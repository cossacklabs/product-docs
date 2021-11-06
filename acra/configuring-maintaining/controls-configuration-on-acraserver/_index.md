---
title: Controls configuration on AcraServer
weight: 3
---

# Controls configuration on AcraServer

AcraServer's security controls have the exact way of enabling/disabling and configuring them.

AcraServer can be configured from command line using CLI flags ([see the whole list](/acra/configuring-maintaining/general-configuration/acra-server/#command-line-flags)), or from a configuration file which should be defined as `--config_file <options.yml>` .


* Data protection security controls

  There are a couple features that can only be enabled/configured in file passed in `--encryptor_config_file` CLI option.
  If you need any of these, the encryptor config is a must have.
  Each feature is configured per table column (except the last one).

  * [Transparent encryption](/acra/security-controls/encryption/) —
    AcraServer will silently replace plaintext with its encrypted version before storing data in the database;
  * [Searchable encryption](/acra/security-controls/searchable-encryption/) —
    provides searching capability over encrypted values stored in the database without decrypting them;
  * [Masking](/acra/security-controls/masking/) —
    provides configurable way of partial or zero-disclosure of sensitive data to unauthorized users;
  * [Tokenization](/acra/security-controls/tokenization/) —
    provides a format-preserving way of storing tokens (number, string, email-looking values) while the original data is stored encrypted in a dedicated separate storage (Redis).
  * [Zones](/acra/security-controls/zones) —
    allows using zone-specific keys for cryptographic operations;
    configured in encryptor config, but enabled with `--zonemode_enable`.

* [Intrusion detection](/acra/security-controls/intrusion-detection/)

  Detecting abnormal activity of clients trying to access data they were no supposed to access.

  Enabled with `--poison_detect_enable`.
  Configured with [`--poison_*` flags](/acra/security-controls/intrusion-detection/#command-line-flags).
  Requires special "poison records" inserted in the database in order to have effect
  ([example](/acra/security-controls/intrusion-detection/#usage-example)).

* [Key management](/acra/security-controls/key-management/)

  Telling Acra where the keys are stored so it can perform crypto-related things.

  The main key, ["Acra Master Key"](/acra/security-controls/key-management/operations/generation/#master-keys)
  is read from `ACRA_MASTER_KEY` environment var, but can also be
  [fetched from HashiCorp Vault](/acra/configuring-maintaining/general-configuration/acra-server/#hashicorp-vault) or [other KMS](/acra/configuring-maintaining/key-storing/kms-integration/).

  Then, there are client- and zone-specific keys, AcraServer can read them
  [from filesystem (`--keys_dir`)](/acra/configuring-maintaining/general-configuration/acra-server/#keystore) or
  [from Redis (`--redis_*` flags)](/acra/configuring-maintaining/general-configuration/acra-server/#command-line-flags).

* [Programmatic reactions](/acra/security-controls/security-logging-and-events/programmatic-reactions/)

  Performing configured activity (i.e. running a script/binary)
  on some events (i.e. client attempted to read a poison record).

  Actual configuration depends on the feature you deal with.

* [Audit logging](/acra/security-controls/security-logging-and-events/audit-logging/)

  Ensuring that log produced by AcraServer itself is not altered/corrupted/truncated in any way.

  Enabled with `--audit_log_enable`. Requires
  [additional preparation](/acra/security-controls/security-logging-and-events/audit-logging/#how-setup-secure-logging).
  Produced logs should be checked with
  [acra-log-verifier](/acra/configuring-maintaining/general-configuration/acra-log-verifier/).

* [SIEM/SOC integration](/acra/security-controls/security-logging-and-events/siem-soc-integration/)

  Exporting logs and security events as file or by direct streaming into your SIEM/SOC software.

* [SQL firewall](/acra/security-controls/sql-firewall/) (aka AcraCensor)

  Protecting against SQL injections. Whitelisting/blacklisting specific queries. Logging queries.

  Enabled with `--acracensor_config_file <config.yml>`, which also specifies a configuration file for this specific feature.

* [Transport security](/acra/security-controls/transport-security/)

  Configuring secure connection between AcraServer and clients, between AcraServer and the database.

  For TLS, there are a plenty of
  [`--tls_*` options](/acra/configuring-maintaining/general-configuration/acra-server/#tls).
  You can use TLS for both sides, but there is also Secure Session you can use if clients
  use AcraConnector to connect to AcraServer.
  Also, make sure you know what [client ID](/acra/guides/integrating-acra-server-into-infrastructure/client_id/)
  is as it's something Acra-related, not a part of TLS or SQL.
