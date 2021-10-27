---
title: Authentication
weight: 6
---

# Authentication

Acra requires authentication for all incoming connections that process data (encryption/masking/tokenization happening in AcraServer, AcraTranslator or AnyProxy), connections to the database (AcraServer), all KMS-related operations, and privileged operations.

## Data processing connections

### Client app <> AcraServer

[AcraServer](/acra/acra-in-depth/architecture/acraserver/) authenticates each incoming connection from client application. We strongly advice using mutual authentication every time. Authentication happens via:

- [TLS](/acra/configuring-maintaining/tls/). `client app <> [TLS] <> AcraServer` 

By default, AcraServer will request and validate client TLS certificate. See [AcraServer's TLS configuration flags](/acra/configuring-maintaining/general-configuration/acra-server/#tls).

- [AcraConnector](/acra/configuring-maintaining/general-configuration/acra-connector). `client app <> AcraConnector <> [TLS or Themis Secure Session] <> AcraServer`. 


AcraServer authenticates connections from AcraConnector. If TLS is used as underlying transport encryption, mutual authentication is desired but optional, if [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session) is used, mutual authentication is enabled by default. See [AcraServer's configuration flags for AcraConnector](/acra/configuring-maintaining/general-configuration/acra-server/#command-line-flags).

AcraServer returns error on non-authenticated queries. Authenticated queries can get access only for the data assosiated with client app `ClientID` or for known [ZoneIDs](/acra/security-controls/zones).


### AcraServer <> database

<!-- to @lagovas: what this sentense means? -->
AcraServer doesn't affect authentication process on database protocol level between client application and database. We strongly recommend using TLS when connecting to the database and providing database TLS certificate in AcraServer configuration.

Refer to [AcraServer TLS configuration params](/acra/configuring-maintaining/general-configuration/acra-server/#tls).

Also, AcraServer does not intervene in the PostgreSQL authentication, so you can still use login/password for authentication between the app and the database. We actually encourage you to do that and to add one extra layer of protection against attackers that target your PostgreSQL installation.

We've tested all the authentification methods compatible with PostgreSQL (excluding RADIUS authentication), and found out that all of them are working correctly through Acra.

<!-- to @lagovas: please clarify database authentication options between AS and DB -->


### Client app <> AcraTranslator

`client app <> [TLS] <> AcraTranslator` 

[AcraTranslator](/acra/acra-in-depth/architecture/acratranslator/) requires authentication for all API requests. Mutual authentication may be turned on or off. In first case applications may get access only for own data related to ClientID or known ZoneIDs. Without mutual authentication all authenticated applications have access to all data if they know related ClientID or ZoneID. 

AcraTranslator doesn't validate applications identifiers before data manipulations.
All ownership mapping is applications' responsibility and may be implemented in different ways according to business requirements.

### Client app <> AnyProxy

[AnyProxy](/acra/acra-in-depth/architecture/anyproxy/) authentication works similarly to AcraTranslator's.


## Key management connections

### External key stores

[AcraServer](/acra/acra-in-depth/architecture/acraserver/), [AcraTranslator](/acra/acra-in-depth/architecture/acratranslator/) and [AnyProxy](/acra/acra-in-depth/architecture/anyproxy/) require authenticated connections when working with external key stores (Redis, BoltDB).

Read more about configuring [external key stores](/acra/configuring-maintaining/key-storing/kv-stores/).

### KMS

[AcraServer](/acra/acra-in-depth/architecture/acraserver/), [AcraTranslator](/acra/acra-in-depth/architecture/acratranslator/) and [AnyProxy](/acra/acra-in-depth/architecture/anyproxy/) require authenticated connections when working with KMS.


Read more about connection configuration to [popular KMS](/acra/configuring-maintaining/key-storing/kms/).


## Privileged operations

AcraServer supports changing configuration in runtime using [AcraWebConfig's](/acra/configuring-maintaining/general-configuration/acra-webconfig). AcraWebConfig is a simple web UI service that requires HTTP basic authentication.

Privileged operations (changing configuration of AcraServer, restarting it) are available only for authenticated and authorized users. You should add users first using [acra-authmanager](/acra/configuring-maintaining/general-configuration/acra-authmanager) utility, then use these users' credentials to access AcraWebConfig.

AcraWebConfig communicates with AcraServer through AcraConnector and can use Themis Secure Session or TLS as transport encryption. There is no requirement to use mutual authentication. TLS may be configured without sending client's certificates. Themis Secure Session uses mutual authentication by design and cannot be changed.