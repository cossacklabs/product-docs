---
title: status
weight: 1
---

# status

**`status`** is `acra-tokens` subcommand used for getting output of token storage statistics.

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

**`status`** subcommand produces output containing several statistic parameters:

- `TokenCount` - displays how many tokens are in storage;
- `StorageSize` - displays the memory size (in Bytes) occupied by tokens in storage;
- `DisabledTokenCount` - display how many disabled tokens are in storage;
- `DisabledStorageSize` - displays the memory size of disabled tokens (in Bytes) in storage;

Let's run an example acra-tokens **`status`** subcommand to get information about newly created local BoltDB storage:

```
$ acra-tokens status --token_db=./tokens.db
TokenCount: 3
StorageSize: 300 (300 B)
DisabledTokenCount: 0
DisabledStorageSize: 0 (0 B)
```

## Time-based configuration

You can configure any `acra-tokens` subcommand for more precise work with tokens via `accessed|created_*` flags. 

Let's get statistic information about tokens generated in some period of time:
```
$ acra-tokens status --token_db=./tokens.db --created_after=2021-09-27T11:40:03+03:00 --created_before=2021-09-27T11:50:03+03:00
TokenCount: 1
StorageSize: 100 (100 B)
DisabledTokenCount: 0
DisabledStorageSize: 0 (0 B)
```

You can also filter tokens by access time to tokens in storage:
```
$ acra-tokens status --token_db=./tokens.db --accessed_after=2021-09-27T11:40:03+03:00 --accessed_before=2021-09-27T11:50:03+03:00
TokenCount: 1
StorageSize: 100 (100 B)
DisabledTokenCount: 0
DisabledStorageSize: 0 (0 B)
```

{{< hint info >}}
**Note:**
`acra-tokens` supports defined list of time formats for all time-based flags:

- `2006-01-02T15:04:05Z07:00` - Full RFC 3339;
- `2006-01-02T15:04:05`
- `2006-01-02 15:04:05`
- `2006-01-02T15:04`
- `2006-01-02 15:04`
- `2006-01-02`
- `Jan 2006`
- `January 2006`
- `2006`
{{< /hint >}}


