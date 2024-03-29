---
title: acra-translator
weight: 4
---

# acra-translator

## Command line flags

* `--acraconnector_transport_encryption_disable={true|false}`

  Use raw transport (tcp/unix socket) between AcraTranslator and client app.
  It turns off reading trace from client app's side which usually sent by AcraConnector (**deprecated since 0.91.0**, will be removed soon).
  Default is `false`.

* `--acratranslator_client_id_from_connection_enable={true|false}`

  Use clientID from TLS certificates or secure session handshake (before 0.92.0) for gRPC requests. It doesn't change clientID usage
  for HTTP API requests.
  Default is `false` which means "use the one passed in gRPC methods".

* `--audit_log_enable={true|false}`

  Enable audit log functionality.
  Default is `false`.

* `--incoming_connection_close_timeout=<seconds>`

  Time that AcraTranslator will wait (in seconds) on stop signal before closing all connections.
  Default is 10.

* `--incoming_connection_grpc_string=<url>`

  Connection string for gRPC transport like `grpc://0.0.0.0:9696`.
  Default is empty which means "use `grpc://0.0.0.0:9696`".

* `--incoming_connection_http_string=<url>`

  Connection string for HTTP transport like `http://0.0.0.0:9595`.
  Default is empty.

* `--keys_dir=<path>`

  Folder from which keys will be loaded.
  Default is `.acrakeys`.

* `--poison_detect_enable={true|false}`

  Turn on poison record detection. If shutdown is not enabled, AcraTranslator just logs the poison record detection and returns error.
  Default is `false` (since 0.92.0).

