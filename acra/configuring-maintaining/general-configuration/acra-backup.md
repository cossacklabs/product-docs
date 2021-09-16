---
title: acra-backup
bookCollapseSection: true
weight: 10
---

# acra-backup

`acra-backup` is a command-line utility used for storing and managing the keystore [backups]({{< ref "/acra/keys/operations/backup" >}}).

## Command line flags

#### General

* `--action={import|export}`❗

  Actions to perform.

### Logging

* `--logging_format={plaintext|json|CEF}`

  Logging format. Default is `plaintext`.

  * `plaintext` — (default) pretty human readable key/value format<br>
    ```
    INFO[2021-09-16T09:58:03+03:00] Starting service acra-backup [pid=459748]     version=0.85.0
    ```

  * `json` — one JSON object per line, easy to parse by most log collectors<br>
    ```
    {"level":"info","msg":"Starting service acra-backup [pid=460911]","product":"acra-backup","timestamp":"2021-09-16T10:14:33+03:00","unixTime":"1631776473.899","version":"0.85.0"}
    ```

  * `CEF` — Common Event Format<br>
    ```
    CEF:0|cossacklabs|acra-backup|0.85.0|100|Starting service acra-backup [pid\=461095]|1|unixTime=1631776510.183
    ```


### Storage destination

#### Filesystem

* `--keys_private_dir=<dir_path>`

  Folder with private keys. Default is `.acrakeys`.

* `--keys_public_dir=<dir_path>`

  Folder with public keys. Leave empty if keys stored in same folder as `keys_private_dir`.

* `--file=<path>`❗ 

  Path to file which will be used for **`import|export`** actions. Required to specify.

#### Redis

* `--redis_db_keys=<number>`

  Redis database number to use.
  Default is `0`.
  <!-- `acra-server -help` says default is `-1` but in `cmd/redis.go` I see `redisDefaultDB = 0` -->
  <!-- this var is also used as default value for the flag, where's the truth? -->

* `--redis_host_port=<host:port>`

  Address of Redis database to use as keystore.
  If not specified, Redis is not used.

* `--redis_password=<password>`

  Password to Redis database.


#### HashiCorp Vault

`acra-backup` can read `ACRA_MASTER_KEY` from HashiCorp Vault instead of environment variable.

* `--vault_connection_api_string=<url>`

  Connection string (like `https://example.com:8200`) for connecting to HashiCorp Vault.
  If not specified, `ACRA_MASTER_KEY` environment variable will be used.

* `--vault_secrets_path=<kv-path>`

  Path to KV Secrets directory in Vault used to store `ACRA_MASTER_KEY`.
  Default is `secret/`.

* `--vault_tls_ca_path=<path>`

  Path to CA certificate bundle to use for HashiCorp Vault certificate validation.

  If not specified, use root certificates configured in system.

* `--vault_tls_client_cert=<path>`

  Path to client TLS certificate used to connect to HashiCorp Vault.

  If not specified, don't send client certificate.

* `--vault_tls_client_key=<path>`

  Path to the private key of the client TLS certificate used to connect to HashiCorp Vault.

  If not specified, don't send client certificate.

* `--vault_tls_transport_enable={true|false}`

  Use TLS to encrypt transport with HashiCorp Vault.
  Default is `false`.


❗ - flags required to be specified.
  
## Output

```
$ acra-backup --action=export --file=./acrakeys.backup
INFO[2021-09-16T11:14:18+03:00] Starting service acra-backup [pid=470120]     version=0.85.0
INFO[2021-09-16T11:14:18+03:00] Initializing ACRA_MASTER_KEY loader...       
INFO[2021-09-16T11:14:18+03:00] Initialized default env ACRA_MASTER_KEY loader 
INFO[2021-09-16T11:14:18+03:00] Backup master key: 1FEbOQ1k2jzn2LsF5xHy7jQmT93Yv1odqqgg1epwUcQ=
 Backup saved to file: ./acrakeys.backup
```

{{< hint info >}}
**Note:**
You need to have `ACRA_MASTER_KEY` environment variable set up for any operation using `acra-backup`.

Before running `import` operation, make sure you also specified `BACKUP_MASTER_KEY` environment variable with the value displayed in `export` operation output.
{{< /hint>}}
