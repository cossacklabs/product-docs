---
weight: 2
title: Backing up keys
bookCollapseSection: true
---

# Key store backups

It is important to keep backup copies of Acra key store because
this is one thing that if lost can make your data completely inaccessible to anyone.
Key store contents are also *very* sensitive because if leaked,
your data may become completely *accessible* to anyone.

Therefore it is crucial to make and store backups of the key store in a secure manner.
Acra has a number of tools to help you with this task.

## Backing up the master keys

Acra keys are always stored encrypted in a key store, or in a backup of a key store.
The keys are ultimately secured by a **master key** which opens the key store.
A key store cannot be accessed without the corresponding master key.
The master key is not a part of a key store and cannot be restored if lost.
Losing the master key means losing access to the encryption keys and all data encrypted with them.

Keep a backup copy of the master keys safe.
For example, you may consider keeping a printed paper copy in a physical safe secured to your building.

## Backing up key store version 1

{{< hint info >}}
**Note:**
The `acra-backup` utility is available only in [Acra Enterprise Edition](https://www.cossacklabs.com/acra/#pricing).
{{< /hint >}}

To make a backup copy of a key store version 1,
use `acra-backup` command for `export`:

```shell
acra-backup --action=export --file "encrypted-keys.dat"
```

{{< hint info >}}
**Note:**
You need to have `ACRA_MASTER_KEY` environment varible set up
to access the source key store for export.
{{< /hint >}}

This command will export all keys in the keystore,
including the public keys and sensitive private keys.
Exported data is all encrypted in the `encrypted-keys.dat` file.
Each backup gets a freshly generated encryption key (distinct from the current master key)
which is printed to the terminal:

```
INFO[2020-08-04T14:15:51+00:00] Starting service acra-backup [pid=28762]      version=0.85.0
INFO[2020-08-04T14:15:51+00:00] Backup master key: /74AXd3r9dfUDBp2Te+5CQArChnE2k5eM0CKIJ1HdoU=
 Backup saved to file: encrypted-keys.dat
```

The key is shown to you just once, take a note of it.

{{< hint warning >}}
**Important:**
Store the encrypted backup and the key used to decrypt it separately.
{{< /hint >}}

To restore a key store from a backup copy,
use `acra-backup` command for `import`.
You need to set the `ACRA_MASTER_KEY` environment variable for the new key store,
as well as set the backup master key in the `BACKUP_MASTER_KEY` variable.

```shell
export BACKUP_MASTER_KEY=/74AXd3r9dfUDBp2Te+5CQArChnE2k5eM0CKIJ1HdoU=
acra-backup --action=import --file "encrypted-keys.dat"
```

## Backing up key store version 2

To make a backup copy of a key store version 2,
use `acra-keys export` command with `--all` and `--private_keys` options:

```shell
acra-keys export --all --private_keys \
    --key_bundle_file "encrypted-keys.dat" \
    --key_bundle_secret "access-keys.json"
```

{{< hint info >}}
**Note:**
You need to have `ACRA_MASTER_ENCRYPTION_KEY` and `ACRA_MASTER_SIGNATURE_KEY`
environment variables set up to access the source key store for export.
{{< /hint >}}

This command will export all keys in the keystore,
including the public keys and sensitive private keys.
Exported data is all encrypted in the `encrypted-keys.dat` file.
Each backup gets a freshly generated encryption keys (distinct from the current master key)
which are placed into the `access-keys.json` file.

{{< hint warning >}}
**Important:**
Store the encrypted backup and the keys used to decrypt it separately.
{{< /hint >}}

To restore a key store from a backup copy, start with an empty key store
then import the backup with `acra-keys import`.
You need to set the `ACRA_MASTER_ENCRYPTION_KEY` and `ACRA_MASTER_SIGNATURE_KEY`
environment variable for the new key store.

```shell
acra-keys import \
    --key_bundle_file "encrypted-keys.dat" \
    --key_bundle_secret "access-keys.json"
```

<!--
TODO: How do I make an empty key store?
It does not seem to be possible at the moment. Well, other than
    mkdir .acrakeys
    echo -n "Acra Key Store v2" > .acrakeys/version
If ".acrakeys" is missing, just doing "acra-keys import" fails.
-->
