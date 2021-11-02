---
title: Requirements
weight: 2
---

# Requirements

## Server side

### Packages

We provide [packages of Acra components via our repository](https://pkgs.cossacklabs.com/stable/) for commonly used Linux distros. Check the complete list of supported platforms on the [package installing page](/acra/getting-started/installing/installing-acra-from-repository/).

### Docker

Currently, all [the images we provide](/acra/getting-started/installing/launching-acra-from-docker-images/) are built to run on a Linux-based machines. Of course, there are ways to run them under intermediate Linux virtual machines over macOS or Windows, but we strongly discourage this approach in production.

### Build from sources

The requirements are not so strict:
* Golang compiler (we support the latest 3 minor versions) should be able to build binaries for your OS/CPU (though Windows is not supported)
* [Themis](https://github.com/cossacklabs/themis/#availability) crypto libraries should be installed on target system

## Client side

### Architecture

In case you want to use [AcraServer, our transparent SQL proxy](/acra/acra-in-depth/architecture/acraserver/):

- Your application talks to PostgreSQL or MySQL database via your preferred ORM. During the setup of Acra, you will redirect your application to talk to Acra instead.
- Use of TLS to access Acra and the database (our strong recommendation). You might need to configure a TLS certificate for Acra. Otherwise, you'll set up an encrypted transport layer using AcraConnector and [Secure Session](/themis/crypto-theory/cryptosystems/secure-session/).
- If you're installing Acra on your server manually from the [GitHub repository](https://github.com/cossacklabs/acra), you need to have Themis' dependencies and `libssl-dev` package installed. Also, make sure that `libcrypto.so` is available in `$PATH`.

If you want to use [AcraTranslator, encryption-as-a-service](/acra/acra-in-depth/architecture/acratranslator/):

- Your application is written in any language that can talk to AcraTranslator via gRPC or HTTP protocol
- Your application uses AcraConnector to connect to AcraTranslator.
  Or it connects directly, TLS is mandatory in this case.

If you need [AcraWriter/AcraReader, in-app SDK for encryption/decryption](/acra/acra-in-depth/architecture/sdks/) (usually used in combination with AcraServer or AcraTranslator):

- Your application is written in any language supported by the SDK.
  This currently includes: Ruby, Python, Go, C++, Node.js, PHP, Swift/Objective-C (iOS), or Java (Android).
- [AcraWriter](/acra/acra-in-depth/architecture/sdks/acrawriter/) library is installed for your application
  that will encrypt the data inside your app ("client side encryption").
  AcraWriter uses [Themis](/themis/installation/) and OpenSSL/BoringSSL as dependencies.
  If you prefer "transparent encryption proxy" mode (AcraServer), no additional libraries will be necessary for your app.

{{< hint info >}}
Note: Read the documentation before starting out with Acra!
There are some fundamental concepts that we highly advise you to understand before you proceed.
Pay special attention to the [Architecture](/acra/acra-in-depth/architecture/)
and [Data flow](/acra/acra-in-depth/data-flow/).
{{< /hint >}}

Also, remember that:

- AcraServer and Acra's dependencies need to stay on a separate server / virtual machine.
- AcraConnector can run in a container or under separate user on the same machine as the main application.

### Languages

Check [the list of languages for which SDK are available](/acra/getting-started/availability/#sdk--acrawriter).
