---
title: Data flow
bookCollapseSection: true
weight: 4
---

## Data flow

### Acra components

- [_AcraWriter_]({{< ref "/acra/configuring-maintaining/installing/building-acrawriter.md" >}}) — a client-side library that integrates into the app's workflow either through ORM or directly and provides the means for encryption of the sensitive data by generating AcraStructs.

- [_AcraServer_]({{< ref "/acra/configuring-maintaining/general-configuration/acra-server.md" >}}) — a separate daemon that runs in an isolated environment (separate virtual machine or physical server). AcraServer is responsible for holding all the secrets required to decrypt the data and for actually decrypting this data.

- [_AcraCensor_]({{< ref "/acra/security-controls/sql-firewall/" >}}) – is a firewall-like component that sits inside AcraServer, and checks every SQL query to the database.

  ![](/files/data-flow/acra-archi-tls.png)
  
  _Acra-based application architecture using TLS transport encryption._
  
Second way to protect raw data between application and AcraServer/AcraTranslator is to use AcraConnector:

- [_AcraConnector_]({{< ref "/acra/configuring-maintaining/general-configuration/acra-connector.md" >}}) — a client-side daemon that runs under a separate user / in a separate container, and which acts as a database listener that redirects all the queries to AcraServer and, upon receiving the results, feeds it back into the app. AcraConnector is an optional component, required in systems that are using extra transport encryption layer via Themis SecureSession.

  ![](/files/data-flow/acra-entities.png)    
  
  _Acra-based application architecture using TLS transport encryption._
  
### Data flow schemas

With TLS as secure transport between application and AcraServer/AcraTranslator:
1. **Writing**: Application --> AcraTranslator --> Application --> Storage.

   **Description**: application uses AcraTranslator to encrypt data and save it in a storage. 
  
   **Reading**: Application --> Storage --> Application --> AcraTranslator --> Application.

   **Description**: application uses AcraTranslator to decrypt data after reading from storage.

2. **Writing**: Application --> AcraWriter --> Database.

   **Description**: application uses AcraWriter and public key to encrypt data and save it directly to database.

   **Reading**: Database --> AcraServer --> Application.

   **Description**: application request data from database through AcraServer that decrypts it transparently.
  
3. **Writing**: Application --> AcraServer --> Database.

   **Description**: application sends data to database through AcraServer in [Transparent encryption mode](/acra/configuring-maintaining/general-configuration/acra-server/#transparent-proxy-mode-INVALID).
   All data manipulations like [encryption]({{< ref "/acra/security-controls/encryption/" >}})/
   [tokenization]({{< ref "/acra/security-controls/tokenization/" >}})/[masking]({{< ref "/acra/security-controls/masking/" >}})
   applied on AcraServer side before sending to database. 

   **Reading**: Database --> AcraServer --> Application.

   **Description**: application request data from database through AcraServer. AcraServer transparently
   decrypts/detokenizes/unmasks data and passes it to application.


   **TODO**: I'd love to see this section updated, here are suggested cases to outline

### Simplest version with SQL proxy

App <> AcraServer <> DB

### Simplest version with API 

App <> AcraTranslator, App <> DB

### API proxy 

App <> DAO (<>AT) <> other API

### Encryption-as-a-service

App <> AT

### Long data lifecycle

Many parts use AT / AS to protect data across lifecycle
   
   {{< hint info >}}
   Raw data transfers using TLS with mutual authentication setup between application and AcraTranslator. Read more about
   [TLS configuration]({{< ref "/acra/configuring-maintaining/tls/" >}}).
   {{< /hint >}}

<figure>
  <img src="/files/data-flow/acra-archi-tls-write-flow.png">
  <figcaption>Data flow #2 and #3</figcaption>
</figure>
  
With SecureSession and AcraConnector for secure transport:

1. **Writing**: Application --> AcraConnector --> AcraTranslator --> AcraConnector --> Application --> Storage.

   **Description**: application uses AcraTranslator to encrypt data and save it in a storage. All data sent through
   AcraConnector to protect plaintext data from application to AcraTranslator via SecureSession.

   **Reading**: Application --> Storage --> Application --> AcraConnector --> AcraTranslator --> AcraConnector --> Application.

   **Description**: application gets data from storage and decrypts it using AcraTranslator. All data sent through
   AcraConnector deployed close to application to protect decrypted data sent from AcraTranslator via SecureSession.

2. **Writing**: Application --> AcraWriter --> Database.
   
   **Description**: application uses AcraWriter and public key to encrypt data and save it directly to database.

   **Reading**: Database --> AcraServer --> AcraConnector --> Application.

   **Description**: application requests data from database through AcraServer that decrypts it transparently. 
   AcraConnector uses Secure Session to protect raw data decrypted by AcraServer before sending it to application.

3. **Writing**: Application --> AcraConnector --> AcraServer --> Database.

   **Description**: application sends data to database through AcraServer in transparent encryption mode and AcraConnector.
   All data manipulations like [encryption]({{< ref "/acra/security-controls/encryption/" >}})/
   [tokenization]({{< ref "/acra/security-controls/tokenization/" >}})/[masking]({{< ref "/acra/security-controls/masking/" >}}) 
   applied on AcraServer side before sending to database. Raw data sent to AcraServer through AcraConnector that protect
   it using SecureSession.

   **Reading**: Database --> AcraServer --> AcraConnector --> Application.

   **Description**: application request data from database through AcraServer and AcraConnector. AcraServer transparently
   decrypts/detokenizes/unmasks data and sends it in safe through AcraConnector with SecureSession to application.

<figure>
  <img src="/files/data-flow/acra-entities-with-extra-writer.png">
  <figcaption>Data flow #2 and #3</figcaption>
</figure>


### Data flow with Zones

Data flow with zones are similar for schemas described above except several additional steps at the beginning:
* Zone generation via [acra-addzone]({{< ref "/acra/configuring-maintaining/general-configuration/acra-addzone.md" >}}) CLI command or [AcraServer's HTTP API]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#http-api-INVALID">}}).
* [Specifying Zone ID]({{< ref "/acra/security-controls/zones.md" >}}) in requests to AcraTranslator or inside DB query to database through AcraServer. 
