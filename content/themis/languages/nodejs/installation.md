---
weight: 2
title: Node.js installation
---

# Installing JsThemis

JsThemis is [available on **npm**](https://www.npmjs.com/package/jsthemis)
and can be installed with the usual `npm install`.
Additionally, Themis Core library has to be installed in your system as well.

Themis Core is available as a system package for Linux and macOS.
Usually you want to install the stable package to benefit from automatic dependency management and security updates.
However, you can also build and install the latest JsThemis from the source code.

  {{< hint warning >}}
  **Note**: Due to some issues with OpenSSL statically linked into Nodejs, for correct JsThemis operation, you need to ensure that the Nodejs and system OpenSSL versions match. Otherwise, you may encounter failures or crashes at runtime. Refer to [Matching OpenSSL versions](#matching-openssl-versions) for more details.
  {{< /hint >}}

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

## Matching OpenSSL versions

JsThemis is a simple library to Node.js that provides bindings to the Themis Core library, which is itself installed as a shared library in the system. In turn, Themis Core depends on OpenSSL installed in the system.

However, [Nodejs often comes with its own OpenSSL version](https://github.com/nodejs/TSC/blob/main/OpenSSL-Strategy.md) included in the binary. This is a problem for JsThemis, because due to how linkage works, some OpenSSL functions will be linked directly from Nodejs and the others will come from the system's OpenSSL. If these OpenSSL versions are not the same, JsThemis could become confused and crash.

```
                          +-----> Node openssl
                          |
jsthemis ----> libthemis -+
                          |
                          +-----> System openssl
```

For these reasons, before installing JsThemis, it is critical to ensure that the Node.js and system OpenSSL versions are the same. To do so, you can check the output of these commands:

```bash
$ openssl version
OpenSSL 3.0.2 15 Mar 2022 (Library: OpenSSL 3.0.2 15 Mar 2022)
$ node -e "console.log(process.versions['openssl'])"
3.0.2+quic
```

If the semantic versions are the same, you are good to go! If they differ, however, there are a few ways to resolve the situation, but there is no easy answer:

1. Choose the Node.js version with the OpenSSL that matches with your systems' one or that has no OpenSSL built in (there may be versions of Node.js that use shared OpenSSL).

   For example, Ubuntu Jammy Jellyfish (22.04) has OpenSSL 3.0.2, so the only Nodejs versions suitable for it are v18.0 and v18.1. On the other hand, Ubuntu Focal Fossa (20.04) has OpenSSL 1.1.1, which is compatible with Node LTS v14 and v12. However, be aware that OpenSSL 1.1.1 [will be unsupported after September 2023](https://www.openssl.org/blog/blog/2023/03/28/1.1.1-EOL/).

2. Try another distribution with OpenSSL that matches Node.js.

3. Try to install OpenSSL version that matches your Node.js. Probably, it will require building OpenSSL from the sources. Then, you will have to rebuild [Themis and JsThemis from sources](#building-latest-version-from-source). Don't forget to [specify the path](../../../installation/installation-from-sources/#cryptographic-backends) to the new OpenSSL.

4. You can try to build Themis and JsThemis from the sources with [Boringssl engine](../../../installation/installation-from-sources/#boringssl).

However, none of these options are ideal because they can lock you to specific versions of software and disable the ability to update components and dependencies.
