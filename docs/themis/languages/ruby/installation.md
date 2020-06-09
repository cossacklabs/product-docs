---
weight: 2
title:  Installation
---

# Installing RbThemis

RbThemis is [available on **RubyGems**](https://rubygems.org/gems/rbthemis)
and can be installed with the usual `gem install`.
Additionally, Themis Core library has to be installed in your system as well.

Themis Core is available as a system package for Linux and macOS.
Usually you want to install the stable package to benefit from automatic dependency management and security updates.
However, you can also build and install the latest RbThemis from the source code.

## Installing stable version on Linux

The easiest way to install Themis on Linux is to use package repositories for your system.
We build packages for a multitude of Linux distributions.

 1. [Add Cossack Labs package repositories](/docs/themis/installation/installation-from-packages)
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

 3. Install RbThemis via RubyGems:

    ```bash
    gem install rbthemis
    ```

    You may need `sudo` for global installation,
    if you are not using virtual environments.

Once RbThemis is installed, you can [try out code examples](../examples).

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

 3. Install RbThemis via RubyGems:

    ```bash
    gem install rbthemis
    ```

Once RbThemis is installed, you can [try out code examples](../examples).

## Building latest version from source

If the stable package version does not suit your needs,
you can manually build and install the latest version of Themis from source code.

 1. [Build and install Themis Core library](/docs/themis/installation/installation-from-sources)
    into your system.

 2. Install RbThemis package from the source code:

    ```bash
    make rbthemis_install
    ```

    The package will be installed globally into the system.

    If you wish to install RbThemis into the user folder,
    use GEM_INSTALL_OPTIONS:

    ```bash
    make rbthemis_install GEM_INSTALL_OPTIONS=--user-install
    ```

 3. Run RbThemis test suite to verify the installation:

    ```bash
    make prepare_tests_all test_ruby
    ```
