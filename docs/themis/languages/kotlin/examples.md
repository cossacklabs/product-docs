---
weight: 4
title:  Examples
---

# Example projects with JavaThemis

{{< hint info >}}
JavaThemis is implemented in Java and provides Kotlin API via JVM interop.
Kotlin support is currently in development
so some examples may be available only in Java.
{{< /hint >}}

[Themis Java examples](https://github.com/cossacklabs/themis-java-examples)
illustrate how to integrate JavaThemis into Android and desktop Java projects
and how JavaThemis API can be used:

  - encrypt data with Secure Cell
  - exchange messages with Secure Message
  - establish connections with Secure Session

[Themis Server examples](https://github.com/cossacklabs/themis/tree/master/docs/examples/Themis-server/java)
can be used with [Themis Interactive Simulator](https://docs.cossacklabs.com/simulator/interactive/):
you can generate the keys and simulate whole client-server communication.
Read more in the [Themis Server guide](/docs/themis/debugging/themis-server).

You can read our blog post on [building encrypted chat service](https://www.cossacklabs.com/building-secure-chat),
which includes Android client using Secure Session and Secure Cell.

You can also take a look at unit tests in [JavaThemis source code](https://github.com/cossacklabs/themis/tree/master/tests/themis/wrappers/android/com/cossacklabs/themis/test).

[Read the feature guide](../features)
in order to learn how to use JavaThemis effectively.
