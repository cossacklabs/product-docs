---
title: Zones performance
weight: 10
---

# Zones performance

{{< hint warning >}}
Zones are deprecated since 0.94.0, will be removed in 0.95.0.
{{< /hint >}}

For "key-wise" compartmentalization, each Acra's user can be mapped to a separate [Zone](/acra/security-controls/zones/). This recommendation is relevant when overall amount of users is not big and hardware resources dedicated for Acra instances are not limited.

The more Zones and Zone keys you've got, the longer it takes to scan through the database response.
