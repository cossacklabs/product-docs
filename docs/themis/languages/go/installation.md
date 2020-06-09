---
weight: 2
title:  Installation
---

# Installing GoThemis

GoThemis can be installed with the usual `go get`.
Additionally, Themis Core library has to be installed in your system as well.

Themis Core is available as a system package for Linux and macOS.
Usually you want to install the stable package to benefit from automatic dependency management and security updates.
However, you can also build and install the latest GoThemis from the source code.

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

3. `go get` the GoThemis package:

    ```bash
    go get github.com/cossacklabs/themis/gothemis
    ```

Once GoThemis is installed, you can [try out code examples](../examples).

## Installing stable version on macOS

The easiest way to install ThemisPP on macOS is to use Homebrew.

 1. Add Cossack Labs tap to your system:

    ```bash
    brew tap cossacklabs/tap
    ```

 2. Install Themis Core package:

    ```bash
    brew install libthemis
    ```

 3. `go get` the GoThemis package:

    ```bash
    go get github.com/cossacklabs/themis/gothemis
    ```

Once GoThemis is installed, you can [try out code examples](../examples).

## Building latest version from source

If the stable package version does not suit your needs,
you can manually build and install the latest version of Themis from source code.

 1. [Build and install Themis Core library](/docs/themis/installation/installation-from-sources)
    into your system.

 2. Get the latest version of GoThemis with `go get -u`:

    ```bash
    go get -u github.com/cossacklabs/themis/gothemis@master
    ```

### Installing specific GoThemis versions

GoThemis supports [Go 1.11 modules](https://blog.golang.org/using-go-modules) since GoThemis 0.12.
To get a specific release, use `go get` like this:

```bash
go get -u github.com/cossacklabs/themis/gothemis@v0.12.0
```

If you need an older version of GoThemis (0.11 or earlier),
or if you use a legacy Go installation that does not support modules,
you need to visit the GoThemis package in GOPATH and check out the specific branch.
For example, to get GoThemis 0.10.0:

```bash
cd $GOPATH/src/github.com/cossacklabs/themis/gothemis
git checkout 0.10.0
```
