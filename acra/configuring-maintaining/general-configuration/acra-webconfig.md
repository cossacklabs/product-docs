---
title: acra-webconfig
bookCollapseSection: true
---

# acra-webconfig

`acra-webconfig` is simple web application that provide web UI for AcraServer's runtime configuration. Currently, it is
under development and for now allows configuring 9 parameters of AcraServer:
* `db_host`
* `db_port`
* `incoming_connection_api_port`
* `d`
* `poison_run_script_file`
* `poison_shutdown_enable`
* `zonemode_enable`

{{< hint info >}}
Parameter's description you can find on AcraServer's [command line flags]({{< ref "/acra/configuring-maintaining/general-configuration/acra_server.md#command-line-flags" >}}) page.
{{< /hint >}}

## Command line flags

* `--destination_host`
  IP or domain to AcraServer/AcraConnector daemon
  Default is `localhost`

* `--destination_port`
  Port of AcraServer's HTTP API port or AcraConnector port that proxy API requests to AcraServer
  Default is `9191`

* `--incoming_connection_host`

  Host for AcraWebconfig HTTP endpoint
  Default is `127.0.0.1`

* `--incoming_connection_port`

  Port for AcraWebconfig HTTP endpoint
  Default is `8000`

* `--http_auth_mode`

  Mode for basic auth. Possible values:
    * `auth_on` (default): turn on basic auth
    * `auth_off_local`: turn off basic auth if AcraServer/AcraConnector running on same host and accessible via `localhost` or `127.0.0.1`
    * `auth_off`: turn off basic auth

* `--static_path`

  Path to static content
  Default is `cmd/acra-webconfig/static`

### Configuration files

* `--config_file=<filename>`

  Path to YAML configuration file.

* `--dump_config`

  Dump configuration to `configs/acra-server.yaml`.

* `--generate_markdown_args_table`

  Generate markdown file with text description of all flags.
  Output file is `configs/markdown_acra-server.md`.
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
After pressing `Save` button AcraServer dumps configuration to the configuration file and gracefully restarts applying all changes.
{{< /hint >}}

### AcraCensor & Zone settings

Now `acra-webconfig` doesn't support changing AcraCensor's and Zone related parameters.

![](/files/acra-webconfig/acra-webconfig-acracensor.png)