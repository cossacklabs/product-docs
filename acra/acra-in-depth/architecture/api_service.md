---
title: AcraTranslator - encryption-as-a-service daemon
bookCollapseSection: true
weight: 3
---

# How it works

AcraTranslator provides an API (either gRPC or HTTP) for applications giving them the ability to:
* Encrypt/decrypt data
* Tokenize/detokenize
* Mask/unmask
* Generate HMAC for searchable encryption

# Which FRs/NFRs does it implement

_TODO_

# How it connects to other parts

Redis — another storage for keys.
When configured, AcraTranslator will request keys it cannot find in keystore (directory in filesystem) from Redis.
It can also use Redis to store data needed for [tokenization feature]({{< ref "acra/security-controls/tokenization/_index.md" >}}) to work.

# What are architectural considerations? 

Just like with AcraServer, it is recommended to host AcraTranslator on a
different machine (virtual or physical), isolated from client applications.
