---
weight: 10
title: "Installation"
bookCollapseSection: true
---

## Installation from package managers

The easiest way to install Themis is [to use package repositories for your OS and language](/docs/themis/installation/installation-from-packages/). Package repositories contain stable versions of Themis, prebuilt and packaged for the most widely-used systems.     

Installation for server-side platforms consists of two parts: installing Themis Core library into the system and installing Themis language wrapper to use from your application. Refer to the Installation guides for [Debian/Ubuntu](/docs/themis/installation/installation-from-packages/#debian-ubuntu), [CentOS/RHEL/OEL](/docs/themis/installation/installation-from-packages/#centos--rhel--oel), [macOS](/docs/themis/installation/installation-from-packages/#macos), [Windows](/docs/themis/installation/installation-from-packages/#windows).

Installation for mobile platforms (iOS, Android) and WebAssembly is easier: just use package manager popular on this platform. Refer to [the Installation guide](/docs/themis/installation/installation-from-packages/#installing-themis-language-wrappers-from-packages).


## Installation from sources

If you need the latest development version of Themis or your system is not supported yet, you can [build and install Themis from GitHub source code](/docs/themis/installation/installation-from-sources/).


## Availability

Themis supports the following architectures: x86/x64, armv, various Android architectures.

It is checked to compile on the latest stable versions of:

* Debian (8, 9), CentOS 7, Ubuntu (16.04, 18.04),
* macOS (10.12 – 10.15),
* Android (4 - 10) / CyanogenMod 11+,
* iOS (9 - 13),
* Windows (MSYS2, experimental feature).

We plan to expand this list with a broader set of platforms. If you'd like to help improve or bring Themis to your favourite platform / language — [get in touch](mailto:dev@cossacklabs.com).

## Languages

Themis is available for the following languages/platforms: 

| Platform | Documentation |
| :----- | :----- |
| 🔶 Swift (iOS, macOS) | [Swift Howto](/docs/themis/languages/swift/)|
| 📱 Objective-C (iOS, macOS) | [Objective-C Howto](/docs/themis/languages/objc/) |
| ☕️ Java (Desktop) | [Java Desktop Howto](/docs/themis/languages/java-desktop/)|
| ☎️ Java (Android) | [Java Android Howto](/docs/themis/languages/java-android/)|
| 📞 Kotlin (Android) | [Java Android Howto](/docs/themis/languages/kotlin-android/)|
| ♦️ Ruby | [Ruby Howto](/docs/themis/languages/ruby/) |
| 🐍 Python | [Python Howto](/docs/themis/languages/python/) |
| 🐘 PHP | [PHP Howto](/docs/themis/languages/php/) |
| ➕ C++ | [CPP Howto](/docs/themis/languages/cpp/) |
| 🍭 Node.js | [Node.js Howto](/docs/themis/languages/nodejs/) |
| 🖥 WebAssembly | [WASM Howto](/docs/themis/languages/wasm/)|
| 🐹 Go | [Go Howto](/docs/themis/languages/go/)|
| 🦀 Rust | [Rust Howto](/docs/themis/languages/rust/)|
| 🕸 С++ PNaCl for Google Chrome|[WebThemis project](https://github.com/cossacklabs/webthemis)|


## Plugins

Themis-based plugins are built to enable Themis' features across various platforms and products: 

- [RD_Themis](https://github.com/cossacklabs/rd_themis) for Redis database,
- [PG_Themis](https://github.com/cossacklabs/pg_themis) for PostgreSQL database.