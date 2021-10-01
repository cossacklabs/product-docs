---
title: Integrating Acra Translator into new infrastructure
bookCollapseSection: true
---

## Usage of AcraTranslator

[AcraTranslator]({{< ref "/acra/configuring-maintaining/general-configuration/acra-translator.md" >}}) is a lightweight server that receives [AcraStructs]({{< ref "/acra/acra-in-depth/data-structures/#understanding-acrastruct" >}}) or [AcraBlocks]({{< ref "acra/acra-in-depth/data-structures/#acrablock" >}}) and returns the decrypted data. 
This element of Acra is necessary in the use-cases when applications store the encrypted data as separate blobs (files that are not in a database - i.e. in the S3 bucket, local file storage, etc.).

By its nature, AcraTranslator is a separate daemon that runs in an isolated environment (separate virtual machine or physical server). AcraTranslator is responsible for holding all the secrets required for data decryption and for actually decrypting the data.

AcraTranslator doesn't care about the source of the data, it accepts [AcraStructs]({{< ref "/acra/acra-in-depth/data-structures/#understanding-acrastruct" >}}) or [AcraBlock]({{< ref "acra/acra-in-depth/data-structures/#acrablock" >}}) via HTTP or gRPC API. An application can store crypto envelope anywhere it is convenient: as cells in the database, as files in the file storage (local or cloud storage, like S3). 
An application sends [AcraStructs]({{< ref "/acra/acra-in-depth/data-structures/#understanding-acrastruct" >}}) or [AcraBlocks]({{< ref "acra/acra-in-depth/data-structures/#acrablock" >}}) as binary data and receives plaintext (or decryption error) from AcraTranslator.

However, sending plaintext data via a non-secure channel is a bad idea, so AcraTranslator requires the use of [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/) or [TLS](/acra/configuring-maintaining/general-configuration/acra-translator/#tls) encryption channel (which is basically encrypted TCP/UNIX sockets). 
To establish a Secure Session connection, an application doesn't need to include the crypto-code itself, only to direct the traffic through [AcraConnector]({{< ref "/acra/configuring-maintaining/general-configuration/acra-connector.md" >}}) instead.



## Architecture and DataFlow of AcraTranslator-based infrastructure

![](/files/data-flow/acra-archi-translator-writer.png)

Acra design values simplicity as much as security.

1. The application sends [AcraStructs]({{< ref "/acra/acra-in-depth/data-structures/#understanding-acrastruct" >}}) or [AcraBlock]({{< ref "acra/acra-in-depth/data-structures/#acrablock" >}}) via HTTP or gRPC API.
2. AcraConnector sends that request to AcraTranslator using [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/) (socket protection protocol).
3. AcraTranslator accepts the request and attempts to decrypt an [AcraStructs]({{< ref "/acra/acra-in-depth/data-structures/#understanding-acrastruct" >}}) or [AcraBlock]({{< ref "acra/acra-in-depth/data-structures/#acrablock" >}}). If the decryption is successful, it sends the resulting plaintext in the response. If decryption fails, AcraTranslator sends out a decryption error.
4. AcraTranslator returns the data to AcraConnector (via [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/)), which in turn returns it to the application.

AcraTranslator reads decryption keys from key folder and stores them in memory in encrypted form. It uses LRU cache to increase performance by keeping only actively used keys in memory. The size of LRU cache can be configured depending on your server's load.

{{< hint warning >}}
**Note:**
AcraTranslator supports ability to use [TLS](/acra/configuring-maintaining/general-configuration/acra-translator/#tls) as encryption channel instead of [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/). In such case, you don't need to use AcraConnector, but you should manage all your TLS certificates manually.
{{< /hint >}}


## Configuration

Each request to AcraTranslator should contain direct crypto envelop for decryption ([AcraStructs]({{< ref "/acra/acra-in-depth/data-structures/#understanding-acrastruct" >}}) or [AcraBlocks]({{< ref "acra/acra-in-depth/data-structures/#acrablock" >}}))
and ClientID or ZoneID. Where ClientID determines what client public key was used and ZoneID determines which zone identifier was used for creating the crypto envelope.

{{< hint info >}}
**Note:**
[AcraTranslator]({{< ref "/acra/configuring-maintaining/general-configuration/acra-translator.md" >}}) can work either using HTTP API or gRPC API, but not simultaneously.
{{< /hint >}}


## Setup AcraTranslator using Docker

AcraTranslator is available as a Docker image which you can download from the [Cossack Labs official Docker repository](https://github.com/cossacklabs/acra/tree/master/docker) or you can find it in the [Docker folder](https://github.com/cossacklabs/acra-Q12021/tree/master/docker) in the GitHub repository.

There are a couple of predefined docker-compose files for [HTTP API](https://github.com/cossacklabs/acra-Q12021/blob/master/docker/docker-compose.translator-ssession-connector-http.yml) and [gRPC API](https://github.com/cossacklabs/acra-Q12021/blob/master/docker/docker-compose.translator-ssession-connector-grpc.yml) AcraTranslator infrastructure.
{{< hint info >}}

**Note:**
Using Docker is recommended for testing purposes only. Please don't rely on Docker in real-life production settings. We provide docker-compose files with pre-generated keys, that are visible for everyone.
{{< /hint >}}



## Poison records

If the client application is hacked and the attacker is trying to decrypt all the data, you can detect it using [poison records]({{< ref "/acra/security-controls/intrusion-detection" >}}).

AcraTranslator also has ability to detect poison records and stop executing the query, preventing the data from leaking to an untrusted destination. 
To learn more about AcraTranslator cmd configuration you can refer [here]({{< ref "/acra/configuring-maintaining/general-configuration/acra-translator.md" >}}).



