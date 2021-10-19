---
title: Enterprise edition
bookCollapseSection: true
weight: 12
---

Acra CE has been built to satisfy the needs of security community, startups and technology/security enthusiasts. AcraCE exposes source code of all the security controls and cryptosystems for public review, testing and usage. 

However, for an enterprise environment there are various security and operational requirements that Acra CE does not satisfy: 

* Key management: 
  * Additional key management options - different ways to trigger key rotation / revocation / generation that are more characteristic of large-scale commercial use-cases. 
  * Custom key schedules - being able to override some of key management automation attributes. 
  * Customizeable key stores - Acra can store intermediary keys in a number of formats. AcraEE provides even more flexibility when doing so. 
  * Hardened key lifecycle - we are researching different ways to improve Acra's resilience in hostile environment, including schemes which do not require master key to ever leave HSM/KMS, etc. 

* Policy / configuration management: 
  * Every Acra configuration, in essence, is a security policy that combines a number of powerful Acra's controls on one enforcement point (like AcraServer or AcraTranslator)
  * AcraEE features advanced configuration engine that allows you to create more expressive security policies, apply better-differentiated configurations to different connections / users on the same Acra node. 

* Security automation 
  * AcraCE out of the box allows you to automate security reactions, use security events to trigger certain behaviours inside Acra or outside. 
  * AcraEE extends that capability with more signals, more internal reaction types and easier integration with SIEM/SOAR systems. 

* More convenient infrastructure:
  * AcraEE separates control plane (configuration management) from data plane (point of enforcing security policy)
  * Spawn Enforcement nodes (SQL Proxies and APIs) easily, manage load.
  * AcraEE allows to more flexibly distribute key storage / management components


**TODO: Link items here to appropriate sections in the docs**