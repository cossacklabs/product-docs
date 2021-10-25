---
title: Key management
bookCollapseSection: true
weight: 3
---

# Key management

Acra uses a multitude of keys for different purposes:

  - storage/zone keys for encrypting your data at rest
  - transport keys for encrypting communications
  - blind index keys for searchable encryption
  - keys for [audit logging](/acra/security-controls/security-logging-and-events/audit-logging)
  - poison record keys for [intrusion detection]({{< ref "/acra/security-controls/intrusion-detection/#poison-records" >}})
  - authentication storage key for encryption/decryption credentials of [AcraWebConfig]({{< ref "/acra/configuring-maintaining/general-configuration/acra-webconfig.md#-INVALID" >}}) users

The keys are securely stored in a [**keystore**](versions) which is located either on the server's filesystem, or in a remote location such as key management service (KMS) or hardware security module (HSM).

Glance through the [inventory of Acra keys](inventory) to learn what keys there are in the keystore, where they are located, and how they are used.


## Operations

However, just storing the keys securely is not enough. It is crucial to manage the keys and operate the keystore in a secure way as well. Acra performs most key management operations.

These are typical operations that you will need to perform:

  - [Generate keys](operations/generation) when deploying a new Acra instance.
  - [Back up keys](operations/backup) to prevent accidental data loss.
  - [Rotate keys](operations/rotation) to mitigate leaks and ensure continuous security.
  - [Destroy keys](operations/destruction) when they are no longer used.

If something goes wrong, please refer the the [troubleshooting](troubleshooting) page
for instructions on dealing with common issues.


## Additional info

Refer to NIST key management guidelines ([NIST SP 800-57](https://csrc.nist.gov/Projects/Key-Management/key-management-guidelines)) to learn more about key management procedures.

Feel free to [contact us](mailto:dev@cossacklabs.com) if you need additional assistance.
