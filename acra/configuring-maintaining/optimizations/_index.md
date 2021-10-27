---
title: Optimizations
bookCollapseSection: true
weight: 13
---

# Optimizations

[Vertical scaling](/acra/configuring-maintaining/optimizations/vertical_scaling/)
describes how performance will grow with more CPU cores / memory added.

[Horizontal scaling](/acra/configuring-maintaining/optimizations/horizontal_scaling/)
describes how performance will grow with instances being added.

[AcraStructs vs AcraBlocks](/acra/configuring-maintaining/optimizations/acrastructs_vs_acrablocks/)
describes difference between AcraStructs and AcraBlocks (encryption containers).

[DB indexes](/acra/configuring-maintaining/optimizations/db_indexes/)
contains important notes regarding proper database indexing while having some encrypted columns.

[TLS configuration](/acra/configuring-maintaining/optimizations/tls_configuration/)
contains few hints regarding TLS configuration effect on network performance.

[Connection reuse](/acra/configuring-maintaining/optimizations/connection_reuse/)
reminds that it is a good practice to reuse opened connections to database as much as possible.

[Disable debug logs](/acra/configuring-maintaining/optimizations/disable_debug_logs/)
contains few flags that can be used for debugging purposes, but better to be disabled in production.

[LRU cache](/acra/configuring-maintaining/optimizations/lru_cache/)
describes which things could be cached in memory by Acra and how to enable this caching to improve performance.

[Obtaining metrics](/acra/configuring-maintaining/optimizations/obtaining_metrics/)
is about metrics you can enable and collect (Prometheus).

[Zones performance](/acra/configuring-maintaining/optimizations/zones/) describes how Zones affect performance.

[Enterprise kickstart](/acra/configuring-maintaining/optimizations/enterprise_kickstart/) hints that Acra Enterprise Edition performance is better and describes what much troubles your team can avoid when using Acra Enterprise Edition.