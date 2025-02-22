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
  **Note**: Due to some issues with OpenSSL statically linked into Node.js, for correct JsThemis operation, you need to ensure that the Node.js and system OpenSSL versions match. Otherwise, you may encounter failures or crashes at runtime. Refer to [Matching OpenSSL versions](#matching-openssl-versions) for more details.
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

    JsThemis is a native addon for nodejs. During the installation process, all package files and all its dependencies are copied to the node_modules directory of your project. After copying, npm will start compiling the addon in your environment. If the compiler shows a compilation error, try adding the following variables before retrying the npm install. Locate the directories where the `libthemis.a` and `themis/themis.h` files are located and change the values of the CPPFLAGS, LDFLAGS variables to the appropriate values.

    ```bash
    export CPPFLAGS="-I/opt/homebrew/include"
    export LDFLAGS="-L/opt/homebrew/lib"
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

## Troubleshooting Themis, Node and OpenSSL

JsThemis is a simple library to Node.js that provides bindings to the Themis Core library, which is itself installed as a shared library in the system. In turn, Themis Core depends on OpenSSL installed in the system.

However, [Node.js often comes with its own OpenSSL version](https://github.com/nodejs/TSC/blob/main/OpenSSL-Strategy.md) included in the binary. This is a problem for JsThemis, because due to how linkage works, some OpenSSL functions will be linked directly from Node.js and the others will come from the system's OpenSSL. If these OpenSSL versions are not the same, JsThemis could become confused and crash.

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

If the semantic versions are the same, you are good to go! If they differ, however, there are a few ways to resolve the situation, but there is no easy answer. For instance, here is what we use while testing Themis in CI:

1. Choose the Node.js version with the OpenSSL that matches with your systems' one or that has no OpenSSL built in (there may be versions of Node.js that use shared OpenSSL).

   For example, Ubuntu Jammy Jellyfish (22.04) has OpenSSL 3.0.2, so the only Node.js versions suitable for it are v18.0 and v18.1. On the other hand, Ubuntu Focal Fossa (20.04) has OpenSSL 1.1.1, which is compatible with Node LTS v14 and v12. However, be aware that OpenSSL 1.1.1 [will be unsupported after September 2023](https://www.openssl.org/blog/blog/2023/03/28/1.1.1-EOL/).

2. Try another distribution with OpenSSL that matches Node.js.

Furthermore, here is how community solves this issue:

1. Try to install OpenSSL version that matches your Node.js. Probably, it will require building OpenSSL from the sources. Then, you will have to rebuild [Themis and JsThemis from sources](#building-latest-version-from-source). Don't forget to [specify the path](../../../installation/installation-from-sources/#cryptographic-backends) to the new OpenSSL.

2. You can try to build and install Themis Core and JsThemis from the sources with [Boringssl engine](../../../installation/installation-from-sources/#boringssl).

However, none of these options are ideal because they can lock you to specific versions of software and disable the ability to update components and dependencies.

### Example of errors
Here are examples of errors you may encounter if the versions of OpenSSL on the system and NodeJS do not match.

#### Ubuntu 22.04 basic installation.
```
# node -v
v12.22.9
# openssl version
OpenSSL 3.0.2 15 Mar 2022 (Library: OpenSSL 3.0.2 15 Mar 2022)
# node -e "console.log(process.versions.openssl)"
1.1.1m
```
This is a vivid example of a fatal coincidence. Old version of `node`.
And as a result trying to run code with themis will crashed with SIGSEGV.

The very simple code example of JsThemis
```
const themis = require('jsthemis');

const masterKey = new themis.SymmetricKey();
console.log(masterKey);

const keypair = new themis.KeyPair()
console.log(keypair);
```

The example of crash.
```
$ node ./index.js
<Buffer 80 9f 1a 70 9c ae 20 e6 c6 76 64 44 48 52 32 4d 5b 42 a2 fc b5 9b 33 57 a1 de ec 02 52 5d c6 de>
Segmentation fault (core dumped)
```

Another example:
```
# node ./index.js
<Buffer 93 74 61 d0 6b e7 dc be f1 46 32 2f 8d 67 f6 0d e8 05 c8 f1 0d a5 80 47 6b 21 2d ad f8 aa 5e 0d>
/root/test/index.js:6
const keypair = new themis.KeyPair()
                ^

Error: Key Pair generation failed: failure
    at Object.<anonymous> (/root/test/index.js:6:17)
    at Module._compile (internal/modules/cjs/loader.js:999:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1027:10)
    at Module.load (internal/modules/cjs/loader.js:863:32)
    at Function.Module._load (internal/modules/cjs/loader.js:708:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:60:12)
    at internal/main/run_main_module.js:17:47 {
  code: 11
}
```

Let's try to install LTS version of node. Remember, that even node 16 works with OpenSSL 1.1.1.

```
# npm install -g n
# n lts
# hash -r
# node -v
v20.9.0
# node -e "console.log(process.versions.openssl)"
3.0.10+quic
# node ./index.js
Segmentation fault (core dumped)
```

Another variant of error:
```
node ./index.js
/root/jsthemis/index.js:3
let keypair = new themis.KeyPair()
              ^

Error: Key Pair generation failed: invalid parameter
    at Object.<anonymous> (/root/jsthemis/index.js:3:15)
    at Module._compile (node:internal/modules/cjs/loader:1241:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1295:10)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:83:12)
    at node:internal/main/run_main_module:23:47 {
  code: 12
}
```

### Verified example how to fix it.
You need to install `OpenSSL` and `Themis` native library from the source code and install the `jsthemis` package.
This is a source code of Dockerfile. You may copy and build, and run it.
```Dockerfile
FROM ubuntu:22.04

