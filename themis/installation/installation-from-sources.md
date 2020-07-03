---
weight: 2
title:  Installation from sources
---

# Building Themis from source code

{{< hint warning >}}
Building Themis from source is not recommended for casual or first-time use.

Unless you really know what you are doing and why —
[install prebuilt Themis from packages](../installation-from-packages/).
{{< /hint >}}

## Building Themis Core

### Dependencies

To build Themis on your own machine, you will need some common UNIX build tools:

  - C compiler: GCC or Clang
  - GNU Make

Themis also requires either
[OpenSSL](https://www.openssl.org/),
[LibreSSL](http://www.libressl.org/),
or [BoringSSL](https://boringssl.googlesource.com/boringssl/)
to be installed.
One of these libraries is used as a cryptographic backend of Themis.

{{< hint warning >}}
**Note:**
You need to install the _development_ version of the package
(usually called `libssl-dev` or `openssl-devel`)
as it contains the necessary header files.
{{< /hint >}}

In either case, we **strongly** recommend that you use the most recent version of these packages.

### Building with Make

Start with getting the latest Themis source code from GitHub:

```bash
git clone https://github.com/cossacklabs/themis.git
cd themis
```

followed by a typical UNIX build and installation:

```bash
make
sudo make install
```

This should work for most common tasks you would want to use Themis for.

### Makefile targets

Themis comes with a Makefile that should serve you well for all the typical use cases and goals.

Here are some of the targets supported by the Makefile:

- `make all` — build Themis libraries, but do not install them **(default)**
- `make install` — build and install Themis Core headers and libraries
- `make themis_shared` — only build the shared Themis library
- `make themis_static` — only build the static Themis library
- `make test` — build and run Themis Core test suite
- `make clean` — remove the build directory with intermediate files

### Configuring the build

Most of Themis configuration is guessed automatically from your system environment.
However, if you wish to customise some build and installation aspects,
Themis Makefile supports a number of configuration variables.

#### Installation prefix

By default, Themis is installed into the `/usr/local` hierarchy.
To change the installation destination, set the PREFIX variable:

```bash
make install PREFIX=/opt/themis
```

{{< hint warning >}}
**Note:**
Some systems (e.g., CentOS) do not include the `/usr/local` hierarchy into their default search paths.
On these systems `make install` will attempt to configure the linker
so that it can locate the installed Themis libraries.
Please adjust the `/etc/ld.so.conf.d/themis.conf` file if necesssary.
{{< /hint >}}

This is what a typical directory structure would look like after a successful installation:

```
/usr/local                - installation prefix
├── include
│   ├── themis            - header files
│   │   ├── themis.h
│   │   └── ...
│   └── soter
│       ├── soter.h
│       └── ...
└── lib
    ├── pkgconfig         - pkg-config support files
    │   ├── libthemis.pc
    │   └── libsoter.pc
    │
    ├── libsoter.a        — compiled libraries
    ├── libthemis.a
    ├── libsoter.so
    ├── libsoter.so.0
    ├── libthemis.so
    └── libthemis.so.0
```

#### Debug builds

By default, Themis libraries are built in release mode.
To build Themis in debug mode, set the `DEBUG` variable:

```bash
make DEBUG=yes
```

This enables additional runtime assertions, extra error reporting, and disables compiler optimisations.

#### Sanitizers

<!-- TODO: remove this box in 2021 -->
{{< hint info >}}
**Note:**
Builds with compiler sanitizers are supported since Themis 0.13.
{{< /hint >}}

It is also possible to build Themis with _sanitizers_ if they are supported by the compiler.
To enable sanitizers, set the following options for `make` when building Themis:

  - `WITH_ASAN` — Address Sanitizer (pointer safety, memory safety)
  - `WITH_MSAN` — Memory Sanitizer (memory safety)
  - `WITH_TSAN` — Thread Sanitizer (synchronisation issues)
  - `WITH_UBSAN` — Undefined Behavior Sanitizer

Recent versions of GCC and Clang support all sanitizers.

For example, to build with address sanitizer enabled, run:

```bash
make all WITH_ASAN=yes
```

### Cryptographic backends

Currently, Themis supports OpenSSL-like cryptographic engines (libcrypto):

  - [OpenSSL](https://www.openssl.org/)
  - [LibreSSL](http://www.libressl.org/)
  - [BoringSSL](https://boringssl.googlesource.com/boringssl/)

In the future we plan to broaden the support of different crypto implementation libraries.

By default, Themis will use the default cryptographic engine for your system.
If you need to use a custom-build engine, set the following parameters:

- `ENGINE` — type of the engine to use (`openssl`, `libressl`, `boringssl`)
- `ENGINE_INCLUDE_PATH` — path to the directory with `openssl` header files
- `ENGINE_LIB_PATH` — path to the directory with the `libcrypto` library

For example:

```bash
make install \
    ENGINE=libressl \
    ENGINE_INCLUDE_PATH=/opt/libressl-2.8.3/include \
    ENGINE_LIB_PATH=/opt/libressl-2.8.3/lib
```

{{< hint info >}}
You need to install the development package for the cryptographic engine:
the one that includes both the engine binaries and its header files.
The package is usually called `libssl-dev` or `openssl-devel`.
{{< /hint >}}

#### BoringSSL

You can opt for BoringSSL by setting `ENGINE=boringssl`.
This will build and use the BoringSSL version embedded into Themis, you don't need to do anything else.

{{< hint info >}}
**Note:**
You still need to install [BoringSSL build dependencies](https://boringssl.googlesource.com/boringssl/+/HEAD/BUILDING.md).
You will typically need to install CMake and Go in addition to Themis dependencies.
{{< /hint >}}

Themis uses BoringSSL by default on Android and WebAssembly platforms.

If you wish to use a custom build of BoringSSL,
then in addition to the `ENGINE` variable
you need to set the `ENGINE_INCLUDE_PATH` and `ENGINE_LIB_PATH` variables as well.
Note that **both** `libcrypto.a` and `libdecrepit.a` have to be put into `ENGINE_LIB_PATH`
(BoringSSL builds typically put them into different directories).

#### Selecting algorithm parameters

Themis is designed to be algorithm-agnostic thanks to its special abstraction layer,
[Soter](/themis/architecture/).
It could be built with custom ciphers or cipher implementations
specific to your regulatory needs or available in your environment.

Themis uses generally good, sane defaults for algorithms and their parameters.
If necessary, you can rebuild Themis with different defaults
by setting configuration variables.

  - `AUTH_SYM_ALG` — authenticated symmetric encryption algorithm
    - `THEMIS_AUTH_SYM_ALG_AES_256_GCM` (used by default)
    - `THEMIS_AUTH_SYM_ALG_AES_192_GCM`
    - `THEMIS_AUTH_SYM_ALG_AES_128_GCM`
  - `SYM_ALG` — general symmetric encryption algorithm
    - `THEMIS_SYM_ALG_AES_256_CTR` (used by default)
    - `THEMIS_SYM_ALG_AES_192_CTR`
    - `THEMIS_SYM_ALG_AES_128_CTR`

As for asymmetric algorithms, we’re still working on making them switchable during compilation.
However, for RSA you can change the key length at compilation time.

{{< hint danger >}}
**Caution:**
We strongly insist that using a key length less than 2048
should only be done due to performance considerations,
in safe and trusted environments.
{{< /hint >}}

  - `RSA_KEY_LENGTH` — RSA key length in bits
    - `1024`
    - `2048` (used by default)
    - `4096`

## Building Themis language wrappers

Language-specific wrappers enable you to use Themis in a particular language.
Most of them can be installed with the same Makefile used to build Themis Core.

Check out the corresponding language guide for more details
on how to build Themis wrapper for your language.

{{< hint info >}}
**Note:**
For server-side development you need to install Themis Core first.

For iOS, Android, and WebAssembly you do not need to build Themis Core separately.
{{< /hint>}}

### Server-side and desktop platforms

  - [C++](/themis/languages/cpp/installation/#building-latest-version-from-source)
  - [Go](/themis/languages/go/installation/#building-latest-version-from-source)
  - [JavaScript (Node.js)](/themis/languages/nodejs/installation/#building-latest-version-from-source)
  - [Java](/themis/languages/java/installation-desktop/#building-latest-version-from-source)
  - [Kotlin](/themis/languages/kotlin/installation-desktop/#building-latest-version-from-source)
  - [PHP](/themis/languages/php/installation/#building-latest-version-from-source)
  - [Python](/themis/languages/python/installation/#building-latest-version-from-source)
  - [Ruby](/themis/languages/ruby/installation/#building-latest-version-from-source)
  - [Rust](/themis/languages/rust/installation/#building-latest-version-from-source)

### Mobile and Web platforms

  - [Swift](/themis/languages/swift/installation/#building-latest-version-from-source)
  - [Objective-C](/themis/languages/objc/installation/#building-latest-version-from-source)
  - [Kotlin](/themis/languages/kotlin/installation-android/#building-latest-version-from-source)
  - [Java](/themis/languages/java/installation-android/#building-latest-version-from-source)
  - [JavaScript (WebAssembly)](/themis/languages/wasm/installation/#building-latest-version-from-source)
