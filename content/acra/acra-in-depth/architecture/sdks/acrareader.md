---
title: AcraReader [ENTERPRISE]
weight: 3
---

# AcraReader

{{< hint info >}}
AcraReader is available in [Acra Enterprise Edition](/acra/enterprise-edition/) only.
{{< /hint>}}

AcraReader — a client-side library that only decrypts the data from Acra's encryption envelopes ([AcraStructs](/acra/acra-in-depth/data-structures/acrastruct/) and [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock/)). AcraReader is available for Ruby, Python, Go, NodeJS, iOS (Objective-C/Swift) and Android (Java, Kotlin). AcraReader only decrypts data, it cannot encrypt it.

Application uses AcraReader SDK to decrypt encrypted data on application side. Typically, AcraReader is used for building fully or partially end-to-end encrypted flows. 

Refer to [the dataflows that use AcraReader](/acra/acra-in-depth/data-flow/#end-to-end-encrypted-dataflow).

### AcraReader's functionality

You integrate AcraReader right into the application and perform same kind of decryption as Acra would do. Application receives encrypted containers and uses AcraReader to decrypt them.

AcraReader supports [AcraStructs](/acra/acra-in-depth/data-structures/acrastruct/) and [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock/). You should be very attentive when implementing decryption on client-side as client app will have access to decryption keys.

### Functional requirements

AcraReader supports data decryption from [AcraStructs](/acra/acra-in-depth/data-structures/acrastruct/) and [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock/).

### Non-functional requirements

* AcraReader can work with many programming languages, consistently using the same data format.
* AcraReader allows not to deal with crypto code inside the application.

### Connection with other parts

You can use AcraReader to bypass AcraServer/AcraTranslator and thus get some little performance boost where it is critical. We recommend using AcraReader in hostile environments where the data should be encrypted all the way until it gets to the app again. 

We strongly advise to combine encryption by AcraReader typical dataflow using AcraServer/AcraTranslator – meaning, that some apps will use AcraServer/AcraTranslator as designed, while some apps will process data on client-side only.

Refer to [the dataflows that use AcraReader](/acra/acra-in-depth/data-flow/#end-to-end-encrypted-dataflow).

### Security considerations

If you decide to use AcraReader, making sure that the keys are properly stored/protected will be a responsibility of the application.