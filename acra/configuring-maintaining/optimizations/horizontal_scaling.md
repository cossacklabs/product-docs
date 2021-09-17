---
title: Horizontal scaling
weight: 2
---

# Horizontal scaling

Generally, Acra has no problems with horizontal scaling.

You will most likely want one AcraServer per one database instance.
We got [docker-compose-based demo](https://github.com/cossacklabs/acra-balancer-demo#stand--docker-composehaproxy-acra-pgsql_zonemodeyml)
with two PostgreSQL+AcraServer instances and haproxy balancer and a simple app.
