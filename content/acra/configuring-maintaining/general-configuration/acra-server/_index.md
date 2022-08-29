---
title: acra-server
weight: 3
---

# acra-server

## Command line flags

* `--acracensor_config_file=<filename>`

  Path to AcraCensor configuration file.

* `--acraconnector_tls_transport_enable={true|false}`

  Enable TLS to encrypt transport between AcraConnector and AcraServer (**deprecated since 0.91.0**, will be removed soon).
  Default is `false` which means "use SecureSession instead".

* `--acraconnector_transport_encryption_disable={true|false}`

  Use raw transport (tcp/unix socket) between AcraTranslator and client app.
  It turns off reading trace from client app's side which usually sent by AcraConnector (**deprecated since 0.91.0**, will be removed soon).
  Default is `false`.

* `--acrastruct_injectedcell_enable={true|false}`

  AcraStruct may be injected into any place of data cell (**deprecated since 0.90.0**, ignored, AcraServer always works in Injected Cell mode).

* `--acrastruct_wholecell_enable={true|false}`

  AcraStruct will be stored in a whole data cell (**deprecated since 0.90.0**, ignored, AcraServer always works in Injected Cell mode).
* `--audit_log_enable={true|false}`

  Enable audit log functionality.
  Default is `false`.

* `--client_id=<id>`

  Use provided client ID for transparent encryption as if it was passed from AcraConnector.

