---
weight: 2
title: Logging error codes
bookCollapseSection: true
---

# Logging error codes

Most errors logged by Acra have their own error code.
Error codes for different events in Acra services are divided by groups and service.

List of basic error codes and their groups:

| Code | Error | Group |
| --- | ---------------------------------   | --------  |
|  100  | `EventCodeGeneral`                | General   |
|  505  | `EventCodeErrorCantStartService`  | Processes | 
|  510  | `EventCodeErrorCantInitKeyStore`  | Keys      |
|  540  | `EventCodeErrorCantConnectToDB`   | Database  |    
|  560  | `EventCodeErrorCensorQueryIsNotAllowed`   | Acracensor  |    
|  700  | `EventCodeErrorTranslatorCantHandleHTTPRequest`   | AcraTranslator  |    
|  1000  | `EventCodeErrorPrometheusHTTPHandler`   | Metrics  |    


{{< hint info >}}
You can find the table of error codes in [logging/event_codes.go](https://github.com/cossacklabs/acra/blob/master/logging/event_codes.go).

We plan to use unique event codes for every system event, not only for errors, but these updates are not ready yet. Currently, the default event code is `100` for all events (except errors).
{{< /hint>}}