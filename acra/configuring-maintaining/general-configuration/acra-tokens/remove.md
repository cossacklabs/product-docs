---
title: remove
weight: 4
---

# remove

**`remove`** is `acra-tokens` subcommand used for removing tokens from the storage.

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

* `--all`

  Remove all requested tokens within specified date range, regardless of their state (enabled and disabled).

* `--only_disabled`

  Remove only disabled tokens within specified date range.

* `--dry_run`

  Do not actually remove tokens, only output status.

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

**`remove`** subcommand removes tokens from storage and displays how many bytes of memory were freed.

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

To remove all disabled tokens in the storage:

```
$ acra-tokens remove --token_db=./tokens.db --only_disabled
INFO[0000] Removed 1 tokens (out of 1 in total)         
INFO[0000] Freed approximately 100 B of token storage
```

After that, you should see that `TokenCount` is equal to `0` which means that all token were removed from the storage:
```
$ acra-tokens status --token_db=./tokens.db
TokenCount: 0
StorageSize: 0 (0 B)
DisabledTokenCount: 0
DisabledStorageSize: 0 (0 B))
```

{{< hint info >}}
**Note:**
`acra-tokens` supports [time-based configuration]({{< ref "acra/configuring-maintaining/general-configuration/acra-tokens/status#time-based-configuration" >}}) via `accessed|created_*` flags:
{{< /hint >}}