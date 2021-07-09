---
weight: 1
title: Logging output
bookCollapseSection: true
---

# Logging output

Acra services write logs to `stderr`.
If you need to redirect logs to a file or a log collector service, please redirect `stderr`.

## Plaintext:

Nothing fancy – the most human-readable format.
If you are running Acra in a terminal, log lines will be colored for extra readability.

```
time="2021-07-01T19:34:14+03:00" level=info msg="Starting service acra-server [pid=304870]" version=0.85.0
time="2021-07-01T19:34:14+03:00" level=info msg="Validating service configuration..."
time="2021-07-01T19:34:14+03:00" level=info msg="Load encryptor configuration from ./acra-conf.yaml ..."
time="2021-07-01T19:34:14+03:00" level=info msg="Encryptor configuration loaded"
time="2021-07-01T19:34:14+03:00" level=info msg="Initializing ACRA_MASTER_KEY loader..."
time="2021-07-01T19:34:14+03:00" level=info msg="Initialized default env ACRA_MASTER_KEY loader"
time="2021-07-01T19:34:14+03:00" level=info msg="Initialising keystore..."
time="2021-07-01T19:34:14+03:00" level=info msg="Keystore init OK"
time="2021-07-01T19:34:14+03:00" level=info msg="Configuring transport..."
```

## JSON:

JSON logs are more structured and easy to parse with automated log analysis tools.

Common fields used by Acra:

- `product` and `version` define Acra components
- `timestamp` in RFC 3339 format
- `unixTime` to be compatible with a variety of log analysis tools
- `error` message and `code` if Acra encounters an error
  ([learn more about error codes](../error_codes/))

```
{"level":"info","msg":"Starting service acra-server [pid=304386]","product":"acra-server","timestamp":"2021-07-01T19:31:17+03:00","unixTime":"1625157077.908","version":"0.85.0"}
{"level":"info","msg":"Validating service configuration...","product":"acra-server","timestamp":"2021-07-01T19:31:17+03:00","unixTime":"1625157077.908","version":"0.85.0"}
{"level":"info","msg":"Load encryptor configuration from ./acra-conf.yaml ...","product":"acra-server","timestamp":"2021-07-01T19:31:17+03:00","unixTime":"1625157077.908","version":"0.85.0"}
{"level":"info","msg":"Encryptor configuration loaded","product":"acra-server","timestamp":"2021-07-01T19:31:17+03:00","unixTime":"1625157077.908","version":"0.85.0"}
{"level":"info","msg":"Initializing ACRA_MASTER_KEY loader...","product":"acra-server","timestamp":"2021-07-01T19:31:17+03:00","unixTime":"1625157077.908","version":"0.85.0"}
{"level":"info","msg":"Initialized default env ACRA_MASTER_KEY loader","product":"acra-server","timestamp":"2021-07-01T19:31:17+03:00","unixTime":"1625157077.908","version":"0.85.0"}
{"level":"info","msg":"Initialising keystore...","product":"acra-server","timestamp":"2021-07-01T19:31:17+03:00","unixTime":"1625157077.908","version":"0.85.0"}
{"level":"info","msg":"Keystore init OK","product":"acra-server","timestamp":"2021-07-01T19:31:17+03:00","unixTime":"1625157077.908","version":"0.85.0"}
{"code":563,"error":"fail to parse specified query","level":"warning","msg":"Failed to parse input query","product":"acra-server","timestamp":"2021-07-01T19:47:06+03:00","unixTime":"1625158026.944","version":"0.85.0"}
```

## CEF:

Acra logs are compliant with the [CEF protocol](https://kc.mcafee.com/resources/sites/MCAFEE/content/live/CORP_KNOWLEDGEBASE/78000/KB78712/en_US/CEF_White_Paper_20100722.pdf) revision 16 from July 22, 2010, except that Acra is using custom Dictionary Extension fields (like `unixTime`)
as we found them to be very useful for log analysis.

Note that CEF severity levels range from 0 to 10.
They map to Acra log levels as follows:

| CEF | Acra log level |
| --- | -------------- |
|  0  | `debug`        |
|  1  | `info`         |
|  3  | `warning`      |
|  6  | `error`        |
|  8  | `fatal`        |
| 10  | `panic`        |

```console   
CEF:0|cossacklabs|acra-server|0.85.0|100|Starting service acra-server [pid\=304668]|1|unixTime=1625157173.936 
CEF:0|cossacklabs|acra-server|0.85.0|100|Validating service configuration...|1|unixTime=1625157173.936 
CEF:0|cossacklabs|acra-server|0.85.0|100|Load encryptor configuration from ./acra-conf.yaml ...|1|unixTime=1625157173.936 
CEF:0|cossacklabs|acra-server|0.85.0|100|Encryptor configuration loaded|1|unixTime=1625157173.936 
CEF:0|cossacklabs|acra-server|0.85.0|100|Initializing ACRA_MASTER_KEY loader...|1|unixTime=1625157173.936 
CEF:0|cossacklabs|acra-server|0.85.0|100|Initialized default env ACRA_MASTER_KEY loader|1|unixTime=1625157173.936 
CEF:0|cossacklabs|acra-server|0.85.0|100|Initialising keystore...|1|unixTime=1625157173.936 
CEF:0|cossacklabs|acra-server|0.85.0|100|Keystore init OK|1|unixTime=1625157173.937 
CEF:0|cossacklabs|acra-server|0.85.0|100|Configuring transport...|1|unixTime=1625157173.937
```

{{< hint info >}}
If you believe that Acra is missing some handy logging formats,
feel free to [open an Issue](https://github.com/cossacklabs/acra/issues) and tell us.

Alternatively, you can add the required log formatter ([`logging` folder](https://github.com/cossacklabs/acra-Q12021/tree/master/logging) is a good place to start)
and [open a pull request](https://github.com/cossacklabs/acra/pulls).

We will be grateful for contributions ❤️
{{< /hint>}}