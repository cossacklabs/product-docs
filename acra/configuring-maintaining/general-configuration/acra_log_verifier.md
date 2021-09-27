---
title: AcraLogVerifier
bookCollapseSection: true
weight: 3
---

# AcraLogVerifier

AcraLogVerifier is command-line utility that verifies secure logs dumped from AcraServer/AcraTranslator/AcraConnector started with `--audit_log_enable=true` flag.

It expects symmetric key to decrypt keys from keystore from  `ACRA_MASTER_KEY` environment variable in pair `--keys_dir` flag or from HashiCorp Vault together with `--vault_*` flags. 

## Command line flags

### Verification

* `--audit_log_file=<filename>`

  Path to log file that should be verified.

* `--audit_log_file_format={plaintext|json|CEF}`

  Expected format of secure log file(s) that should be verified: plaintext, JSON or CEF. 
  Default is  "plaintext".

* `--audit_log_file_list`

  Path to file with list of files that should be verified. File contain one path per line: 
  ```
  <filepath1>
  <filepath2>
  ...
  <filepathN>
  ```

* `--audit_log_missing_ok`

  Don't fail validation if some file from `audit_log_file_list` cannot be opened. Verifier will log file path with `WARNING` severity level
  and will not interrupt validation with non-zero exit status.

* `-d`

  Debug mode, shows order of input files. Useful in pair with `--audit_log_file_list` flag. 
  Verifier will print absolute file paths that in the order used during validation. 

### Logging

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

### Configuration files

* `--config_file=<path>`

  Path to YAML configuration file.

* `--dump_config`

  Dump configuration to `configs/acra-log-verifier.yaml`.

* `--generate_markdown_args_table`

  Generate markdown file with text description of all flags.
  Output file is `configs/markdown_acra-log-verifier.md`.
  Works in pair with `--dump_config`.

### Keystore

* `--keys_dir=<path>`

  Path to keystore directory.

  Default is `.acrakeys`.

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

### HashiCorp Vault

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
  
## Usage example

### Verification list of files

For example let's start AcraServer twice with turned on secure logging and save logs into files `acra-server_1.log` + `acra-server_2.log`, and stop them with SIGTERM signal via `CTRL+C`:
```
acra-server --audit_log_enable=true --log_to_file=acra-server_1.log --db_host=localhost
acra-server --audit_log_enable=true --log_to_file=acra-server_2.log --db_host=localhost 
```
{{< hint info >}}
Don't forget to generate keys for AcraServer via AcraKeyMaker and export ACRA_MASTER_KEY environment variable
{{< /hint >}}

It will generate and save logs into files that will look like:
```
time="2021-09-02T00:48:14+03:00" level=info msg="Starting service acra-server [pid=90754]" version=0.85.0
time="2021-09-02T00:48:14+03:00" level=info msg="Validating service configuration..."
time="2021-09-02T00:48:14+03:00" level=info msg="Initializing ACRA_MASTER_KEY loader..."
time="2021-09-02T00:48:14+03:00" level=info msg="Initialized default env ACRA_MASTER_KEY loader"
time="2021-09-02T00:48:14+03:00" level=info msg="Initialising keystore..."
time="2021-09-02T00:48:14+03:00" level=info msg="Keystore init OK"
time="2021-09-02T00:48:14+03:00" level=info msg="Configuring transport..." integrity=132c2e45664447c30f768c58bb9e0bb7044f9495ff6d5d647e1e17f6c77c1e6e chain=new
time="2021-09-02T00:48:14+03:00" level=info msg="Use sni" sni=localhost integrity=532ec8aca6d1b728f557470694f838dc1c1e222c7181e5c24f15b8f1dc8d3c0b
time="2021-09-02T00:48:14+03:00" level=info msg="Loaded TLS configuration" use_client_id_from_cert=false integrity=b74e3d734cd2447e7701e93a9555f6711d1ec03a748767f1f892932fd2918594
time="2021-09-02T00:48:14+03:00" level=info msg="Selecting transport: use Secure Session transport wrapper" integrity=dea3c7a2ce0232eb7e8d6743540ad95c535ee815efecb00251bf9eab84dcc122
time="2021-09-02T00:48:14+03:00" level=info msg="Initialize in-memory db storage for tokens" integrity=2550b414989f95fcada711d7520a7d35bc0d899cfed6a8049814aa0b0b01ee7d
time="2021-09-02T00:48:14+03:00" level=info msg="Initialized in-memory db storage for tokens" integrity=fcf81e07cc5936d33c8e4bec48949f4e08957a4a052d59a5e5c158af037b78ac
time="2021-09-02T00:48:14+03:00" level=info msg="Initialized SQL query parser in default mode" integrity=e66fb6ecdcb44c4ebbff4ed13efc244d97cc822980e0b2d27747f7aedfe8adc5
time="2021-09-02T00:48:14+03:00" level=info msg="Start listening to connections. Current PID: 90754" integrity=b2e45d9ab39430509fa6ddea2a7edb261a86927156947dd65880ae7a5959c4af
time="2021-09-02T00:48:14+03:00" level=info msg="Disabling future logs... Set -v -d to see logs" integrity=0b703ccb144e2cdc1e35f96dc426aea946081029e078b47a617d21cda7517d0c
time="2021-09-02T00:48:15+03:00" level=info msg="Prepare to audit log chain finalization" integrity=0c25bf90b75e7e5315b08bd2d5e4c3043ae90dc43c651366892f5985673d580b
time="2021-09-02T00:48:15+03:00" level=info msg="End of current audit log chain" chain=end integrity=a172d5c26b9ee713621b44cfeba34be2b720ea04b6a329ce8704109779a8963a
```

