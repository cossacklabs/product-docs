---
title: Enterprise edition
weight: 12
---

# Acra Enterprise Edition

{{< hint info >}}
We are merging Acra Commuity Edition and Acra Enterprise Edition documentation here, so some sections are updating in realtime :)
{{< /hint>}}

[Acra Community Edition](https://github.com/cossacklabs/acra) has been built to satisfy the needs of security community, startups and technology/security enthusiasts. Acra Community Edition exposes source code of all the security controls and cryptosystems for public review, testing and usage. 

However, for an enterprise environment there are various security and operational requirements that Acra Community Edition does not satisfy, but Acra Enterprise Edition satisfies.


**Would you like to evaluate Acra Enterprise Edition? Drop us a line at [sales@cossacklabs.com](mailto:sales@cossacklabs.com).**


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


See [Security automation guides](/acra/security-controls/programmatic-reactions/).


### Even more convenient infrastructure

  * Acra Enterprise Edition separates control plane (configuration management) from data plane (point of enforcing security policy).
  * Acra Enterprise Edition allows to spawn enforcement nodes (SQL Proxies and APIs) easily and manage their load.
  * Acra Enterprise Edition allows to more flexibly distribute key storage / management components.