---
title: Getting started
weight: 3
bookCollapseSection: true
---

# Getting started

To see [Hermes-core](https://github.com/cossacklabs/hermes-core/) working, you need to perform the following actions.

## Installing or building Hermes-core

You can build it manually from source, or install from the available package manager.

* If you are running Ubuntu, Debian or CentOS, check [Installing from repository](/hermes/getting-started/installing/hermes-from-repository/).
* If you want to have the latest version of Hermes-core, you can build it from sources: [Building Hermes core](/hermes/getting-started/installing/building-hermes/).

## Languages

Hermes-core is available on C, however, client side applications are implemented on C, Python and Go:

| Platform | Tutorial | Code example |
| -------- | -------- | ------------ |
| C core / C client | [Local CLI tutorial](https://github.com/cossacklabs/hermes-core/wiki/Local-CLI-example) | [docs/examples/c/mid_hermes_low_level](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c/mid_hermes_low_level) |
| C core / C client | 	[C tutorial](/hermes/guides/c-tutorial/) | 	[docs/examples/c](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/c) |
| C core / Python client | [Python tutorial](/hermes/guides/python-tutorial/) | [docs/examples/python](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/python) |
| C core / Go client | 	[Go tutorial](/hermes/guides/go-tutorial/) | [docs/examples/go](https://github.com/cossacklabs/hermes-core/tree/master/docs/examples/go) |

Moreover, Hermes natively supports:

| Server side | Client side (languages) |
| ----------- | ---------------------- |
| Docker, VMs, GCP, AWS, Ubuntu, Debian, CentOS, macOS | iOS, Android, Java, Ruby, PHP, Python, Node.js, Go, Rust, C/C++ |

## Availability

[Hermes itself](https://www.cossacklabs.com/hermes/) supports the following architectures: x86x64, armv\*, various Android architectures:

* Debian (8, 9), CentOS 7, Ubuntu (14.04, 16.04, 18.04),
* macOS (10.12 - 10.15, 11),
* Android (6 - 12) / CyanogenMod 11+,
* iOS (12 - 15),
* Docker-containers, VMs.

Hermes-core has limited support, only x86/x64 platforms.


## Running examples

[Usage examples](/hermes/getting-started/installing/building-example/) describe how examples work and what are possible usages for Hermes-core.


## High-level tutorials

Consider checking out full tutorials to understand how to add and update blocks, grant READ and UPDATE access right for users, revoke access rights.

* [C tutorial](/hermes/guides/c-tutorial/), where both Hermes and client app are written in C.
* [Python tutorial](/hermes/guides/python-tutorial/), where Hermes app is C-based, but client code runs on Python.
* [Go tutorial](/hermes/guides/go-tutorial/), where Hermes app is C-based, but client code runs on Go.


## The next steps

As your next steps towards exploring Hermes-core, we advise you to:

* study the [source code](https://github.com/cossacklabs/hermes-core) and the [architectural overview](/hermes/hermes-in-depth/architecture/),
* find out [how things work](/hermes/hermes-in-depth/),
* read a more in-depth overview of the [examples](/hermes/getting-started/installing/building-example/),
* simply [read the docs](/hermes/),
* go deeper and read [Hermes – a framework for cryptographically assured access control and data security](https://www.cossacklabs.com/files/hermes-theory-paper-rev1.pdf) theoretical paper as well as the implementation-oriented document [Implementing Hermes-based Security Systems](https://www.cossacklabs.com/hermes/implementing-hermes-based-systems/).