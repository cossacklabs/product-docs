---
weight: 1
title:  Updating Acra from 0.77.0 to 0.80.0
---

# Migration guide

Please read the migration guide if at some point you used Acra version 0.77.0 - in Acra 0.80.0 some radical renaming was applied throughout. 

Here is the detailed migration guide.

The migration guide of moving from Acra `0.77.0` to Acra `0.80.0`.

We did a global renaming of Acra components and configuration parameters for most of them. We believe that updated naming will decrease confusion about components' functions and will make Acra setup and usage easier.

If you were using Acra before `0.80.0` release you might want to update configuration files and parameter names.

## The main services:

| Old name | New name | Function |
| --- | --- | --- |
| AcraServer | AcraServer | decrypts data from database |
| AcraWriter | AcraWriter | encrypts data on client side |
| AcraProxy | AcraConnector | encrypts traffic between client and server using Themis Secure Session |
| AcraCensor | AcraCensor | firewall, part of AcraServer, blocks suspicious SQL requests to the database |
| AcraConfigUI | AcraWebConfig | lightweight HTTP web server for managing AcraServer's certain configuration options |

## Utilities:

| Old name | New name | Function |
| --- | --- | --- |
| acra_rollback | AcraRollback | decrypts the whole database |
| acra_genkeys | AcraKeymaker | generates encryption keys for storage and transport for Acra components |
| acra_genauth | AcraAuthmanager | generates user accounts for AcraWebConfig |
| acra_genpoisonrecord | AcraPoisonRecordMaker | generates poision records for databases |
| acra_addzone | AcraAddzone | generates Zones header for AcraWriter |

## Configuration parameters

### AcraServer configuration

