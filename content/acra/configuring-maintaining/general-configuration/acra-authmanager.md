---
title: acra-authmanager
weight: 14
---

# acra-authmanager (deprecated since 0.91.0)

`acra-authmanager` is CLI utility for [acra-webconfig](/acra/configuring-maintaining/general-configuration/acra-webconfig/) user management.
Using this utility you can add/update/remove users that should have access to web UI of `acra-webconfig`. It changes 
encrypted auth file that stores all users and hashed passwords for basic authentication.

## Command line flags

`acra-authmanager` should be called with same `ACRA_MASTER_KEY` that used for `acra-server`. Only these two binaries can
read an encrypted file with authentication data.

### Configuration files

* `--file=<filepath>`
  
    Path to encrypted file where stored authentication data.
    Default is `configs/auth.keys`

* `--user=<username>`

    Name of user that will be added/removed/updated. This flag is required.
  
* `--password=<password>`

    User's password that will be used for basic authentication. Cannot be empty for `--set` operation and unused for 
    `--remove` operation.
  
* `--remove`
  
    Flag to remove user specified by `--user=<user>` flag. 
  
* `--set`

    Flag to add/update password for user specified by `--user=<user>` flag. Password cannot be empty.

### Configuration files

* `--config_file=<filename>`

  Path to YAML configuration file.

* `--dump_config`

  Dump configuration to `configs/acra-addzone.yaml`.

* `--generate_markdown_args_table`

  Generate markdown file with text description of all flags.
  Output file is `configs/markdown_acra-addzone.md`.
  Works in a pair with `--dump_config`.

### Logging

* `-d`

  Log to stderr all `DEBUG`, `INFO`, `WARNING` and `ERROR` logs.


### Storage destination

#### Filesystem

* `--keys_dir=<path>`

  Path to keystore directory.

  Default is `.acrakeys`.

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

  Path to AcraServer TLS certificate's CA certificate for Vault certificate validation (AcraServer works as "client" when communicating with Vault).
  Empty by default.


* `--vault_tls_client_cert=<filename>`

  Path to AcraServer TLS certificate presented to Vault (AcraServer works as "client" when communicating with Vault).
  Empty by default.


* `--vault_tls_client_key=<filename>`

  Path to AcraServer TLS certificate's private key of the TLS certificate presented to Vault (AcraServer works as "client" when communicating with Vault).
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

## Auth file

`acra-authmanager` updates encrypted file where rows are stored in the following format:
```
<user>:<salt>:<hash_function_parameters>:<hash(salt, password, parameters)>
<user>:<salt>:<hash_function_parameters>:<hash(salt, password, parameters)>
<user>:<salt>:<hash_function_parameters>:<hash(salt, password, parameters)>
``` 
Each row is separate entry related to distinct user. 

Every password is hashed using [Argon2 hash function](https://en.wikipedia.org/wiki/Argon2). You can find current Argon2's parameter
values in [Acra source code](https://github.com/cossacklabs/acra/blob/release/0.85.0/cmd/constants.go#L34).

Example of decrypted auth file:
```
user1:teVSBZPexDCrhQyf:3,8192,2,32:s+5DGNl06ClB7tDoVyJbj3hnfPmEZzaL5SxcxV9dTDA=
user2:pozbKtOLYWrHFQIG:3,8192,2,32:DubAhRrPEKbE1wCV2/yFt9mWL+W95JfCJAScoyZCMuI=
```

There are at first row `user1` is username, `teVSBZPexDCrhQyf` is salt, `3,8192,2,32` are parameters for Argon2 hash function 
and `s+5DGNl06ClB7tDoVyJbj3hnfPmEZzaL5SxcxV9dTDA=` hash of password.