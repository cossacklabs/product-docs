---
title: SDKs [ENTERPRISE]
bookCollapseSection: true
weight: 5
---

# SDK to AcraTranslator (API client)

AcraTranslator provides gRPC and HTTP API, which you can use in your application.

You can also contact us to get an SDK that will provide better/deeper integration with your language.

[Read more]({{< ref "api_service.md" >}}) about features it provides.

## How it works

You use API/SDK in places where data should be encrypted/decrypted,
and get the results without having to write crypto code in you language,
with consistent results among all the components that use the API/SDK.

[Read more]({{< ref "acra/guides/integrating-acra-translator-into-new-infrastructure/_index.md" >}}) about AcraTranslator integration.

For the gRPC protobuf `proto` file, click
[here](https://github.com/cossacklabs/acra/blob/master/cmd/acra-translator/grpc_api/api.proto).

## Which FRs/NFRs does it implement

<!-- All the FRs provided by AcraTranslator -->
* Data encryption/decryption
* Tokenization/detokenization (kind of anonymization, [read more]({{< ref "acra/security-controls/tokenization/_index.md" >}}))
* Encryption/decryption with masking (leaving some part of data unencrypted,
  [read more]({{< ref "acra/security-controls/tokenization/_index.md" >}}))
* HMAC calculation for search of encrypted value in a database

---

* Can work with (almost) all programming languages, consistently using the same data format
* No need to deal with crypto code inside the application

## How it connects to other parts

Since it relies on AcraTranslator, you will definitely need it up and running.

If you use AcraConnector, then the application will connect to it instead.

## What are architectural considerations?

_TODO_

# Full-on in-app SDK

There are two components: AcraWriter and AcraReader.
The first is responsible for data encryption, the second one — for decryption.

## How it works

You integrate them right into the application and perform same kind of encryption/decryption as Acra would do in transparent mode.
Then you store encrypted data in the database.

If you encrypt data using a public key known to Acra, and store it database by performing a query through AcraServer,
the later will attempt to decrypt the data and encrypt it with a new key.
If succeeded, Acra will then be able to transparently decrypt the data.
[Read more about crypto containers]({{< ref "acra/configuring-maintaining/optimizations/acrastructs_vs_acrablocks.md" >}}).

You can also configure AcraServer to re-encrypt AcraStructs into AcraBlock to increase future decryption performance.

## Which FRs/NFRs does it implement

* Data encryption/decryption on client (application) side

## How it connects to other parts

You can use AcraWriter/AcraReader to bypass AcraServer and thus get some little performance boost where it is critical.
But you can also combine AcraWriter with AcraServer and get "encrypted data the whole way, from application to the database".

## What are the security considerations?

If you decide to use AcraWriter+AcraReader, making sure that the keys are properly stored/protected
will be a responsibility of the application.

## What are architectural considerations?

_TODO_
