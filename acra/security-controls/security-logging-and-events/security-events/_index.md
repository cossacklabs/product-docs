---
title: Security events
bookCollapseSection: true
weight: 1
---

# Security events

Acra’s security log is specifically pre-configured to be helpful to SIEM/SOC operators in building analytics and automation around security events.

## Logs and events that Acra can export

Acra services logs tons of activities – incoming connections, SQL firewall actions, encryption/decryption errors, key accesses and many more. Refer to the [Security controls / Security Logging and events](/acra/security-controls/security-logging-and-events) to learn the full list. Logs from AcraServer and AcraTranslator follow the same structure and format, but can have slightly different content (for example, AcraTranslator won't have SQL Request Firewall related logs and it doesn't have integrated SQL Request Firewall module.)

Acra services support logging in different formats including CEF, and can log to the file or stream. Refer to the [AcraServer configuration](/acra/configuring-maintaining/general-configuration#logging) to find out how to control Acra's logging.

All security events have a specific event code that indicates the exact type of the event. As example, `EventCodeErrorCantLoadMasterKey = 512` code means that Acra can't load Acra Master Key during initialisation on startup. Refer to the full list of [the event codes](https://github.com/cossacklabs/acra/blob/master/logging/event_codes.go).


## Metadata 

Typically, each event has additional fields giving specific context about what's heppening:

* Timestamp (always present).
* ClientID for encryption/decryption operations – AcraServer logs the ID of client application that triggered the operation (helpful to analyze amount of errors happening for specific application).
* ZoneID for encryption/decryption operations related to the specific [Zone](/acra/security-controls/zones/).


# List important security events

Here are the most important security events for SIEM/SOC analysis. Refer to the full list of [the event codes](https://github.com/cossacklabs/acra/blob/master/logging/event_codes.go).


### General errors

```
EventCodeErrorGeneral         = 500
EventCodeErrorWrongParam      = 501
EventCodeErrorInvalidClientID = 502
```

### Startup and initialization errors of AcraServer and AcraTranslator

```
EventCodeErrorCantStartService             = 505
EventCodeErrorCantForkProcess              = 506
EventCodeErrorWrongConfiguration           = 507
EventCodeErrorCantReadServiceConfig        = 508
EventCodeErrorCantCloseConnectionToService = 509
```

### Host system related errors

```
EventCodeErrorCantGetFileDescriptor     = 520
EventCodeErrorCantOpenFileByDescriptor  = 521
EventCodeErrorFileDescriptionIsNotValid = 522
EventCodeErrorCantRegisterSignalHandler = 523
```

### Key management and key access errors

```
EventCodeErrorCantInitKeyStore             = 510
EventCodeErrorCantReadKeys                 = 511
EventCodeErrorCantLoadMasterKey            = 512
EventCodeErrorCantInitPrivateKeysEncryptor = 513
```

### Encryption-decryption errors

```
EventCodeErrorCantInitDecryptor                          = 580
EventCodeErrorDecryptorCantDecryptBinary                 = 581
EventCodeErrorDecryptorCantInitializeTLS                 = 584
EventCodeErrorDecryptorCantDecryptSymmetricKey           = 586

EventCodeErrorDecryptorCantCheckPoisonRecord             = 589
EventCodeErrorDecryptorRecognizedPoisonRecord            = 587
EventCodeErrorDecryptorCantHandleRecognizedPoisonRecord  = 583

EventCodeErrorEncryptorInitialization        = 901
EventCodeErrorDataEncryptorInitialization    = 902
EventCodeErrorCantEncryptData                = 904
```

### Transport and network connection errors

```
EventCodeErrorCantAcceptNewConnections   = 533
EventCodeErrorCantHandleSecureSession    = 535
EventCodeErrorCantCloseConnection        = 536
EventCodeErrorCantInitClientSession      = 537
EventCodeErrorCantWrapConnection         = 538
EventCodeErrorConnectionDroppedByTimeout = 539
EventCodeErrorNetworkTLSGeneral          = 1302
```


### Database communication errors

```
EventCodeErrorCantConnectToDB       = 540
EventCodeErrorCantCloseConnectionDB = 541
EventCodeErrorProtocolProcessing    = 600

EventCodeErrorCodingCantParsePostgresqlParseCommand   = 1202
EventCodeErrorCodingPostgresqlUnexpectedPacket        = 1203
```

### Acra Request Firewall errors

```
EventCodeErrorCensorQueryIsNotAllowed   = 560
EventCodeErrorCensorSetupError          = 561
EventCodeErrorCensorBackgroundError     = 562
EventCodeErrorCensorQueryParseError     = 563
```

### AcraServer specific errors

```
EventCodeErrorGeneralConnectionProcessing = 1100
EventCodeErrorCreateFileFromDescriptor    = 1101
```

### AcraTranslator specific errors

```
EventCodeErrorTranslatorCantHandleHTTPRequest       = 700
EventCodeErrorTranslatorMethodNotAllowed            = 701
EventCodeErrorTranslatorMalformedURL                = 702	
EventCodeErrorTranslatorZoneIDMissing               = 706
EventCodeErrorTranslatorCantDecryptAcraStruct       = 707
EventCodeErrorTranslatorCantReturnResponse          = 708
EventCodeErrorTranslatorCantHandleHTTPConnection    = 710
EventCodeErrorTranslatorCantAcceptNewHTTPConnection = 712
EventCodeErrorTranslatorCantHandleGRPCConnection    = 713
EventCodeErrorTranslatorClientIDMissing             = 714
EventCodeErrorTranslatorCantAcceptNewGRPCConnection = 715
```
