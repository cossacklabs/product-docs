---
title: acra-authmanager
weight: 14
---

# acra-authmanager

`acra-authmanager` is CLI utility for [acra-webconfig]({{< ref "/acra/configuring-maintaining/general-configuration/acra-webconfig.md" >}}) user management.
Using this utility you can add/update/remove users that should have access to web UI of `acra-webconfig`. It changes 
encrypted auth file that stores all users and hashed passwords for basic authentication.

## Command line flags

`acra-authamanager` should be called with same `ACRA_MASTER_KEY` that used for `acra-server`. Only these two binaries can
read encrypted file with authentication data. 

### Configuration files

* `--file=<filepath>`
  
    Path to encrypted file where stored authentication data
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
  Works in pair with `--dump_config`.

### Logging

* `-d`

  Log to stderr all `DEBUG`, `INFO`, `WARNING` and `ERROR` logs.


### Storage destination

#### Filesystem

* `--keys_dir=<path>`

  Path to keystore directory.

  Default is `.acrakeys`.

### HashiCorp Vault

`acra-authmanager` can read `ACRA_MASTER_KEY` from HashiCorp Vault instead of environment variable.

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

## Auth file

`acra-authmanager` updates encrypted file where stored rows in format: 
```
<user>:<salt>:<hash_function_parameters>:<hash(salt, password, parameters)>
<user>:<salt>:<hash_function_parameters>:<hash(salt, password, parameters)>
<user>:<salt>:<hash_function_parameters>:<hash(salt, password, parameters)>
``` 
Each row is separate entry related to distinct user. 

Every password hashed using [Argon2 hash function](https://en.wikipedia.org/wiki/Argon2). You can find current parameter
values used for hash function in [Acra source code](https://github.com/cossacklabs/acra/blob/release/0.85.0/cmd/constants.go#L34).

Example of decrypted auth file:
```
user1:teVSBZPexDCrhQyf:3,8192,2,32:s+5DGNl06ClB7tDoVyJbj3hnfPmEZzaL5SxcxV9dTDA=
user2:pozbKtOLYWrHFQIG:3,8192,2,32:DubAhRrPEKbE1wCV2/yFt9mWL+W95JfCJAScoyZCMuI=
```

There are at first row `user1` is username, `teVSBZPexDCrhQyf` is salt, `3,8192,2,32` are parameters for Argon2 hash function 
and `s+5DGNl06ClB7tDoVyJbj3hnfPmEZzaL5SxcxV9dTDA=` hash of password.