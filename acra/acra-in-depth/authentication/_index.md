---
title: Authentication
weight: 6
---

## Authentication

Acra requires authentication for data access operations, for functions requiring private keys and for privileged 
operations.

### Data access operations

Such operations occur in database requests by application through AcraServer and API requests for data manipulations via 
AcraTranslator.

[AcraServer]({{< ref "/acra/configuring-maintaining/general-configuration/acra-server.md" >}}) requires mutual authentication 
via [Secure Session]({{< ref "/themis/crypto-theory/cryptosystems/secure-session.md" >}}) through 
[AcraConnector]({{< ref "/acra/configuring-maintaining/general-configuration/acra-connector.md" >}}) or 
[TLS]({{< ref "acra/configuring-maintaining/tls/" >}}) (as direct connections or through AcraConnector) 
for data protection operations from application. AcraServer doesn't touch authentication process on DB protocol level 
between application and database. Mutual authentication required for application authorization and identification purposes. 
Authenticated queries can get access only for own data related to own identifier `ClientID` or for known 
[ZoneIDs]({{< ref "/acra/security-controls/zones.md" >}}).

[AcraTranslator]({{< ref "/acra/configuring-maintaining/general-configuration/acra-translator.md" >}}) requires authentication
for all API requests. Mutual authentication may be turned on or off. In first case applications may get access only for own data
related to ClientID or known ZoneIDs. Without mutual authentication all authenticated applications have access to all
data if they know related ClientID or ZoneID. AcraTranslator doesn't validate applications identifiers before data manipulations.
All ownership mapping is applications' responsibility and may be implemented in different ways according to business requirements.

### Privileged operations

AcraServer supports changing configuration in runtime via [AcraWebConfig's]({{< ref "/acra/configuring-maintaining/general-configuration/acra-webconfig.md" >}}) 
web UI that required basic authentication. It is privileged operations and only authenticated and authorized users may do it. 

AcraWebConfig web service requires basic authentication for all HTTP requests from web UI and only users who were added by 
[acra-authmanager]({{< ref "/acra/configuring-maintaining/general-configuration/acra-authmanager.md" >}}) CLI tool will be authorized.

Web service communicates with AcraServer through AcraConnector and authenticated by Secure Session
or TLS. There is no requirement to use mutual authentication. So TLS may be configured without sending client's certificates.
Secure Session uses mutual authentication by design and cannot be changed.