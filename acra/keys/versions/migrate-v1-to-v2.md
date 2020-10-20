---
weight: 1
title: Migration from keystore v1 to v2
bookCollapseSection: true
---

# Migration from keystore v1 to v2

In order to migrate from keystore version 1 to version 2,
use `acra-keys` utility.

```shell
acra-keys migrate \
    --src_keystore=v1 --src_keys_dir ".acrakeys" \
    --dst_keystore=v2 --dst_keys_dir ".acrakeys.v2"
```

You need to put the master key to the source keystore into `SRC_ACRA_MASTER_KEY`
and the destination master key into `DST_ACRA_MASTER_KEY`.
New keystore will be created at `.acrakeys.v2`.

{{< hint info >}}
**Note:**
You can use the `--dry_run` option to test the migration and be sure that you can access all keys.
{{< /hint >}}

After migration is completed, check that Acra components can still operate with the new keystore.
You can set the path to the new keystore using the `keys_dir` option
on the command-line or in the configuration file when launching Acra components.
Once you're sure that your operations are not affected, you can swap the keystore directories.

<!--
TODO: describe Acra EE migration?
It may be more complex due to remote key storages which do not provide for easy renaming.
-->
