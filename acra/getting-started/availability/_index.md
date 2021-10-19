---
title: Availability on platforms/languages
weight: 2
---

# Availability on platforms/languages

## Server side

Where you can run Acra software that acts like a server (including AcraServer, AcraConnector, AcraTranslator).

In most cases Linux will be used as a host OS, and we have [packages](https://github.com/cossacklabs/acra/#server-side) available for commonly used distros.

However, of you want to build Acra from sources, the requirements are not so strict:
1) Golang compiler should be able to build binaries for your OS/CPU
2) [Themis](https://github.com/cossacklabs/themis/#availability)
   crypto libraries should be installed on target system

## Client side

Requirements for applications wishing to interact with database through Acra.

### SQL client

Since AcraServer acts as a proxy between client applications (such as backend of website) and the database,
you will have to connect to AcraConnector/AcraServer after you have integrated Acra into your infrastructure
instead of direct connections to the database like before.
Otherwise, you may end up in a situation when some data you expect to be transparently encrypted is stored in database as plaintext.
Adding Acra between app and DB does not require you to use any kind of special SQL connector, just use what you were using before.

In cases when the application does not interact with tables that contain encrypted data,
you can avoid AcraServer and connect directly to the database as before.
But even if AcraServer does not perform any kind of encryption on proxied data,
you will still be able to benefit from features like SQL firewall.

### AcraWriter

Another way of encrypting data before storing it in database is encrypting it in the application itself
and then putting encrypted variant in SQL query before executing it.
In this case you don't rely on transparent encryption by AcraServer and you can store such encrypted data directly in the database.

This is what AcraWriter does.
You can [read more](https://github.com/cossacklabs/acra/#client-side) about its availability for different languages.
Right now the following languages are supported:
* [Golang](https://github.com/cossacklabs/acra/tree/master/examples/golang)
* [Python](https://github.com/cossacklabs/acra/tree/master/examples/python)
* [Ruby](https://github.com/cossacklabs/acra/tree/master/examples/ruby)
* [C++](https://github.com/cossacklabs/acra/tree/master/examples/cpp)
* [iOS (Swift / Objective-C)](https://github.com/cossacklabs/acra/tree/master/examples/objc)
* [Android (Java / Kotlin)](https://github.com/cossacklabs/acra/tree/master/examples/android_java)
* [PHP](https://github.com/cossacklabs/acra/tree/master/examples/php)
* [NodeJS](https://github.com/cossacklabs/acra/tree/master/examples/nodejs)
