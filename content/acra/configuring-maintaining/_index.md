---
title: Configuring & maintaining
bookCollapseSection: true
weight: 6
---

# Configuring & maintaining

This page is generally for Ops team, or anybody else who's job is to make things work together.

* [Installation](/acra/getting-started/installing/)
  describes requirements and installation process using pre-built packages, Docker images or from sources.
* [General configuration](/acra/configuring-maintaining/general-configuration/)
  contains list of all Acra binaries, their flags/subcommands, additional hints about configuration.
* [Controls configuration on AcraServer](/acra/configuring-maintaining/controls-configuration-on-acraserver/) and
  [Controls configuration on AcraTranslator](/acra/configuring-maintaining/controls-configuration-on-acratranslator/)
  are about configuring of particular security controls provided by AcraServer/AcraTranslator respectively.
* [TLS](/acra/configuring-maintaining/tls/)
  is about TLS-specific things, how to enable/configure TLS for each Acra service along with an additional CRL/OCSP validations.
* [Key storing](/acra/configuring-maintaining/key-storing/)
  is about different cryptographic keys storing and distributing over your infrastructure, and configuring Acra to use the proper storage.
* [Policies](/acra/configuring-maintaining/policies-enterprise/) —
  enterprise feature that provides more flexible control over Acra's behavior compared with usual configuration.
* [Storage and data model implications](/acra/configuring-maintaining/storage-and-data-model-implications/)
  lists things you should take into account before integrating Acra into your ecosystem.
* [Logging](/acra/configuring-maintaining/logging/)
  describes logging capabilities of Acra services and how to configure it.
* [Metrics](/acra/configuring-maintaining/metrics/)
  is about metrics you can collect with Prometheus, their meaning and configuration.
* [Tracing](/acra/configuring-maintaining/tracing/)
  lists existing traces you can export to Jaeger to analyze performance of some operations.
* [Debugging and troubleshooting](/acra/configuring-maintaining/debugging-and-troubleshooting/)
  shows what you can do to get more information about what's happening with Acra services to find out the cause of problem you've encountered.
* [Optimizations](/acra/configuring-maintaining/optimizations/) 
  lists tips that may help you improve overall performance.
