---
title: AcraTranslator
bookCollapseSection: true
weight: 2
---

# AcraTranslator

## Command line flags

(excluding TLS-related flags that are listed [here](/acra/configuring-maintaining/tls))

* `--acraconnector_transport_encryption_disable={true|false}`

  Use raw transport (tcp/unix socket) between AcraTranslator and client app.
  It turns off reading trace from client app's side which usually sent by AcraConnector.
  Default is `false`.

* `--acratranslator_client_id_from_connection_enable={true|false}`

  Use clientID from TLS certificates or secure session handshake.
  Default is `false` which means "use the one passed in gRPC methods".

* `--audit_log_enable={true|false}`

  Enable audit log functionality.
  Default is `false`.

* `--config_file=<filename>`

  Path to YAML configuration file.

* `-d`

  Log everything to stderr.

* `--dump_config`

  Dump configuration to `configs/acra-translator.yaml`.

* `--generate_markdown_args_table`

  Generate markdown file with text description of all flags.
  Output file is `configs/markdown_acra-translator.md`.
  Works in pair with `--dump_config`.

* `--incoming_connection_close_timeout=<seconds>`

  Time that AcraTranslator will wait (in seconds) on stop signal before closing all connections.
  Default is 10.

* `--incoming_connection_grpc_string=<url>`

  Connection string for gRPC transport like `grpc://0.0.0.0:9696`.
  Default is empty which means "use `grpc://0.0.0.0:9696`".

* `--incoming_connection_http_string=<url>`

  Connection string for HTTP transport like `http://0.0.0.0:9595`.
  Default is empty.

* `--incoming_connection_prometheus_metrics_string=<url>`

  URL which will be used to expose Prometheus metrics (use `<url>/metrics` address to pull metrics).
  Default is empty.

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

* `--keys_dir=<path>`

  Folder from which keys will be loaded.
  Default is `.acrakeys`.

* `--keystore_cache_size=<count>`

  Count of keys that will be stored in in-memory LRU cache in encrypted form.
  Use `0` to set unlimited size, `-1` to disable caching.
  Default is `0`.

* `--log_to_console={true|false}`

  Log to stderr.
  Default is `true`.

* `--log_to_file=<filename>`

  Log to file if non-empty value was passed.
  Default is empty.

* `--logging_format={plaintext|json|CEF}`

  Logging format.

  * `plaintext` — (default) pretty human readable key/value format  
    `time="2021-07-12T14:02:12+03:00" level=info msg="Starting service acra-translator [pid=475995]" version=0.85.0`

  * `json` — one JSON object per line, easy to parse by most log collectors  
    `{"level":"info","msg":"Starting service acra-translator [pid=476077]","product":"acra-translator","timestamp":"2021-07-12T14:02:50+03:00","unixTime":"1626087770.004","version":"0.85.0"}`

  * `CEF` — Common Event Format  
    `CEF:0|cossacklabs|acra-translator|0.85.0|100|Starting service acra-translator [pid\=476133]|1|unixTime=1626087782.510`

* `--poison_detect_enable={true|false}`

  Turn on poison record detection, if server shutdown is disabled, AcraTranslator logs the poison record detection and returns error.
  Default is `true`.

* `--poison_run_script_file=<filename>`

  On detecting poison record: log about poison record detection, execute script, return decrypted data.
  Default is empty (don't execute any script).

* `--poison_shutdown_enable={true|false}`

  On detecting poison record: log about poison record detection, stop and shutdown.
  Default is `false`.

* `--redis_db_keys=`

  Number of Redis database for keys.
  Default is `0`.
  <!-- `acra-translator -help` says default is `-1` but in `cmd/redis.go` I see `redisDefaultDB = 0` -->
  <!-- this var is also used as default value for the flag, where's the truth? -->

* `--redis_db_tokens=`

  Number of Redis database for tokens.
  Default is `0`.
  <!-- `acra-translator -help` says default is `-1` but in `cmd/redis.go` I see `redisDefaultDB = 0` -->
  <!-- this var is also used as default value for the flag, where's the truth? -->

* `--redis_host_port=<host:port>`

  `<host:port>` used to connect to Redis.
  Default is empty (don't connect).

* `--redis_password=<password>`

  Password to Redis database.

* `--securesession_id=<id>`

  ID that will be sent in secure session handshake.
  Default is `acra_translator`.

* `--tracing_jaeger_enable={true|false}`

  Export trace data to jaeger.
  Default is `false`.

* `--tracing_log_enable={true|false}`

  Export trace data to log.
  Default is `false`.

* `-v`

  Log to stderr all `INFO`, `WARNING` and `ERROR` logs.

* `--vault_connection_api_string=<url>`

  Connection string (like `http://x.x.x.x:yyyy`) for loading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is empty (`ACRA_MASTER_KEY` environment variable is expected).

* `--vault_secrets_path=<path>`

  KV Secret Path for reading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is `secret/`.

* `--vault_tls_ca_path=<filename>`

  Path to CA certificate for HashiCorp Vault certificate validation.
  Default is empty (use root certificates configured in system).

* `--vault_tls_client_cert=<filename>`

  Path to client TLS certificate for reading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is empty (don't send client certificate).

* `--vault_tls_client_key=<filename>`

  Path to private key of the client TLS certificate for reading `ACRA_MASTER_KEY` from HashiCorp Vault.
  Default is empty (don't send client certificate).

* `--vault_tls_transport_enable={true|false}`

  Use TLS to encrypt transport with HashiCorp Vault.
  Default is `false`.

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
    --keystore=v2 \
    --client_id=client1 \
    --generate_acrawriter_key \
    --keys_output_dir=/tmp/translator_keys
```

### HMAC keys

Required for hashing requests, as well as searchable encryption/decryption.

```
acra-keymaker \
    --keystore=v2 \
    --client_id=client1 \
    --generate_hmac_key \
    --keys_output_dir=/tmp/translator_keys
```

### Symmetric storage keys

Required for tokenization/detokenization requests.

```
acra-keymaker \
    --keystore=v2 \
    --client_id=client1 \
    --generate_symmetric_storage_key \
    --keys_output_dir=/tmp/translator_keys
```

### Transport keys

Used in `AcraConnector <-> AcraTranslator` connection with `SecureSession` as transport encryption.

```
acra-keymaker \
    --keystore=v2 \
    --client_id=client1 \
    --generate_acratranslator_keys \
    --keys_output_dir=/tmp/translator_keys
```
