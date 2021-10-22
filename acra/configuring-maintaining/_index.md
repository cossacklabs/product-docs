---
title: Configuring & maintaining
bookCollapseSection: true
weight: 6
---

# Configuring & maintaining

This page is generally for Ops team, or anybody else who's job is to make things work together.

* [Installation]({{< ref "installing">}})
  describes requirements and installation process from repos or from sources
* [General configuration]({{< ref "general-configuration">}})
  contains list of all Acra binaries, their flags/subcommands, additional hints about configuration
* [Controls configuration on AcraServer]({{< ref "controls-configuration-on-acraserver">}}) and
  [Controls configuration on AcraTranslator]({{< ref "controls-configuration-on-acratranslator">}}) are
  about security controls provided by AcraServer/AcraTranslator respectively, what are they used for, how to enable/configure
* [TLS]({{< ref "tls" >}})
  is about TLS-specific things, like how you can generate a certificate, make Acra additionally validate them
* [Key storing]({{< ref "key-storing" >}})
  is about storage and distribution of different cryptographic keys in your infrastructure,
  also telling how to configure Acra to use the proper storage
* [Policies]({{< ref "policies-enterprise" >}}) —
  enterprise feature for more flexible control over Acra behavior compared to usual configuration
* [Storage and data model implications]({{< ref "storage-and-data-model-implications" >}})
  lists things you should take into account before integrating Acra into your ecosystem
* [Logging]({{< ref "logging" >}})
  describes logging capabilities of Acra services and how to configure it
* [Metrics]({{< ref "metrics" >}})
  is about metrics you can collect with Prometheus, how to configure, and what they mean
* [Tracing]({{< ref "tracing" >}})
  lists existing traces you can export to Jaeger to analyze performance of some operations
* [Debugging and troubleshooting]({{< ref "debugging-and-troubleshooting">}})
  shows what you can do to get more information about what's happening to find out the cause of problem you've encountered
* [Optimizations]({{< ref "optimizations" >}})
  lists tips that may help you improve overall performance
