---
title: Encryption
bookCollapseSection: true
---

# Encryption as a security control

Acra prevents adversaries with access to database from seeing sensitive plaintexts, if it has been configured so. 
Acra does that by encrypting the sensitive data selectively and keeping the keys to itself. In this, Acra acts as security boundary in front of sensitive data. 

## Encryption 

* AcraServer transparent: If AcraServer has been set up in transparent mode, encryption happens on AcraServer during insert/update queries. 
* AcraTranslator: Encryption happens via request to AcraTranslator API. 
* SDK (AcraWriter): It is possible to generate AcraStructs using AcraWriter library with appropriate public keys. 

## Decryption

Decryption always happens on AcraServer / AcraTranslator, as it is the only entity to hold the keys and metadata. 

## Interoperability 

Records encrypted by AcraTranslator can be decrypted by AcraServer and vice versa. Records encrypted by AcraWriter can by decrypted by both as well. 


