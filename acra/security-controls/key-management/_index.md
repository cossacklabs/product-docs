---
title: Key management
bookCollapseSection: true
weight: 5
---

# Key management

Acra uses a multitude of encryption keys for different purposes:

  - Acra Master Key – the main key, typically stored in KMS / secure storage, and used to encrypt other keys;
  - storage keys for encrypting/masking/tokenizing the data. Each data field is encrypted by data encryption key (DEK) which is encrypted by `ClientID`-related storage key;
  - keys for transport encryption: either TLS certicates or special transport encryption keys if [AcraConnector is used with Themis Secure Session](/acra/security-controls/transport-security/acra-connector/);
  - keys for [searchable encryption](/acra/security-controls/searchable-encryption/) (if used);
  - keys for [tamper-proof audit logging](/acra/security-controls/security-logging-and-events/audit-logging) (if used);
  - poison record keys for [intrusion detection](/acra/security-controls/intrusion-detection/#poison-records) (if used);
  - authentication storage key for encryption/decryption credentials of [AcraWebConfig](/acra/configuring-maintaining/general-configuration/acra-webconfig) (deprecated since 0.91.0) users (if used).

Acra Master Key is securely stored in [key management service (KMS)](/acra/acra-in-depth/architecture/key-storage-and-kms/#kms) or hardware security module (HSM). Other keys are encrypted and securely stored in a [**keystore**](versions) which is located either on the server's filesystem, or in [a remote key storage database](/acra/acra-in-depth/architecture/key-storage-and-kms/#key-storage).

## Inventory of keys

Glance through the [inventory of Acra keys](inventory) to learn what cryptographic keys are stored in the keystore, where they are located, and how they are used.


## Operations

However, just storing the keys securely is not enough. It is crucial to manage the keys and operate with the keystore securely as well. Acra provides tools for many key management operations.

These are typical operations that you will need to perform:

  - [Generate keys](operations/generation) when deploying a new Acra instance.
  - [Back up keys](operations/backup) to prevent accidental data loss.
  - [Rotate keys](operations/rotation) to mitigate leaks and ensure continuous security.
  - [Destroy keys](operations/destruction) when they are no longer used.

If something goes wrong, please refer to the [troubleshooting](troubleshooting) page
for instructions on dealing with common issues.


## Additional info

Refer to NIST key management guidelines ([NIST SP 800-57](https://csrc.nist.gov/Projects/Key-Management/key-management-guidelines)) to learn more about key management procedures.

Feel free to [contact us](mailto:dev@cossacklabs.com) if you need additional assistance.
