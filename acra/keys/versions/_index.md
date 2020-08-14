---
weight: 2
title: Key store versions
bookCollapseSection: true
---

# Key store versions

We keep improving key storage and management in Acra.
Starting from version 0.86, all Acra components support a new storage format: key store version 2.
New features include:

  - Stronger key integrity validation, preventing even more tampering attempts.
  - Improved paritioning of the keys, simplifying configuration correctness checks.
  - Tracking additional key metadata, such as key validity periods and active states.
  - Compliance with best practices and recommendations,
    such as [NIST SP 800-57](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt1r4.pdf).
  - Support for more external KMS types
    (only in [Acra Enterprise Edition](https://www.cossacklabs.com/acra/#pricing)).

Key store version 1 is the current version, used by new Acra instances by default.
You can *opt in* the new version 2 when [generating keys](../operations/generation/)
by using the `--keystore=v2` option.
Acra components can automatically tell which key store version is currently in use,
so special attention is necessary only during the initial key generation and exchange.

{{< hint warning >}}
**Note:**
Key store version 2 is currently in development.
Some features provided by version 1 may not be available yet for version 2.
Please [let us know](mailto:dev@cossacklabs.com) if you run into any issues.
{{< /hint >}}

Of course it is also possible to convert existing key folders into the new format.
See how to migrate existing Acra deployments [from key store v1 to v2](migrate-v1-to-v2/).

Key store version affects mostly the storage format and available key management options.
The content of the keys – key material – stays the same.
This means that different Acra components can run with different key store versions.
For example, AcraServer may use improved version 2 while AcraConnector is still using version 1.

## Key store version 1

File-based key store version 1 uses a mostly flat file structure.
Purposes of the keys are encoded in their file names.
Private keys are stored encrypted.
Public keys are stored in plain, they have a `*.pub` file name extension.
Rotated keys are stored in directories with an `*.old` extension.

For example, here is how a key store version 1 might look like:

```
.acrakeys
├── Alice                               AcraConnector keypair
├── Alice.pub
├── Alice_server                        AcraServer keypair, rotated twice
├── Alice_server.old
│   ├── 2020-02-03T06:23:28.564094
│   └── 2020-08-04T08:30:31.663145
├── Alice_server.pub
├── Alice_server.pub.old
│   ├── 2020-02-03T06:23:28.564700
│   └── 2020-08-04T08:30:31.663733
├── Alice_storage                       storage keypair, rotated once
├── Alice_storage.old
│   └── 2020-05-21T16:01:58.656663
├── Alice_storage.pub
├── Alice_storage.pub.old
│   └── 2020-05-21T16:01:58.657333
├── DDDDDDDDIgRssUkVnxCyGcDv_zone       zone encryption keypair
└── DDDDDDDDIgRssUkVnxCyGcDv_zone.pub
```

## Key store version 2

File-based key store version 2 uses a hierarchical file structure.
Purposes of the keys are encoded in their file paths.
Private keys are stored encrypted, public keys are stored in plain,
both together inside a `*.keyring` file along with key metadata.
Rotated keys are stored in the same `*.keyring` file too.

The distinguishing feature of key store version 2 is the `version` file
with the following string it in: `Acra Key Store v2`.

For example, here is how a key store version 2 might look like:

```
.acrakeys
├── client
│   └── Alice
│       ├── storage.keyring             storage keypair
│       └── transport
│           ├── connector.keyring       AcraConnector keypair
│           └── server.keyring          AcraServer keypair
├── version
└── zone
    └── DDDDDDDDIgRssUkVnxCyGcDv
        └── storage.keyring             zone encryption keypair
```
