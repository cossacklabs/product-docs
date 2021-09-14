---
title: Regulations
bookCollapseSection: true
---

# Acra and GDPR compliance

## How Acra can help you comply with GDPR

Acra is a database security suite that enables processing sensitive data with great care and security — namely, encrypting the data in a certain way.
Acra performs encryption through [Themis]({{< ref "/themis/" >}})
with [Secure Cell]({{< ref "themis/crypto-theory/cryptosystems/secure-cell.md" >}})
in Seal mode using AES-256-GCM,
a “state of the art” algorithm of symmetric data encryption as understood by [GDPR](https://gdpr-info.eu/).
Also, Acra follows “secure by default” configuration philosophy and carries out extensive logging of all its actions “out of the box”.
Using Acra fulfills some of the demands of the articles 25 and 32 of GDPR
([Data protection by design and by default](https://gdpr-info.eu/art-25-gdpr/) and [Security of processing](https://gdpr-info.eu/art-32-gdpr/))
as well as assists with compliance with articles 33 and 34
([Notification of a personal data breach to the supervisory authority](http://gdpr-info.eu/art-33-gdpr/) and [Communication of a personal data breach to the data subject](http://gdpr-info.eu/art-34-gdpr/)).

## Security of processing
[Article 32 of GDPR](https://gdpr-info.eu/art-32-gdpr/)

Acra provides “state of the art security of processing” required by the article 32 of GDPR through providing data encryption and integrity checking of the encrypted data.

> Taking into account the state of the art, the costs of implementation and the nature, scope, context and purposes of processing as well as the risk of varying likelihood and severity for the rights and freedoms of natural persons, the controller and the processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk [...]

Also, the components of Acra allow encrypting data on the client side which enables secure transfer of the data in encrypted form through an untrusted channel.

## Data protection by design and by default

[Article 25 of GDPR](https://gdpr-info.eu/art-25-gdpr/)

Default configuration of Acra uses the most secure settings to provide “secure by default” state of the system.
This is enabled through the encrypted data transfer between the application, components of Acra, and the database
([TLS/SSL](https://en.wikipedia.org/wiki/Transport_Layer_Security) and [Secure Session]({{< ref "themis/crypto-theory/cryptosystems/secure-session.md" >}}) are supported).

> The controller shall implement appropriate technical and organisational measures for ensuring that, by default, only personal data which are necessary for each specific purpose of the processing are processed [...] In particular, such measures shall ensure that by default personal data are not made accessible without the individual’s intervention to an indefinite number of natural persons.

## Logging, Intrusion Detection, and Notification

[Articles 33](https://gdpr-info.eu/art-33-gdpr/) [and 34 of GDPR](https://gdpr-info.eu/art-34-gdpr/)

Acra encrypts sensitive data, making it easier to communicate with the users in case of a data breach:

> The communication to the data subject referred to in paragraph 1 shall not be required if any of the following conditions are met:
>
> * the controller has implemented appropriate technical and organisational protection measures, and those measures were applied to the personal data affected by the personal data breach, in particular, those that render the personal data unintelligible to any person who is not authorised to access it, such as encryption;

All components of Acra continuously log requests, queries, and events that take place.
Acra also supports [secure logging]({{< ref "/acra/security-controls/security-logging-and-events/" >}})
which prevents tampering with, removing, adding, or changing the order of log entries.
This provides audit record of everything that happens in Acra, which comes particularly useful in case of a security incident.
Having a tamper-proof complete audit log makes it easier to notify the supervisory authority and users about the exact details of a data breach
(pursuant to [articles 33](http://gdpr-info.eu/art-33-gdpr/) [and 34](http://gdpr-info.eu/art-34-gdpr/) of GDPR).
All SQL queries to the database are logged by [AcraCensor]({{< ref "/acra/security-controls/sql-firewall/" >}}) (Acra’s firewall) with configurable verbosity.

Additionally, Acra has a special intrusion detection feature called [poison records]({{< ref "/acra/security-controls/intrusion-detection/#poison-records-INVALID" >}})
which can help detecting a massive data leak and prevent further data disclosure.
Poison records never show up in legitimate queries.
If a poison record is detected in a query then it's likely a result of an unauthorized data access.
In this case, Acra can be configured to shutdown completely, disable data encryption and decryption, or perform any other action specified by the administrator.

## Acra and other data privacy regulations

Similarly to how Acra helps reach better compliance with GDPR, Acra can also help reach better compliance with other current data privacy regulations, such as

* [General Data Protection Regulation (GDPR)](https://gdpr-info.eu/)
* [HIPAA (Health Insurance Portability and Accountability Act)](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act)
* [DPA (Data Protection Act)](https://www.legislation.gov.uk/ukpga/2018/12/contents/enacted)
* [CCPA (California Consumer Privacy Act)](https://en.wikipedia.org/wiki/California_Consumer_Privacy_Act)

Check out the data encryption cheatsheet that covers several current data privacy regulations in [Cossack Labs blog](https://www.cossacklabs.com/blog/what-we-need-to-encrypt-cheatsheet.html).
