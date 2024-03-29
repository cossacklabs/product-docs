---
title: Connection reuse
weight: 6
---

# Connection reuse

In most libraries/frameworks for working with SQL databases a connection object corresponds directly to
established and authenticated connection with the database.
You get a single connection object for every successful connection to the database with appropriate credentials.
It is recommended to **reuse** connection objects as much as possible,
typically via some sort of *connection pool*.

Reusing connections will result in lower latencies (no need to wait for connection before every SQL request).
It may also increase overall performance since less CPU time spent on connection handling
means more time can be spent on processing the requests themselves.

Both Acra and the database reserve some amount of memory for every new connection.
Reusing connections lowers the memory pressure since they won't have to handle new connections so frequently.
