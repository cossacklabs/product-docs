---
title: Configuring & maintaining
bookCollapseSection: true
weight: 6
---

# Configuring & maintaining

This page is generally for Ops team, or anybody else who's job is to make things work together.

* [Installation](/acra/getting-started/installing/)
  describes requirements and installation process from repos or from sources.
* [General configuration](/acra/configuring-maintaining/general-configuration/)
  contains list of all Acra binaries, their flags/subcommands, additional hints about configuration.
* [Controls configuration on AcraServer](/acra/configuring-maintaining/controls-configuration-on-acraserver/) and
  [Controls configuration on AcraTranslator](/acra/configuring-maintaining/controls-configuration-on-acratranslator/) are
  about security controls provided by AcraServer/AcraTranslator respectively, what are they used for, how to enable/configure.
* [TLS](/acra/configuring-maintaining/tls/)
  is about TLS-specific things, like how you can generate a certificate, make Acra additionally validate them.
* [Key storing](/acra/configuring-maintaining/key-storing/)
  is about storage and distribution of different cryptographic keys in your infrastructure,
  also telling how to configure Acra to use the proper storage.
* [Policies](/acra/configuring-maintaining/policies-enterprise/) —
  enterprise feature for more flexible control over Acra behavior compared to usual configuration.
* [Storage and data model implications](/acra/configuring-maintaining/storage-and-data-model-implications/)
  lists things you should take into account before integrating Acra into your ecosystem.
* [Logging](/acra/configuring-maintaining/logging/)
  describes logging capabilities of Acra services and how to configure it.
* [Metrics](/acra/configuring-maintaining/metrics/)
  is about metrics you can collect with Prometheus, how to configure, and what they mean.
* [Tracing](/acra/configuring-maintaining/tracing/)
  lists existing traces you can export to Jaeger to analyze performance of some operations.
* [Debugging and troubleshooting](/acra/configuring-maintaining/debugging-and-troubleshooting/)
  shows what you can do to get more information about what's happening to find out the cause of problem you've encountered.
* [Optimizations](/acra/configuring-maintaining/optimizations/) 
  lists tips that may help you improve overall performance.
