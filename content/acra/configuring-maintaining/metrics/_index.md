---
weight: 10
title: Metrics
---

# Metrics in Acra

Starting from version [`0.83.0`](https://github.com/cossacklabs/acra/releases/tag/0.83.0), Acra supports tracking and exporting of the basic metrics of AcraServer, AcraConnector, and AcraTranslator to [` Prometheus`](https://prometheus.io/).


## Metrics configuration

### Command line flags

* `--incoming_connection_prometheus_metrics_string=<url>`

  URL (`tcp://host:port`) which will be used to expose Prometheus metrics (`<URL>/metrics` address to pull metrics).


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

5. **Metric**: *acra_api_encryptions_total* (Deprecated since 0.94.0)

   **Description**: Number of data encryption operations (AcraStruct creations) performed

   **Type**: [`Counter`](https://prometheus.io/docs/concepts/metric_types/#counter)

   **Labels**: `status`

6. **Metric**: *acra_acrastruct_decryptions_total* (Deprecated since 0.94.0)

    **Description**: Number of AcraStruct decryption operations performed

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

11. **Metric**: *acra_decryptions_total* (Available since 0.94.0)

    **Description**: Number of decryptions AcraStruct/AcraBlock

    **Type**: [`Counter`](https://prometheus.io/docs/concepts/metric_types/#counter)

    **Labels**: `status`, `type`

12. **Metric**: *acra_encryptions_total* (Available since 0.94.0)

    **Description**: Number of encryptions AcraStruct/AcraBlock

    **Type**: [`Counter`](https://prometheus.io/docs/concepts/metric_types/#counter)

    **Labels**: `status`, `type`

13. **Metric**: *acra_tokenizations_total* (Available since 0.94.0)

    **Description**: Number of tokenizations for token_type

    **Type**: [`Counter`](https://prometheus.io/docs/concepts/metric_types/#counter)

    **Labels**: `status`, `token_type`

14. **Metric**: *acra_detokenizations_total* (Available since 0.94.0)

    **Description**: Number of detokenizations for token_type

    **Type**: [`Counter`](https://prometheus.io/docs/concepts/metric_types/#counter)

    **Labels**: `status`, `token_type`

### Metrics example


#### AcraServer

```
 HELP acra_acrastruct_decryptions_total number of AcraStruct decryptions
# TYPE acra_acrastruct_decryptions_total counter
acra_acrastruct_decryptions_total{status="success"} 40
# HELP acraserver_build_info 
# TYPE acraserver_build_info counter
acraserver_build_info{edition="ee",version="0.85.0"} 1
# HELP acraserver_connections_processing_seconds Time of connection processing
# TYPE acraserver_connections_processing_seconds histogram
acraserver_connections_processing_seconds_bucket{connection_type="db",le="0.1"} 0
acraserver_connections_processing_seconds_bucket{connection_type="db",le="0.2"} 0
acraserver_connections_processing_seconds_bucket{connection_type="db",le="0.5"} 0
acraserver_connections_processing_seconds_bucket{connection_type="db",le="1"} 0
acraserver_connections_processing_seconds_bucket{connection_type="db",le="10"} 0
acraserver_connections_processing_seconds_bucket{connection_type="db",le="60"} 0
acraserver_connections_processing_seconds_bucket{connection_type="db",le="3600"} 2
acraserver_connections_processing_seconds_bucket{connection_type="db",le="86400"} 2
acraserver_connections_processing_seconds_bucket{connection_type="db",le="+Inf"} 2
acraserver_connections_processing_seconds_sum{connection_type="db"} 647.696587508
acraserver_connections_processing_seconds_count{connection_type="db"} 2
# HELP acraserver_connections_total number of connections to database
# TYPE acraserver_connections_total counter
acraserver_connections_total{connection_type="db"} 2
# HELP acraserver_request_processing_seconds Time of response processing
# TYPE acraserver_request_processing_seconds histogram
acraserver_request_processing_seconds_bucket{db="mysql",le="0.0001"} 6
acraserver_request_processing_seconds_bucket{db="mysql",le="0.0005"} 35
acraserver_request_processing_seconds_bucket{db="mysql",le="0.001"} 39
acraserver_request_processing_seconds_bucket{db="mysql",le="0.005"} 39
acraserver_request_processing_seconds_bucket{db="mysql",le="0.01"} 39
acraserver_request_processing_seconds_bucket{db="mysql",le="1"} 40
acraserver_request_processing_seconds_bucket{db="mysql",le="3"} 40
acraserver_request_processing_seconds_bucket{db="mysql",le="5"} 40
acraserver_request_processing_seconds_bucket{db="mysql",le="10"} 40
acraserver_request_processing_seconds_bucket{db="mysql",le="+Inf"} 40
acraserver_request_processing_seconds_sum{db="mysql"} 0.054349582
acraserver_request_processing_seconds_count{db="mysql"} 40
```

#### AcraConnector

```
# HELP acraconnector_build_info 
# TYPE acraconnector_build_info counter
acraconnector_build_info{edition="ce",version="0.85.0"} 1
# HELP acraconnector_connections_processing_seconds Time of connection processing
# TYPE acraconnector_connections_processing_seconds histogram
acraconnector_connections_processing_seconds_bucket{connection_type="db",le="0.1"} 0
acraconnector_connections_processing_seconds_bucket{connection_type="db",le="0.2"} 0
acraconnector_connections_processing_seconds_bucket{connection_type="db",le="0.5"} 0
acraconnector_connections_processing_seconds_bucket{connection_type="db",le="1"} 0
acraconnector_connections_processing_seconds_bucket{connection_type="db",le="10"} 0
acraconnector_connections_processing_seconds_bucket{connection_type="db",le="60"} 0
acraconnector_connections_processing_seconds_bucket{connection_type="db",le="3600"} 2
acraconnector_connections_processing_seconds_bucket{connection_type="db",le="86400"} 2
acraconnector_connections_processing_seconds_bucket{connection_type="db",le="+Inf"} 2
acraconnector_connections_processing_seconds_sum{connection_type="db"} 647.694854604
acraconnector_connections_processing_seconds_count{connection_type="db"} 2
# HELP acraconnector_connections_total number of connections to database
# TYPE acraconnector_connections_total counter
acraconnector_connections_total{connection_type="db"} 2
# HELP acraconnector_version_major Major number of version
# TYPE acraconnector_version_major gauge
acraconnector_version_major 0
# HELP acraconnector_version_minor Minor number of version
# TYPE acraconnector_version_minor gauge
acraconnector_version_minor 85
```

#### AcraTranslator

```
# HELP acratranslator_build_info 
# TYPE acratranslator_build_info counter
acratranslator_build_info{edition="ce",version="0.85.0"} 1
# HELP acratranslator_version_major Major number of version
# TYPE acratranslator_version_major gauge
acratranslator_version_major 0
# HELP acratranslator_version_minor Minor number of version
# TYPE acratranslator_version_minor gauge
acratranslator_version_minor 85
# HELP acratranslator_version_patch Patch number of version
# TYPE acratranslator_version_patch gauge
acratranslator_version_patch 0
# HELP go_gc_duration_seconds A summary of the pause duration of garbage collection cycles.
# TYPE go_gc_duration_seconds summary
go_gc_duration_seconds{quantile="0"} 0.00020384
go_gc_duration_seconds{quantile="0.25"} 0.000208173
go_gc_duration_seconds{quantile="0.5"} 0.000216844
go_gc_duration_seconds{quantile="0.75"} 0.000687777
go_gc_duration_seconds{quantile="1"} 0.000687777
go_gc_duration_seconds_sum 0.001316634
go_gc_duration_seconds_count 4
# HELP go_goroutines Number of goroutines that currently exist.
# TYPE go_goroutines gauge
go_goroutines 13
# HELP go_info Information about the Go environment.
# TYPE go_info gauge
go_info{version="go1.15.6"} 1
# HELP go_memstats_alloc_bytes Number of bytes allocated and still in use.
# TYPE go_memstats_alloc_bytes gauge
go_memstats_alloc_bytes 1.223896e+07
# HELP go_memstats_alloc_bytes_total Total number of bytes allocated, even if freed.
# TYPE go_memstats_alloc_bytes_total counter
go_memstats_alloc_bytes_total 1.8350904e+07
# HELP go_memstats_buck_hash_sys_bytes Number of bytes used by the profiling bucket hash table.
# TYPE go_memstats_buck_hash_sys_bytes gauge
go_memstats_buck_hash_sys_bytes 1.451433e+06
# HELP go_memstats_frees_total Total number of frees.
# TYPE go_memstats_frees_total counter
go_memstats_frees_total 55487
# HELP go_memstats_gc_cpu_fraction The fraction of this program's available CPU time used by the GC since the program started.
# TYPE go_memstats_gc_cpu_fraction gauge
```

{{< hint info >}}
**Note:**
The [engineering examples](https://github.com/cossacklabs/acra-engineering-demo/) illustrate collecting and displaying metrics through the integration of Acra-protected infrastructure with [` Prometheus`](https://prometheus.io/) and [` Grafana`](https://grafana.com/grafana/dashboards) dashboards.
{{< /hint >}}
