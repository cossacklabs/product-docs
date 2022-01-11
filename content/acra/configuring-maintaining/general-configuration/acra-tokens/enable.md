---
title: enable
weight: 3
---

# enable

**`enable`** is `acra-tokens` subcommand used for enabling back once disabled tokens and allowing their use.

## Command line flags

### General configuration

* `--accessed_after=<date>`

  Limit action to tokens accessed after specified date.

* `--accessed_before=<date>`

  Limit action to tokens accessed before specified date.

* `--created_after=<date>`

  Limit action to tokens created after specified date.

* `--created_before=<date>`

  Limit action to tokens created before specified date.

### Storage destination

#### Redis

* `--redis_db_tokens=<number>`

  Number of Redis database for tokens.
  Default is `0`.

* `--redis_host_port=<host:port>`

  Address of Redis database to use as keystore.
  If not specified, Redis is not used.
  (Should be specified without `token_db` flag)

* `--redis_password=<password>`

  Password to Redis database.

* `--token_db=<path>`

  Path to BoltDB used for token data.
  (Should be specified without `redis_host_port` flag)

## Usage example

**`enable`** subcommand switches tokens on for using and displays in output how many tokens were enabled.

Firstly, let's run [`acra-tokens` **`disable`**]({{< ref "acra/configuring-maintaining/general-configuration/acra-tokens/disable" >}}) subcommand to disable all tokens stored in BoldDB local storage:

```
$ acra-tokens disable --token_db=./tokens.db
INFO[0000] Disabled 1 tokens (out of 1 inspected)
```

To verify that token storage contains disabled tokens you can run [`acra-tokens` **`status`**]({{< ref "acra/configuring-maintaining/general-configuration/acra-tokens/status" >}}) subcommand:

```
$ acra-tokens status --token_db=./tokens.db
TokenCount: 1
StorageSize: 100 (100 B)
DisabledTokenCount: 1
DisabledStorageSize: 100 (100 B)
```

You can enable back your tokens to be able to use them:

```
$ acra-tokens enable --token_db=./tokens.db
INFO[0000] Enabled 1 tokens (out of 1 inspected)
```

After that, you should see that `DisabledTokenCount` is equal to `0` which means that all token were enabled again:
```
$ acra-tokens status --token_db=./tokens.db
TokenCount: 1
StorageSize: 100 (100 B)
DisabledTokenCount: 0
DisabledStorageSize: 0 (0 B)
```

{{< hint info >}}
**Note:**
`acra-tokens` supports [time-based configuration]({{< ref "acra/configuring-maintaining/general-configuration/acra-tokens/status#time-based-configuration" >}}) via `accessed|created_*` flags:
{{< /hint >}}