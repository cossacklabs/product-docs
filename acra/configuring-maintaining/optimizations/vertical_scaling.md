---
title: Vertical scaling
weight: 1
---

# Vertical scaling

## CPU cores

When switching from one CPU core to two on AcraServer machine, the performance is roughly doubled.
So it is recommended to give AcraServer machine at least two of them.

Acra supports parallelism well, therefore, to maintain a high level of performance,
it is recommended to increase the number of cores in accordance with the increase in
the number of parallel client connections and the overall load.
Specific values should be selected empirically by monitoring the saturation level of the system.

Dedicating CPU cores to Acra helps to reduce jitter and increase overall responsiveness, which also leads to performance gains that are noticeable under significant load.

## Memory

Here are some rough recommendations for minimum memory amount based on our tests:

![](/files/infrastructure/Recommended_minimum_RAM_for_AcraServer.png)

where:
* "connections" — number of connections handled by AcraServer in parallel
* "cores" — number of CPU cores available to AcraServer

This recommendations might be used only for an approximate calculation.
The actual use of RAM can vary depending on many factors, for example,
the nature of the load, the number and type of client keys, the type of database, etc.
