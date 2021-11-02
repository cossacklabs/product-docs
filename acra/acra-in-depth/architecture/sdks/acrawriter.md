---
title: AcraWriter [ENTERPRISE]
weight: 2
---

# AcraWriter

{{< hint info >}}
AcraWriter is available in [Acra Enterprise Edition](/acra/enterprise-edition/) only.
{{< /hint>}}

AcraWriter — a client-side library that only encrypts the data into Acra's encryption envelopes ([AcraStructs](/acra/acra-in-depth/data-structures/acrastruct/) and [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock/)). AcraWriter is available for Ruby, Python, Go, NodeJS, iOS (Objective-C/Swift) and Android (Java, Kotlin). AcraWriter only encrypts data, it cannot decrypt it.

Application uses AcraWriter SDK to encrypt data on application side, and sends it to the database directly. Later, application reads the data through [AcraReader](/acra/acra-in-depth/architecture/sdks/acrareader/), [AcraTranslator](/acra/acra-in-depth/architecture/acratranslator/) or [AcraServer](/acra/acra-in-depth/architecture/acraserver/) to decrypt it. 

Refer to [the dataflows that use AcraWriter](/acra/acra-in-depth/data-flow/#client-side-encryption-server-side-decryption).

### AcraWriter's functionality

You integrate AcraWriter right into the application and perform same kind of encryption as Acra would do. Then you store encrypted data in the database.

AcraWriter supports [AcraStructs](/acra/acra-in-depth/data-structures/acrastruct/) and [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock/). You should be very attentive when implementing encryption on client-side as client app will have access to encryption keys.

### Functional requirements

AcraWriter supports data encryption to [AcraStructs](/acra/acra-in-depth/data-structures/acrastruct/) and [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock/).

### Non-functional requirements

* AcraWriter can work with many programming languages, consistently using the same data format.
* AcraWriter allows not to deal with crypto code inside the application.

### Connection with other parts

You can use AcraWriter to bypass AcraServer/AcraTranslator and thus get some little performance boost where it is critical. We recommend using AcraWriter in hostile environments where the data should be encrypted after leaving the app. 

We strongly advise to combine encryption by AcraWriter typical dataflow using AcraServer/AcraTranslator - meaning, that some apps will use AcraServer/AcraTranslator as designed, while some apps will process data on client-side only.

Refer to [the dataflows that use AcraWriter](/acra/acra-in-depth/data-flow/#client-side-encryption-server-side-decryption).

### Security considerations

If you decide to use AcraWriter, making sure that the keys are properly stored/protected will be a responsibility of the application.