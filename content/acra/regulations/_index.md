---
title: Regulations
weight: 10
---

# Acra and security compliance

Acra provides under-the-hood cryptographic and security processes that are mandated by various data security and privacy compliance requirements. Although a 3rd party companies have not audited Acra Community Edition for compliance to any of these, open-source adopters report using it in regulated environments.


Check out the data encryption cheatsheet covering several current data privacy regulations in [Cossack Labs blog](https://www.cossacklabs.com/blog/what-we-need-to-encrypt-cheatsheet.html).


Also, refer to [Cossack Labs Data security and privacy compliance page](https://www.cossacklabs.com) to learn more.

## GDPR

Acra performs encryption through [Themis](/themis/) with [Secure Cell](/themis/crypto-theory/cryptosystems/secure-cell) in Seal mode using AES-256-GCM, a “state of the art” algorithm of symmetric data encryption as understood by [GDPR](https://gdpr-info.eu/).

Also, Acra follows “secure by default” configuration philosophy and carries out [extensive security and audit logging](/acra/security-controls/security-logging-and-events/) of all its actions “out of the box”.

Using Acra fulfils some demands of the articles [25. Data protection by design and by default](https://gdpr-info.eu/art-25-gdpr/) and [32. Security of processing](https://gdpr-info.eu/art-32-gdpr/). Also, Acra assists with compliance with articles [33. Notification of a personal data breach to the supervisory authority](http://gdpr-info.eu/art-33-gdpr/) and [34. Communication of a personal data breach to the data subject](http://gdpr-info.eu/art-34-gdpr/).

### Data protection by design and by default

[Article 25 of GDPR](https://gdpr-info.eu/art-25-gdpr/).

The default configuration of Acra uses the most secure settings to provide “secure by default” state of the system.
This is enabled through the encrypted data transfer between the application, components of Acra, and the database
([TLS/SSL](https://en.wikipedia.org/wiki/Transport_Layer_Security) and [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session) are supported).

> The controller shall implement appropriate technical and organisational measures for ensuring that, by default, only personal data which are necessary for each specific purpose of the processing are processed [...] In particular, such measures shall ensure that by default personal data are not made accessible without the individual’s intervention to an indefinite number of natural persons.


### Security of processing

[Article 32 of GDPR](https://gdpr-info.eu/art-32-gdpr/).

Acra provides “state-of-the-art security of processing” required by article 32 of GDPR through providing data encryption and integrity checking of the encrypted data.

> Taking into account the state of the art, the costs of implementation and the nature, scope, context and purposes of processing as well as the risk of varying likelihood and severity for the rights and freedoms of natural persons, the controller and the processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk [...]

Also, the components of Acra allow encrypting data on the client-side, which enables the secure transfer of the data in encrypted form through an untrusted communication channel.

### Logging, Intrusion Detection, and Notification

[Articles 33](https://gdpr-info.eu/art-33-gdpr/) and [34 of GDPR](https://gdpr-info.eu/art-34-gdpr/).

Acra encrypts sensitive data, making it easier to communicate with the users in case of a data breach:

> The communication to the data subject referred to in paragraph 1 shall not be required if any of the following conditions are met:
>
> * the controller has implemented appropriate technical and organisational protection measures, and those measures were applied to the personal data affected by the personal data breach, in particular, those that render the personal data unintelligible to any person who is not authorised to access it, such as encryption;

All components of Acra continuously log requests, queries, and events that take place.
Acra also supports [audit logging](/acra/security-controls/security-logging-and-events/audit-logging)
which prevents tampering with, removing, adding, or changing the order of log entries.

Acra provides an audit record of everything that happens in Acra, which is particularly useful in case of a security incident.
Having a tamper-proof complete audit log makes it easier to notify the supervisory authority and users about the exact details of a data breach
(pursuant to [articles 33](http://gdpr-info.eu/art-33-gdpr/) [and 34](http://gdpr-info.eu/art-34-gdpr/) of GDPR).

All SQL queries to the database are logged by [AcraCensor](/acra/security-controls/sql-firewall/) (Acra’s Request Firewall) with configurable verbosity.

Additionally, Acra has a special intrusion detection feature called [poison records](/acra/security-controls/intrusion-detection/)
which can help detect a massive data leak and prevent further data disclosure. Poison records never show up in legitimate queries.
If a poison record is detected in a query, it’s likely a result of unauthorized data access. In this case, Acra can be configured to shut down completely, disable data encryption and decryption, or perform [any other action specified by the administrator](/acra/security-controls/security-logging-and-events/programmatic-reactions/).


### Other GDPR-like regulations

Similarly to how Acra helps reach better compliance with GDPR, Acra can also help achieve better compliance with other current data privacy regulations, such as

* [DPA (Data Protection Act)](https://www.legislation.gov.uk/ukpga/2018/12/contents/enacted)
* [CCPA (California Consumer Privacy Act)](https://en.wikipedia.org/wiki/California_Consumer_Privacy_Act)


## FIPS & NIST

**Encryption primitives**: [Acra Enterprise Edition](/acra/enterprise-edition/) can be built with FIPS 140-2 compatible encryption module, so that encryption primitives are certified against many US and international regulations. 

**Key management**: Acra Community Edition can satisfy most of NIST SP 800-57 requirements (in its own way). [Acra Enterprise Edition](/acra/enterprise-edition/) can satisfy most of NIST SP 800-57 requirements quite literally.


## PCI DSS

Acra fulfils some PCI DSS requirements, and can be creatively used to reinforce others:


**Requirement 1. A firewall configuration must be installed and maintained**

Since access to plaintext is possible only through Acra, Acra can be used as a database firewall:
* On L3, limiting IP range.
* On L4, limiting by TLS certificate.
* On L7, parsing database queries and only allowing whitelisted ones to come in. 

**Requirement 3. Protect stored cardholder data**

Acra can encrypt the data, mask it during output, tokenize it, etc. 

**Requirement 4: Encrypt transmission of cardholder data across open, public networks**

Acra’s records are suitable for transit in public records between applications. 

**Requirement 7: Cardholder data access must be restricted to a business need-to-know basis** 

Acra acts as access control gateway, reinforcing access control on every transaction and allowing to craft sophisticated access policies. 

**Requirement 9: Physical access to cardholder data must be restricted** 

Acra allows you to put cardholder data in encrypted form into even public databases - and no access will help attackers get access to the data, if Acra remains uncompromised. 

**Requirement 10: Track and monitor all access to network resources and cardholder data** 

Logging: Acra can generate [a detailed audit trail](/acra/security-controls/security-logging-and-events/audit-logging/) regarding all database queries, making it tamper-proof. 

Monitoring: being aware of database/datastore query contents, Acra can provide monitoring and [security events](/acra/security-controls/security-logging-and-events/security-events/) stream that will allow granular identification of suspicious queries and users.


## HIPAA

Acra can satisfy some [HIPAA requirements](https://www.hipaajournal.com/hipaa-compliance-checklist/) and be a stepping stone for meeting others:

**Implement a means of access control**

Acra’s encryption is linked with ClientID – an application identifier – that is linked with encryption keys. Applications that provide the wrong TLS certificate or ClientID can’t get decrypted data. In addition, Acra gives more compartmentalization ways of diving access by [Zones](/acra/security-controls/zones/). 


**Introduce a mechanism to authenticate ePHI**

All connections that are going through Acra are [logged](/acra/security-controls/security-logging-and-events/) and Acra can generate [a detailed audit trail](/acra/security-controls/security-logging-and-events/audit-logging/). Acra can provide monitoring and [security events](/acra/security-controls/security-logging-and-events/security-events/) stream that will allow identification of actions and applications which altered or deleted ePHI.

**Implement tools for encryption and decryption**

Acra encrypts ePHI data, providing means to store ePHI encrypted and process it encrypted. Also, the components of Acra allow encrypting data on the client-side, which enables the secure transfer of the data in encrypted form through an untrusted channel.

Decryption happens in Acra only for authorized applications and connections, and Acra produces logs and security events, which allow identifying who/when/where has decrypted ePHI.


**Introduce activity logs and audit controls**

Logging: Acra can generate [a detailed audit trail](/acra/security-controls/security-logging-and-events/audit-logging/) regarding all database queries, making it tamper-proof. 

Monitoring: being aware of database/datastore query contents, Acra can provide monitoring and [security events](/acra/security-controls/security-logging-and-events/security-events/) stream that will allow granular identification of suspicious queries and users. 


**Restricting third-party access**

After Acra’s encryption, ePHI is stored in encrypted form; even in a case of an incident, ePHI is leaked encrypted.

Acra's [Intrusion detection](/acra/security-controls/intrusion-detection/) controls allow detecting and preventing unauthorized access and SQL injection attacks.


**Reporting security incidents**

Acra can generate [a detailed audit trail](/acra/security-controls/security-logging-and-events/audit-logging/) regarding all connections, actions and database queries, which might work as proof documents for incident response (IR) teams.
