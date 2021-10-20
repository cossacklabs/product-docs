---
title: Scaling and high availability
bookCollapseSection: true
weight: 9
---

# Scaling and high availability

For each database instance, you may have as many AcraServer instances as you like.
However, there's no need bring up additional nodes if existing ones have enough CPU/memory to process all requests.
Similar thing with AcraTranslator.

On the other hand, you may want to have redundant instances:
* for unpredicted extremely high load
* for best availability of application: while machine X that hosts AcraServer/AcraTranslator is unavailable
  due to scheduled maintenance, application will switch to machine Y, resulting in some kind of 100% time availability

Read more about [horizontal scaling]({{< ref "acra/configuring-maintaining/optimizations/horizontal_scaling.md" >}})
or [vertical scaling]({{< ref "acra/configuring-maintaining/optimizations/vertical_scaling.md" >}}).
