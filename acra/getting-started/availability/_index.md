---
title: Availability on platforms/languages
weight: 1
---

# Availability on platforms/languages

## Server side

It is where you can run Acra software that acts like a server (including AcraServer, AcraConnector, AcraTranslator).

In most cases Linux will be used as a host OS, and we have:
* [packages](/acra/getting-started/installing/installing-acra-from-repository/) available for commonly used distros
* [pre-built images](/acra/getting-started/installing/launching-acra-from-docker-images/) compatible with Docker and most cloud Kubernetes providers like GCP/GKE and AWS/EKS

Alternatively, you can manually [build Acra from sources](/acra/getting-started/installing/installing-acra-from-sources/) under desired platform (though Windows is not supported).

## Client side

Depending on the planned mode of use, there are two main approaches to connecting your application via Acra:
* directly to Acra as a regular SQL client
* integrating [SDK](/acra/acra-in-depth/architecture/sdks/) into your application

Each option has its own advantages, they are discussed in detail in the [Architecture](/acra/acra-in-depth/architecture/) and [Data flow](/acra/acra-in-depth/data-flow/) sections.

### SQL client

In this mode Acra looks transparent to your application in most cases. The only components are needed to operate in this mode are server items described above.

### SDK / AcraWriter

Another way of encrypting data before storing it in database is encrypting it in the application itself
and then putting encrypted variant in SQL query before executing it.
In this case you don't rely on transparent encryption by AcraServer and you can store such encrypted data directly in the database.

This is what [AcraWriter](/acra/acra-in-depth/architecture/sdks/acrawriter/) does. Right now the following languages are supported:
* [Golang](https://github.com/cossacklabs/acra/tree/master/examples/golang)
* [Python](https://github.com/cossacklabs/acra/tree/master/examples/python)
* [Ruby](https://github.com/cossacklabs/acra/tree/master/examples/ruby)
* [C++](https://github.com/cossacklabs/acra/tree/master/examples/cpp)
* [iOS (Swift / Objective-C)](https://github.com/cossacklabs/acra/tree/master/examples/objc)
* [Android (Java / Kotlin)](https://github.com/cossacklabs/acra/tree/master/examples/android_java)
* [PHP](https://github.com/cossacklabs/acra/tree/master/examples/php)
* [NodeJS](https://github.com/cossacklabs/acra/tree/master/examples/nodejs)
