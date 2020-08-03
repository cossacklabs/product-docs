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
