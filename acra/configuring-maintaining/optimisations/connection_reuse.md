---
title: Connection reuse
weight: 6
---

# Connection reuse

Most of libraries/frameworks for work with SQL databases have a dedicated object for the connection with database.
The one you get after soccessful connetion to database with used credentials.
It is recommended to **reuse** such object as much as possible.

Reusing connections will result in lower latencies (no need to wait for connection before every SQL request).

Both Acra and the database reserve some amount of memory for every new connection.
Reusing connection will make memory pressure lower since they won't have to handle new connections so frequently.
