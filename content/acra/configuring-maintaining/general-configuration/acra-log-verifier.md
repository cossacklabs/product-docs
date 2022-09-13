---
title: acra-log-verifier
weight: 12
---

# acra-log-verifier

{{< hint info >}}
acra-log-verifier is available in [Acra Enterprise Edition](/acra/enterprise-edition/) only.
{{< /hint>}}

`acra-log-verifier` is command-line utility that verifies secure logs dumped from AcraServer/AcraTranslator/AcraConnector started with `--audit_log_enable=true` flag.

It expects symmetric key to decrypt keys from keystore from  `ACRA_MASTER_KEY` environment variable in pair `--keys_dir` flag or from HashiCorp Vault together with `--vault_*` flags. 

## Command line flags

### Verification

* `--audit_log_file=<filename>`

  Path to log file that should be verified.

* `--audit_log_file_format={plaintext|json|CEF}`

  The expected format of secure log file(s) that should be verified are following: plaintext, JSON or CEF.
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

  Debug mode, shows order of input files. Useful in a pair with `--audit_log_file_list` flag.
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
  Works in a pair with `--dump_config`.

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

* `--keystore_encryption_type=<strategy>`

  Keystore encryption strategy.
  Currently supported strategies:
  * **`env_master_key`** (**Default**) - Keystore using Acra Master Key, loaded from ENV (`ACRA_MASTER_KEY`) variable;
  * **`vault_master_key`** -  Keystore using Acra Master Key, loaded from Hashicorp Vault
  * **`kms_encrypted_master_key`** - Keystore using Acra Master Key, loaded from ENV `ACRA_MASTER_KEY` variable and decrypted
    via KMS key-encryption key.
  * **`kms_per_client`** - Keystore using KMS for decryption Acra keys per ClientID and ZoneID.


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


### Hashicorp Vault

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

* `--vault_tls_ca_path=<filename>`

  Path to CA certificate for HashiCorp Vault certificate validation.
  Default is empty (deprecated since 0.94.0, use `vault_tls_client_ca` instead).


* `--vault_tls_client_ca=<filename>`

  Path to additional CA certificate for Vault certificate validation.
  Empty by default.


* `--vault_tls_client_cert=<filename>`

  Path to AcraServer TLS certificate presented to Vault (AcraServer works as "client" when communicating with Vault).
  Empty by default.


* `--vault_tls_client_key=<filename>`

  Path to private key of the TLS certificate presented to Vault.
  Empty by default.


* `--vault_tls_client_sni=<SNI>`

  Expected Server Name (SNI) of the Vault instance. Will be used `--vault_connection_api_string` value if is empty.
  Empty by default.


* `--vault_tls_crl_client_cache_size=<count>`

  How many CRLs to cache in memory in connections to Vault.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.


* `--vault_tls_crl_client_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds for connections to Vault.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.


* `--vault_tls_crl_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Vault certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.


* `--vault_tls_crl_client_from_cert=<policy>`

  How to treat CRL's URL described in a certificate from Vault server/agent

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--vault_tls_crl_client_url` flags.


* `--vault_tls_crl_client_url=<url>`

  CRL's URL for outcoming TLS connections to Vault.
  Empty by default.


* `--vault_tls_ocsp_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Vault certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no OCSP's URL configured and there is no OCSP's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know whom to ask about them.


* `--vault_tls_ocsp_client_from_cert=<policy>`

  How to treat OCSP server URL described in a certificate from Vault server.

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--vault_tls_ocsp_client_url` flags.


* `--vault_tls_ocsp_client_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested Vault certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and
    continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration


* `--vault_tls_ocsp_client_url=<url>`

  OCSP service URL for outgoing TLS connections to check Vaults' certificates.
  Empty by default.

{{< hint info >}}
**Note**:
Should be provided only with `--keystore_encryption_type=<vault_master_key>` flag.
{{< /hint >}}
  
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
Previous 6 rows haven't `integrity` because AcraServer didn't initialize Keystore yet and secure logger does not have access to symmetric key that will be used for signatures.

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
`acra-log-verifier` allows run verification with `--audit_log_missing_ok` that will ignore such errors. It is useful in some 
cases of automation when file with list may be generated before finishing log collection of last service startup. And avoid
legal verification failures of not finished last file.

```
acra-log-verifier --audit_log_file_list=log_file_list.txt --audit_log_missing_ok
```

`acra-log-verifier` will just warn about missing file but finish with 0 status:
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