* `--encryptor_config_storage_type=<type>`

  Storage type used for `encryptor_config` loading.

  * `filesystem` — use YAML configuration file format; filename should be specified via `--encryptor_config_file` flag;
  * `consul` — use [HashiCorp Consul](/acra/configuring-maintaining/general-configuration/acra-server/#hashicorp-consul) KV storage;
  
  Default is `filesystem`.

* `--poison_detect_enable={true|false}`

  Turn on poison record detection. If shutdown is not enabled, AcraServer just logs the poison record detection and returns error.
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
  <!-- `acra-server -help` says default is `-1` but in `cmd/redis.go` I see `redisDefaultDB = 0` -->
  <!-- this var is also used as default value for the flag, where's the truth? -->

* `--redis_db_tokens=<id>`

  Number of Redis database for tokens.
  Default is `0`.
  <!-- `acra-server -help` says default is `-1` but in `cmd/redis.go` I see `redisDefaultDB = 0` -->
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

  Path to additional CA certificate for Redis' certificate validation (overrides `--tls_ca`).
  Empty by default.


* `--redis_tls_client_cert=<filename>`

  Path to server TLS certificate presented to Redis (overrides `--tls_cert`).
  Empty by default.


* `--redis_tls_client_key=<filename>`

  Path to private key of the TLS certificate presented to Redis (overrides `--tls_key`).
  Empty by default.


* `--redis_tls_client_sni=<SNI>`

  Expected Server Name (SNI) of the Redis instance. Will be used `--redis_host_port` value if is empty.
  Empty by default.


* `--redis_tls_crl_client_cache_size=<count>`

  How many CRLs to cache in memory in connections to Redis.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.


* `--redis_tls_crl_client_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds for connections to Redis.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.


* `--redis_tls_crl_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Redis' certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.


* `--redis_tls_crl_client_from_cert=<policy>`

  How to treat CRL's URL described in a certificate from Redis server

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--tls_crl_*_url` flags. See [Configuring & maintaining > TLS > CRL](/acra/configuring-maintaining/tls/crl/).


* `--redis_tls_crl_client_url=<url>`

  CRL's URL for outcoming TLS connections to Redis.
  Empty by default.


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


* `--redis_tls_ocsp_client_from_cert=<policy>`

  How to treat OCSP server URL described in a certificate from Redis server

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--tls_ocsp_*_url` flags, see [Configuring & maintaining > TLS > OCSP](/acra/configuring-maintaining/tls/ocsp/).


* `--redis_tls_ocsp_client_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested Redis' certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and
    continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration


* `--redis_tls_ocsp_client_url=<url>`

  OCSP service URL for outgoing TLS connections to check Redis' certificates.
  Empty by default.

* `--securesession_id=<id>`

  ID that will be sent during secure session handshake (**deprecated since 0.91.0**, will be removed soon).
  Default is `acra_server`.

* `--sql_parse_on_error_exit_enable={true|false}`

  Stop AcraServer's execution in case of SQL query parse error.
  Default is `false`.

* `--token_db=<filename>`

  Path to BoltDB database file to store tokens.

* `--zonemode_enable={true|false}`

  Turn on zone mode.
  Default is `false`.

### Configuration files

* `--config_file=<filename>`

  Path to YAML configuration file.

* `--dump_config`

  Dump configuration to `configs/acra-server.yaml`.

* `--generate_markdown_args_table`

  Generate markdown file with text description of all flags.
  Output file is `configs/markdown_acra-server.md`.
  Works in a pair with `--dump_config`.

* `--encryptor_config_file=<filename>`

  Path to Encryptor configuration file.
  Default is empty.

### Monitoring

#### Logging

* `-d`

  Log to stderr `INFO`, `WARNING`, `ERROR` and `DEBUG` logs.

* `-v`

  Log to stderr `INFO`, `WARNING` and `ERROR` logs.

* `--log_to_console={true|false}`

  Enable or disable AcraServer's logs.
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

* `--auth_keys=<filename>`

  Path to basic auth credentials.
  To add user, use: `./acra-authmanager --set --user <user> --pwd <pwd>`.
  Default is `configs/auth.keys`.

* `--keys_dir=<path>`

  Folder from which keys will be loaded.
  Default is `.acrakeys`.

* `--keystore_cache_size=<count>`

  Maximum number of keys stored in in-memory LRU cache in encrypted form. 0 - no limits, -1 - turn off cache
  Default is `1000` (since 0.92.0, previous default value is `0`).

* `--keystore_cache_on_start_enable={true|false}`

  Load all keystore keys to cache on start. Should be provided only with enabled keystore cache (`--keystore_cache_size` >= 0 ).
  Currently, supported only for keystore `v1` and will fail to start for keystore `v2`.
  Default is `true`.

* `--keystore_encryption_type=<strategy>`

  Keystore encryption strategy.
  Currently supported strategies:
  * **`env_master_key`** (**Default**) - Keystore using Acra Master Key, loaded from ENV (`ACRA_MASTER_KEY`) variable;
  * **`vault_master_key`** -  Keystore using Acra Master Key, loaded from Hashicorp Vault
  * **`kms_encrypted_master_key`** - Keystore using Acra Master Key, loaded from ENV `ACRA_MASTER_KEY` variable and decrypted
    via KMS key-encryption key.
  * **`kms_per_client`** - Keystore using KMS for decryption Acra keys per ClientID and ZoneID.


### MySQL

* `--mysql_enable={true|false}`

  Handle MySQL connections.
  Default is `false`.

### Network

* `--db_host=<host>` 🔴

  Database host for AcraServer → database connections.
  Must be set.
  Default is empty.

* `--db_port=<port>`

  Database port for AcraServer → database connections.
  Default is `5432`.

* `-ds`

  Turn on HTTP debug server.
  The server will be listening at `127.0.0.1:6060`.

* `--http_api_enable={true|false}`

  Enable HTTP API.

* `--http_api_tls_transport_enable={true|false}`

  Enables the TLS for the HTTP API. Use together with the `--http_api_enable=true`.  Uses the same key and certificates as the Acra proxy.

  Default is `false`.

  {{< hint warning >}}
  **Note:**
  The default configuration with `--http_api_tls_transport_enable=false` is **insecure**. Enable TLS whenever possible.
  {{< /hint >}}

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

* `--incoming_connection_string=<url>`

  Connection string like `tcp://x.x.x.x:yyyy` or `unix:///path/to/socket`.
  Default is `tcp://0.0.0.0:9393/` (built from default host and port).

### PostgreSQL

* `--pgsql_escape_bytea={true|false}`

  Escape format for PostgreSQL bytea data (**deprecated since 0.85.0**, ignored).

* `--pgsql_hex_bytea={true|false}`

  Hex format for PostgreSQL bytea data (**deprecated since 0.85.0**, ignored).

* `--postgresql_enable={true|false}`

  Handle Postgresql connections.
  Default is `false`.

### TLS

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
  It will be sent to the client application (or AcraConnector if it's used between client app and AcraServer) and to the database server.
  Empty by default.

* `--tls_ca=<filename>`

  Path to additional CA certificate for application and database certificates validation.
  It will be used to validate the client application's certificate (or AcraConnector's if it's used between client app and AcraServer) and the database server ones.
  Empty by default.

* `--acraconnector_tls_transport_enable={true|false}`

  Enable TLS to encrypt transport between AcraConnector and AcraServer (**deprecated since 0.91.0**, will be removed soon).
  Default is `false` which means "use SecureSession instead".

* `--tls_client_auth=<mode>`

  Set authentication mode that will be used for TLS connection with applications/AcraConnectors.
  Possible values are the same as for `--tls_auth`.
  Default is `-1` which means "take value of `--tls_auth`".

  Overrides the `--tls_auth` setting.

* `--tls_client_key=<filename>`

  Path to private key of the TLS certificate presented to applications/AcraConnectors (see `--tls_client_cert`).
  Empty by default.

* `--tls_client_cert=<filename>`

  Path to server TLS certificate presented to applications/AcraConnectors (overrides `--tls_cert`).
  Empty by default.

* `--tls_client_ca=<filename>`

  Path to additional CA certificate for application/AcraConnector certificate validation
  (setup if CA certificate of application/AcraConnector is different from CA certificate of database).
  Empty by default.

* `--tls_client_id_from_cert={true|false}`

  Extract clientID from TLS certificate.
  Take TLS certificate from AcraConnector's connection if `--acraconnector_tls_transport_enable` is `true`;
  otherwise take TLS certificate from application's connection if `--acraconnector_transport_encryption_disable` is `true`.
  Can't be used with `--tls_client_auth=0` or `--tls_auth=0`.
  Default is `false`.

* `--tls_database_auth=<mode>`

  Set authentication mode that will be used for TLS connection with a database.
  Possible values are the same as for `--tls_auth`.
  Overrides the `--tls_auth` setting.
  Default is `-1` which means "take value of `--tls_auth`".

* `--tls_database_key=<filename>`

  Path to private key that will be used for TLS handshake with a database.
  Should correspond to the certificate configured with `--tls_database_cert`.
  Empty by default.

* `--tls_database_cert=<filename>`

  Path to client TLS certificate shown to database during TLS handshake (overrides `--tls_cert`).
  Empty by default.

* `--tls_database_ca=<filename>`

  Path to additional CA certificate for database certificate validation
  (setup if CA certificate of database is different from CA certificate of application/AcraConnector).
  Empty by default.

* `--tls_database_sni=<SNI>`

  Expected Server Name (SNI) of a database.
  Empty by default which means "don't check the SNI sent by a database".

* `--tls_db_sni=<SNI>`

  Expected Server Name (SNI) of a database.
  Deprecated since 0.90.0, use `--tls_database_sni` instead.

* `--tls_identifier_extractor_type=<type>`

  Decide which field of TLS certificate to use as ClientID.

  * `distinguished_name` — (default) certificate Distinguished Name (DN)
  * `serial_number` — certificate serial number

For additional certificate validation flags, see corresponding pages:
[OCSP](/acra/configuring-maintaining/tls/ocsp/) and
[CRL](/acra/configuring-maintaining/tls/crl/).

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


### HashiCorp Consul

* `--consul_connection_api_string=<url>`

  Connection string (like `https://example.com:8500`) for connecting to HashiCorp Consul for `encryptor_config` loading.
  If not specified, Consul is not used.

* `--consul_kv_config_path=<schema://host:port>`

  Path to KV storage directory in Consul used to store `encryptor_config`.
  Default is `acra/encryptor_config`.

* `--consul_tls_client_auth=<mode>`

  Set authentication mode that will be used for TLS connection with Consul.

  * `0` — do not request client certificate, ignore it if received;
  * `1` — request client certificate, but don't require it;
  * `2` — expect to receive at least one certificate to continue the handshake;
  * `3` — don't require client certificate, but validate it if client actually sent it;
  * `4` — (default) request and validate client certificate.

  These values correspond to [crypto.tls.ClientAuthType](https://golang.org/pkg/crypto/tls/#ClientAuthType).

* `--consul_tls_client_ca=<filename>`

  Path to additional CA certificate for Consul certificate validation.
  Empty by default.


* `--consul_tls_client_cert=<filename>`

  Path to AcraServer TLS certificate presented to Consul (AcraServer works as "client" when communicating with Consul).
  Empty by default.


* `--consul_tls_client_key=<filename>`

  Path to private key of the TLS certificate presented to Consul.
  Empty by default.


* `--consul_tls_client_sni=<SNI>`

  Expected Server Name (SNI) of the Consul instance. Will be used `--consul_connection_api_string` value if is empty.
  Empty by default.


* `--consul_tls_crl_client_cache_size=<count>`

  How many CRLs to cache in memory in connections to Consul.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.


* `--consul_tls_crl_client_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds for connections to Consul.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.


* `--consul_tls_crl_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Consul certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.


* `--consul_tls_crl_client_from_cert=<policy>`

  How to treat CRL's URL described in a certificate from Consul server/agent

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--consul_tls_crl_client_url` flags.


* `--consul_tls_crl_client_url=<url>`

  CRL's URL for outcoming TLS connections to Consul.
  Empty by default.


* `--consul_tls_enable=<true|false>`

  Turns on/off TLS for connection with Consul to `--consul_connection_api_string` endpoint.

  * `true` — turns on
  * `false` — (default) turns off.


* `--consul_tls_ocsp_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Consul certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no OCSP's URL configured and there is no OCSP's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know whom to ask about them.


* `--consul_tls_ocsp_client_from_cert=<policy>`

  How to treat OCSP server URL described in a certificate from Consul server/agent

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--consul_tls_ocsp_client_url` flags.


* `--consul_tls_ocsp_client_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested Consul certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and
    continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration


* `--consul_tls_ocsp_client_url=<url>`

  OCSP service URL for outgoing TLS connections to check Consuls' certificates.
  Empty by default.


### Hashicorp Vault

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

{{< hint info >}}
**Note**:
Should be provided only with `--keystore_encryption_type=<vault_master_key>` flag.
{{< /hint >}}


  🔴 - flags required to be specified.

## HTTP API

AcraServer handles HTTP requests that may change its internal state, generates new Zones or fetches data
related with authentication of AcraWebConfig users.

{{< hint warning >}}
AcraWebConfig and AcraAuthManager are deprecated and will not be available since 0.91.0.
{{< /hint >}}

- Endpoint: `/getNewZone`.
  
  Generates new Zone and returns ZoneID with zone's public key as the response.
  - Response example:
    - Status: 200
    - Content-Type: `application/json`
    - Body:
      ```json
      {"id":"DDDDDDDDnAdXLIcBPDlQPYpl","public_key":"VUVDMgAAAC2BgJJUA//O+rVRGTSC7xAyFa1qIL8eANBtnvgQnMZyHOXHfgCE"}
      ```
  - Error response:
    - Status: 404
    - Content-Type: `text/plain; charset=utf-8`
    - Body:
      ```
      incorrect request
      ```

- Endpoint: `/resetKeyStorage`.
  
  Resets AcraServer's cache of encrypted keys from KeyStore configured with `--keystore_cache_size` CLI flag.
  - Response example:
    - Status: 200
    - Content-Type: `text/plain; charset=utf-8`
    - Body: *empty*.
  - Error response:
    - Status: 404
    - Content-Type: `text/plain; charset=utf-8`
    - Body:
      ```
      incorrect request
      ```

- Endpoint: `/loadAuthData` (deprecated since 0.91.0).
  Description: returns decrypted authentication data as pairs `<username>:<hash>` for AcraWebConfig. By default, encrypted
  data is stored in `configs/auth.keys` file in `htpasswd` format where each row is actually an entry related to separate user.
  Response type: text.
  Response example:
  ```
  test:teVSBZPexDCrhQyf:3,8192,2,32:s+5DGNl06ClB7tDoVyJbj3hnfPmEZzaL5SxcxV9dTDA=
  user2:pozbKtOLYWrHFQIG:3,8192,2,32:DubAhRrPEKbE1wCV2/yFt9mWL+W95JfCJAScoyZCMuI=
  ```
  Error response:
  ```
  HTTP/1.1 404 Not Found

  incorrect request
  ```

- Endpoint: `/getConfig` (deprecated since 0.91.0).
  Description: returns current AcraServer's configuration used while startup (maybe changed via AcraWebConfig).
  Response type: JSON object.
  Response example:
  ```json
  {
    "db_host": "localhost",
    "db_port": 5432,
    "incoming_connection_api_port": 8181,
    "debug": true,
    "poison_run_script_file": "",
    "poison_shutdown_enable": false,
    "zonemode_enable":false
  }
  ```
  Error response:
  ```
  HTTP/1.1 404 Not Found

  incorrect request
  ```

- Endpoint: `/setConfig` (deprecated since 0.91.0).
  Description: sets new configuration for AcraServer, dumps new configuration to config file specified from CLI flags
  or in config file (with default path) and gracefully restarts AcraServer's instance.
  Response type: empty.
  Error response:
  ```
  HTTP/1.1 500 Server error
  ```

## POSIX signals

There are a couple of signals `acra-server` reacts on:
- `SIGTERM`, `SIGINT` — graceful shutdown: stop accepting new connections, close existing ones, terminate the process.
- `SIGHUP` — restart: create new AcraServer subprocess and transfer opened listener sockets to it, then terminate the current process.
