---
title: PKI overview for Acra
weight: 3
---

## PKI overview for Acra

We strongly recommend following the best security practices and using the public key infrastructure (PKI) to provide authentication between the components of Acra. This document contains some useful information about the PKI and links to related resources.


### The public key infrastructure

The central component of any PKI is the Certificate Authority (CA). The CA acts as an arbitrator or a third party, whilst the trust relations are established between the two other sides. A very simplified scheme of one-side authentication of `User` by a `Relying Party` is described below.


![](/files/wiki/pki-overview-for-acra.png)

(_Image source: [LdapWiki](http://ldapwiki.com/wiki/Public%20Key%20Infrastructure)._)

Each entity of the PKI possesses their own pair of cryptographic keys:
- Private key that is always stored secretly, while
- Public key, along with the corresponding digital certificate, is available for other entities.

The digital certificate is signed by the CA and contains the information about an entity (organisation, department, alias/name, email, etc.) and the value of its public key. The digital certificate also indicates that the entity possesses a corresponding private key.

{{< hint info >}}
Note: The CA issues certificate for its own public key, which is why it is considered to be the main point of trust: both the User and the Relying Party trust the CA, while the User and the Relying Party do not trust each other.
{{< /hint >}}

The main point that should be kept in mind is that if you use a free-for-all communication infrastructure (the Internet), some primary security layer (PSL) that involves a PKI has to be deployed (e.g. VPN). This PSL will provide a strong authentication between components (e.g. client application, the database, AcraServer or AcraTranslator) inside the organisational infrastructure.

The next step after deploying the PSL is the deployment of Acra. Note that even if there is an existing PSL present, a secure deployment of Acra requires the delivery of secret keys to the target components (in [Docker containers](/acra/guides/trying-acra-with-docker/)). 

The best practices for solving this task are provided below:

- **Environment variables** — classic and reasonably secure way that is simple, flexible, and can be implemented with system tools. The main known risks of this method are: the possibility to bleed into logs if the deployment was untidy and the possible granting of access to the non-target apps in case of insufficiently fine-tunes access rights differentiation.

- **Files** — many technologies of secrets’ deployment  use the transfer of secrets in the file format to the app - both for infrastructure management systems and container orchestration systems. This method is usually implemented through a regular creation of files containing secrets (at the moment deployment or by daemons of the key distribution systems), or through mounting from the host system inside a container or virtual file system mounting (Swarm, Kubernetes). The pros and cons and the same as in the variant with the environment variables, with some specifics depending on the exact implementation.

- **URI / REST API** — another rather common way based on cloud services like AWS, Azure, DO, etc. The main disadvantage of this approach is its price. Cloud KMS also often use REST API to delivery secrets.

- **KMS** — usually implemented using the supplied libraries of KMS providers. They are offered by AWS, Azure, etc., to enable the work with their KMS clouds. The standard de-facto approach here is HashiCorp Vault integrated with numerous applications.


Acra supports several ways of delivering keys – direct connection to KMS (HashiCorp Vault), delivery via environment variables.