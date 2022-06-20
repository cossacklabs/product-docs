---
title: Availability on platforms/languages
weight: 1
---

# Availability on platforms/languages

## Server side

It is where you can run Acra software that acts like a server (including AcraServer, AcraTranslator, AnyProxy).

In most cases Linux will be used as a host OS, and we have:

* [packages](/acra/getting-started/installing/installing-acra-from-repository/) available for commonly used distros
* [pre-built images](/acra/getting-started/installing/launching-acra-from-docker-images/) compatible with Docker and most cloud Kubernetes providers like GCP/GKE and AWS/EKS

Alternatively, you can manually [build Acra from sources](/acra/getting-started/installing/installing-acra-from-sources/) under desired platform.


{{< hint info >}}
The server-side Acra components should not run on Windows OS as host OS, consider using any kind of full virtualization, including Docker for Windows.
{{< /hint >}}


Even if your infrastructure is Windows-based, you can run the server-side Acra components on a Linux server and connect to them from client-side apps running on Windows machines.


### Cloud infrastructure

Acra is cloud-agnostic. You can deploy Acra from Docker images to any cloud, or VPS, or physical servers.

Acra is actively tested and supported on [Google Cloud Platform](https://cloud.google.com/) (GCP), [Amazon Web Services](https://aws.amazon.com/) (AWS) and [DigitalOcean](https://www.digitalocean.com/) cloud services. 

You can [write to us](mailto:sales@cossacklabs.com) for a consultancy of Acra deployment on cloud infrastructure or request [Acra Enterprise Edition](/acra/enterprise-edition/) with demonstration of deployment on any of these services.


## Databases

### SQL databases

AcraServer works as proxy for [PostgreSQL wire protocol](https://www.postgresql.org/docs/14/protocol.html) and 
[MySQL wire protocol](https://dev.mysql.com/doc/internals/en/client-server-protocol.html). Overall, Acra supports all databases that works over these protocols. We regularly run tests with MySQL, PostgreSQL and MariaDB on every new commit in our [public](https://github.com/cossacklabs/acra/blob/release/0.85.0/.circleci/config.yml) and private CI. 

**SQL databases that AcraServer is known to work with**: MySQL 5.7+, PostgreSQL 9.4+, MariaDB 10.3, Google Cloud SQL, Amazon RDS, TiDB, CockroachDB. 

Acra Community Edition doesn't support [Protocol X](https://dev.mysql.com/doc/internals/en/x-protocol.html) of MySQL. If this is something important for you, consider writing us [an email](mailto:sales@cossacklabs.com) and checking out [Acra Enterprise Edition](/acra/enterprise-edition/).


### NoSQL / KV data stores

AcraTranslator allows working with any database / data store, as it works as API service, and the client app is responsible for storing data in the storage.

**SQL / Cloud RDBMS include:** MySQL, PostgreSQL, MariaDB, Google Cloud SQL, Amazon RDS, TiDB, CockroachDB. 

**NoSQL / KV data stores include:** MongoDB, Redis, Cassandra, TimescaleDB. Any datastore or database with REST API, filesystems, Amazon S3, Google Cloud DataStore.



## Client side

Depending on the planned mode of use, there are three approaches to connecting your application to Acra:

* directly to Acra as a regular SQL client ([configure and deploy AcraServer](/acra/guides/integrating-acra-server-into-infrastructure/) and connect client-side app to it as if it's SQL database to transparently encrypt, decrypt, (de)tokenise, (de)mask data);
* directly to Acra via HTTP / gRPC API ([configure and deploy AcraTranslator](/acra/guides/integrating-acra-translator-into-new-infrastructure/) and call API requests from client-side app to encrypt, decrypt, (de)tokenize data);
* integrating [SDK](/acra/acra-in-depth/architecture/sdks/) into your application.

Each option has its own advantages, they are discussed in detail in the [Architecture](/acra/acra-in-depth/architecture/) and [Data flow](/acra/acra-in-depth/data-flow/) sections.

### SQL client

In this mode Acra looks "transparent" to your application in most cases. The only component needed is AcraServer. 

Continue with [Guide: Integrating AcraServer into infrastructure](/acra/guides/integrating-acra-server-into-infrastructure/).

### API client

In this mode your application knows that it should call AcraTranslator and send data fields to encrypt, decrypt, tokenise, detokenise. 

Continue with [Guide: Integrating AcraTranslator into infrastructure](/acra/guides/integrating-acra-translator-into-new-infrastructure/).


### SDKs

#### AcraWriter

Another way of encrypting data before storing it in a database is encrypting it in the application itself and then putting encrypted data in SQL query before executing it.

In this case you don't rely on encryption by AcraServer or AcraTranslator and you can store such encrypted data directly in the database. Client-side encryption is useful for building partially or end-to-end encrypted data flows.

This is what [AcraWriter](/acra/acra-in-depth/architecture/sdks/acrawriter/) does. Right now the following languages are supported:
* [Golang](https://github.com/cossacklabs/acra/tree/master/examples/golang)
* [Python](https://github.com/cossacklabs/acra/tree/master/examples/python)
* [Ruby](https://github.com/cossacklabs/acra/tree/master/examples/ruby)
* [C++](https://github.com/cossacklabs/acra/tree/master/examples/cpp)
* [iOS (Swift / Objective-C)](https://github.com/cossacklabs/acra/tree/master/examples/objc)
* [Android (Java / Kotlin)](https://github.com/cossacklabs/acra/tree/master/examples/android_java)
* [PHP](https://github.com/cossacklabs/acra/tree/master/examples/php)
* [NodeJS](https://github.com/cossacklabs/acra/tree/master/examples/nodejs)


#### AcraReader

[AcraReader](/acra/acra-in-depth/architecture/sdks/acrareader/) allows decrypting data inside the client-side application. Client-side decryption is useful for building partially or end-to-end encrypted data flows.


#### SDK for AcraTranslator

Calling API from the app code requires writing code that performs requests, handles responses, reacts on errors, queue and repeat requests in case the network is unavailable, etc. We did this for you in a special [SDK for AcraTranslator](/acra/acra-in-depth/architecture/sdks/acratranslator-sdk/).

