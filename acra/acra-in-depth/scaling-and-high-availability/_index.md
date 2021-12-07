---
title: Scaling and high availability
weight: 9
---

# Scaling and high availability

For each database instance, you may have as many AcraServer instances as you like.
However, there's no need to bring up additional nodes if existing ones have enough CPU/memory to process all requests.
Same for AcraTranslator.

On the other hand, you may want to have redundant instances:
* for extremal unpredicted high loads;
* to preserve better application's availability: while machine X that hosts AcraServer/AcraTranslator is unavailable
  due to scheduled maintenance, application will switch to machine Y, resulting in some kind of 100% time availability.

Read more about [horizontal scaling](/acra/configuring-maintaining/optimizations/horizontal_scaling)
or [vertical scaling](/acra/configuring-maintaining/optimizations/vertical_scaling).
