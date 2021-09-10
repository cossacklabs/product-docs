---

weight: 1
title: Metrics
bookCollapseSection: true
---

# Metrics in Acra

Starting with version [`0.83.0`](https://github.com/cossacklabs/acra/releases/tag/0.83.0), Acra supports tracking and exporting of the basic metrics of AcraServer, AcraConnector, and AcraTranslator to [` Prometheus`](https://prometheus.io/).


## Metrics configuration

### Command line flags

* `--incoming_connection_prometheus_metrics_string=<url>`

  URL (tcp://host:port) which will be used to expose Prometheus metrics (`<URL>/metrics` address to pull metrics).


### Exposed metrics

Acra can expose standard set of metric [`types`](https://prometheus.io/docs/concepts/metric_types/) for AcraServer, AcraConnector, and AcraTranslator. 
Additional metrics registration info could be found in [`prometheus.go`](https://github.com/cossacklabs/acra/blob/master/cmd/acra-server/common/prometheus.go) files located in `cmd` folder for each corresponded Acra component.


1. **Metric**: *acra{server|translator|connector}_connections_total*

   **Description**: Number of connections to database

   **Type**: [`Counter`](https://prometheus.io/docs/concepts/metric_types/#counter)

   **Labels**: `connection_type`

2. **Metric**: *acra{server|translator|connector}_connections_processing_seconds*

   **Description**: Time of connection processing

   **Type**: [`Histogram`](https://prometheus.io/docs/concepts/metric_types/#histogram)

   **Labels**: `connection_type`

   **Buckets**: 0.1, 0.2, 0.5, 1, 10, 60, 3600, 86400

3. **Metric**: *acra{server|translator}_request_processing_seconds*

   **Description**: Time of request processing

   **Type**: [`Histogram`](https://prometheus.io/docs/concepts/metric_types/#histogram)

   **Labels**:
   - acraserver: `db`
   - acratranslator: `request_type`, `operation`

   **Buckets**: 0.000001, 0.00001, 0.00002, 0.00003, 0.00004, 0.00005, 0.00006, 0.00007, 0.00008, 0.00009, 0.0001, 0.0005, 0.001, 0.005, 0.01, 1, 3, 5, 10

4. **Metric**: *acraserver_response_processing_seconds*

   **Description**: Time of response processing

   **Type**: [`Histogram`](https://prometheus.io/docs/concepts/metric_types/#histogram)

   **Labels**: `db`, `mode`

   **Buckets**: 0.000001, 0.00001, 0.00002, 0.00003, 0.00004, 0.00005, 0.00006, 0.00007, 0.00008, 0.00009, 0.0001, 0.0005, 0.001, 0.005, 0.01, 1, 3, 5, 10

5. **Metric**: *acra_api_encryptions_total*

   **Description**: Number of encryptions data to AcraStruct

   **Type**: [`Counter`](https://prometheus.io/docs/concepts/metric_types/#counter)

   **Labels**: `status`

6. **Metric**: *acra_acrastruct_decryptions_total*

    **Description**: Number of AcraStruct decryptions

    **Type**: [`Counter`](https://prometheus.io/docs/concepts/metric_types/#counter)

    **Labels**: `status`

7. **Metric**: *acra{server|translator|connector}_version_major*

   **Description**: Major number of version

   **Type**: [`Gauge`](https://prometheus.io/docs/concepts/metric_types/#gauge)

8. **Metric**: *acra{server|translator|connector}_version_minor*

   **Description**: Minor number of version

   **Type**: [`Gauge`](https://prometheus.io/docs/concepts/metric_types/#gauge)

9. **Metric**: *acra{server|translator|connector}_version_patch*

   **Description**: Patch number of version

   **Type**: [`Gauge`](https://prometheus.io/docs/concepts/metric_types/#gauge)

10. **Metric**: *acra{server|translator|connector}_build_info*

    **Description**: Build number

    **Type**: [`Counter`](https://prometheus.io/docs/concepts/metric_types/#counter)

    **Labels**: `edition`, `version`


### Metrics example

```
acraserver_build_info{edition="ee",version="0.85.0"} 1
# HELP acraserver_connections_processing_seconds Time of connection processing
# TYPE acraserver_connections_processing_seconds histogram
acraserver_connections_processing_seconds_bucket{connection_type="db",le="0.1"} 0
acraserver_connections_processing_seconds_bucket{connection_type="db",le="0.2"} 0
acraserver_connections_processing_seconds_bucket{connection_type="db",le="0.5"} 0
acraserver_connections_processing_seconds_bucket{connection_type="db",le="1"} 0
acraserver_connections_processing_seconds_bucket{connection_type="db",le="10"} 0
acraserver_connections_processing_seconds_bucket{connection_type="db",le="60"} 0
acraserver_connections_processing_seconds_bucket{connection_type="db",le="3600"} 1881
acraserver_connections_processing_seconds_bucket{connection_type="db",le="86400"} 1881
acraserver_connections_processing_seconds_bucket{connection_type="db",le="+Inf"} 1881
acraserver_connections_processing_seconds_sum{connection_type="db"} 3.3436777324352157e+06
acraserver_connections_processing_seconds_count{connection_type="db"} 1881
# HELP acraserver_connections_total number of connections to database
# TYPE acraserver_connections_total counter
acraserver_connections_total{connection_type="db"} 1901
# HELP acraserver_request_processing_seconds Time of response processing
# TYPE acraserver_request_processing_seconds histogram
acraserver_request_processing_seconds_bucket{db="mysql",le="1e-06"} 0
acraserver_request_processing_seconds_bucket{db="mysql",le="1e-05"} 0
acraserver_request_processing_seconds_bucket{db="mysql",le="2e-05"} 0
```



{{< hint info >}}
**Note:**
The [engineering examples](https://github.com/cossacklabs/acra-engineering-demo/) illustrate collecting and displaying metrics through the integration of Acra-protected infrastructure with [` Prometheus`](https://prometheus.io/) and [` Grafana`](https://grafana.com/grafana/dashboards) dashboards.
{{< /hint >}}