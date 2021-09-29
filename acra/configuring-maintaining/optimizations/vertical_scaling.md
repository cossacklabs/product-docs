---
title: Vertical scaling
weight: 1
---

# Vertical scaling

## CPU cores

When switching from one CPU core to two on AcraServer machine, the performance is roughly doubled.
So it is recommended to give AcraServer machine at least two of them.
However, every additional core will give less performance boost than the previous one.
For example, 4 cores will handle 3 times more write requests compared to single core machine.
And 8 cores will handle only 4 times more requests.

## Memory

Here are some rough estimations of memory usage based on our tests:

| vCPUs | threads* | memory |
|-------|----------|--------|
| 1     | 1        | 314M   |
| 1     | 8        | 362M   |
| 1     | 20       | 441M   |
|       |          |        |
| 2     | 1        | 223M   |
| 2     | 8        | 513M   |
| 2     | 20       | 604M   |
|       |          |        |
| 4     | 1        | 225M   |
| 4     | 8        | 563M   |
| 4     | 20       | 725M   |
|       |          |        |
| 8     | 1        | 238M   |
| 8     | 8        | 567M   |
| 8     | 20       | 746M   |

\* — number of connections handled by AcraServer in parallel,
each producing hundreds or thousands of request one after another

It is recommended to give the machine at least twice the amount you see in the table,
900M for single core machine, 1200M for dual core one and so on.
