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
Additional metrics registration info could be found in [`prometheus.go`](https://github.com/cossacklabs/acra-Q12021/blob/master/cmd/acra-server/common/prometheus.go) files located in `cmd` folder for each corresponded Acra component.



|                            Metric                                   |              Description                   |                                     Type                                   | 
| ------------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------- | 
|  `acra{server|translator|connector}_connections_total`              | Number of connections to database          | [`Counter`](https://prometheus.io/docs/concepts/metric_types/#counter)     | 
|  `acra{server|translator|connector}_connections_processing_seconds` | Time of connection processing              | [`Histogram`](https://prometheus.io/docs/concepts/metric_types/#histogram) |
|  `acra{server|translator}_request_processing_seconds`               | Time of request processing                 | [`Histogram`](https://prometheus.io/docs/concepts/metric_types/#histogram) |
|  `acraserver_response_processing_seconds`                           | Time of response processing                | [`Histogram`](https://prometheus.io/docs/concepts/metric_types/#histogram) |
|  `acra_api_encryptions_total`                                       | Number of encryptions data to AcraStruct   | [`Counter`](https://prometheus.io/docs/concepts/metric_types/#counter)     |
|  `acra{server|translator|connector}_version_major`                  | Major number of version                    | [`Gauge`](https://prometheus.io/docs/concepts/metric_types/#gauge)         |
|  `acra{server|translator|connector}_version_minor`                  | Minor number of version                    | [`Gauge`](https://prometheus.io/docs/concepts/metric_types/#gauge)         |
|  `acra{server|translator|connector}_version_patch`                  | Patch number of version                    | [`Gauge`](https://prometheus.io/docs/concepts/metric_types/#gauge)         |
|  `acra{server|translator|connector}_build_info`                     | Build number                               | [`Counter`](https://prometheus.io/docs/concepts/metric_types/#counter)     |



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