You can see that starting from 7 row each row has additional attribute `integrity` with hex value. Additionally, this row has `chain=new` attribute that signalize start of secure log chain.
Previous 6 rows haven't `integrity` because AcraServer didn't initialize Keystore yet and secure logger hasn't access to symmetric key that will be used for signatures.

Then create file with list of files that we want to verify:
```
echo 'acra-server_1.log' > log_file_list.txt
echo 'acra-server_2.log' >> log_file_list.txt
```

And run `acra-log-verifier` to validate these secure logs:
```
acra-log-verifier --audit_log_file_list=log_file_list.txt
```

{{< hint info >}}
Should be called with same symmetric key `ACRA_MASTER_KEY`. Will be used previously exported. 
{{< /hint >}}

You will output like next:
```
INFO[2021-09-02T00:54:51+03:00] Initializing ACRA_MASTER_KEY loader...       
INFO[2021-09-02T00:54:51+03:00] Initialized default env ACRA_MASTER_KEY loader 
WARN[2021-09-02T00:54:51+03:00] No integrity check for line:  1              
WARN[2021-09-02T00:54:51+03:00] No integrity check for line:  2              
WARN[2021-09-02T00:54:51+03:00] No integrity check for line:  3              
WARN[2021-09-02T00:54:51+03:00] No integrity check for line:  4              
WARN[2021-09-02T00:54:51+03:00] No integrity check for line:  5              
WARN[2021-09-02T00:54:51+03:00] No integrity check for line:  6              
WARN[2021-09-02T00:54:51+03:00] No integrity check for line:  1              
WARN[2021-09-02T00:54:51+03:00] No integrity check for line:  2              
WARN[2021-09-02T00:54:51+03:00] No integrity check for line:  3              
WARN[2021-09-02T00:54:51+03:00] No integrity check for line:  4              
WARN[2021-09-02T00:54:51+03:00] No integrity check for line:  5              
WARN[2021-09-02T00:54:51+03:00] No integrity check for line:  6              
INFO[2021-09-02T00:54:51+03:00] Integrity check successful 
```

We see that verifier warns us that first 6 rows hasn't integrity value due to startup initialization of Keystore in AcraServer.
Finally, logs that check is successful and exit with zero status. 

### Failed verification with tampered entries

Let's corrupt first log file and replace entry in the middle from "Use sni" to "Use snl" by replacing one character and run verifier:
```
sed -i 's/Use sni/Use snl/g' log1.txt
acra-log-verifier --audit_log_file_list=log_file_list.txt
```

