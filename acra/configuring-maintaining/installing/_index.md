---
title: Installing
bookCollapseSection: true
weight: 1
---

## Requirements

In case you want to use [AcraServer, our transparent SQL proxy]({{< ref "acra/acra-in-depth/architecture/acraserver.md" >}}):

- Your application talks to PostgreSQL or MySQL database via your preferred ORM. During the setup of Acra, you will redirect your application to talk to Acra instead.
- Use of TLS to access Acra and the database (our strong recommendation). You might need to configure a TLS certificate for Acra. Otherwise, you'll set up an encrypted transport layer using AcraConnector and [Secure Session]({{< ref "themis/crypto-theory/cryptosystems/secure-session.md" >}}).
- If you're installing Acra on your server manually from the [GitHub repository](https://github.com/cossacklabs/acra), you need to have Themis' dependencies and `libssl-dev` package installed. Also, make sure that `libcrypto.so` is available in `$PATH`.

If you want to use [AcraTranslator, encryption-as-a-service]({{< ref "acra/acra-in-depth/architecture/acratranslator.md" >}}):

- Your application is written in any language that can talk to AcraTranslator via gRPC or HTTP protocol
- Your application uses AcraConnector to connect to AcraTranslator.
  Or it connects directly, TLS is mandatory in this case.

If you need [AcraWriter/AcraReader, in-app SDK for encryption/decryption](/acra/acra-in-depth/architecture/sdks/) (usually used in combination with AcraServer or AcraTranslator):

- Your application is written in any language supported by the SDK.
  This currently includes: Ruby, Python, Go, C++, Node.js, PHP, Swift/Objective-C (iOS), or Java (Android).
- [AcraWriter]({{< ref "acra/acra-in-depth/security-design/#acrawriter-INVALID" >}}) library is installed for your application
  that will encrypt the data inside your app ("client side encryption").
  AcraWriter uses [Themis]({{< ref "themis/installation/" >}}) and OpenSSL/BoringSSL as dependencies.
  If you prefer "transparent encryption proxy" mode (AcraServer), no additional libraries will be necessary for your app.

{{< hint info >}}
Note: Read the documentation before starting out with Acra!
There are some fundamental concepts that we highly advise you to understand before you proceed.
Pay special attention to the [Architecture]({{< ref "acra/acra-in-depth/architecture/_index.md" >}})
and [Data flow]({{< ref "acra/acra-in-depth/data-flow/_index.md" >}}).
{{< /hint >}}

Also, remember that:

- AcraServer and Acra's dependencies need to stay on a separate server / virtual machine.
- AcraConnector can run in a container or under separate user on the same machine as the main application.

## Installing

Installing Acra is fairly simple:

- For trying Acra really quickly, for hassle-free testing purposes,
  you can [try Acra with Docker]({{< ref "acra/guides/trying-acra-with-docker/" >}}).
  You can also visit [engineering demos](https://github.com/cossacklabs/acra-engineering-demo#readme)
  repo with scripts for automated deployment of example projects.
- For another quick start with Acra, you can get a minimalistic version of Acra Community Edition as a 1-Click App running in a [Droplet on DigitalOcean Marketplace](https://marketplace.digitalocean.com/apps/acra). If you're new to DigitalOcean, you can use [Cossack Labs referral code](https://marketplace.digitalocean.com/apps/acra?refcode=3477f5f54884) to register and get $100 for 60 days for free. [More details]({{< ref "acra/guides/advanced-integrations/digital-ocean-marketplace.md" >}}).
- For a real-world hands-on experience, [install Acra from the official Cossack Labs repository]({{< ref "acra/configuring-maintaining/installing/installing-from-repository.md" >}}) or
- Download and [build Acra from the GitHub repository]({{< ref "acra/configuring-maintaining/installing/installing-from-github.md" >}}).

## Guides

For the further guides on how to integrate Acra, see
* [Integrating AcraServer into infrastructure]({{< ref "acra/guides/integrating-acra-server-into-infrastructure/" >}})
* [Integrating AcraTranslator into infrastructure]({{< ref "acra/guides/integrating-acra-translator-into-new-infrastructure/" >}})
