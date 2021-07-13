---
title: AcraServer
bookCollapseSection: true
weight: 3
---

# AcraServer

## Command line flags

(excluding TLS-related flags that are listed [here](/acra/configuring-maintaining/tls))

* `--acracensor_config_file=<filename>`

  Path to AcraCensor configuration file.

* `--acraconnector_tls_transport_enable={true|false}`

  Enable TLS to encrypt transport between AcraConnector and AcraServer.
  Default is `false` which means "use SecureSession instead".

* `--acraconnector_transport_encryption_disable=`

  Use raw transport (tcp/unix socket) between AcraTranslator and client app.
  It turns off reading trace from client app's side which usually sent by AcraConnector.
  Default is `false`.

* `--acrastruct_injectedcell_enable={true|false}`

  Acrastruct may be injected into any place of data cell.
  Default is `false`.

* `--acrastruct_wholecell_enable={true|false}`

  Acrastruct will stored in whole data cell.
  Default is `true`.

* `--audit_log_enable={true|false}`

  Enable audit log functionality.
  Default is `false`.

* `--auth_keys=<filename>`

  Path to basic auth credentials.
  To add user, use: `./acra-authmanager --set --user <user> --pwd <pwd>`.
  Default is `configs/auth.keys`.

* `--client_id=<id>`

  Expected client ID of AcraConnector in mode without encryption.

* `--config_file=<filename>`

  Path to YAML configuration file.

* `--db_host=<host>`

  Database host for AcraServer -> database connections.
  Must be set.
  Default is empty.

* `--db_port=<port>`

  Database port for AcraServer -> database connections.
  Default is `5432`.

* `-ds`

  Turn on HTTP debug server.
  The server will be listening at `127.0.0.1:6060`.

* `--dump_config`

  Dump configuration to `configs/acra-server.yaml`.

* `--encryptor_config_file=<filename>`

  Path to Encryptor configuration file.
  Default is empty.

* `--generate_markdown_args_table`

  Generate markdown file with text description of all flags.
  Output file is `configs/markdown_acra-server.md`.
  Works in pair with `--dump_config`.

* `--http_api_enable={true|false}`

  Enable HTTP API.

* `--incoming_connection_api_port=<port>`

  Port for AcraServer for HTTP API.
  Default is `9090`.

* `--incoming_connection_api_string=<url>`

  Connection string for API like `tcp://x.x.x.x:yyyy` or `unix:///path/to/socket`.
  Default is `tcp://0.0.0.0:9090/`.

* `--incoming_connection_close_timeout=<seconds>`

  Time that AcraServer will wait (in seconds) on restart before closing all connections.
  Default is `10`.

* `--incoming_connection_host=<host>`

  Host for AcraServer to listen on.
  Default is `0.0.0.0`.

* `--incoming_connection_port=<port>`

  Port for AcraServer to listen on.
  Default is `9393`.

* `--incoming_connection_prometheus_metrics_string=<url>`

  URL which will be used to expose Prometheus metrics (use `<url>/metrics` address to pull metrics).
  Default is empty.

* `--incoming_connection_string=<url>`

  Connection string like `tcp://x.x.x.x:yyyy` or `unix:///path/to/socket`.
  Default is `tcp://0.0.0.0:9393/` (built from default host and port).

* `--keys_dir=<path>`

  Folder from which keys will be loaded.
  Default is `.acrakeys`.

* `--keystore_cache_size=<count>`

  Count of keys that will be stored in in-memory LRU cache in encrypted form.
  Use `0` to set unlimited size, `-1` to disable caching.
  Default is `0`.

* `--mysql_enable={true|false}`

  Handle MySQL connections.
  Default is `false`.

* `--pgsql_escape_bytea={true|false}`

  Escape format for Postgresql bytea data (**deprecated**, ignored).

* `--pgsql_hex_bytea={true|false}`

  Hex format for Postgresql bytea data (**deprecated**, ignored).

* `--poison_detect_enable={true|false}`

  Turn on poison record detection, if server shutdown is disabled, AcraServer logs the poison record detection and returns error.
  Default is `true`.

* `--poison_run_script_file=<filename>`

  On detecting poison record: log about poison record detection, execute script, return decrypted data.
  Default is empty (don't execute any script).

* `--poison_shutdown_enable={true|false}`

  On detecting poison record: log about poison record detection, stop and shutdown.
  Default is `false`.

* `--postgresql_enable={true|false}`

  Handle Postgresql connections.
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

  ID that will be sent during secure session handshake.
  Default is `acra_server`.

* `--sql_parse_on_error_exit_enable={true|false}`

  Stop AcraServer execution in case of SQL query parse error.
  Default is `false`.

* `--token_db=<filename>`

  Path to BoltDB database file to store tokens.

* `--zonemode_enable={true|false}`

  Turn on zone mode.
  Default is `false`.

### Jaeger

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

### Logging

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

* `--tracing_log_enable={true|false}`

  Export trace data to log.
  Default is `false`.

* `-v`

  Log to stderr all `INFO`, `WARNING` and `ERROR` logs.

* `-d`

  Log everything to stderr.

### Vault

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
