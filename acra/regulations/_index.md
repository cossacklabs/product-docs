---
title: Regulations
bookCollapseSection: true
---

# Acra and GDPR compliance

## How Acra can help you comply with GDPR

Acra is an encryption tool that allows processing sensitive data with great care and secureness — namely, encrypting the data in a certain way. Acra performs encryption through [Themis]({{< ref "/themis/" >}}) in [Secure Cell]({{< ref "themis/crypto-theory/cryptosystems/secure-cell.md" >}})/Seal mode (AES256 + GCM). This corresponds to the &quot;state of the art&quot; (as mentioned in the [full text of the GDPR](https://gdpr-info.eu/) regulation) algorithms of symmetric encryption. Also, Acra is securely pre-configured by default and carries out extensive logging of all its actions &quot;out of the box&quot;. Using Acra helps reaching compliance with some of the demands of the articles 32 ([Security of processing](https://gdpr-info.eu/art-32-gdpr/)) and 25 ([Data protection by design and by default](https://gdpr-info.eu/art-25-gdpr/)) of GDPR, as well as helps comply with the articles 33 and 34  ([Notification of a personal data breach to the supervisory authority](http://gdpr-info.eu/art-33-gdpr/) and [Communication of a personal data breach to the data subject](http://gdpr-info.eu/art-34-gdpr/)) of GDPR.

## Security of processing
[Article 32 of GDPR](https://gdpr-info.eu/art-32-gdpr/)

Acra provides  &quot;state of the art&quot; &quot;security of processing&quot; required in article 32 of GDPR through providing data encryption and integrity check of the encrypted data.

_&gt; &quot;Taking into account the state of the art, the costs of implementation and the nature, scope, context and purposes of processing as well as the risk of varying likelihood and severity for the rights and freedoms of natural persons, the controller and the processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk,...&quot;_

Also, the components of Acra allow encrypting data on the client&#39;s side, which enables secure transfer of the data in encrypted form through an untrusted channel.

## Data protection by design and by default

[Article 25 of GDPR](https://gdpr-info.eu/art-25-gdpr/)

The default settings of Acra are pre-configured in the most secure way to provide that exact &quot;secure by default&quot; state of the system. This is enabled through the default encryption settings for the data transfer between the Acra&#39;s components and the database ( [SSL](http://info.ssl.com/article.aspx?id=10241) and [Secure Session]({{< ref "themis/crypto-theory/cryptosystems/secure-session.md" >}}) are used).

_&gt;&quot;In particular, such measures shall ensure that by default personal data are not made accessible without the individual&#39;s intervention to an indefinite number of natural persons.&quot;_

## Logging, Intrusion Detection, and Notification

[Articles 33](https://gdpr-info.eu/art-33-gdpr/) [and 34 of GDPR](https://gdpr-info.eu/art-34-gdpr/)

Acra makes the communication with the users in case of a data breach easier because the data is encrypted (see Art 34 of GDPR):

_&gt; &quot;The communication to the data subject referred to in paragraph 1 shall not be required if any of the following conditions are met:
the controller has implemented appropriate technical and organisational protection measures, and those measures were applied to the personal data affected by the personal data breach, in particular, those that render the personal data unintelligible to any person who is not authorised to access it, such as encryption.&quot;_

All the components of Acra are logging the requests/queries/events that take place within Acra plus supports [secure logging]({{< ref "/acra/security-controls/security-logging-and-events/" >}}) that prevents tampering messages, removing, adding or changing the order of log entries. This provides the logs of everything that was happening in Acra in case of a security incident. Using the logs makes it easier to notify the supervisory authority and users about the exact details of a data breach (which complies with the articles [33](http://gdpr-info.eu/art-33-gdpr/) and [34](http://gdpr-info.eu/art-34-gdpr/) of GDPR). All the SQL queries to the database are logged in Acra by [AcraCensor]({{< ref "/acra/security-controls/sql-firewall/" >}}) (Acra&#39;s firewall) with configurable verbosity.

Also, there is a special intrusion detection feature in Acra called &quot; [poison records]({{< ref "/acra/security-controls/intrusion-detection/#poison-records-INVALID" >}})&quot;. The poison records help to detect a massive data leak and perform a shutdown (or any other action specified by the administrator) of Acra&#39;s work (data encryption/decryption) if a poison record is detected in a query (which means there was a successful attempt at an unauthorized data access).

## Acra and other data privacy regulations

Similarly to how Acra helps reach better compliance with GDPR, Acra can also help reach better compliance with other current data privacy regulations, such as

* [General Data Protection Regulation (GDPR)](https://gdpr-info.eu/)
* [HIPAA (Health Insurance Portability and Accountability Act)](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act)
* [DPA (Data Protection Act)](https://www.legislation.gov.uk/ukpga/2018/12/contents/enacted)
* [CCPA (California Consumer Privacy Act)](https://en.wikipedia.org/wiki/California_Consumer_Privacy_Act)

Check out the data encryption cheatsheet that covers several current data privacy regulations in [Cossack Labs blog](https://www.cossacklabs.com/blog/what-we-need-to-encrypt-cheatsheet.html).
