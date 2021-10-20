---
title: SIEM/SOC integration
bookCollapseSection: true
weight: 10
---

**TODO: Expand**

# Integrating Acra with SIEM systems 


## Events we can export

For the list of things Acra can log, see [What Acra can log]({{< ref "../security-logging-and-events/_index.md#what-acra-can-log" >}}).

Acra services can log events in Common Event Format, see for example
[AcraServer configuration]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#logging" >}})
(same flags are available for other services).

Most log events have a code indicating the exact type of the event. See list of these codes in
[logging/event\_codes.go](https://github.com/cossacklabs/acra/blob/master/logging/event_codes.go).

## Metadata 

Depending on which log event we are talking about, there can be some additional fields giving additional context about what's heppening:

* Timestamp, it's always present as the most basic log metadata
* Encryption/decryption handlers in AcraServer show ID of client that triggered the operation
* If crypto operation includes zone ID, it will be logged as well

# SOC integration

Acra can be integrated with any monitoring software your SOC is using, because Acra has unified format


# List of logs and events from security perspective

It will be hard, but we need kinda-exhaustive table here.
<!-- parse https://github.com/cossacklabs/acra/blob/master/logging/event_codes.go and group by importance? -->
