---
title: Security design
bookCollapseSection: true
---

## Security design

Acra is built to provide selective encryption only to the records that require such protection.
AcraWriter provides the app developer with the means to encrypt these records via wrapping anything in a function that outputs [AcraStruct]({{< ref "acra/acra-in-depth/data-structures/#understanding-acrastruct" >}}), a crypto container decryptable by AcraServer, which is then stored in a database.

Any secret contained within an app (e.g. passwords in config files) can be leaked. There are many reasons why a developer might not want to use the user password as a secret - not all systems have to be end-to-end encrypted, even though we'd like it to be that way. An example of a good trust model is to use asymmetric cryptography to "send" this data (for the encryption of which we only have a public key) to some remote party. A leakage of this public key will still be insufficient for decrypting anything from the database.

### Threat model

We expect that anything, apart from AcraServer (which must remain uncompromised), can be compromised and that any piece of data can leak outside the system.

Our goal is to provide the three following guarantees:

**Guarantee 1**: If the attacker compromises the system through collecting all the data from any (or all) components other than AcraServer, and AcraServer remains uncompromised, this data will not be sufficient to decrypt protected entries.

More specifically, AcraServer's key storage is the 'crown jewel' of the whole security scheme and should be protected with the typical server security measures.

**Guarantee 2**: If the attacker alters the app's behaviour in such a way that makes the app legitimately request all the protected data from the database, AcraServer becomes suspicious of the app's abnormalities, detects possible 'configuration picking' attempts, and reacts accordingly, using the pre-set alarms / panic blocks.

There is an additional third guarantee, which is valid while using Zone keys:

**Guarantee 3**: If the attacker compromises the system in such a way that they modify the app's behaviour to extract all the protected records, and these records are protected using Zone keys, the attacker will need to reverse-engineer both the storage model and the Zone identification to be able to request all of them correctly. This guarantee should be achieved cryptographically, not programmatically.

### Guarantee 1: Cryptographic model

To provide Guarantee 1, we've composed a special cryptosystem based on well-known high-level primitives and simple design.

Before generating each AcraStruct, AcraWriter generates a keypair of throwaway keys that are used in the encryption process and then get zeroed (turned into zeros) in the memory once the process is over.

Read more details about [AcraStruct]({{< ref "acra/acra-in-depth/data-structures/#understanding-acrastruct" >}}), including implementation examples.

AcraStruct contains three meaningful bits of data:
- [Secure Cell]({{< ref "themis/crypto-theory/cryptosystems/secure-cell.md" >}})-encrypted input with a random key RK.
- [Secure Message]({{< ref "themis/crypto-theory/cryptosystems/secure-message.md" >}})-encrypted RK, with AcraServer's Public Key (or Zone key - see Zones in [Client Side]({{< ref "acra/guides/integrating-acra-server-into-infrastructure#with-zones-INVALID" >}})) and one-time random Throwaway Private Key.
- Throwaway Public Key.

AcraServer, upon receiving and detecting valid AcraStruct, is able to:
- Extract Throwaway Public Key (TPK);
- Decrypt asymmetric envelope with TPK and Acra's Private Key (or [Zone key]({{< ref "acra/guides/integrating-acra-server-into-infrastructure#with-zones-INVALID" >}}));
- Extract Random Key RK for Secure Cell container out of a decrypted envelope;
- Decrypt Secure Cell, extract payload;
- Reconstruct database answer in such a way that AcraStruct is replaced by decrypted data.

This, essentially, makes AcraServer the only place to have sufficient secrets to decrypt AcraStruct.

### Guarantee 2: Detection and mitigation

Due to the deep integration of Acra into the application's data flow, Acra can detect suspicious activity in a growing list of places:
- Connections to AcraConnector,
- AcraServer listener,
- Requests to AcraServer,
- Database responses via AcraServer,
- Data content coming from the AcraWriter-Database-AcraServer roundtrip.

Currently, we've implemented the first few sample triggers to outline the methodology:
- Attempts to extract whole tables with sensitive data by "poisoning" them with records that would never be selected unless SELECT * is used.
- Inaccurate connection attempts to AcraConnector from the processes that don't match the expected conditions (if the users running AcraConnector / App itself are on the same VM / physical machine). Such expected conditions can be process names, name substrings, etc.

We plan to include more triggers into the future releases.

Once the trigger is triggered, an automatic reaction can be executed. You can choose to either:
- notify a 3rd party monitoring / alarm system or
- stop data decryption.

### Guarantee 3: Add encryption context

By differentiating the sensitive data via [Zones]({{< ref "acra/acra-in-depth/cryptography-and-key-management/#zones-INVALID" >}}), Acra users can build an additional layer of security:
- Zone keys are used for encrypting the AcraStruct's RK section. In this case, AcraServer will only be able to pick the right key and decrypt the data by knowing the correct zone. This limits the leak scope for every private key, even if AcraServer is partially compromised.
- Zone IDs are used as context when encrypting Secure Cell, providing additional protection.

