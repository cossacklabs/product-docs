---
weight: 1
title: What is Acra
bookCollapseSection: true
---


# What is Acra?

Acra is a data security toolkit for modern distributed applications. It is written in Go, aimed for modern cloud applications that store sensitive data in PostgreSQL/mySQL-compatible SQL databases, and any other datastores. 

It enables application-level/field-level encryption of data in your application and a number of additional data security techniques to protect sensitive data in modern applications in a convenient way. 

With Acra you can: 

* protect sensitive data from leakage and misuse via encryption, tokenization, data masking, request filtering and honeytokens. 
* gain deep visibility: generate audit trail for database queries and access events, generate security events for your SIEM system and monitoring events/metrics for your monitoring system.
* respond: automate some Acra's reactions to protect sensitive data and/or keys during security incidents. 

Aside from core security controls, Acra features a number of supporting mechanisms to make security implementation stronger and more convenient to use: 
* proper key management tooling, inlucluding advanced features like gradual key rolling; 
* searchable encryption to effiicently access some of the encrypted data
* [ENTERPRISE ONLY] expressive policy language that allows to configure Acra's behavior in very sophisticated ways

Acra essentially moves security boundary as close to the data itself as possible without sacrificing security and usability, and provides a number of defense-in-depth mechanisms to protect the data. 

## Why Acra

**TODO**: Continue

Acra allows you to protect sensitive data inside your infrastructure / product / distributed application efficiently, with a number of modern security contorls. There are many regulatory, business risk and security rigorousness reasons to use Acra, they are typical to usage of any data protection / leakage prevention / encryption software. 

Let's see how Acra is actually different from many products and approaches: 

### Application level encryption, field level encryption

Acra allows you to efficiently pick fields / parts of your data model (on application level) and encrypt them - either by listening to database wire protocol and substituting certain fields to their protected equivalents, or using other means. 

If done right, application-level encryption protects your sensitive data from more sensitive risks than other encryption modes. 

Application-level encryption brings plenty of application-specific benefits: 

* Acra enables mapping of keys to users/entities/tenants, BYOK, more advanced key layouts, etc. 
* Acra enables of 

#### Risk implications 

**TODO**: Our risk table 

Some relevant links: 
* MongoDB ALE
* Our risk table

* Acra changes your risk model drastically - you can now deal with many risks with less contorls, and you need to keep an eye on smaller variety of control implementations. 

* There is no application compomise scenario that leads to immediate massive data leak - there are no keys, secrets on application side that can be stolen, combined with database dump to decrypt the data. The only case for data leakage via compromised app that talks to database via Acra is for application to record sensitive data legitimately requested under regular process. 

* Acra changes attack surface to your data significantly - narrowing it to: 
	* Acra and it's supporting infrastructure
	* Application logic that queries data

* Security boundary is closer to data - so insiders, privileged attackers, DBAs, infrastructure administrators have less opportunity for unauthorized access and there are no implicit "trusted paths" to access the data without authorization/authentication/security contorl application.


### Choke point security

Since Acra sits on choke point to data access, it can enforce additional security restrictions on the data if you need it, and you can be sure that whoever wants to access plaintext will need to go through all these controls. 


## Acra's typical use cases


**TODO: FINISH**

**Secure data vault**: put your sensitive data in a separate database (PostgreSQL/mySQL-compatible), then protect it with Acra so that high-risk data has separate protection infrastrucutre built around it. 

**Quick integration of encryption**: quickly integrate Acra into existing applications that rely on MySQL/PostgreSQL-compatible databases as backends with minimum amount of re-engineering effort - days instead of months. 

**Developer-friendly data security module**: integrate a number of security controls in your application without diving into security detail too deeply. 

**Secure data lifecycle tool**: protect sensitive data's journey in your product, from database to all the microservices, backups, logs and all. Use single encryption model across data's lifecycle: encrypt in Acra as you write the data to database, pull encrypted text, pass it between microservices and decrypt later by talking to API service / SDK, while using keys from the same datastore. 

**Unified set of security controls towards data**: you don't need to maintain different software pieces implementing same security contorls in different places. 

## Major security features

**TODO: extend** 

* Cryptographic security: during storage and transmission. 
* Searchable encryption: address encrypted records without unnecessarily revealing them
* Selective encryption: you pick what, where and how gets encrypted.
* Key lifecycle tooling: flexible management of rolling/rotation/revocation to suit your load needs and data architecture. 
* SQL query firewall: prevent SQL injections, unauthorized queries, parse and log SQL queries
* Intrusion detection system: detect data leakage through several additional controls (honeytokens, DB traffic anomaly)
* Tokenisation (+optional encryption)
* Data masking
* Audit logging and security events
* Tamper-proof security for audit logging


## Key design principles

### Security

Major security design principles that you can achieve while using Acra: 

* Defense in depth: Acra delivers different layers of defense for different parts and stages of the data lifecycle. This is what defence in depth is – an independent set of security controls aimed at mitigating multiple risks in case of an attacker crossing the outer perimeter.
* Trust compartmentalisation and strong isolation
* Zero trust: by default, nobody under no assumptions have access to the sensitive data if it's encrypted with Acra. 
* Secure by default. 
* Layered blend of protective, detective, responsive and recovery controls. 


### User experience

* **Quick and straightforward integration of security instrumentation**: there are many behavioural and organisational challenges which prevent security work from happening. To enable better security, security instrumentation should be as developer/operations friendly as possible. 
* **Hard to misuse**: world has a multitude of amazing security technologies. Unfortunately, if these technologies can be misused in a way that will lead to lowering of their security impact (with a false sense of security attached), they will be. Acra actively resists misuse that has security impact, where possible.
* **Crypto under the hood**: you don't have to become cryptography expert to use Acra, nor you can. Crypto details are abstracted away. 
* **Transparent and code-less integration**: in some of Acra's scenarios, it is possible to avoid changing your application code completely. 
* **Full operational control**: Acra provides logs, events, metrics and 360 degree operational and security overview into Acra's inside processes if you ned that. 


## Architecture 


**TODO: Review & expand**

Acra allows you to keep various components of security system outside of main application architecture, securely keeping apart components that should not leak / become compromised together: 

* Encryption/decryption happens in separate components (proxies and APIs)
* Keys are stored separately, unpacked / delivered to encryption layer atomically, with key layout minimizing risks of massive leakage. 
* Privileged key management happens outside of main components. 
* Configuration is managed separately, delivered to each Acra component separately. 
* Audit trail is exportable to independent audit log storage in real-time. 

There are 3 basic form-factors of security enforcement components Acra provides: 

* SQL Proxy
* API Proxy (with direct API and application SDKs to talk to that API)
* Privileged SDKs (enabling some operations to happen within application context)

... which allow you to construct infinitely sophisticated data flows with Acra. 

**TODO**: Architecture pictures: 

1. Proxy (SQL & API)
2. DAO + API
3. Complex - DAO API SDK Proxy complex


**TODO:** Lead-in to Acra in-depth


### All components of typical Acra deployment

**TODO: Finish** List all components 

## Licensing and form-factors

### Open-source

Acra CE (Community Edition) is licensed as Apache 2. Here's a list of components that require mention and their licenses: 

**TODO**: fill out licensing terms briefly. 

### Proprietary license

Acra EE (Enterprise Edition) is licensed with proprietary licenses. It contains significant bits of CE, and CE deployments can be upgaded into larger versions. 

### Custom solutions, managed solutions, services

Ana will write something here, I bet. 