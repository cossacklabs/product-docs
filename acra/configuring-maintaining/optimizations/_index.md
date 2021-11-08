---
title: Optimizations
bookCollapseSection: true
weight: 13
---

# Optimizations

This section contains a set of specific optimizations and practices for more efficient use of Acra

## Management

* [Vertical scaling](/acra/configuring-maintaining/optimizations/vertical_scaling/)

  Describes how performance will grow with more CPU cores / memory added.

* [Horizontal scaling](/acra/configuring-maintaining/optimizations/horizontal_scaling/)

  Describes how performance will grow with instances being added.

* [TLS configuration](/acra/configuring-maintaining/optimizations/tls_configuration/)

  Contains few hints regarding TLS configuration effect on network performance.

* [Obtaining metrics](/acra/configuring-maintaining/optimizations/obtaining_metrics/)

  Contains detailed overview about metrics you can enable and collect via Prometheus.

* [Disable debug logs](/acra/configuring-maintaining/optimizations/disable_debug_logs/)

  Contains few flags that can be used for debugging purposes, but better to be disabled in production.

## Data

* [AcraStructs vs AcraBlocks](/acra/configuring-maintaining/optimizations/acrastructs_vs_acrablocks/)

  Describes difference between AcraStructs and AcraBlocks (encryption containers).

* [DB indexes](/acra/configuring-maintaining/optimizations/db_indexes/)

  Contains important notes regarding proper database indexing while having some encrypted columns.

* [LRU cache](/acra/configuring-maintaining/optimizations/lru_cache/)

  Describes which things could be cached in memory by Acra and how to enable this caching to improve performance.

## Resources

* [Connection reuse](/acra/configuring-maintaining/optimizations/connection_reuse/)

  Reminds that it is a good practice to reuse opened connections to database as much as possible.

* [Enterprise kickstart](/acra/configuring-maintaining/optimizations/enterprise_kickstart/)

  Hints that Acra Enterprise Edition performance is better and describes which troubles your team can avoid when using
  Acra Enterprise Edition.

* [Zones performance](/acra/configuring-maintaining/optimizations/zones/)

  Describes how Zones affect performance.







