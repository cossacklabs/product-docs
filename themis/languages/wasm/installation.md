---
weight: 2
title:  Installation
---

# Installing WasmThemis

WasmThemis is [available on **npm**](https://www.npmjs.com/package/wasm-themis)
and can be installed with the usual `npm install`.
Usually you want to install the stable package to benefit from automatic dependency management and security updates.
However, you can also build and install the latest WasmThemis from the source code.

## Installing stable version with npm

Just run the following line to install WasmThemis for your project:

```bash
npm install wasm-themis
```

Once WasmThemis is installed, you can [try out code examples](../examples/).

## Deploying apps with WasmThemis

WasmThemis is distributed as Node.js package which is compatible with many JavaScript module bundlers
like Browserify, webpack, and Electron framework packager.

However, in addition to JavaScript code, WasmThemis also includes the compiled WebAssembly bytecode.
The bytecode is located in `node_modules/wasm-themis/src/libthemis.wasm` file,
which will be loaded by the browser separately.
Make sure that `libthemis.wasm` is placed next to the produced JavaScript bundle
by copying it from `node_modules` directory when building your application.

### Bundler specifics

If you are using **webpack**,
you may also need to add the following declaration to your `webpack.config.js`:

```javascript
node: {
    fs: 'empty'
}
```

### Web server MIME types

Web servers should use MIME type `application/wasm` for serving WebAssembly files.
This enables more efficient streaming compilation process with shorter startup times.
The servers are usually pre-configured to use proper MIME types,
but if you see the following warning message:

    wasm streaming compile failed: TypeError: Failed to execute 'compile' on
    'WebAssembly': Incorrect response MIME type. Expected 'application/wasm'.

then you might need to check the web server configuration.

Nginx MIME types are configured via the `/etc/nginx/mime.types` configuration file.
Apache and other servers typically use the `/etc/mime.types` configuration file.
Reload configuration or restart the server for the change to take effect.

## Building latest version from source

If the stable package version does not suit your needs,
you can manually build and install the latest version of Themis from source code.

{{< hint info >}}
**Note:**
WasmThemis is compiled with **Emscripten** toolchain.
Unfortunately, Emscripten does not support 32-bit architectures
and some older systems such as CentOS 7.

You will not be able to develop and build WasmThemis on those older systems.
However, the resulting WebAssembly binaries are portable
and can be installed and used anywhere.
{{< /hint >}}

WasmThemis uses [BoringSSL](https://boringssl.googlesource.com/boringssl/) as its cryptographic backend.
BoringSSL is included as a submodule in the Themis repository,
but you will need to install its build dependencies as well.

 1. Install Emscripten toolchain
    [as described in the documentation here](https://emscripten.org/docs/getting_started/downloads.html).

    If you haven’t used Emscripten before,
    [take a look at this tutorial](https://emscripten.org/docs/getting_started/Tutorial.html)
    before proceeding.

 2. Activate a suitable toolchain version.

    {{< hint warning >}}
Currently WasmThemis supports only the **“fastcomp”** flavor of the toolchain.
The “upstream” (LLVM) flavor has known issues and is not recommended at the moment.
    {{< /hint >}}

    Emscripten installs the “upstream” flavor by default
    so you need to explicitly install and activate a suitable version
    (run this from Emscripten SDK directory):

    ```bash
    ./emsdk install  1.39.16-fastcomp
    ./emsdk activate 1.39.16-fastcomp
    source ./emsdk_env.sh
    ```

    The `1.39.16-fastcomp` is the latest “fastcomp” toolchain version
    which is known to work for WasmThemis.

    {{< hint info >}}
Read the [Emscripten documentation](https://emscripten.org/docs/tools_reference/emsdk.html)
to learn more about managing toolchain versions.
    {{< /hint >}}

 3. Make sure that BoringSSL submodule is checked out:

    ```bash
    git submodule update --init
    ```

 4. Make sure that BoringSSL [build dependencies](https://boringssl.googlesource.com/boringssl/+/HEAD/BUILDING.md) are installed.

    You will typically need to install Go, CMake, GNU Make.

 5. Build and package WasmThemis:

    ```bash
    emmake make wasmthemis
    ```

The resulting package will be placed into `build/wasm-themis.tgz`
in Themis source tree.

To run the test suite for WasmThemis wrapper
(and a more extensive one for the Themis Core library),
run the following commands:

```bash
emmake make test_wasm
emmake make test
```
