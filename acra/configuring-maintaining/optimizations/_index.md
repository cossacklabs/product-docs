---
title: Optimizations
bookCollapseSection: true
---

[Vertical scaling]({{< ref "acra/configuring-maintaining/optimizations/vertical_scaling.md" >}})
describes how performance will grow with more CPU cores / memory added

[Horizontal scaling]({{< ref "acra/configuring-maintaining/optimizations/horizontal_scaling.md" >}})
describes how performance will grow with instances being added

[AcraStructs vs AcraBlocks]({{< ref "acra/configuring-maintaining/optimizations/acrastructs_vs_acrablocks.md" >}})
describes difference between AcraStructs and AcraBlocks (two possible "containers" for encrypted data)

[DB indexes]({{< ref "acra/configuring-maintaining/optimizations/db_indexes.md" >}})
contains few important notes regarding proper indexing while having some encrypted columns

[TLS configuration]({{< ref "acra/configuring-maintaining/optimizations/tls_configuration.md" >}})
contains few hints regarding TLS configuration effect on network performance

[Connection reuse]({{< ref "acra/configuring-maintaining/optimizations/connection_reuse.md" >}})
reminds that it is a good practice to reuse opened connections to database as much as possible

[Disable debug logs]({{< ref "acra/configuring-maintaining/optimizations/disable_debug_logs.md" >}})
contains few flags that can be used for debugging purposes, but better to be disabled in production

[LRU cache]({{< ref "acra/configuring-maintaining/optimizations/lru_cache.md" >}})
describes which things could be cached in memory by Acra and how to enable this caching to improve performance

[Obtaining metrics]({{< ref "acra/configuring-maintaining/optimizations/obtaining_metrics.md" >}})
is about metrics you can enable and collect (Prometheus)
