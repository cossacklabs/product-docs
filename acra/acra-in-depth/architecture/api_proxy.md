---
title: API Proxy [ENTERPRISE]
bookCollapseSection: true
weight: 6
---

# How it works

API proxy can be achieved via using Acra SDKs or AcraTranslator and building proxy layer around it.
In enterprise version, we bring different nuts'n'bolts to make it easier.

# Which FRs/NFRs does it implement

_TODO_

# How it connects to other parts

API proxy will work between the application and AcraTranslator.
It may transparently forward requests/responses, but it may also perform some conversion/validation,
translate between different RPC protocols.

The exact feature set of API proxy is defined by you and we can help with implementing it.

# What are architectural considerations?

_TODO_
