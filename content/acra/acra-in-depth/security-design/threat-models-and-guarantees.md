---
title: Threat models and security guarantees
weight: 2
---

# Threat models and security guarantees

Acra is built to provide selective encryption only to the records that require such protection. Thus, such records are sensitive assets that are subject to certain risks and threats, which Acra helps to mitigate.

Depending on the environment where Acra runs and the dataflow of sensitive data, threat models and mitigations are different. Acra is built as modular system that allows to achieve different security guarantees.

Let's quickly model different environments.

#### Option 1. Friendly environment

Client application, AcraTranslator, KMS, database. Client application encrypts/decrypts data by using AcraTranslator API (REST or gRPC) via TLS. Client application is responsible for putting data in the database. 

`Acra's protection measures`: data encryption, TLS, KMS.

#### Option 2. Friendly environment 

Client application, AcraServer, KMS, SQL database. Client application sends data to the SQL database through AcraServer, which encrypts/decrypts data. AcraServer is responsible for putting data in the database. 

`Acra's protection measures`: data encryption, TLS, KMS.

#### Option 3. Hostile environment

Client application for saving data (Writer) with AcraWriter SDK, client application for reading data (Reader), AcraServer, AcraConnector, Redis, KMS, SQL database. Writer application encrypts data using AcraWriter SDK and sends it to the SQL database via AcraServer. Reader application reads data from the database via AcraServer. Reader application connects to AcraServer via AcraConnector to provide better transport security guarantees. When AcraServer reads records from the database, it checks for poison records (intrusion detection system). AcraServer has Acra's Request Firewall enabled to validate every SQL query. AcraServer has enabled automation to trigger warnings for Ops team. AcraServer produces logs and security events, that go into SIEM. AcraServer produces cryptographically signed audit logs that are being verified automatically by a timer.

`Acra's protection measures`: data encryption, AcraConnector, KMS, intrusion detection, AcraWriter SDK for client-side encryption, logs, security events, automation, crypto-signed audit logs.

As you can see, Acra can be configured to provide more security controls mitigating threats in less trusty environments. An example of a good trust model is to divide "reading" and "writing" applications, and encrypt data on client-side using AcraStructs (using public key, not a secret one). A leakage of this public key will still be insufficient for decrypting anything from the database.


## Threat model

We expect that anything, apart from AcraServer/AcraTranslator (which must remain uncompromised), can be compromised and that any piece of data can leak outside the system.

Our goal is to provide the three following guarantees:

**Guarantee 1:** If the attacker compromises the system through collecting all the data from any (or all) components other than AcraServer/AcraTranslator, and AcraServer/AcraTranslator remains uncompromised, this data will not be sufficient to decrypt protected entries. More specifically, AcraServer/AcraTranslator's key storage is the 'crown jewel' of the whole security scheme and should be protected with the typical server security measures.

**Guarantee 2:** If the attacker alters the app's behaviour in such a way that makes the app legitimately request all the protected data from the database, AcraServer becomes suspicious of the app's abnormalities, detects possible 'configuration picking' attempts, and reacts accordingly, using the pre-set alarms / panic blocks.

There is an additional third guarantee, which is valid while using Zone keys:

**Guarantee 3:** If the attacker compromises the system in such a way that they modify the app's behaviour to extract all the protected records, and these records are protected using Zone keys, the attacker will need to reverse-engineer both the storage model and the Zone identification to be able to request all of them correctly. This guarantee should be achieved cryptographically, not programmatically.


### Guarantee 1: Cryptographic model

To provide Guarantee 1, Acra uses data encryption, where each data field is encrypted into a special cryptographic container. Data encryption could happen on client-side (in case of AcraStructs), AcraServer or AcraTranslator sides. Decryption happens only on AcraServer/AcraTranslator sides, making them the only places to have sufficient secrets to decrypt data.

