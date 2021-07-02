---
weight: 3
title: Logging error codes
bookCollapseSection: true
---

## Logging error codes

Most errors logged by Acra have their own error code. You can find the table of error codes in [logging/event_codes.go](https://github.com/cossacklabs/acra-Q12021/blob/master/logging/event_codes.go).

We plan to use unique event codes for every system event, not only for errors, but these updates are not ready yet. Currently, the default event code is `100` for all events (except errors).

### Implementing a new logging format

If you think that Acra is missing some handy logging formats, feel free to open an [Issue](https://github.com/cossacklabs/acra/issues) and describe why you think it's important. Alternatively, you can add the required log formatter ([logging folder](https://github.com/cossacklabs/acra-Q12021/tree/master/logging) is a good place to start) and open a [Pull Request](https://github.com/cossacklabs/acra/pulls).<br/>
We are grateful for contributions.