---
weight: 2
title: Logging error codes
bookCollapseSection: true
---

# Logging error codes

Most errors logged by Acra have their own error code. You can find the table of error codes in [logging/event_codes.go](https://github.com/cossacklabs/acra-Q12021/blob/master/logging/event_codes.go).

We plan to use unique event codes for every system event, not only for errors, but these updates are not ready yet. Currently, the default event code is `100` for all events (except errors).
