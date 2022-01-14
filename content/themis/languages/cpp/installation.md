---
weight: 2
title: "C++ installation"
---

# Installing ThemisPP

ThemisPP is available as a system package for Linux and macOS.
Usually you want to install the stable package to benefit from automatic dependency management and security updates.
However, you can also build and install the latest ThemisPP from the source code.

## Installing stable version on Linux

The easiest way to install ThemisPP on Linux is to use package repositories for your system.
We build packages for a multitude of Linux distributions.

 1. [Add Cossack Labs package repositories](/themis/installation/installation-from-packages/)
    to your system.

 2. Install ThemisPP package.

    For Debian, Ubuntu:

    ```bash
    sudo apt install libthemispp-dev
    ```

    For CentOS, RHEL:

    ```bash
    sudo yum install libthemispp-devel
    ```

Once ThemisPP is installed, you can [try out code examples](../examples/).

## Installing stable version on macOS

The easiest way to install ThemisPP on macOS is to use Homebrew.

 1. Add Cossack Labs tap to your system:

    ```bash
    brew tap cossacklabs/tap
    ```

 2. Install ThemisPP package:

    ```bash
    brew install libthemis --with-cpp
    ```

Once ThemisPP is installed, you can [try out code examples](../examples/).

## Building latest version from source

If the stable package version does not suit your needs,
you can manually build and install the latest version of Themis from source code.

 1. [Build and install Themis Core library](/themis/installation/installation-from-sources/)
    into your system.

 2. Install ThemisPP from the source code:

    ```bash
    make themispp_install
    ```

    ThemisPP will be installed globally into the system.

ThemisPP is a _header-only_ library.
Instead of installing it into your system,
you can just copy the header files to your project and tell the compiler about them.
You need to copy the following directory:
[`src/wrappers/themis/themispp`](https://github.com/cossacklabs/themis/tree/master/src/wrappers/themis/themispp)
(in its entirety).
