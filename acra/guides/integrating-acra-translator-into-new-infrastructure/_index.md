---
title: Integrating AcraTranslator into new infrastructure
bookCollapseSection: true
weight: 2
---

# Integrating AcraTranslator into infrastructure

## How AcraTranslator works

Refer to [AcraTranslator architecture]({{< ref "/acra/acra-in-depth/architecture/acratranslator.md" >}}) page to find out
deep description of internals and how it works.

## AcraTranslator installation

There are multiple ways to install AcraTranslator.
You will also need utilities like `acra-keys` that come along.

* [Install package from a repo]({{< ref "acra/getting-started/installing/installing-acra-from-repository.md">}})
* [Use Docker images]({{< ref "acra/getting-started/installing/launching-acra-from-docker-images.md">}})
* [Install from sources]({{< ref "acra/getting-started/installing/installing-acra-from-sources.md">}})

## Key generation

You will need some keys in order to launch AcraServer, so let's do it first.

1. [Generate a master key]({{< ref "acra/security-controls/key-management/operations/generation.md#11-generating-acra-master-key">}})
2. [Generate encryption keys]({{< ref "acra/security-controls/key-management/operations/generation.md#12-generating-transport-and-encryption-keys">}})

The first one will be used to protect all the other keys,
it should be base64-encoded and passed to Acra services in `ACRA_MASTER_KEY` environment variable.

Like this: `ACRA_MASTER_KEY="$(cat /tmp/master_key | base64)" acra-server ...`

The second key is responsible for data encryption.
There are actually more kinds of keys, read more about that on
[Acra keys inventory]({{< ref "acra/security-controls/key-management/inventory.md" >}}).

It is also possible to store keys in a Redis database, see
[Scalable KV storages]({{< ref "acra/configuring-maintaining/key-storing/kv-stores.md#redis" >}}).

### Note about Client ID

When generating a key, you will always have to bind it with a [Cliend ID]({{< ref "client_id.md" >}}) or Zone ID.
AcraTranslator distinguishes requests by [Client ID]({{< ref "client_id.md" >}}) and uses different encryption keys for 
different client ID.

## Architecture and DataFlow of AcraTranslator-based infrastructure

![](/files/data-flow/acra-archi-translator-writer.png)

Acra design values simplicity as much as security.

1. The application sends [AcraStructs] or [AcraBlocks] via HTTP or gRPC API.
2. AcraConnector sends that request to AcraTranslator using [Themis Secure Session] (socket protection protocol).
3. AcraTranslator accepts the request and attempts to decrypt an [AcraStruct] or [AcraBlock]. If the decryption is
   successful, it sends the resulting plaintext in the response. If decryption fails, AcraTranslator sends out a
   decryption error.
4. AcraTranslator returns the data to AcraConnector (via [Themis Secure Session]), which in turn returns it to the application.

AcraTranslator reads decryption keys from key folder and stores them encrypted in memory. It uses LRU cache to increase
performance by keeping only actively used keys in memory. The size of LRU cache can be configured depending on your
server's load.

{{< hint warning >}}
**Note:**
AcraTranslator supports ability to use [TLS] as encryption channel instead of [Themis Secure Session].
In such case, you don't need to use AcraConnector, but you should manage all your TLS certificates manually.
{{< /hint >}}

## AcraTranslator configuration

Refer to [AcraTranslator configuration]({{< ref "acratranslator_configuration.md" >}}) page.

## AcraConnector (optional)

AcraConnector is as intermediate proxy between the application and AcraTranslator.
Why would you need yet another proxy? Well, there are a couple of reasons:

* Providing secure transport to AcraTranslator:
  if application does not support TLS, communicates with AcraTranslator on remote host, and you want to ensure the 
  communication channel is safe
* Specifying which Client ID to use:
  when using TLS, you will have to use client IDs derived from some certificate properties (such as serial number),
  but with AcraConnector you can use whatever ID you want by simply setting configuration option when launching AcraConnector

AcraConnector usually lives on the same host as the application, but is isolated a bit
(running as different user, in separate docker container and so on).

Read more in [Client side encryption with AcraConnector and AcraWriter]({{< ref "acra/guides/advanced-integrations/client-side-integration-with-acra-connector.md" >}}).

## Changes on application side

* Teach application to work with AcraTranslator API. Generate code for gRPC client or write own to work with HTTP API
* Make sure application will accept TLS certificate configured in AcraTranslator in case of usage TLS as transport protection
* Up and configure AcraConnector close to application in case of usage SecureSession as transport protection

### AcraWriter integration (optional)

One of the things available in enterprise edition is
[part of SDK called AcraWriter]({{< ref "acra/acra-in-depth/architecture/sdks/acrawriter.md" >}})
that allows data encryption right inside the application for `Encrypt` operations via gRPC/HTTP API calls.


## Poison records

If the client application is hacked and the attacker is trying to decrypt all the data, you can detect it using [poison records](/acra/security-controls/intrusion-detection/).

AcraTranslator (similarly as AcraServer) has ability to detect poison records and stop executing the request, 
preventing the data from leaking to an untrusted destination.
To learn more about AcraTranslator cmd configuration you can refer [here](/acra/configuring-maintaining/general-configuration/acra-translator/).

## Read more

* [Storage and data model implications]({{< ref "acra/configuring-maintaining/storage-and-data-model-implications/" >}})
  lists current limitations introduced when using AcraTranslator
* [Encryption docs]({{< ref "acra/security-controls/encryption/_index.md" >}})
  describes encryption configuration more precisely, describes how AcraTranslator encrypts/decrypts data on the fly
* [docker-compose examples](https://github.com/cossacklabs/acra/tree/master/docker)
  may give you various ideas about AcraTranslator integration in docker environment

[AcraTranslator]: /acra/configuring-maintaining/general-configuration/acra-translator/
[AcraStructs]: /acra/acra-in-depth/data-structures/acrastruct/
[AcraBlocks]: /acra/acra-in-depth/data-structures/acrablock/
[Themis Secure Session]: /themis/crypto-theory/cryptosystems/secure-session/
[TLS]: /acra/configuring-maintaining/general-configuration/acra-translator/#tls