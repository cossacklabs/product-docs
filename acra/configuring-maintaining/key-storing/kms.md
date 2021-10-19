---
title: KMS integration
bookCollapseSection: true
weight: 2
---

# KMS integration

KMS is important part of keys security. For now Acra uses KMS to load master key used to encrypt and decrypt private keys.
Safety of master key is important guarantee of keys protection. So Acra has strong requirements to KMS and their security
guarantees.

## Which KMS we support

### Hashicorp Vault

[Hashicorp Vault](https://www.vaultproject.io/) is popular, widely used service for secure storing sensitive data, 
especially secrets. Acra uses Hashicorp Vault as storage for master key used to encrypt/decrypt all private keys.
Every Acra service that operates with key storage (
[acra-server]({{< ref "/acra/configuring-maintaining/general-configuration/acra-server.md#hashicorp-vault" >}}), 
[acra-translator]({{< ref "/acra/configuring-maintaining/general-configuration/acra-translator.md#hashicorp-vault" >}}), 
[acra-keymaker]({{< ref "/acra/configuring-maintaining/general-configuration/acra-keymaker.md#hashicorp-vault" >}}), 
[acra-rotate]({{< ref "/acra/configuring-maintaining/general-configuration/acra-rotate.md#hashicorp-vault" >}}), [acra-addzone]({{< ref "/acra/configuring-maintaining/general-configuration/acra-addzone.md#hashicorp-vault" >}}),
[acra-backup]({{< ref "/acra/configuring-maintaining/general-configuration/acra-backup.md#hashicorp-vault" >}}),
[acra-log-verifier]({{< ref "/acra/configuring-maintaining/general-configuration/acra-log-verifier.md#hashicorp-vault" >}}),
[acra-poisonrecordmaker]({{< ref "/acra/configuring-maintaining/general-configuration/acra-poisonrecordmaker.md#hashicorp-vault" >}}),
[acra-rollback]({{< ref "/acra/configuring-maintaining/general-configuration/acra-rollback.md#hashicorp-vault" >}}))
can load master key from this KMS. You can find out how to configure access to KMS on `HashiCorp Vault` section on the 
distinct documentation page of these services.

Hashicorp Vault supports a lot of storage backends, that guarantee high availability, scalability, authenticated and 
secure transport communication. That is why Acra supports is out of the box.

## How we support it 

On startup every tool or daemon that needs access to private keys loads master key from KMS. They load and store it in 
memory and use to decrypt private key every time. After using private key services forget and erase private keys from memory
to leave them in unprotected form as less as possible. Only master key loaded from KMS gives Acra access to private keys
and sensitive data protected with these keys.