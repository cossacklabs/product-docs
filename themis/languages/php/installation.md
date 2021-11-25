---
weight: 2
title: PHP installation
---

# Installing PHPThemis

PHPThemis is available as a system package for Linux.
Usually you want to install the stable package to benefit from automatic dependency management and security updates.
However, you can also build and install the latest PHPThemis from the source code.

## Installing stable version on Linux

The easiest way to install PHPThemis on Linux is to use package repositories for your system.
We build packages for a multitude of Linux distributions.

 1. [Add Cossack Labs package repositories](/themis/installation/installation-from-packages/)
    to your system.

 2. Install PHPThemis package.

    For Debian, Ubuntu:

    ```bash
    sudo apt install libphpthemis-php7.0
    ```

    For CentOS, RHEL:

    ```bash
    sudo yum install libphpthemis-php7.0
    ```

    {{< hint info >}}
The `libphpthemis-php7.0` package is intended for PHP 7.0, 7.1, 7.2.

For PHP 5.6 you need to install `libphpthemis-php5.6`.
    {{< /hint >}}

Once PHPThemis is installed, you can [try out code examples](../examples/).

## Building latest version from source

If the stable package version does not suit your needs,
you can manually build and install the latest version of Themis from source code.

 1. [Build and install Themis Core library](/themis/installation/installation-from-sources/)
    into your system.

 2. Install PHPThemis extension:

    ```bash
    make phpthemis_install
    ```

    This will build and install `phpthemis.so` to the standard Zend extension directory.

 3. Tell PHP to enable the new extension.

    You need to add the following line to your `php.ini`:

    ```
    extension=phpthemis.so
    ```

 4. Verify that PHPThemis is correctly installed:

    ```bash
    php --ri phpthemis
    ```
