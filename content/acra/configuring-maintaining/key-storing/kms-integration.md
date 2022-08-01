---
title: KMS integration
bookCollapseSection: true
weight: 2
---

# KMS integration

KMS plays an important role for providing cryptographic keys security. Currently, Acra uses KMS to load Acra Master Key used for intermediate keys encrypting / decrypting.
Since safety of Acra's cryptographic keys directly depends on safety of Acra Master Key, Acra has strong requirements to KMSs and their security guarantees.

Refer to [Acra in depth / Key storage and KMS](/acra/acra-in-depth/architecture/key-storage-and-kms/) to learn more about general key storage requirements.

Refer to [Security controls / Key management](/acra/security-controls/key-management/) to learn how to generate Acra Master Key.


## Loading Acra Master Key

On startup every Acra service or tool that needs access to intermediate keys should load Acra Master Key. 

They load and store it in a memory and use it to decrypt intermediate key every time. After finishing operations with intermediate keys, a service forgets and erases them from memory to leave them in unprotected form as less as possible.

Only Acra Master Key loaded securely gives Acra access to intermediate keys and sensitive data protected with these keys.


The load could happen:

* directly via environment variable (refer to [Security Controls / Key management](/acra/security-controls/key-management/operations/generation/#master-keys));

* directly from KMS (AcraServer/AcraTranslator support KMS integration directly to read Acra Master Key, see [below](#supported-kmss));

* from KMS via environment variable (read keys from KMS using `curl` or your preferred deployment tool, put it to the environment variable, startup Acra service from env variable).


## Supported KMSs

### Hashicorp Vault

[Hashicorp Vault](https://www.vaultproject.io/) is popular, widely used service for secure storing sensitive data, 
especially secrets. Acra uses Hashicorp Vault as storage for master key used to encrypt/decrypt all private keys.

Hashicorp Vault supports a lot of storage backends, that guarantee high availability, scalability, authenticated and 
secure transport communication. That is why Acra supports it out of the box.


The following Acra services and tools can load Acra Master Key from this KMS. 

* [acra-server](/acra/configuring-maintaining/general-configuration/acra-server/#hashicorp-vault),
* [acra-translator](/acra/configuring-maintaining/general-configuration/acra-translator/#hashicorp-vault),
* [acra-keymaker](/acra/configuring-maintaining/general-configuration/acra-keymaker/#hashicorp-vault),
* [acra-rotate](/acra/configuring-maintaining/general-configuration/acra-rotate/#hashicorp-vault), 
* [acra-addzone](/acra/configuring-maintaining/general-configuration/acra-addzone/#hashicorp-vault),
* [acra-backup](/acra/configuring-maintaining/general-configuration/acra-backup/#hashicorp-vault),
* [acra-log-verifier](/acra/configuring-maintaining/general-configuration/acra-log-verifier/#hashicorp-vault),
* [acra-poisonrecordmaker](/acra/configuring-maintaining/general-configuration/acra-poisonrecordmaker/#hashicorp-vault),
* [acra-rollback](/acra/configuring-maintaining/general-configuration/acra-rollback/#hashicorp-vault).

You can find out how to configure access to KMS on `HashiCorp Vault` section on the distinct documentation page of these services.

### AWS KMS

[AWS KMS](https://aws.amazon.com/kms/) is a managed service that makes it easy for you to create and control the
cryptographic keys that are used to protect your data. Acra use AWS KMS manged keys to decrypt Acra Master Key.

AWS KMS is a popular solution for centralized key management, managing encryption for AWS services, and data encryption
in the client application. That is why Acra is trying to provide the closest possible integration with it.

The following Acra services and tools can load Acra Master Key from this KMS.

* [acra-server](/acra/configuring-maintaining/general-configuration/acra-server/#hashicorp-vault),
* [acra-translator](/acra/configuring-maintaining/general-configuration/acra-translator/#hashicorp-vault),
* [acra-keymaker](/acra/configuring-maintaining/general-configuration/acra-keymaker/#hashicorp-vault),
* [acra-rotate](/acra/configuring-maintaining/general-configuration/acra-rotate/#hashicorp-vault),
* [acra-addzone](/acra/configuring-maintaining/general-configuration/acra-addzone/#hashicorp-vault),
* [acra-backup](/acra/configuring-maintaining/general-configuration/acra-backup/#hashicorp-vault),
* [acra-log-verifier](/acra/configuring-maintaining/general-configuration/acra-log-verifier/#hashicorp-vault),
* [acra-poisonrecordmaker](/acra/configuring-maintaining/general-configuration/acra-poisonrecordmaker/#hashicorp-vault),
* [acra-rollback](/acra/configuring-maintaining/general-configuration/acra-rollback/#hashicorp-vault).

You can find out how to configure access to KMS on `KMS` section on the distinct documentation page of these
services.

### GCP KMS

Support of GCP KMS is available only in [Acra Enterprise Edition](/acra/enterprise-edition/)


### Keywhiz

Support of Keywhiz is available only in [Acra Enterprise Edition](/acra/enterprise-edition/)

Note that [Acra Enterprise Edition](/acra/enterprise-edition/) provides better KMSs integration and more ways to load Acra Master Key.
