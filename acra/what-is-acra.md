---
weight: 2
title: What is Acra
---


# What is Acra? An overview.

Acra is a application-level encryption and data security toolkit for modern distributed applications. Acra allows app developers to encrypt sensitive data, manage the keys, apply tokenization, data masking, request filtering, generate audit logs and security events, automate reactions on security boundary. 

In short, providing you with means to protect the data, detect incidents and respond to them. 

Acra is written in Go, aimed for modern cloud applications that store sensitive data in PostgreSQL/MySQL-compatible SQL databases, and any other datastores. Acra consists of several services (SQL Proxy, API service, API proxy, in-app SDK, key management utils) that apply security controls exactly where the data flows.


## Acra's typical use cases

Unlike many security software tools, Acra uses cryptography as main line of defense. When data is encrypted, it can't be suddenly and unnoticeably decrypted. 

* **Secure data vault:** put your sensitive data in a separate database, then protect it with Acra so that high-risk data has separate protection infrastructure built around it. Encrypt, anonymize, mask or tokenize sensitive data. Filter suspicious SQL queries, detect and prevent data leaks, produce tamper-proof audit log. 

* **Quick and transparent integration of encryption:** quickly integrate Acra into your existing applications that rely on MySQL/PostgreSQL-compatible databases with minimum amount of re-engineering effort - days instead of months. Acra will encrypt/decrypt data fields "on the fly", while your application and database don't know that the data is encrypted.

* **Developer-friendly data security module:** integrate security controls in your infrastructure without diving into security detail too deeply. Even in case of the incident, your data is encrypted.

* **Secure data lifecycle tool:** protect sensitive data's journey in your product, from database to all the microservices, backups, logs and all. Use single encryption model across data's lifecycle: encrypt in Acra as you write the data to the database, pull encrypted text, pass it between microservices and decrypt later by talking to API service / SDK, while using keys from the same datastore. Operate on encrypted data. Even build end-to-end encrypted dataflows.

* **Unified set of security controls towards data:** you don't need to maintain different software pieces implementing same security controls in different places, you don't need to write cryptographic code in your apps.

* **Gain visibility and transparency:** with tamper-proof audit logging in Acra you have proofs of who/when/how has accessed the data or tried to change the logs.

* **Detect and prevent incidents:** automate Acra's reactions to detect potential leakage and protect sensitive data and/or keys during security incidents. 

* **Achieve complaince** in data security and privacy while actually increasing practical security posture. (Best of two words: compliance and actual pragmatic security.)


Acra essentially moves security boundary as close to the data itself as possible without sacrificing security and usability, and provides a number of defense-in-depth mechanisms to protect the data. 


## Major security features

* Cryptographic security: data is encrypted during storage and transmission via application-level and transport-level encryption with strong mutual authentication. 
* Searchable encryption: address encrypted records (use them in WHERE queries) without revealing them to the database.
* Selective encryption: you pick what, where and how gets encrypted.
* Key management tooling: flexible management of rolling/rotation/revocation to suit your load needs and data architecture. 
* Data masking and tokenization: anonymise or pseudonymise the data preserving its original format. 
* SQL request firewall: prevent SQL injections, stop unauthorized and suspicious queries.
* Intrusion detection system: detect data leakage using poison records and SIEM integration.
* Logging, monitoring and security events: always have operational and security overview on what's happening with your data.
* Tamper-proof audit logging: Acra produces audit log that prevents unnoticable changes.
* Policies: expressive policy language that allows to configure Acra's behavior in large infrastructures.

Refer to [Acra-in-depth / Security features](/acra/acra-in-depth/security-features/) to learn more.


## Why Acra

Acra allows you to protect sensitive data inside your infrastructure / product efficiently, with a number of modern security contorls. 

There are many regulatory, business risk and security rigorousness reasons to use Acra, they are typical to usage of any data protection / leakage prevention / encryption software:

 * protecting sensitive data to prevent unauthorized parties from accessing it (including insiders and advanced persistent adversaries);
 * encrypting sensitive data due to compliance requirements;
 * building security boundary around sensitive data to protect and provide visibility into the way it is used; 
 * reinforcing database security measures with external security controls; 
 * building separate vaults of sensitive data with enhanced security.

Refer to [Regulations](/acra/regulations/) section to learn which requirements of which regulations Acra helps you to satisfy.

Let's see how Acra is actually different from many products and approaches. 


### Application level encryption, field level encryption

