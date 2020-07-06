---
weight: 2
title:  Installation
---

# Installing JsThemis

JsThemis is [available on **npm**](https://www.npmjs.com/package/jsthemis)
and can be installed with the usual `npm install`.
Additionally, Themis Core library has to be installed in your system as well.

Themis Core is available as a system package for Linux and macOS.
Usually you want to install the stable package to benefit from automatic dependency management and security updates.
However, you can also build and install the latest JsThemis from the source code.

## Installing stable version on Linux

The easiest way to install Themis on Linux is to use package repositories for your system.
We build packages for a multitude of Linux distributions.

 1. [Add Cossack Labs package repositories](/themis/installation/installation-from-packages/)
    to your system.

 2. Install Themis Core _development_ package.

    For Debian, Ubuntu:

    ```bash
    sudo apt install libthemis-dev
    ```

    For CentOS, RHEL:

    ```bash
    sudo yum install libthemis-devel
    ```

3. Install JsThemis via npm for your project:

    ```bash
    npm install jsthemis
    ```

Once JsThemis is installed, you can [try out code examples](../examples/).

## Installing stable version on macOS

The easiest way to install Themis on macOS is to use Homebrew.

 1. Add Cossack Labs tap to your system:

    ```bash
    brew tap cossacklabs/tap
    ```

 2. Install Themis Core package:

    ```bash
    brew install libthemis
    ```

 3. Install JsThemis via npm for your project:

    ```bash
    npm install jsthemis
    ```

Once JsThemis is installed, you can [try out code examples](../examples/).

## Building latest version from source

If the stable package version does not suit your needs,
you can manually build and install the latest version of Themis from source code.

 1. [Build and install Themis Core library](/themis/installation/installation-from-sources/)
    into your system.

 2. Build JsThemis package from the source code:

    ```bash
    make jsthemis
    ```

    The resulting package will be placed into `build/jsthemis.tgz`
    in Themis source tree.

 3. Install JsThemis via npm for your project:

    ```bash
    npm install /path/to/jsthemis.tgz
    ```
