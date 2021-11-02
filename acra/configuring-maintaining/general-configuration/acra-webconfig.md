---
title: acra-webconfig
weight: 15
---

# acra-webconfig

`acra-webconfig` is a simple web application providing web UI for AcraServer's runtime configuration.
You can adjust the following parameters of AcraServer via `acra-webconfig`:
* `db_host`
* `db_port`
* `incoming_connection_api_port`
* `d`
* `poison_run_script_file`
* `poison_shutdown_enable`
* `zonemode_enable`

{{< hint info >}}
See [AcraServer's command line flag documentation](/acra/configuring-maintaining/general-configuration/acra-server/#command-line-flags).
{{< /hint >}}

## Command line flags

* `--destination_host=<hostname>`

  Hostname of AcraServer to configure or AcraConnector that will proxy configuration requests to AcraServer.
  IP addresses are also supported.
  Default is `localhost`.

* `--destination_port=<port>`

  HTTP API port of AcraServer or AcraConnector.
  Default is `9191`.

* `--incoming_connection_host=<address>`

  Address of the network interface for `acra-webconfig` to listen for HTTP connections on.
  Default is `127.0.0.1`.
  Set to empty string, `0.0.0.0`, or `[::]` to listen on all interfaces.

* `--incoming_connection_port=<port>`

  Port for `acra-webconfig` to listen for HTTP connections on.
  Default is `8000`.

* `--http_auth_mode={auth_on|auth_off_local|auth_off}`

  HTTP basic authentication mode.

    * `auth_on` — (default) basic authentication is always required
    * `auth_off_local` — turn off basic authentication if `acra-webconfig` accepts connections only from `localhost`
    * `auth_off` — basic authentication is not performed

* `--static_path=<path>`

  Path to static content.
  Default is `cmd/acra-webconfig/static`.

### Configuration files

* `--config_file=<filename>`

  Path to YAML configuration file.

* `--dump_config`

  Dump configuration to `configs/acra-webconfig.yaml`.

* `--generate_markdown_args_table`

  Generate markdown file with text description of all flags.
  Output file is `configs/markdown_acra-webconfig.md`.
  Works in pair with `--dump_config`.

### Logging

* `-d`

  Log to stderr all `DEBUG`, `INFO`, `WARNING` and `ERROR` logs.

* `--logging_format={plaintext|json|CEF}`
  Logging format.

    * `plaintext` — (default) pretty human readable key/value format<br>
      ```
      time="2021-07-12T14:02:12+03:00" level=info msg="Starting service acra-translator [pid=475995]" version=0.85.0
      ```

    * `json` — one JSON object per line, easy to parse by most log collectors<br>
      ```
      {"level":"info","msg":"Starting service acra-translator [pid=476077]","product":"acra-translator","timestamp":"2021-07-12T14:02:50+03:00","unixTime":"1626087770.004","version":"0.85.0"}
      ```

    * `CEF` — Common Event Format<br>
      ```
      CEF:0|cossacklabs|acra-translator|0.85.0|100|Starting service acra-translator [pid\=476133]|1|unixTime=1626087782.510
      ```

## Web interface

### AcraServer settings

![](/files/acra-webconfig/acra-webconfig-ui.png)

{{< hint info >}}
After pressing `Save` button AcraServer dumps configuration to the configuration file and gracefully restarts to apply all changes.
{{< /hint >}}

### AcraCensor & Zone settings

Currently `acra-webconfig` does not support changing AcraCensor and Zone-related parameters.

![](/files/acra-webconfig/acra-webconfig-acracensor.png)