* `--poison_run_script_file=<filename>`

  On detecting poison record: log about poison record detection, execute script, return decrypted data.
  Default is empty (don't execute any script).

* `--poison_shutdown_enable={true|false}`

  On detecting poison record: log about poison record detection, stop and shutdown.
  Default is `false`.

* `--redis_db_keys=<id>`

  Number of Redis database for keys.
  Default is `0`.
  <!-- `acra-translator -help` says default is `-1` but in `cmd/redis.go` I see `redisDefaultDB = 0` -->
  <!-- this var is also used as default value for the flag, where's the truth? -->

* `--redis_db_tokens=<id>`

  Number of Redis database for tokens.
  Default is `0`.
  <!-- `acra-translator -help` says default is `-1` but in `cmd/redis.go` I see `redisDefaultDB = 0` -->
  <!-- this var is also used as default value for the flag, where's the truth? -->

* `--redis_host_port=<host:port>`

  `<host:port>` used to connect to Redis.
  Default is empty (don't connect).

* `--redis_password=<password>`

  Password to Redis database.

* `--redis_tls_client_auth=<mode>`

  Set authentication mode that will be used for TLS connection with Redis.

  * `-1` — not specified, common `--tls_ca` value will be used.
  * `0` — do not request client certificate, ignore it if received;
  * `1` — request client certificate, but don't require it;
  * `2` — expect to receive at least one certificate to continue the handshake;
  * `3` — don't require client certificate, but validate it if client actually sent it;
  * `4` — (default) request and validate client certificate.

  These values correspond to [crypto.tls.ClientAuthType](https://golang.org/pkg/crypto/tls/#ClientAuthType).

* `--redis_tls_client_ca=<filename>`

  Path to additional CA certificate for Redis' certificate validation.
  Empty by default.
  If not specified, AcraTranslator uses value from `--tls_ca` flag.


* `--redis_tls_client_cert=<filename>`

  Path to TLS certificate presented to Redis.
  Empty by default.
  If not specified, AcraTranslator uses value from `--tls_cert` flag.


* `--redis_tls_client_key=<filename>`

  Path to private key of the TLS certificate presented to Redis.
  Empty by default.
  If not specified, AcraTranslator uses value from `--tls_key` flag.

* `--redis_tls_client_sni=<SNI>`

  Expected Server Name (SNI) of the Redis instance. Will be used `--redis_host_port` value if is empty.
  Empty by default.


* `--redis_tls_crl_client_cache_size=<count>`

  How many CRLs to cache in memory in connections to Redis.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.
  If not specified, AcraTranslator uses value from `--tls_crl_cache_size` flag.


* `--redis_tls_crl_client_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds for connections to Redis.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.
  If not specified, AcraTranslator uses value from `--tls_crl_cache_time` flag.


* `--redis_tls_crl_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Redis' certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.
  If not specified, AcraTranslator uses value from `--tls_crl_check_only_leaf_certificate` flag.


* `--redis_tls_crl_client_from_cert=<policy>`

  How to treat CRL's URL described in a certificate from Redis server

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--redis_tls_crl_client_url` flags.
  If not specified, AcraTranslator uses value from `--tls_crl_from_cert` flag.


* `--redis_tls_crl_client_url=<url>`

  CRL's URL for outcoming TLS connections to Redis.
  Empty by default.
  If not specified, AcraTranslator uses value from `--tls_crl_url` flag.


* `--redis_tls_enable=<true|false>`

  Turns on/off TLS for connection with Redis to `--redis_host_port` endpoint.

  * `true` — turns on
  * `false` — (default) turns off.


* `--redis_tls_ocsp_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Redis' certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no OCSP's URL configured and there is no OCSP's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know whom to ask about them.
  If not specified, AcraTranslator uses value from `--tls_ocsp_check_only_leaf_certificate` flag.


* `--redis_tls_ocsp_client_from_cert=<policy>`

  How to treat OCSP server URL described in a certificate from Redis server

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--redis_tls_ocsp_client_url` flags.
  If not specified, AcraTranslator uses value from `--tls_ocsp_from_cert` flag.


* `--redis_tls_ocsp_client_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested Redis' certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration
  If not specified, AcraTranslator uses value from `--tls_ocsp_required` flag.


* `--redis_tls_ocsp_client_url=<url>`

  OCSP service URL for outgoing TLS connections to check Redis' certificates.
  Empty by default.
  If not specified, AcraTranslator uses value from `--tls_ocsp_url` flag.

* `--securesession_id=<id>`

  ID that will be sent during secure session handshake (**deprecated since 0.91.0**, will be removed soon).
  Default is `acra_translator`.

### Configuration files

* `--config_file=<filename>`

  Path to YAML configuration file.

* `--dump_config`

  Dump configuration to `configs/acra-translator.yaml`.

* `--generate_markdown_args_table`

  Generate markdown file with text description of all flags.
  Output file is `configs/markdown_acra-translator.md`.
  Works in a pair with `--dump_config`.

### Monitoring

#### Logging

* `-d`

  Log to stderr all `DEBUG`, `INFO`, `WARNING` and `ERROR` logs.

* `-v`

  Log to stderr all `INFO`, `WARNING` and `ERROR` logs.

* `--log_to_console={true|false}`

  Enable or disable AcraTranslator's logs.
  Default is `true` (logs are enabled).

* `--log_to_file=<filename>`

  Log to file if non-empty value was passed.
  Default is empty.

* `--logging_format={plaintext|json|CEF}`

  Logging format.

  * `plaintext` — (default) pretty human readable key/value format<br>
    ```
    time="2021-07-12T14:02:12+03:00" level=info msg="Starting service acra-translator [pid=475995]" version=0.85.0
    ```

  * `json` — one JSON object per line, easy to parse by most log collectors<br>
    ```
    {"level":"info","msg":"Starting service acra-translator [pid=476077]","product":"acra-translator","timestamp":"2021-07-12T14:02:50+03:00","unixTime":"1626087770.004","version":"0.85.0"}
    ```

  * `CEF` — Common Event Format<br>
    ```
    CEF:0|cossacklabs|acra-translator|0.85.0|100|Starting service acra-translator [pid\=476133]|1|unixTime=1626087782.510
    ```

* `--tracing_log_enable={true|false}`

  Export trace data to log.
  Default is `false`.

#### Metrics (Prometheus)

* `--incoming_connection_prometheus_metrics_string=<url>`

  URL which will be used to expose Prometheus metrics (use `<url>/metrics` address to pull metrics).
  Default is empty.

#### Tracing (Jaeger)

* `--jaeger_agent_endpoint=<addr>`

  Jaeger agent endpoint that will be used to export trace data.
  Example: `localhost:6831`.
  Default is empty.

* `--jaeger_basic_auth_password=<password>`

  Password used for basic auth (optional) to jaeger.

* `--jaeger_basic_auth_username=<username>`

  Username used for basic auth (optional) to jaeger.

* `--jaeger_collector_endpoint=<url>`

  Jaeger endpoint that will be used to export trace data.
  Example: `http://localhost:14268/api/traces`.
  Default is empty.

* `--tracing_jaeger_enable={true|false}`

  Export trace data to jaeger.
  Default is `false`.

### Keystore

* `--keystore_cache_size=<count>`

  Maximum number of keys stored in in-memory LRU cache in encrypted form. 0 - no limits, -1 - turn off cache
  Default is `1000` (since 0.92.0, previous default value is `0`).

* `--keystore_cache_on_start_enable={true|false}`

  Load all keystore keys to cache on start. Should be provided only with enabled keystore cache (`--keystore_cache_size` >= 0 ).
  Currently, supported only for keystore `v1` and will fail to start for keystore `v2`.
  Default is `true`.

### TLS

* `--acratranslator_tls_transport_enable={true|false}`

  Use TLS transport (tcp/unix socket) between AcraTranslator and client app (**deprecated since 0.91.0**, will be removed soon).
  Default is `false`.

* `--tls_auth=<mode>`

  Set authentication mode that will be used for TLS connection.

  * `0` — do not request client certificate, ignore it if received;
  * `1` — request client certificate, but don't require it;
  * `2` — expect to receive at least one certificate to continue the handshake;
  * `3` — don't require client certificate, but validate it if client actually sent it;
  * `4` — (default) request and validate client certificate.

  These values correspond to [crypto.tls.ClientAuthType](https://golang.org/pkg/crypto/tls/#ClientAuthType).

* `--tls_key=<filename>`

  Path to private key that will be used for TLS handshake.
  Should correspond to the certificate configured with `--tls_cert`.
  Empty by default.

* `--tls_cert=<filename>`

  Path to TLS certificate that will be sent to other peers during handshake.
  Empty by default.

* `--tls_ca=<filename>`

  Path to additional CA certificate for application/AcraConnector certificates validation.
  Empty by default.

* `--tls_identifier_extractor_type=<type>`

  Decide which field of TLS certificate to use as ClientID.

  * `distinguished_name` — (default) certificate Distinguished Name (DN)
  * `serial_number` — certificate serial number

For additional certificate validation flags, see corresponding pages:
[OCSP](/acra/configuring-maintaining/tls/ocsp/) and
[CRL](/acra/configuring-maintaining/tls/crl/).

* `--keystore_encryption_type=<strategy>`

  Keystore encryption strategy.
  Currently supported strategies:
  * **`env_master_key`** (**Default**) - Keystore using Acra Master Key, loaded from ENV (`ACRA_MASTER_KEY`) variable;
  * **`vault_master_key`** - Keystore using Acra Master Key, loaded from Hashicorp Vault
  * **`kms_encrypted_master_key`** - Keystore using Acra Master Key, loaded from ENV `ACRA_MASTER_KEY` variable and
    decrypted via KMS key-encryption key.
  * **`kms_per_client`** - Keystore using KMS for decryption Acra keys per ClientID and ZoneID (zones are deprecated since 0.94.0, will be removed in 0.95.0).


### KMS

* `--kms_type=<type>`

  Specify your KMS.
  Currently supported KMS types:
  * `aws` - AWS Key Management Service

* `--kms_credentials_path=<filepath>`

  A path to a file with KMS credentials JSON format.

  Example of KMS config:
* **AWS**:
  ```json
     {"access_key_id":"<access_key_id>","secret_access_key":"<secret_access_key>","region":"<region>"}
  ```

{{< hint info >}}
**Note**:
Should be provided only with `--keystore_encryption_type=<kms_encrypted_master_key|kms_per_client>` flags.
{{< /hint >}}

### HashiCorp Vault

* `--vault_connection_api_string=<url>`

  Connection string (like `http://x.x.x.x:yyyy`) for loading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is empty (`ACRA_MASTER_KEY` environment variable is expected).

* `--vault_secrets_path=<path>`

  KV Secret Path for reading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is `secret/`.

* `--vault_tls_transport_enable=<true|false>`

  Turns on/off TLS for connection with vault to `--vault_connection_api_string` endpoint.

  * `true` — turns on
  * `false` — (default) turns off.

* `--vault_tls_client_auth=<mode>`

  Set authentication mode that will be used for TLS connection with Vault.

  * `0` — do not request client certificate, ignore it if received;
  * `1` — request client certificate, but don't require it;
  * `2` — expect to receive at least one certificate to continue the handshake;
  * `3` — don't require client certificate, but validate it if client actually sent it;
  * `4` — (default) request and validate client certificate.

  These values correspond to [crypto.tls.ClientAuthType](https://golang.org/pkg/crypto/tls/#ClientAuthType).
  If not specified, AcraTranslator uses value from `--tls_auth` flag. (since 0.96.0)

* `--vault_tls_ca_path=<filename>`

  Path to CA certificate for HashiCorp Vault certificate validation.
  Default is empty (deprecated since 0.94.0, use `vault_tls_client_ca` instead).


* `--vault_tls_client_ca=<filename>`

  Path to AcraTranslator TLS certificate's CA certificate for Vault certificate validation (AcraTranslator works as "client" when communicating with Vault).
  Empty by default.
  If not specified, AcraTranslator uses value from `--tls_ca` flag. (since 0.96.0)


* `--vault_tls_client_cert=<filename>`

  Path to AcraTranslator TLS certificate presented to Vault (AcraTranslator works as "client" when communicating with Vault).
  Empty by default.
  If not specified, AcraTranslator uses value from `--tls_cert` flag. (since 0.96.0)


* `--vault_tls_client_key=<filename>`

  Path to AcraTranslator TLS certificate's private key of the TLS certificate presented to Vault (AcraTranslator works as "client" when communicating with Vault).
  Empty by default.
  If not specified, AcraTranslator uses value from `--tls_key` flag. (since 0.96.0)


* `--vault_tls_client_sni=<SNI>`

  Expected Server Name (SNI) of the Vault instance. Will be used `--vault_connection_api_string` value if is empty.
  Empty by default.


* `--vault_tls_crl_client_cache_size=<count>`

  How many CRLs to cache in memory in connections to Vault.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.
  If not specified, AcraTranslator uses value from `--tls_crl_cache_size` flag. (since 0.96.0)


* `--vault_tls_crl_client_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds for connections to Vault.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.
  If not specified, AcraTranslator uses value from `--tls_cache_time` flag. (since 0.96.0)


* `--vault_tls_crl_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Vault certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.
  If not specified, AcraTranslator uses value from `--tls_crl_check_only_leaf_certificate` flag. (since 0.96.0)


* `--vault_tls_crl_client_from_cert=<policy>`

  How to treat CRL's URL described in a certificate from Vault server/agent

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--vault_tls_crl_client_url` flags.
  If not specified, AcraTranslator uses value from `--tls_crl_from_cert` flag. (since 0.96.0)


* `--vault_tls_crl_client_url=<url>`

  CRL's URL for outcoming TLS connections to Vault.
  Empty by default.
  If not specified, AcraTranslator uses value from `--tls_crl_url` flag. (since 0.96.0)


* `--vault_tls_ocsp_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Vault certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no OCSP's URL configured and there is no OCSP's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know whom to ask about them.
  If not specified, AcraTranslator uses value from `--tls_ocsp_check_only_leaf_certificate` flag. (since 0.96.0)


* `--vault_tls_ocsp_client_from_cert=<policy>`

  How to treat OCSP server URL described in a certificate from Vault server.

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--vault_tls_ocsp_client_url` flags.
  If not specified, AcraTranslator uses value from `--tls_ocsp_from_cert` flag. (since 0.96.0)


* `--vault_tls_ocsp_client_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested Vault certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration
  If not specified, AcraTranslator uses value from `--tls_ocsp_required` flag. (since 0.96.0)


* `--vault_tls_ocsp_client_url=<url>`

  OCSP service URL for outgoing TLS connections to check Vaults' certificates.
  Empty by default.
  If not specified, AcraTranslator uses value from `--tls_ocsp_url` flag. (since 0.96.0)

{{< hint info >}}
**Note**:
Should be provided only with `--keystore_encryption_type=<vault_master_key>` flag.
{{< /hint >}}

## Keys

There are few different kinds of keys for different purposes.
When generating them, few things should be kept in mind:
* `ACRA_MASTER_KEY` should be set containing master key of same keystore version
* Output directory should have no permissions for group and others

`client1` in examples is the identifier of client that can be either sent in
RPC requests or derived from the client TLS certificate depending on configuration.

### Storage keys

Required for encrypt/decrypt requests.

```
acra-keymaker \
    --keystore=v1 \
    --client_id=client1 \
    --generate_acrawriter_key \
    --keys_output_dir=/tmp/translator_keys
```

### Transport keys

{{< hint warning >}}
AcraConnector and its transport keys are deprecated since 0.91 and removed since 0.92. Consider migrating to TLS instead.
{{< /hint >}}

Used in `AcraConnector ↔︎ AcraTranslator` connection with `SecureSession` as transport encryption.

```
acra-keymaker \
    --keystore=v1 \
    --client_id=client1 \
    --generate_acratranslator_keys \
    --keys_output_dir=/tmp/translator_keys
```


### HMAC keys

Required for hashing requests, as well as searchable encryption/decryption.

```
acra-keymaker \
    --keystore=v1 \
    --client_id=client1 \
    --generate_hmac_key \
    --keys_output_dir=/tmp/translator_keys
```

### Symmetric storage keys

Required for tokenization/detokenization requests.

```
acra-keymaker \
    --keystore=v1 \
    --client_id=client1 \
    --generate_symmetric_storage_key \
    --keys_output_dir=/tmp/translator_keys
```

## POSIX Signals

There are a couple of signals `acra-translator` reacts on:
- `SIGTERM`, `SIGINT` — graceful shutdown: stop accepting new connections, close existing ones, terminate the process.
- `SIGHUP` — restart: create new AcraTranslator subprocess and transfer opened listener sockets to it, then terminate the current process.
