---
title: KMS
weight: 2
---

# KMS

As Acra stores all intermediate keys encrypted, it needs Acra Master Key to decrypt them. 

KMS is used to store Acra Master Key. While KMS can be used to store all the intermediate keys, we strongly don't recommend it, as it might be quite expensive and might become performance bottleneck.

## KMS' functionality

Most Acra services and tools, like AcraServer, AcraTranslator and AnyProxy, can read Acra Master Key from environment variable, but they can read it from KMS as well.

Refer to [KMS integration](/acra/configuring-maintaining/key-storing/kms-integration) to learn more about supported KMS and how to configure connection.


## Functional requirements

* Secure storage of Acra Master Key


## Connection with other parts

AcraServer, AcraTranslator and AnyProxy can read Acra Master Key from KMS.


## Security considerations

If you want to use KMS for master key storage/distribution, you already know that it is quite important
to ensure that the KMS is properly configured, well isolated and there are policies that limit what clients can request.

You can, for example, limit who can read Acra Master Key to only machines that actually need it.

We strongly recommend considering backup of Acra Master Key, configuring audit logging on KMS side, and deploying KMS as a cluster (scaling in mind).

