---
title: Architecture
bookCollapseSection: true
weight: 1
---
**TODO: Expand**
# Architecture

## Key components

Security control services: Proxy and API 
Key storage
Configuration / policy
KMS

## Supporting modules

AcraConnector
WebConfig


# Data flow & component layout


Acra requires 3 components to talk together during startup: 

* KMS to fetch keys 
* Acraserver/AcraTranslator

Acra requires 3 components to talk together during encryption/decryption: 

* Key store
* AcraServer/Translator
* Application
* Database (in AcraServer case)

For examples, please consult (TODO link) appropriate section for data flow examples. 
