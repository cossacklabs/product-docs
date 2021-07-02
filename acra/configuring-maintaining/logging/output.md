---
weight: 2
title: Logging output
bookCollapseSection: true
---

## Logging output

The default output is `stderr`. Examples of output:

#### Plaintext:

Nothing special, bonus is color-formatted output when connected to terminal.

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

#### JSON:

JSON log contains many useful fields like: `product` and `versions`, which define Acra components; `timestamp` in RFC3339 and `unixTime` to be compatible with a variety of log analysis tools.<br/>
The log `levels` could be `debug/info/warning/error/panic`.<br/>
Acra logs both error code and message if an error occurs (`code` and `error` fields respectively).

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

#### CEF:

CEF logger is compliant with the [CEF protocol](https://kc.mcafee.com/resources/sites/MCAFEE/content/live/CORP_KNOWLEDGEBASE/78000/KB78712/en_US/CEF_White_Paper_20100722.pdf) revision 16 from July 22, 2010, except the fact that Acra is using custom Dictionary Extension fields (like `unixTime`) because we found them to be very useful for log analysis.<br/>
Pay attention that severity levels range from 0 (debug level) to 10 (panic level), see severity mapping function in [logging/cef_formatter](https://github.com/cossacklabs/acra-Q12021/blob/master/logging/cef_formatter.go#L199).

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
