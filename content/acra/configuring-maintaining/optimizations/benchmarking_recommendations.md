---
title: Benchmarking recommendations
weight: 2
---

# Benchmarking recommendations

It may be quite easy to end up making wrong conclusions about performance bottleneck after running benchmarks.
Here are some recommendations to take into account when measuring performance with Acra:

* Make sure you created all needed indexes in a database
  (for encrypted columns, see [searchable encryption](/acra/security-controls/searchable-encryption/)).
* Make sure you [reuse connections to AcraServer](/acra/configuring-maintaining/optimizations/connection_reuse/),
  otherwise the application will spend a lot of time just waiting for the connection to be created
  (this also creates additional load on both AcraServer and the database,
  so frequent new connections will cause fewer requests processed per second).
* If load of any other component (database, application, etc.) is near 100%,
  then you are actually benchmarking something else, and not the AcraServer,
  make sure other components have enough resources.
* If network channel between application and AcraServer or AcraServer and database is fully loaded,
  you are benchmarking the network, consider upgrading the infrastructure.
* Be sure you do not have any problems with your network stack:
  drops, significant latencies and/or jitter, cache overflow, MTU or fragmentation issues.
