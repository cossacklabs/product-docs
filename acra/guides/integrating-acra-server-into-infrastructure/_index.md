---
title: Integrating AcraServer into infrastructure
bookCollapseSection: true
weight: 1
---

# Integrating AcraServer into infrastructure

## AcraServer installation

There are multiple ways to install AcraServer.
You will also need utilities like `acra-keys` that come along.

* [Install package from a repo]({{< ref "acra/getting-started/installing/installing-acra-from-repository.md">}})
* [Use Docker images]({{< ref "acra/getting-started/installing/launching-acra-from-docker-images.md">}})
* [Install from sources]({{< ref "acra/getting-started/installing/installing-acra-from-sources.md">}})

## Key generation

You will need some keys in order to launch AcraServer, so let's do it first.

1. [Generate a master key]({{< ref "acra/security-controls/key-management/operations/generation.md#11-generating-acra-master-key">}})
2. [Generate encryption keys]({{< ref "acra/security-controls/key-management/operations/generation.md#12-generating-transport-and-encryption-keys">}})

The first one will be used to protect all the other keys, while the second one... well, it is responsible for data encryption.
There are actually more kinds of keys, read more about that on
[Acra keys inventory]({{< ref "acra/security-controls/key-management/inventory.md" >}}).

It is also possible to store keys in a Redis database, see
[Scalable KV storages]({{< ref "acra/configuring-maintaining/key-storing/kv-stores.md#redis" >}}).

### Note about Client ID

When generating a key, you will always have to bind it with a [Cliend ID]({{< ref "client_id.md" >}}) or Zone ID.
AcraServer distinguishes applications by [Cliend ID]({{< ref "client_id.md" >}}) and uses different encryption keys for different clients.

## AcraServer configuration

Refer to [AcraServer configuration]({{< ref "acraserver_configuration.md" >}}) page.

## Data migration

There are [few things you need to know]({{< ref "data_migration.md" >}}) before using AcraServer encryption features.

## Changes on application side

As soon as you have running instance of AcraServer, you can try redirecting you application(s) to it

* Change the `host:port` part of connection to make application connect to AcraServer
* Make sure application will accept TLS certificate configured in AcraServer
* No need to change database credentials

### AcraWriter integration (optional)

One of the things available in enterprise edition is
[part of SDK called AcraWriter]({{< ref "acra/acra-in-depth/architecture/sdks/acrawriter.md" >}})
that allows data encryption right inside the application.
This feature is not frequently needed, but may help in situations where transport encryption is not enough.

## Read more

* [Storage and data model implications]({{< ref "acra/configuring-maintaining/storage-and-data-model-implications/" >}})
  lists current limitations introduced when using AcraServer
* [Encryption docs]({{< ref "acra/security-controls/encryption/_index.md" >}})
  describes encryption configuration more precisely, describes how AcraServer encrypts/decrypts data on the fly
* [docker-compose examples](https://github.com/cossacklabs/acra/tree/master/docker)
  may give you various ideas about AcraServer integration in docker environment
* [Trying Acra]({{< ref "acra/getting-started/trying/" >}})
  with a couple of examples on how to launch Acra and run scripts that store/fetch data while also triggering its encryption