Asymmetric container: [AcraStruct](/acra/acra-in-depth/data-structures) is based on asymmetric (public-key) cryptography. It allows encrypting data on client-side without risking decryption keys, decrypting only via AcraServer/AcraTranslator.

Symmetric container: [AcraBlock](/acra/acra-in-depth/data-structures) is based on symmetric (secret-key) cryptography. Encryption/decryption is performed only on AcraServer/AcraTranslator, decryption keys never leave trusted perimeter.


### Guarantee 2: Detection and mitigation

Due to the deep integration of Acra into the application's data flow, Acra can detect suspicious activity in a growing list of places:

- application connections to AcraServer/AcraTranslator,
- database responses via AcraServer,
- data content coming from the application-Database-AcraServer roundtrip.

Acra produces a number of security events and supports alarm triggers and programmatic reactions in case of suspicious activity:

- If AcraServer/AcraTranslator detect poison record (honey token) in the database response, it might mean that somebody attempts to extract whole tables with sensitive data by "poisoning" them with records that would never be selected unless SELECT * is used.
- Inaccurate connection attempts to AcraServer/AcraTranslator from the processes that don't match the expected conditions (if the users running AcraServer and the client application on the same VM / physical machine). Such expected conditions can be process names, name substrings, etc.

Once the trigger is triggered, an automatic reaction can be executed. Refer to [Security events](/acra/security-controls/security-logging-and-events/security-events/) and [programmatic reactions](/acra/security-controls/security-logging-and-events/programmatic-reactions/).


### Guarantee 3: Add encryption context

By differentiating the sensitive data via [Zones](/acra/security-controls/zones/), Acra users can build an additional layer of security. 

- Zone keys are used for encrypting the AcraStructs. In this case, AcraServer will only be able to pick the right key and decrypt the data by knowing the correct zone. This limits the leak scope for every private key, even if AcraServer is partially compromised.

- Zone IDs are used as context when encrypting data using Themis Secure Cell, providing additional protection.


## Security model for Acra

### Possible threats

{{< hint info >}}
Note: We recommend taking a look at the [architectural scheme of Acra](/acra/acra-in-depth/architecture/) before continuing to read.
{{< /hint >}}

Acra at its core is a set of tools that allow safeguarding the security of a database/datastorage against the known widespread threats.

Related security threats are:

- Threats related to excess / abuse of access privileges.
- Data leaks caused by mistakes in deploy, configuration settings, backup leakages, log leakages, etc.
- SQL injections.
- Denial of service.
- Vulnerabilities in the database protocol.
- Weak audit or an absence thereof.
- Operational system vulnerabilities.
- Unsafe management of cryptographic keys.

### Security assumptions

Acra can perform its protective functions properly and protect from the security threats if the following security assumptions are met:

- The PKI/KMS infrastructure is trusted;
- AcraServer/AcraTranslator is trusted;
- The client is less trusted than the server.


### Possible consequences of security incident

Let’s consider possible consequences of any separate component being broken (broken as in “fully compromised” when the adversary fully overtakes the work of the component and gains full access to its memory).

When a **Database** is broken into, the worst-case scenario is DoS or COA (ciphertext-only attack). Thus, the stability of the system, in this case, is reduced to the stability of the symmetric encryption algorithm (AES-GCM-256).

When the **Client application** gets broken, the worst-case scenario is that the adversary can get the data belonging to this client application, which is stored in the database.

And finally, if AcraServer/AcraTranslator gets broken, the adversary can fully compromise the system.

It is worth mentioning that in absence of reliable public key infrastructure, the communication channel between the client application and AcraServer/AcraTranslator is also vulnerable. In this case, the resistance ability of the system comes down to the security of the TLS. In all the other communication channels the data is encrypted so, in the worst case (when TLS is not used) the security of the system comes down to the security of the symmetric encryption algorithm (AES-GCM-256).

Refer to the [PKI overview for Acra](/acra/acra-in-depth/security-design/acra-and-pki/) section to learn our recommendations regarding PKI.
