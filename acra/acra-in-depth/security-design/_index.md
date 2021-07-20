---
title: Security design
bookCollapseSection: true
---

## Security design

Acra is built to provide selective encryption only to the records that require such protection.
AcraWriter provides the app developer with the means to encrypt these records via wrapping anything in a function that outputs [AcraStruct]({{< ref "acra/acra-in-depth/data-structures/#understanding-acrastruct" >}}), a crypto container decryptable by AcraServer, which is then stored in a database.

Any secret contained within an app (i.e. passwords in config files) can be leaked. There are many reasons why a developer might not want to use the user password as a secret - not all systems have to be end-to-end encrypted, even though we'd like it to be that way. An example of a good trust model is to use asymmetric cryptography to "send" this data (for the encryption of which we only have a public key) to some remote party. A leakage of this public key will still be insufficient for decrypting anything from the database.

### Threat model

We expect that anything, apart from AcraServer (which must remain uncompromised), can be compromised and that any piece of data can leak outside the system.

Our goal is to provide the two following guarantees:

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

Zone data is supplied to an app via JSON (i.e. `{"id": "...", "public_key": "..."}`) from [HTTP api]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#http-api-INVALID">}}) or [console utility]({{< ref "acra/security-controls/transport-security/acra-connector.md#acraconnector-and-acrawriter-INVALID" >}}).