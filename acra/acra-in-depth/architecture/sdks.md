---
title: SDKs [ENTERPRISE]
bookCollapseSection: true
weight: 5
---

# Acra SDKs in general

{{< hint info >}}
All Acra SDKs are available in [Acra Enterprise Edition](/acra/enterprise-edition/) only.
{{< /hint>}}

Acra provides a number of different SDKs that enable more in-depth usage of Acra's capabilities. By default, all necessary wrapper libraries are available only to commercial customers, but eventually it might change. 

Acra provides optional client-side SDKs for encrypting data (AcraWriter), for decrypting data (AcraReader), or for working with AcraTranslator (SDK for AcraTranslator).

## AcraWriter

AcraWriter — a client-side library that only encrypts the data into Acra's encryption envelopes (AcraStructs, AcraBlocks). AcraWriter is available for Ruby, Python, Go, NodeJS, iOS (Objective-C/Swift) and Android Java. AcraWriter only encrypts data, it cannot decrypt it.

Application uses AcraWriter SDK to encrypt data on application side, and sends it to the database directly. Later, application reads the data through [AcraReader](#acrareader), AcraTranslator or AcraServer to decrypt it. 

Refer to [the dataflows that use AcraWriter](/acra/acra-in-depth/data-flow/#client-side-encryption-server-side-decryption).

### How it works

You integrate AcraWriter right into the application and perform same kind of encryption as Acra would do. Then you store encrypted data in the database.

AcraWriter supports AcraStructs and AcraBlocks. You should be very attentive when implementing encryption on client-side as client app will have access to encryption keys.

### Functional requirements

AcraWriter supports data encryption to AcraStructs and AcraBlocks.

### Non-functional requirements

* AcraWriter can work with many programming languages, consistently using the same data format.
* AcraWriter allows not to deal with crypto code inside the application.

### How it connects to other parts

You can use AcraWriter to bypass AcraServer/AcraTranslator and thus get some little performance boost where it is critical. We recommend using AcraWriter in hostile environments where the data should be encrypted after leaving the app. 

We strongly advise to combine encryption by AcraWriter typical dataflow using AcraServer/AcraTranslator - meaning, that some apps will use AcraServer/AcraTranslator as designed, while some apps will process data on client-side only.

### What are the security considerations?

If you decide to use AcraWriter, making sure that the keys are properly stored/protected will be a responsibility of the application.


--- 
## AcraReader

AcraReader — a client-side library that only decrypts the data from Acra's encryption envelopes (AcraStructs and AcraBlocks). AcraReader is available for Ruby, Python, Go, NodeJS, iOS (Objective-C/Swift) and Android Java. AcraReader only decrypts data, it cannot encrypt it.

Application uses AcraReader SDK to decrypt encrypted data on application side. Typically, AcraReader is used for building fully or partially end-to-end encrypted flows. 

Refer to [the dataflows that use AcraReader](/acra/acra-in-depth/data-flow/#end-to-end-encrypted-dataflow).

### How it works

You integrate AcraReader right into the application and perform same kind of decryption as Acra would do. Application receives encrypted containers and uses AcraReader to decrypt them.

AcraReader supports AcraStructs and AcraBlocks. You should be very attentive when implementing decryption on client-side as client app will have access to decryption keys.

### Functional requirements

AcraReader supports data decryption from AcraStructs and AcraBlocks.

### Non-functional requirements

* AcraReader can work with many programming languages, consistently using the same data format.
* AcraReader allows not to deal with crypto code inside the application.

### How it connects to other parts

You can use AcraReader to bypass AcraServer/AcraTranslator and thus get some little performance boost where it is critical. We recommend using AcraReader in hostile environments where the data should be encrypted all the way until it gets to the app again. 

We strongly advise to combine encryption by AcraReader typical dataflow using AcraServer/AcraTranslator - meaning, that some apps will use AcraServer/AcraTranslator as designed, while some apps will process data on client-side only.

### What are the security considerations?

If you decide to use AcraReader, making sure that the keys are properly stored/protected will be a responsibility of the application.


---

## SDK for AcraTranslator

[AcraTranslator](/acra/acra-in-depth/architecture/acratranslator/) provides gRPC and HTTP API, which you can use in your application. You can also contact us to get an SDK that will provide better/deeper integration with your client application's language. SDK for AcraTranslator encapsulates its API.

### How it works

You use API or SDK in places where data should be encrypted/decrypted, and get the results without having to write crypto code in your language,
with consistent results among all the components that use the API/SDK.

Read more about [AcraTranslator](/acra/acra-in-depth/architecture/acratranslator/).


### Functional requirements

SDK for AcraTranslator supports the same features as AcraTranslator's API.

### Non-functional requirements

* SDK for AcraTranslator can work with many programming languages, consistently using the same data format.
* SDK for AcraTranslator allows not to deal with crypto code inside the application.

### How it connects to other parts

SDK for AcraTranslator is a client-side SDK for infrastructures that rely on AcraTranslator. 

Refer to [AcraTranslator](/acra/acra-in-depth/architecture/acratranslator/) page.

