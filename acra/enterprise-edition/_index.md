---
title: Enterprise edition
weight: 12
---

# Acra Enterprise Edition

{{< hint info >}}
We are merging Acra Community Edition and Acra Enterprise Edition documentation here, so some sections are updating in realtime :)
{{< /hint>}}

[Acra Community Edition](https://github.com/cossacklabs/acra) has been built to satisfy the needs of security community, startups and technology/security enthusiasts. Acra Community Edition exposes source code of all the security controls and cryptosystems for public review, testing and usage. 

However, for an enterprise environment there are various security and operational requirements that Acra Community Edition does not satisfy, but Acra Enterprise Edition satisfies. 

**Would you like to evaluate Acra Enterprise Edition? Drop us a line at [sales@cossacklabs.com](mailto:sales@cossacklabs.com).**

## Why Acra Enterprise Edition?

Acra Enterprise Edition ia tailored for enterprise businesses with multiple apps or databases. It's faster, easier to maintain and automate, and is boosted by our years of experience doing data security.

Acra Enteprise Edition is compatible with Acra Community Edition (you can start with Acra Community Edition and migrate to Acra Enteprise Edition later).

Review comparison of Acra Community Edition and Acra Enterprise Edition features on [Cossack Labs site](https://www.cossacklabs.com/acra).

### Key management

  * Additional key management options - different ways to trigger key rotation / revocation / generation that are more characteristic of large-scale commercial use-cases. 
  * Custom key schedules - being able to override some of key management automation attributes. 
  * Customizeable key stores - Acra can store intermediary keys in a number of formats. Acra Enterprise Edition provides even more flexibility when doing so. 
  * Hardened key lifecycle - we are researching different ways to improve Acra's resilience in hostile environment, including schemes which do not require master key to ever leave HSM/KMS, etc. 

See [Key management guides](/acra/security-controls/key-management/).


### Policy / configuration management

  * Every Acra configuration, in essence, is a security policy that combines a number of powerful Acra's controls on one enforcement point (like AcraServer or AcraTranslator).
  * Acra Enterprise Edition features advanced configuration engine that allows you to create more expressive security policies, apply better-differentiated configurations to different connections / users on the same Acra node. 

See [Policy management guides](/acra/configuring-maintaining/policies-enterprise/).


### Security automation

  * Acra Community Edition out of the box allows you to automate security reactions, use security events to trigger certain behaviours inside Acra or outside. 
  * Acra Enterprise Edition extends that capability with more signals, more internal reaction types and easier integration with SIEM/SOAR systems. 


See [Security automation guides](/acra/security-controls/security-logging-and-events/programmatic-reactions/).


### Even more convenient infrastructure

  * Acra Enterprise Edition separates control plane (configuration management) from data plane (point of enforcing security policy).
  * Acra Enterprise Edition allows to spawn enforcement nodes (SQL Proxies and APIs) easily and manage their load.
  * Acra Enterprise Edition allows to more flexibly distribute key storage / management components.


## Licensing and form-factors of Acra Enterprise Edition

Acra Enterprise Edition is licensed with proprietary licenses. Each license includes our engineering assistance: integration, configuration, policies, deployment, support. We provide several support tiers, so you can select what's better for your SLAs.

See a full list of features on [Cossack Labs's site](https://www.cossacklabs.com/acra).

We provide a great flexibility around Acra Enterprise Edition. Select what is best for your product.

* **Acra license & support** – we give you Acra, your team has full control around Acra. We provide support when required.
* **Acra managed solution** – we give you Acra and we manage Acra for you in your infrastructure. We act like your Ops team.
* **Acra custom solution** – we customize Acra for your use case and your infrastructure. Support another database, change tokenization format, produce more logs, build custom modules for your SCADA system – we are in.


## How to evaluate and get started

### 1. Start with Acra Community Edition and examples.

Check [Acra Community Edition](https://github.com/cossacklabs/acra) on GitHub. Play with [Acra engineering examples](https://github.com/cossacklabs/acra-engineering-demo) – a collection of ready-to-try projects with Acra, database, web application and monitoring tools. Learn how easy it is to integrate Acra data protection into existing application.

### 2. Free playgrounds tailored for your use case.

Sign NDA and get access to a free playground that runs Acra Enterprise Edition, a database of your choice and a client application. 

We allocate some engineering time to tailor free playground for your use case: use suitable data model and showcase relevant scenarios (encryption-decryption, searchable encryption, SQL firewall, monitoring, audit logging, and others).

After evaluating the playground, your team knows more about Acra functionality and security benefits it brings into your project.

Interested in free playground? [Write us](mailto:sales@cossacklabs.com) your use case, language and database, and we'll deploy it for you.


### 3. Paid pilot / PoC, highly customized for your use case.

Sign NDA, Acra Evaluation license and consulting agreement.

We allocate engineering time to build your exact architecture and use cases, advise you on optimal configurations, tune data model and queries.

After evaluating PoC, your team is confident that you can attain your security objectives with Acra prior to buy-in. 

Would you like to evaluate Acra Enterprise Edition? Drop us a line at [sales@cossacklabs.com](mailto:sales@cossacklabs.com).

