---
weight: 1
title: Migration from key store v1 to v2
bookCollapseSection: true
---

# Migration from key store v1 to v2

In order to migrate from key store version 1 to version 2,
use `acra-migrate-keys` utility.

```shell
acra-migrate-keys \
    --src_keystore=v1 --src_keys_dir ".acrakeys" \
    --dst_keystore=v2 --dst_keys_dir ".acrakeys.v2"
```

You need to have `ACRA_MASTER_KEY` environment variable set to access the source key store.
The `ACRA_MASTER_ENCRYPTION_KEY` and `ACRA_MASTER_SIGNATURE_KEY` variables need to be set as well
in order to access the destination key store which will be created at `.acrakeys.v2`.

{{< hint info >}}
**Note:**
You can use the `--dry_run` option to test the migration and be sure that you can access all keys.
{{< /hint >}}

After migration is completed, check that Acra components can still operate with the new key store.
You can set the path to the new key store using the `keys_dir` option
on the command-line or in the configuration file when launching Acra components.
Once you're sure that your operations are not affected, you can swap the key store directories.

<!--
TODO: describe Acra EE migration?
It may be more complex due to remote key storages which do not provide for easy renaming.
-->