Zone data is supplied to an app via JSON (e.g. `{"id": "...", "public_key": "..."}`) from [HTTP api]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#http-api-INVALID">}}) or [console utility]({{< ref "acra/security-controls/transport-security/acra-connector.md#acraconnector-and-acrawriter-INVALID" >}}).


## Security model for Acra

### Possible threats

{{< hint info >}}
Note: We recommend taking a look at the [architectural scheme of Acra]({{< ref "acra/acra-in-depth/data-flow/#-INVALID" >}}) before continuing to read.
{{< /hint >}}

Acra at its core is a set of tools that allow safeguarding the security of a database (running PostgreSQL or MySQL) against the known widespread threats.

The most dangerous current known security threats are:
- Threats related to excess / abuse of access privileges.
- Data leaks caused by mistakes in deploy, configuration settings, backup thefts, etc.
- SQL injections.
- Denial of service.
- Vulnerabilities in the database protocol.
- Weak audit or an absence thereof.
- Operational system vulnerabilities.
- Unsafe handling of cryptographic keys.

### Security assumptions
Acra can perform its protective functions properly and protect from the security threats 1, 2, 3 if the following security assumptions are met:
- The PKI infrastructure is trusted;
- AcraServer is trusted;
- The client is less trusted than the server.

### Possible consequences of security incident
Let’s consider possible consequences of any of separate component being broken (broken as in “fully compromised” when the adversary fully overtakes the work of the component and gains full access to its memory).

When a *Database* is broken into, the worst-case scenario is DoS or COA (ciphertext-only attack). Thus, the stability of the system, in this case, is reduced to the stability of the symmetric encryption algorithm (AES-GCM-256).
When the *Client* gets broken, the worst-case scenario is that the adversary can get the data belonging to this client, which is stored in the database.
And finally, if AcraServer gets broken, the adversary can fully compromise the system.

It is worth mentioning that in absence of PKI, the communication channel between the Client and AcraServer is also vulnerable. In this case, the resistance ability of the system comes down to the security of the TLS or Themis’ Secure Session protocols. In all the other communication channels the data is encrypted so, in the worst case (when TLS is not used) the security of the system comes down to the security of the symmetric encryption algorithm (AES-GCM-256).

### Additional reading

We recommend that you also check out the following articles to gain a better understanding of the security notions in this article:

* https://www.zdnet.com/article/the-top-ten-most-common-database-security-vulnerabilities/   
* https://en.wikipedia.org/wiki/Vulnerability_database
* https://www.bcs.org/content/ConWebDoc/8852 .


## PKI overview for Acra

We strongly recommend following the best security practices and using the public key infrastructure (PKI) to provide authentication between the components of Acra. This document contains some useful information about the PKI and links to related resources.

### The Public Key Infrastructure

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

The main point that should be kept in mind is that if you use a free-for-all communication infrastructure (e.g. the Internet), some primary security layer (PSL) that involves a PKI has to be deployed (e.g. VPN). This PSL will provide a strong authentication between components (e.g. the database, [AcraServer]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#-INVALID" >}}) in Acra’s context) inside the organisational infrastructure.

The next step after deploying the PSL is the deployment of Acra. Note that even if there is an existing PSL present, a secure deployment of Acra requires the delivery of secret keys to the target components (in [Docker containers]({{< ref "acra/guides/trying-acra-with-docker/" >}})). The best practices for solving this task are provided below:

- **Environment variables** — classic and reasonably secure way that is simple, flexible, and can be implemented with system tools. The main known risks of this method are: the possibility to bleed into logs if the deployment was untidy and the possible granting of access to the non-target apps in case of insufficiently fine-tunes access rights differentiation.

- **Files** — many technologies of secrets’ deployment  use the transfer of secrets in the file format to the app - both for infrastructure management systems and container orchestration systems. This method is usually implemented through a regular creation of files containing secrets (at the moment deployment or by daemons of the key distribution systems), or through mounting from the host system inside a container or virtual file system mounting (Swarm, Kubernetes). The pros and cons and the same as in the variant with the environment variables, with some specifics depending on the exact implementation.

- **URI / REST API** — another rather common way based on cloud services like AWS, Azure, DO, etc. The main disadvantage of this approach is its price. Cloud KMS also often use REST API to delivery secrets.

- **KMS** — usually implemented using the supplied libraries of KMS providers. They are offered by AWS, Azure, etc., to enable the work with their KMS clouds. The standard de-facto approach here is HashiCorp Vault integrated with numerous applications.

Acra supports several ways of delivering keys – direct connection to HashiCorp Vault; delivery via environment variables.

### Additional recommended reading

We recommend checking out the following pages and resources to find out more about the PKIs.

* https://pki-tutorial.readthedocs.io/en/latest/
* https://openvpn.net/
* https://www.ejbca.org/
* https://sourceforge.net/projects/xca/
* https://github.com/OpenVPN/easy-rsa
* https://en.wikipedia.org/wiki/Public_key_infrastructure
* https://en.wikipedia.org/wiki/Virtual_private_network .