---
title: acra-connector
weight: 5
---

# acra-connector (deprecated since 0.91.0)

## Command line flags

* `--audit_log_enable`

  Enable audit log functionality.
  Default is `false`.

* `--client_id=<id>`

  Provided Client ID identifies Secure Session transport keys for handshake with AcraServer/AcraTranslator and will be sent to AcraServer/AcraTranslator as identifier of encryption keys.

* `--user_check_disable`

  Disable checking that connections from app running from another user.

* `--mode`

  An expected mode of connection.
  * `AcraServer` - (default) mode switch AcraConnector to work with `AcraServer`.
  * `AcraTranslator` - mode switch AcraConnector to work with `AcraTranslator`.

Following table describes flags that work only in appropriate mode:

| AcraServer | AcraTranslator |
| --- | --- |
| `acraserver_connection_host` | `acratranslator_connection_host` |
| `acraserver_connection_string` | `acratranslator_connection_string` |
| `acraserver_connection_port` | `acratranslator_connection_port` |
| `acraserver_securesession_id` | `acratranslator_securesession_id` |
| `incoming_connection_port` | |
| `incoming_connection_api_port` | |
| `acraserver_api_connection_string` | |
| `acraserver_api_connection_port` | |
| `http_api_enable` | |

### Network

* `--acraserver_api_connection_port`
  
  Port of AcraServer's HTTP API.
  Default is `9090`.

* `--acraserver_api_connection_string`
  
  Connection string to AcraServer's API like `tcp://x.x.x.x:yyyy` or `unix:///path/to/socket`.

* `--acraserver_connection_host`

  IP/domain of AcraServer daemon.

* `--acraserver_connection_port`

  Port of AcraServer daemon.
  Default is `9393`.
  
* `--acraserver_connection_string`

  Connection string to AcraServer like `tcp://x.x.x.x:yyyy` or `unix:///path/to/socket`.

* `--acraserver_securesession_id`

  ID that will be sent during secure session handshake with AcraServer.
  Default is `acra_server`.

* `--acraserver_tls_transport_enable`

  Use tls to encrypt transport between AcraServer and AcraConnector/client.

* `--acraserver_transport_encryption_disable`
  
  Enable this flag to omit AcraConnector and connect client app to AcraServer directly using raw transport (tcp/unix socket). From security perspective please use at least TLS encryption (over tcp socket) between AcraServer and client app.
  
* `--acratranslator_connection_host`

  IP/domain of AcraTranslator daemon.
  Default is `"0.0.0.0"`.

* `--acratranslator_connection_port`

  Port of AcraTranslator daemon.
  Default is `9696`.

* `--acratranslator_connection_string`
  
  Connection string to AcraTranslator like `grpc://0.0.0.0:9696` or `http://0.0.0.0:9595`.

* `--acratranslator_securesession_id`

  ID that will be sent during secure session handshake with AcraTranslator.
  Default is `acra_translator`.

* `--http_api_enable`

  Enable connection to AcraServer via HTTP API. Works only with `--mode=AcraServer`.

* `--incoming_connection_api_port=<port>`

  Port for AcraConnector HTTP API.
  Default is `9191`.

* `--incoming_connection_api_string=<url>`

  Connection string like `tcp://x.x.x.x:yyyy` or `unix:///path/to/socket`.
  Default is `"tcp://127.0.0.1:9191/"`.

* `--incoming_connection_port=<port>`

  Port to AcraConnector.
  Default is `9494`.

* `--incoming_connection_string`

  Connection string like `tcp://x.x.x.x:yyyy` or `unix:///path/to/socket`.
  Default is  `tcp://127.0.0.1:9494/` (built from default host and port).
  
### Configuration files

* `--config_file=<filename>`

  Path to YAML configuration file.

* `--dump_config`

  Dump configuration to `configs/acra-server.yaml`.

* `--generate_markdown_args_table`

  Generate markdown file with text description of all flags.
  Output file is `configs/markdown_acra-server.md`.
  Works in a pair with `--dump_config`.

### Monitoring

#### Logging

* `-d`

  Log to stderr all `DEBUG`, `INFO`, `WARNING` and `ERROR` logs.

* `-v`

  Log to stderr all `INFO`, `WARNING` and `ERROR` logs.

* `--log_to_console={true|false}`

  Enable or disable AcraConnector's logs.
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

* `--keys_dir=<path>`

  Folder from which keys will be loaded.
  Default is `.acrakeys`.
  
* `--redis_db_keys=<id>`

  Number of Redis database for keys.
  Default is `0`.
  <!-- `acra-server -help` says default is `-1` but in `cmd/redis.go` I see `redisDefaultDB = 0` -->
  <!-- this var is also used as default value for the flag, where's the truth? -->

* `--redis_host_port=<host:port>`

  `<host:port>` used to connect to Redis.
  Default is empty (don't connect).

* `--redis_password=<password>`

  Password to Redis database.

### TLS

{{< hint info >}}
Note: TLS related flags work only together with `AcraServer` mode. `AcraTranslator` mode supports only `SecureSession` transport encryption or direct TLS connections from application
{{< /hint >}}

* `--tls_auth=<mode>`

  Set authentication mode that will be used for TLS connection.

  * `0` — do not request client certificate, ignore it if received;
  * `1` — request client certificate, but don't require it;
  * `2` — expect to receive at least one certificate to continue the handshake;
  * `3` — don't require client certificate, but validate it if client actually sent it;
  * `4` — (default) request and validate client certificate.

  These values correspond to [crypto.tls.ClientAuthType](https://golang.org/pkg/crypto/tls/#ClientAuthType).

* `--tls_key=<filename>`

  Path to private key that will be used for TLS handshake with AcraServer.
  Should correspond to the certificate configured with `--tls_cert`.
  Empty by default.

* `--tls_cert=<filename>`

  Path to TLS certificate that will be sent to AcraServer.
  Empty by default.

* `--tls_ca=<filename>`

  Path to additional CA certificate for AcraServer certificate validation.
  Empty by default.
  
* `--tls_acraserver_sni`
  
  Expected Server Name (SNI) from AcraServer
   
For additional certificate validation flags, see corresponding pages:
[OCSP](/acra/configuring-maintaining/tls/ocsp/) and
[CRL](/acra/configuring-maintaining/tls/crl/).


### HashiCorp Vault

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
  