RUN apt update
RUN apt install -y git wget npm gcc make tar

ARG OPENSSL_VERSION=3.0.10
ARG OPENSSL_PREFIX=/opt/openssl-${OPENSSL_VERSION}

RUN wget https://www.openssl.org/source/openssl-${OPENSSL_VERSION}.tar.gz && \
    apt purge -y openssl  && \
    mkdir ${OPENSSL_PREFIX} -p && \
    tar xf openssl-${OPENSSL_VERSION}.tar.gz && \
    cd openssl-${OPENSSL_VERSION} && \
    ./Configure --prefix=${OPENSSL_PREFIX} && \
    make && \
    make install

RUN apt install -y npm
RUN npm install -g n
RUN n lts

ENV LD_LIBRARY_PATH=${OPENSSL_PREFIX}/lib64
ENV PKG_CONFIG_PATH=${OPENSSL_PREFIX}/lib64/pkgconfig
ENV PATH=${OPENSSL_PREFIX}/bin:${PATH}

RUN git clone https://github.com/cossacklabs/themis.git && \
    cd themis && \
    make ENGINE_INCLUDE_PATH=${OPENSSL_PREFIX}/include ENGINE_LIB_PATH=${OPENSSL_PREFIX}/lib64 && \
    make install

WORKDIR /jsthemis
RUN npm init -y -f && npm install jsthemis
RUN echo "const themis = require('jsthemis');"           >> index.js \
    && echo "let keypair = new themis.KeyPair();"        >> index.js \
    && echo ""                                           >> index.js \
    && echo "// Keys are Buffers"                        >> index.js \
    && echo "let privateKey = keypair.private();"        >> index.js \
    && echo "let publicKey = keypair.public();"          >> index.js \
    && echo "let masterKey = new themis.SymmetricKey();" >> index.js \
    && echo ""                                           >> index.js \
    && echo "console.log(privateKey);"                   >> index.js \
    && echo "console.log(publicKey);"                    >> index.js \
    && echo "console.log(masterKey);"                    >> index.js

ENTRYPOINT ["node", "index.js"]
```

As a result you will see similar three lines of keys: private, public and symmetric keys.
```
<Buffer 52 45 43 32 00 00 00 2d e0 10 7b f5 00 bd 06 82 af 38 25 d1 d9 d1 33 64 93 14 59 b7 d5 4e c3 f8 3a 9c 73 da 70 bc 42 a6 32 94 cb f5 70>
<Buffer 55 45 43 32 00 00 00 2d 36 1a 7f 94 02 b6 76 7a 5f cb d7 b5 80 e0 b9 b7 54 e9 e9 bf d0 1a 86 dd 61 df 53 0b e3 c1 b7 ca ea 18 57 21 92>
<Buffer 3f 5e e1 90 09 10 a9 4d 4a 63 a6 fc 34 51 69 a1 55 73 2a 1f 45 f7 1c e4 3c 68 4b 2d b3 4c 70 4e>
```
If you see something similar, then you have done everything right and can transfer this recipe for installing `jsthemis` to your system.
If you see an error, please create an issue on GitHub and we will try to help you.

