---
weight: 2
title:  Installation
---

# Installing RustThemis

RustThemis is [available on **crates.io**](https://crates.io/crates/themis).
Additionally, Themis Core library has to be installed in your system as well.

Themis Core is available as a system package for Linux and macOS.
Usually you want to install the stable package to benefit from automatic dependency management and security updates.
However, you can also build and install the latest RustThemis from the source code.

{{< hint info >}}
RustThemis uses **pkg-config** to locate Themis Core, if available.
It is an optional but highly recommended dependency.
{{< /hint >}}

## Installing stable version on Linux

The easiest way to install Themis on Linux is to use package repositories for your system.
We build packages for a multitude of Linux distributions.

 1. [Add Cossack Labs package repositories](/docs/themis/installation/installation-from-packages)
    to your system.

 2. Install Themis Core _development_ package.

    For Debian, Ubuntu:

    ```bash
    sudo apt install libthemis-dev pkg-config
    ```

    For CentOS, RHEL:

    ```bash
    sudo yum install libthemis-devel pkgconfig
    ```

 3. Add the following lines to your `Cargo.toml` file:

    ```
    [dependencies]
    themis = "0.13.0"
    ```

Once Themis Core is installed, you can [try out code examples](../examples).

## Installing stable version on macOS

The easiest way to install Themis on macOS is to use Homebrew.

 1. Add Cossack Labs tap to your system:

    ```bash
    brew tap cossacklabs/tap
    ```

 2. Install Themis Core package:

    ```bash
    brew install libthemis pkg-config
    ```

 3. Add the following lines to your `Cargo.toml` file:

    ```
    [dependencies]
    themis = "0.13.0"
    ```

Once Themis Core is installed, you can [try out code examples](../examples).

## Building latest version from source

If the stable package version does not suit your needs,
you can manually build and install the latest version of Themis from source code.

 1. [Build and install Themis Core library](/docs/themis/installation/installation-from-sources)
    into your system.

 2. Add the following lines to your `Cargo.toml` file:

    ```
    [dependencies]
    themis = { path = "/path/to/themis-source-root" }
    ```
