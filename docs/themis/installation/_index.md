---
weight: 10
title: "Installation"
bookCollapseSection: true
---

## Installation from package managers

The easiest way to install Themis is to use package repositories for your OS and language. Package repositories contain stable versions of Themis, prebuilt and packaged for the most widely-used systems.


### Installing for server-side and desktop platforms

Installation for server-side platforms **consists of two steps:** 

  - installing [Themis Core library into the system](/docs/themis/installation/installation-from-packages/),
  - installing [Themis language wrapper to use from your application](/docs/themis/installation/installation-from-packages/#installing-themis-language-wrappers-from-packages).

{{< hint info >}}
**Note:** Use this installation way if your application is written in Go, Python, Ruby, PHP, Node.js, Rust, Java desktop, C++, C.
{{< /hint>}}


### Installing for mobile platforms

Installation for mobile platforms **consists of one step:** 

  - installing [Themis language wrapper to use from your application](/docs/themis/installation/installation-from-packages/#installing-themis-language-wrappers-from-packages).

Installation for mobile platforms (iOS, Android) and WebAssembly is easier: just use package manager popular on this platform. Open to the Installation guide, select your language and follow language tutorial.


{{< hint info >}}
**Note:** Use this installation way if your application is written in Swift, Objective-C, Java Android, Kotlin Android, WebAssembly (javascript).
{{< /hint>}}

## Installation from sources

If you need the latest development version of Themis or your system is not supported yet, you can [build and install Themis from GitHub source code](/docs/themis/installation/installation-from-sources/).