Check out the full guide to [AcraServer](/acra/what-is-acra/#how-acraserver-works).

| Old name | New name | Function |
|-----|-----|-----|
| --censor_config | --acracensor_config_file | Path to AcraCensor configuration file |
| --tls | --acraconnector_tls_transport_enable | Use tls to encrypt transport between AcraServer and AcraConnector/client |
| --no_encryption | --acraconnector_transport_encryption_disable | Use raw transport (tcp/unix socket) between AcraServer and AcraConnector/client (don't use this flag if you not connect to database with ssl/tls) |
| --injectedcell | --acrastruct_injectedcell_enable | Acrastruct may be injected into any place of data cell |
| --wholecell | --acrastruct_wholecell_enable | Acrastruct will stored in whole data cell (default true) |
| --auth_keys | --auth_keys | Path to basic auth passwords. To add user, use: `./acra-authmanager --set --user <user> --pwd <pwd>` (default "configs/auth.keys") |
| --client_id | --client_id | Expected client id of AcraConnector in mode without encryption |
| --config | --config_file | path to config |
| -d | -d | Turn on debug logging |
| --db_host | --db_host | Host to db |
| --db_port | --db_port | Port to db (default 5432) |
| -ds | -ds | Turn on http debug server |
| --dumpconfig | --dump_config | dump config |
| --enable_http_api | --http_api_enable | Enable HTTP API |
| --commands_port | --incoming_connection_api_port | Port for AcraServer for HTTP API (default 9090) |
| --connection_api_string | --incoming_connection_api_string | Connection string for api like tcp://x.x.x.x:yyyy or unix:///path/to/socket (default "tcp://0.0.0.0:9090/") |
| --close_connections_timeout | --incoming_connection_close_timeout | Time that AcraServer will wait (in seconds) on restart before closing all connections (default 10) |
| --host | --incoming_connection_host | Host for AcraServer (default "0.0.0.0") |
| --port | --incoming_connection_port | Port for AcraServer (default 9393) |
| --connection_string | --incoming_connection_string | Connection string like tcp://x.x.x.x:yyyy or unix:///path/to/socket (default "tcp://0.0.0.0:9393/") |
| --keys_dir | --keys_dir | Folder from which will be loaded keys (default ".acrakeys") |
| --logging_format | --logging_format | Logging format: plaintext, json or CEF (default "plaintext") |
| --mysql | --mysql_enable | Handle MySQL connections |
| --escape_bytea | --pgsql_escape_bytea | Escape format for Postgresql bytea data |
| --hex_bytea | --pgsql_hex_bytea | Hex format for Postgresql bytea data (default) |
| --poisonscript | --poison_run_script_file | Execute script on detecting poison record |
| --poisonshutdown | --poison_shutdown_enable | Stop on detecting poison record |
| --postgresql | --postgresql_enable | Handle Postgresql connections (default true) |
| --server_id | --securesession_id | Id that will be sent in secure session (default "acra_server") |
| --tls_ca | --tls_ca | Path to root certificate which will be used with system root certificates to validate Postgresql's and AcraConnector's certificate |
| --tls_cert | --tls_cert | Path to tls certificate |
| --tls_sni | --tls_db_sni | Expected Server Name (SNI) from Postgresql |
| --tls_key | --tls_key | Path to private key that will be used in TLS handshake with AcraConnector as server's key and Postgresql as client's key |
| --zonemode | --zonemode_enable | Turn on zone mode |
| -v | -v | Log to stderr |

## AcraConnector configuration

Check out the full guide to [AcraConnector](/acra/security-controls/transport-security/acra-connector).

| Old name | New name | Function |
|-----|-----|-----|
| --acra_commands_port | --acraserver_api_connection_port | Port of Acra HTTP api (default 9090) |
| --acra_api_connection_string | --acraserver_api_connection_string | Connection string to Acra's API like tcp://x.x.x.x:yyyy or unix:///path/to/socket |
| --acra_host | --acraserver_connection_host | IP or domain to AcraServer daemon |
| --acra_port | --acraserver_connection_port | Port of AcraServer daemon (default 9393) |
| --acra_connection_string | --acraserver_connection_string | Connection string to AcraServer like tcp://x.x.x.x:yyyy or unix:///path/to/socket |
| --acra_id | --acraserver_securesession_id | Expected id from AcraServer for Secure Session (default "acra_server") |
| --tls | --acraserver_tls_transport_enable | Use tls to encrypt transport between AcraServer and AcraConnector/client |
| --no_encryption | --acraserver_transport_encryption_disable | Use raw transport (tcp/unix socket) between acraserver and acraproxy/client (don't use this flag if you not connect to database with ssl/tls |
| --client_id | --client_id | Client id |
| --config | --config_file | path to config |
| --dumpconfig | --dump_config | dump config |
| --enable_http_api | --http_api_enable | Enable HTTP API |
| --command_port | --incoming_connection_api_port | Port for AcraConnector HTTP api (default 9191) |
| --connection_api_string | --incoming_connection_api_string | Connection string like tcp://x.x.x.x:yyyy or unix:///path/to/socket (default "tcp://127.0.0.1:9191/") |
| --port | --incoming_connection_port | Port to AcraConnector (default 9494) |
| --connection_string | --incoming_connection_string | Connection string like tcp://x.x.x.x:yyyy or unix:///path/to/socket (default "tcp://127.0.0.1:9494/") |
| --keys_dir | --keys_dir | Folder from which will be loaded keys (default ".acrakeys") |
| --logging_format | --logging_format | Logging format: plaintext, json or CEF (default "plaintext") |
| --tls_sni | --tls_acraserver_sni | Expected Server Name (SNI) from AcraServer |
| --tls_ca | --tls_ca | Path to root certificate which will be used with system root certificates to validate AcraServer's certificate |
| --tls_cert | --tls_cert | Path to certificate |
| --tls_key | --tls_key | Path to private key that will be used in TLS handshake with AcraServer |
| --disable_user_check | --user_check_disable | Disable checking that connections from app running from another user |
| -v | -v | Log to stderr |


## AcraWebConfig configuration

Check out the full guide to [AcraWebConfig](/acra/configuring-maintaining/general-configuration/acra-webconfig/).

| Old name | New name | Function |
|-----|-----|-----|
| --config | --config_file | path to config |
| -d | -d | Turn on debug logging |
| --acra_host | --destination_host | Host for AcraServer HTTP endpoint or AcraConnector (default "localhost") |
| --acra_port | --destination_port | Port for AcraServer HTTP endpoint or AcraConnector (default 9191) |
| --dumpconfig | --dump_config | dump config |
| --auth_mode | --http_auth_mode | Mode for basic auth. Possible values: auth_on/auth_off_local/auth_off (default "auth_on") |
| --host | --incoming_connection_host | Host for AcraWebconfig HTTP endpoint (default "127.0.0.1") |
| --port | --incoming_connection_port | Port for AcraWebconfig HTTP endpoint (default 8000) |
| --logging_format | --logging_format | Logging format: plaintext, json or CEF (default "plaintext") |
| --static_path | --static_path | Path to static content (default "cmd/acra-webconfig/static") |


## AcraRollback configuration

Check out the full guite to [AcraRollback](/acra/configuring-maintaining/general-configuration/acra-rollback/).

| Old name | New name | Function |
|-----|-----|-----|
| --client_id | --client_id | Client id should be name of file with private key |
| --config | --config_file | path to config |
| --connection_string | --connection_string | Connection string for db |
| --dumpconfig | --dump_config | dump config |
| --escape | --escape | Escape bytea format |
| --execute | --execute | Execute inserts |
| --insert | --insert | Query for insert decrypted data with placeholders (pg: $n, mysql: ?) |
| --keys_dir | --keys_dir | Folder from which the keys will be loaded (default ".acrakeys") |
| --mysql | --mysql_enable | Handle MySQL connections |
| --output_file | --output_file | File for store inserts queries (default "decrypted.sql") |
| --postgresql | --postgresql_enable | Handle Postgresql connections |
| --select | --select | Query to fetch data for decryption |
| --zonemode | --zonemode_enable | Turn on zone mode |


## AcraKeymaker configuration

Check out the full guide to [Key management](/acra/security-controls/key-management/).

| Old name | New name | Function |
|-----|-----|-----|
| --client_id | --client_id | Client id (default "client") |
| --config | --config_file | path to config |
| --dumpconfig | --dump_config | dump config |
| --acraproxy | --generate_acraconnector_keys | Create keypair for AcraConnector only |
| --acraserver | --generate_acraserver_keys | Create keypair for AcraServer only |
| --basicauth | --generate_acrawebconfig_keys | Create symmetric key for AcraWebconfig's basic auth db |
| --storage | --generate_acrawriter_keys | Create keypair for data encryption/decryption |
| --master_key | --generate_master_key | Generate new random master key and save to file |
| --output | --keys_output_dir | Folder where will be saved keys (default ".acrakeys") |
| --output_public | --keys_public_output_dir | Folder where will be saved public key (default ".acrakeys") |

## AcraPoisonRecordMaker configuration

Check out the full guide to [Poison records](/acra/security-controls/intrusion-detection).

| Old name | New name | Function |
|-----|-----|-----|
| --config | --config_file | path to config |
| --data_length | --data_length | Length of random data for data block in acrastruct. -1 is random in range 1..100 (default -1) |
| --dumpconfig | --dump_config | dump config |
| --keys_dir | --keys_dir | Folder from which will be loaded keys (default ".acrakeys") |


## AcraAddzone configuration

Check out the full guide to [Zones](/acra/security-controls/zones/).

| Old name | New name | Function |
|-----|-----|-----|
| --config | --config_file | path to config |
| --dumpconfig | --dump_config | dump config |
| -fs | --fs_keystore_enable | Use filesystem key store (default true) |
| --output_dir | --keys_output_dir | Folder where will be saved generated zone keys (default ".acrakeys") |