Verifier will exit with 1 status and next output:
```
INFO[2021-09-02T01:49:55+03:00] Initializing ACRA_MASTER_KEY loader...       
INFO[2021-09-02T01:49:55+03:00] Initialized default env ACRA_MASTER_KEY loader 
WARN[2021-09-02T01:49:55+03:00] No integrity check for line:  1              
WARN[2021-09-02T01:49:55+03:00] No integrity check for line:  2              
WARN[2021-09-02T01:49:55+03:00] No integrity check for line:  3              
WARN[2021-09-02T01:49:55+03:00] No integrity check for line:  4              
WARN[2021-09-02T01:49:55+03:00] No integrity check for line:  5              
WARN[2021-09-02T01:49:55+03:00] No integrity check for line:  6              
ERRO[2021-09-02T01:49:55+03:00] Specified logs are corrupted. File: log1.txt , Line:  8  error="integrity doesn't match"
```

### Verification list of files with not existing one

Let's add not existing filename to `log_file_list.txt` and look how `acra-log-verifier` will signalize about failure:
```
echo 'not_existing_file.txt' > log_file_list.txt
acra-log-verifier --audit_log_file_list=log_file_list.txt
```

You will see next output:
```
INFO[2021-09-02T01:03:31+03:00] Initializing ACRA_MASTER_KEY loader...       
INFO[2021-09-02T01:03:31+03:00] Initialized default env ACRA_MASTER_KEY loader 
WARN[2021-09-02T01:03:31+03:00] file:  /home/example/not_existing_file.txt is missing 
ERRO[2021-09-02T01:03:31+03:00] unexpected error occurred while log file processing:  /home/example/not_existing_file.txt  error="open /home/example/not_existing_file.txt: no such file or directory"
WARN[2021-09-02T01:03:31+03:00] No integrity check for line:  1              
WARN[2021-09-02T01:03:31+03:00] No integrity check for line:  2              
WARN[2021-09-02T01:03:31+03:00] No integrity check for line:  3              
WARN[2021-09-02T01:03:31+03:00] No integrity check for line:  4              
WARN[2021-09-02T01:03:31+03:00] No integrity check for line:  5              
WARN[2021-09-02T01:03:31+03:00] No integrity check for line:  6              
WARN[2021-09-02T01:03:31+03:00] No integrity check for line:  1              
WARN[2021-09-02T01:03:31+03:00] No integrity check for line:  2              
WARN[2021-09-02T01:03:31+03:00] No integrity check for line:  3              
WARN[2021-09-02T01:03:31+03:00] No integrity check for line:  4              
WARN[2021-09-02T01:03:31+03:00] No integrity check for line:  5              
WARN[2021-09-02T01:03:31+03:00] No integrity check for line:  6              
ERRO[2021-09-02T01:03:31+03:00] Logs verification error                       error="open /home/example/not_existing_file.txt: no such file or directory"
```

Verifier will exit with status 1.
AcraLogVerifier allows run verification with `--audit_log_missing_ok` that will ignore such errors. It is useful in some 
cases of automation when file with list may be generated before finishing log collection of last service startup. And avoid
legal verification failures of not finished last file.

```
acra-log-verifier --audit_log_file_list=log_file_list.txt --audit_log_missing_ok
```

AcraLogVerifier will just warn about missing file but finish with 0 status:
```
INFO[2021-09-02T01:13:23+03:00] Initializing ACRA_MASTER_KEY loader...       
INFO[2021-09-02T01:13:23+03:00] Initialized default env ACRA_MASTER_KEY loader 
WARN[2021-09-02T01:13:23+03:00] file:  /home/example/not_existing_file.txt is missing 
WARN[2021-09-02T01:13:23+03:00] No integrity check for line:  1              
WARN[2021-09-02T01:13:23+03:00] No integrity check for line:  2              
WARN[2021-09-02T01:13:23+03:00] No integrity check for line:  3              
WARN[2021-09-02T01:13:23+03:00] No integrity check for line:  4              
WARN[2021-09-02T01:13:23+03:00] No integrity check for line:  5              
WARN[2021-09-02T01:13:23+03:00] No integrity check for line:  6              
WARN[2021-09-02T01:13:23+03:00] No integrity check for line:  1              
WARN[2021-09-02T01:13:23+03:00] No integrity check for line:  2              
WARN[2021-09-02T01:13:23+03:00] No integrity check for line:  3              
WARN[2021-09-02T01:13:23+03:00] No integrity check for line:  4              
WARN[2021-09-02T01:13:23+03:00] No integrity check for line:  5              
WARN[2021-09-02T01:13:23+03:00] No integrity check for line:  6              
INFO[2021-09-02T01:13:23+03:00] Integrity check successful
```