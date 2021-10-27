---
title: Security design
weight: 1
bookCollapseSection: true
---

# Security design

Acra is a database protection suite with special features:

* multi-layer access compartmentation to secrets for better security and early-stage intrusion detection;
* numerous data protection measures – [application-level encryption](/acra/security-controls/encryption/), [masking](/acra/security-controls/masking/), [tokenization](/acra/security-controls/tokenization/) – to ensure that data stays encrypted as long as possible;
* special modular architecture for better developer usability and security;
* single point of trust for minimizing the attack surface, inspection of traffic that touches attack surface, and consistent risk management.

Security controls provided by Acra are improving security without significantly affecting system's architecture, performance and usability. Refer to the full list of [security features](/acra/acra-in-depth/security-features/).


## Security design principles

Major security design principles that you can achieve while using Acra: 

* **Defense in depth:** Acra delivers different layers of protection for different parts and stages of the data lifecycle. Acra provides an independent set of security controls aimed at mitigating multiple risks in case of an attacker crossing the outer perimeter.
* **Trust compartmentalisation** and strong isolation: each data record is encrypted by unique data encryption key, each data encryption key is encrypted by customer/application key. 
* **Zero trust:** by default, nobody under no assumptions have access to the sensitive data if it's encrypted with Acra. 
* **Secure by default:** Acra's default configurations are `more security, less trust`. 
* **Security controls:** layered blend of protective, detective and responsive controls. 

## Security design goals

One of **the key design goals** for Acra was to ensure that engineering behind the security guarantees is compatible with modern software development and reliability engineering practices. 

**Security design goals** are rather simple (the guarantees are further explained and explored in [Threat modelling and security guarantees](/acra/acra-in-depth/security-design/threat-models-and-guarantees/)):

* No amount of data and/or secrets leaked from the database could be sufficient for decryption of the data stolen from the database. This is achieved through cryptography rather than through general system design.

* Sometimes even a well-behaved and trusted client application (which is supposed to receive decrypted responses from AcraServer/AcraTranslator) might become compromised. 

However, any alteration of the app's data consumption in an unauthorised manner should be noticed, reported and prevented:

* Acra provides security events and alarm triggers to detect potentially suspicious behaviour and requests from the application. Those triggers are configurable and allow creating unique sets of detection rules specific to the workflow and the app. See [Security events](/acra/security-controls/security-logging-and-events/security-events/).

* Acra provides panic scripts, which either shut down the decryption, shut down the database connection, or provide other threat isolation methods. [See Programmatic reactions](/acra/security-controls/security-logging-and-events/programmatic-reactions/).


## Acra narrows down attack surface

Acra combines multiple security controls under one roof. This changes your risk model drastically - you can now deal with many risks with less security controls, and you need to monitor a smaller attack surface. 

Acra changes attack surface to your data significantly, by narrowing it to (1) Acra and its supporting infrastructure, (2) application logic that queries data.

Acra moves the security boundary closer to the data. Insiders, privileged attackers, DBAs, infrastructure administrators have less opportunity for unauthorized access and there are no implicit "trusted paths" to access the data without authorization/authentication/security control application.


## Application-level encryption behefits

The main Acra's security control is [application-level encryption](https://www.infoq.com/articles/ale-software-architects/). Application-level encryption (ALE) means encrypting data within the application, and not depending on the underlying transport and/or at-rest encryption.

Acra is not the only tool that provide ALE. [MongoDB client-side encryption](https://docs.mongodb.com/manual/core/security-client-side-encryption/) is another great example of encrypting data before storing in the database. Acra allows applying ALE in the different parts of your system – on the client-side or on the Acra side.


Acra's application-level encryption is more than data at rest encryption and TLS combined.

![](/files/acra/acra-ale-protections.png)

Learn more about [Acra's features on Cossack Labs site](https://www.cossacklabs.com/acra).