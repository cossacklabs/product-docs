---
weight: 2
title: Keystore versions
bookCollapseSection: true
---

# Keystore versions

We keep improving key storage and management in Acra.


## The latest keystore

Starting from version [0.90.0](/acra/#latest-release-and-revision), all Acra components support a new storage format: keystore version 2.

New features include:

  - Stronger key integrity validation, preventing even more tampering attempts.
  - Improved paritioning of the keys, simplifying configuration correctness checks.
  - Tracking additional key metadata, such as key validity periods and active states.
  - Compliance with best practices and recommendations,
    such as [NIST SP 800-57](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt1r4.pdf).
  - Support for more external KMS types
    (only in [Acra Enterprise Edition](/acra/enterprise-edition/)).

Keystore version 1 is the current version, used by new Acra instances by default.

You can *opt in* the new version 2 when [generating keys](../operations/generation/)
by using the `--keystore=v2` option.

Acra components can automatically tell which keystore version is currently in use,
so special attention is necessary only during the initial key generation and exchange.

Of course it is also possible to convert existing key folders into the new format.
See how to migrate existing Acra deployments [from keystore v1 to v2](migrate-v1-to-v2/).

Keystore version affects mostly the storage format and available key management options.
The content of the keys – key material – stays the same.
This means that different Acra components can run with different keystore versions.
For example, AcraServer may use improved version 2 while AcraConnector is still using version 1.

## Keystore version 2

File-based keystore version 2 uses a hierarchical file structure.
Purposes of the keys are encoded in their file paths.
Private keys are stored encrypted, public keys are stored in plain,
both together inside a `*.keyring` file along with key metadata.
Rotated keys are stored in the same `*.keyring` file too.

The distinguishing feature of keystore version 2 is the `version` file
with the following string it in: `Acra Keystore v2`.

For example, here is how a keystore version 2 might look like:

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

## Keystore version 1

File-based keystore version 1 uses a mostly flat file structure.
Purposes of the keys are encoded in their file names.
Private keys are stored encrypted.
Public keys are stored in plain, they have a `*.pub` file name extension.
Rotated keys are stored in directories with an `*.old` extension.

For example, here is how a keystore version 1 might look like:

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
