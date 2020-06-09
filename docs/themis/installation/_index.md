---
weight: 10
title:  Installation
bookCollapseSection: true
---

# Installing Themis

Stable versions of Themis can be conveniently installed from packages.
Non-standard installations require building Themis from the source code.

## Installing Themis from packages

The easiest way to install Themis is to use package repositories for your OS and language.
Package repositories contain stable versions of Themis,
prebuilt and packaged for the most widely-used systems.

### Server-side and desktop platforms

{{< hint info >}}
Use this installation way if your application is written in
Go, Python, Ruby, PHP, Java, JavaScript (for Node.js), Rust, C++, C.
{{< /hint>}}

Installation for server-side platforms consists of **two steps:**

 1. Install [Themis Core library](installation-from-packages)
    into the system.
 2. Install [Themis language wrapper](installation-from-packages#installing-language-wrappers)
    used by your application.

Server-side platforms can receive security updates for the core library
independently of the language wrappers.
Themis Core library is managed by the system package manager (such as APT or Yum).
The language wrapper is mananged by the language-specific package manager (such as npm or Cargo).

### Mobile and web platforms

{{< hint info >}}
Use this installation way if your application is written in
Swift, Objective-C, Java, Kotlin, JavaScript (for WebAssembly).
{{< /hint>}}

Installation for mobile platforms consists of just **one step:**

 1. Install [Themis language wrapper](installation-from-packages#installing-language-wrappers)
    used by your application.

Installation for mobile platforms (iOS, Android) and WebAssembly is easier:
just use package managed by the language-specific package manager.
Themis package for mobile and web platforms includes the Themis Core library.

## Building from the source code

If you need the latest development version of Themis or your system is not supported yet,
you can [build and install Themis from the source code](installation-from-sources).