Acra allows you to efficiently pick fields of your data model and encrypt them. When done right, [application-level encryption](https://www.infoq.com/articles/ale-software-architects/) protects your sensitive data from more sensitive risks than other encryption modes.

Application-level encryption brings plenty of security benefits: 

* ALE enables mapping of keys to users/entities/tenants, BYOK, more advanced key layouts, etc. 
* ALE enables application developers and architects to distribute additional computing load and bottlenecks as they wish, thus making security less of a performance challenge, if it ever was.
* ALE means that data stays encrypted until it is explicitly decrypted, which is not the case with TLS and data-at-rest encryption provided by databases by default.

### Risk implications 

**TODO**: Insert our risk table 

Some relevant links: 
* MongoDB ALE
* Our risk table

Acra changes your risk model drastically - you can now deal with many risks with less security controls, and you need to monitor a smaller attack surface. 

There is no application compomise scenario that leads to immediate massive data leak - there are no keys, secrets on application side that can be stolen, combined with database dump to decrypt the data. The only case for data leakage via compromised app that talks to database via Acra is for application to record sensitive data legitimately requested under regular process. 

Acra changes attack surface to your data significantly, by narrowing it to: 

  * Acra and it's supporting infrastructure
  * Application logic that queries data

Security boundary is closer to data. Insiders, privileged attackers, DBAs, infrastructure administrators have less opportunity for unauthorized access and there are no implicit "trusted paths" to access the data without authorization/authentication/security control application.

### Choke point security

Since Acra sits on choke point to data access, it can enforce additional security restrictions on the data if you need it, and you can be sure that whoever wants to access plaintext will need to go through all these controls. 


## Key design principles

### Security

Major security design principles that you can achieve while using Acra: 

* **Defense in depth:** Acra delivers different layers of protection for different parts and stages of the data lifecycle. Acra provides an independent set of security controls aimed at mitigating multiple risks in case of an attacker crossing the outer perimeter.
* **Trust compartmentalisation** and strong isolation: each data record is encrypted by unique data encryption key, each data encryption key is encrypted by customer/application key. 
* **Zero trust:** by default, nobody under no assumptions have access to the sensitive data if it's encrypted with Acra. 
* **Secure by default:** Acra's default configurations are `more security, less trust`. 
* **Security controls:** layered blend of protective, detective and responsive controls. 

### User experience

* **Quick and straightforward integration of security instrumentation**: there are many behavioural and organisational challenges which prevent security work from happening. To enable better security, security instrumentation should be as developer/operations friendly as possible. 
* **Hard to misuse**: world has a multitude of amazing security technologies. Unfortunately, if these technologies can be misused in a way that will lead to lowering of their security impact (with a false sense of security attached), they will be. Acra actively resists misuse that has security impact, where possible.
* **Crypto under the hood**: you don't have to become cryptography expert to use Acra, nor you can. Crypto details are abstracted away. 
* **Transparent and code-less integration**: in some of Acra's scenarios, it is possible to avoid changing your application code completely. 
* **Full operational control**: Acra provides logs, events, metrics and 360 degree operational and security overview into Acra's inside processes if you ned that. 

Refer to [Acra-in-depth / Security design](/acra/acra-in-depth/security-design/) section to learn more about Acra's security design, principles, trust models and security guarantees.

## Architecture 

**TODO: Review & expand, align terminology**

Acra allows you to keep various components of security system outside of main application architecture, securely keeping apart components that should not leak / become compromised together: 

* Encryption/decryption happens in separate components (proxies and APIs)
* Keys are stored separately, unpacked / delivered to encryption layer atomically, with key layout minimizing risks of massive leakage. 
* Privileged key management happens outside of main components. 
* Configuration is managed separately, delivered to each Acra component separately. 
* Audit trail is exportable to independent audit log storage in real-time. 

Acra CE consists of: 
* Security enforcement component (SQL proxy, API service/proxy, SDK)
* Key storage (Redis, table in your database, any KV store)
* Master key storage driver (plug into KMS / Vault)
... and a number of supporting utilities.

There are 3 basic form-factors of security enforcement components Acra provides: 

* SQL Proxy
* API service (with direct API and application SDKs to talk to that API)
* Privileged SDKs (enabling some operations to happen within application context)

... which allow you to construct infinitely sophisticated data flows with Acra: 

### Typical deployment architectures

1. Proxy (SQL)

Classic scenario: Acra sits between your application (or database-facing microservice) and the actual database, encrypting and decrypting data, using different means to 

**TODO: Picture** 

**TODO: Explainer**


2. DAO + API

**TODO: Picture** 

**TODO: Explainer**

3. Complex - DAO API SDK Proxy complex

Acra was built to accompany sensitive data lifecycle in large, microservice-driven applications. So you can use APIs inside applications and proxies between some services and databases to build pretty sophisticated lifecycle: 

**TODO: Picture** 

**TODO: Explainer**

Keen to learn more about Acra internals and what enables this level of data flow magic? Head to (LINK to Acra in-depth)

### All components of typical Acra deployment

**TODO: Finish** List all components 


## Licensing and form-factors

### Acra Community Edition

Open source and free [Acra Community Edition](https://github.com/cossacklabs/acra). Apache 2 licensed. 

Acra Community Edition supports all major security features, but has a limited support for platforms, integrations, databases. Best for prototyping and small-scale projects with Ops team. You take open source Acra, configure and deploy it.

See list of features on [Cossack Labs's site](https://www.cossacklabs.com/acra).

### Acra Community Edition & services

Open source and free [Acra Community Edition](https://github.com/cossacklabs/acra), boosted by Cossack Labs integration services. 

Get our engineering assistance in configuring, optimizing, scaling Acra. Build custom solutions around Acra CE. Train your team in building secure and reliable systems. Best for small-scale projects without Ops team. You take open source Acra, we assist with configuration and deployment.

See list of services on [Cossack Labs's site](https://www.cossacklabs.com/acra).


### Acra Enterprise Edition

[Acra Enterprise Edition](/acra/enterprise-edition/) is licensed with proprietary licenses. It is compatible with Acra CE (you can start from CE and migrate to EE later).

Acra Enterprise Edition supports all security features and is tailored for large infrastructures. Acra EE provides key management utils and policies to configure and control Acra automatically. Best for enterprise businesses with multiple apps / databases. You take Enterprise Acra, we assist with configuration, policies, deployment, support.

See list of features on [Cossack Labs's site](https://www.cossacklabs.com/acra).

Refer to [Acra Enterprise Edition](/acra/enterprise-edition/) to learn more or [drop us a line](mailto:sales@cossacklabs.com) describing you use case.
