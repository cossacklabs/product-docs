---
title: AcraTranslator SDK [ENTERPRISE]
weight: 3
---

# SDK for AcraTranslator

{{< hint info >}}
SDK for AcraTranslator is available in [Acra Enterprise Edition](/acra/enterprise-edition/) only.
{{< /hint>}}

[AcraTranslator](/acra/acra-in-depth/architecture/acratranslator/) provides gRPC and HTTP API, which you can use in your application. You can also contact us to get an SDK that will provide better/deeper integration with your client application's language. SDK for AcraTranslator encapsulates its API.

### SDK for AcraTranslator's functionality

You use API or SDK in places where data should be encrypted/decrypted, and get the results without having to write crypto code in your language,
with consistent results among all the components that use the API/SDK.

Read more about [AcraTranslator](/acra/acra-in-depth/architecture/acratranslator/).

### Functional requirements

SDK for AcraTranslator supports the same features as AcraTranslator's API.

### Non-functional requirements

* SDK for AcraTranslator can work with many programming languages, consistently using the same data format.
* SDK for AcraTranslator allows not to deal with crypto code inside the application.

### Connection with other parts

SDK for AcraTranslator is a client-side SDK for infrastructures that rely on AcraTranslator. 

Refer to [AcraTranslator](/acra/acra-in-depth/architecture/acratranslator/) page.

