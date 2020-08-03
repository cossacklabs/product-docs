---
weight: 4
title: Destroying keys
bookCollapseSection: true
---

# Destroying keys

After you have [rotated the keys](../rotation/), you might want to destroy the old ones.

## When it is safe to destroy keys

Transport keys may be destroyed after you have confirmed that all instances are using the new keys.

Data storage keys may be destroyed after you have confirmed that no data is encrypted with old keys.

{{< hint danger >}}
We strongly recommend to **never destroy the keys** immediately after rotation.
First you make a backup of the old keys.
Then you remove the supposedly unused keys from the components that may use them.
After that you verify that your operations are not affected by this removal.
Only then you might plan for eventual destruction of the key backup.
{{< /hint >}}

## How to destroy Acra keys

In order to destroy historical keys, remove corrensponding files from the `*.old` subdirectories.
For example, to remove old storage encryption keys:

```
.acrakeys
├── your_client_ID_storage              current private storage key
├── your_client_ID_storage.old
│   ├── 2020-02-02T12:43:56.460128      previous private storage keys
│   └── 2020-08-03T16:54:12.176121
├── your_client_ID_storage.pub          current public storage key
├── your_client_ID_storage.pub.old
│   ├── 2020-02-02T12:43:56.460653      previous public storage keys
│   └── 2020-08-03T16:54:12.176642
...
```

{{< hint info >}}
**Note:**
The above instructions work only for current key store version 1.
New key store version 2 does not support key destruction at the moment.
{{< /hint >}}

<!--

If would be cool to have tools that do it, but we don't have any right now.
Thus we don't give *any* actionable instructions.
Including "how can I remove the key".
Find it out and do it yourself at your own risk.

-->
