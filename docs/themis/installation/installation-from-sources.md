---
weight: 13
---

## Building Themis Core from sources

### Requirements    

To build Themis on your own machine, you will need some common UNIX build tools:

  - C compiler: GCC or Clang,     
  - GNU make.    

Themis also requires either
[OpenSSL](https://www.openssl.org/),
[LibreSSL](http://www.libressl.org/),
or [BoringSSL](https://boringssl.googlesource.com/boringssl/)
package to be installed for you to be able to use one of them as a cryptographic backend.    

{{< hint warning >}}
**Attention!** You need to install the _developer_ version of the package
(usually suffixed with `-dev` or `-devel`) as it contains the necessary header files.
{{< /hint >}}


In either case, we **strongly** recommend that you use the most recent version of these packages.    

### Building Themis core    

No matter what you have selected on the previous step – your own machine or Docker – you need to start with getting the latest version of Themis from GitHub:  

```bash
git clone https://github.com/cossacklabs/themis.git
```

From the source directory, type:

```bash
make install
```    
(Depending on your rights, `sudo` might be necessary for installation.)    

This should work for most common tasks you would want to use Themis for. 

### Makefile targets

Themis comes with a Makefile that should serve you well for all the typical use cases and goals.

Here are some of the targets supported by the Makefile:

- `make install` — build and install Themis Core headers and libraries in the system,        
- `make all` — build Themis libraries, but do not install them,       
- `make themis_shared` — only build the shared Themis library,      
- `make themis_static` — only build the static Themis library,       
- `make test` — build and run Themis Core test suite,        
- `make clean` — remove the build directory with intermediate files.       

### Makefile configuration

Most of Themis configuration is guessed automatically from your system environment.
There is no separate `./configure` step, everything comes prepared in advance!

However, if you wish to customise some build and installation aspects,
Themis Makefile supports a number of configuration variables.

#### Installation prefix    

By default, Themis is installed to the `/usr/local` hierarchy. To change the installation destination, set the `PREFIX` variable:

```bash
make install PREFIX=/opt/themis
```

{{< hint info >}}
**NOTE:** Some systems (e.g., _CentOS_) do not include `/usr/local` hierarchy into their default search paths. On these systems you may need to add `/usr/local/lib` path to `/etc/ld.so.conf` configuration file; otherwise, make sure that system linker and loader can locate the installed Themis libraries.     
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

##### Sanitizers

{{< hint info >}}
**NOTE:** The following feature is currently available only in the `master` branch of Themis. It will become widely available starting with Themis 0.13.0.  
{{< /hint >}}


It is also possible to build Themis with _sanitizers_ if they are supported by the compiler. To enable sanitizers, set the following flags on the `make` command line:

- `WITH_ASAN=1` — Address Sanitizer (pointer safety, memory safety)  
- `WITH_MSAN=1` — Memory Sanitizer (memory safety)  
- `WITH_TSAN=1` — Thread Sanitizer (synchronisation issues)  
- `WITH_UBSAN=1` — Undefined Behavior Sanitizer

Recent versions of GCC and Clang support all sanitizers.

### Cryptographic backends

Currently, Themis supports OpenSSL-like cryptographic engines (libcrypto):

  - [OpenSSL](https://www.openssl.org/)     
  - [LibreSSL](http://www.libressl.org/)     
  - [BoringSSL](https://boringssl.googlesource.com/boringssl/)      

In the future, we plan to broaden the support of different crypto implementation libraries
(and, in some rare cases, provide our own).

You need to install both the engine and its development header files.
The packages are usually called `libssl` and `libssl-dev` (or `-devel`).

By default, Themis will build with system default cryptographic engine.
If you need to use a custom libcrypto, set these parameters:

- `ENGINE`: name of the engine to use (`openssl`, `libressl`, `boringssl`),    
- `ENGINE_INCLUDE_PATH`: path to the directory with `openssl` header files,    
- `ENGINE_LIB_PATH`: path to the directory with `libcrypto` library.    

For example:

```bash
make install \
    ENGINE=libressl \
    ENGINE_INCLUDE_PATH=/opt/libressl-2.8.3/include \
    ENGINE_LIB_PATH=/opt/libressl-2.8.3/lib
```
    
#### BoringSSL

You can opt for BoringSSL by setting `ENGINE=boringssl`. This will build and use the BoringSSL version embedded into Themis, you don't need to do anything else.       
For Android wrapper, Themis currently uses BoringSSL engine by default.    

If you wish to use a custom build of BoringSSL, start with reading the instructions at
[boringssl.googlesource.com](https://boringssl.googlesource.com/boringssl/+/HEAD/BUILDING.md#building).
In addition to the `ENGINE` variable, you need to set the `ENGINE_INCLUDE_PATH` and `ENGINE_LIB_PATH` variables, too.    
Note that **both** `libcrypto.a` and `libdecrepit.a` have to be put in `ENGINE_LIB_PATH`.

### Selecting the default algorithm parameters

Themis is designed to be algorithm-agnostic thanks to its special abstraction layer, [Soter](/pages/soter/). It could be built with custom ciphers or cipher implementations specific to your regulatory needs or to the available implementations in your environment. There are two ways you can alter these parameters: for the symmetric algorithm, there is a variable that points libsoter to a specific function picked at the compilation point. 

Authenticated symmetric algorithm (only AES in GCM mode is currently available):

    AUTH_SYM_ALG: THEMIS_AUTH_SYM_ALG_AES_256_GCM /* used by default */
                  THEMIS_AUTH_SYM_ALG_AES_128_GCM
                  THEMIS_AUTH_SYM_ALG_AES_192_GCM

General symmetric algorithm (only AES in CTR mode is currently available): 

     SYM_ALG: THEMIS_SYM_ALG_AES_256_CTR /* used by default */
              THEMIS_SYM_ALG_AES_128_CTR
              THEMIS_SYM_ALG_AES_192_CTR

As for asymmetric algorithms, we're still working on making them switchable in compilation. Currently, for most of the asymmetric operations, the algorithm is selected by the key type you feed into it (either RSA or EC key, defined during the key generation point). 

However, for RSA you can change the key length at compilation time (we strongly insist that using a key length less than 2048 should only be done due to performance considerations, in safe environments):

      RSA_KEY_LENGTH: 1024
                      2048 /* used by default */
                      4096

### Custom destinations

By default, Themis is installed to `/usr/local/lib` and `/usr/local/include` folder. To change the prefix of target folders, use parameter PREFIX:

    make install PREFIX=/opt/themis      

{{< hint info >}}
**NOTE:** Some systems (e.g., _CentOS_) do not include `/usr/local` hierarchy into their default search paths. On these systems you may need to add `/usr/local/lib` path to `/etc/ld.so.conf` configuration file; otherwise, make sure that system linker and loader can locate the installed Themis libraries.  
{{< /hint >}}


## Building Themis language wrappers

This section covers building Theims wrappers from source code.      

{{< hint warning >}}
**WARNING** Unless you really know what you are doing and why — do not build Themis wrappers from source code! [Installation from packages](/docs/themis/installation/installation-from-packages/) should be enough for your needs in most cases. 
{{< /hint >}}

Instructions for building wrappers assume that you have a working installation of the relevant language toolchains
available via standard system paths. 


### Android wrapper installation    

{{< hint warning >}}
Building Themis wrappers from source is not recommended for casual or first-time use! [Install Android Themis from packages](/docs/themis/languages/java-android) unless you know why exactly you need to build your Themis wrapper from the source code.         
{{< /hint >}}


#### Using Docker      

If you have Docker and you just need to build Themis quickly, you can use our prebuilt `android-build` image:

```bash
docker run --rm -it -v $(pwd):/projects cossacklabs/android-build bash -c 'git clone https://github.com/cossacklabs/themis.git && cd themis && git submodule update --init && ./gradlew assembleRelease'
```

It will create AAR (Android library project) in the `build/outputs/aar/` folder. Link this `aar` file manually into your application.

#### Manually from sources

Themis for Android uses Gradle build system.     
A Gradle wrapper is included in the root directory of the project.
Like the rest of the modern Android ecosystem,
Themis uses [BoringSSL](https://boringssl.googlesource.com/boringssl/) as its cryptographic backend.
BoringSSL is included as a submodule in the Themis repository.

You should install the latest [Android SDK tools or Android Studio](https://developer.android.com/studio/index.html).
You don't need full Android Studio to build Themis, just the command line SDK tools.

Make sure to specify the correct path to your Android SDK:

```bash
export ANDROID_HOME=/path/to/android/sdk
```

Make sure your SDK has the necessary build tools and Android NDK:    

```bash
$ANDROID_HOME/tools/bin/sdkmanager --update
$ANDROID_HOME/tools/bin/sdkmanager 'build-tools;27.0.3' \
                                   'platforms;android-27' \
                                   'ndk-bundle'
```

Since BoringSSL is included as a submodule,
make sure all the Git submodules are initialised in your working copy:     

```bash
git submodule update --init
```

Build Themis for Android:      

```bash
./gradlew --info assembleRelease
```

It will create AAR (Android library project) in the `build/outputs/aar/` folder. Link this `aar` file manually into your application.

To run Android tests, make sure ADB is enabled in settings, connect your device(s) and run:

```bash
./gradlew --info connectedAndroidTest
```     
        

### Java wrapper installation     

{{< hint warning >}}
Building Themis wrappers from source is not recommended for casual or first-time use! [Install Java Themis from packages](/docs/themis/languages/java-desktop) unless you know why exactly you need to build your Themis wrapper from the source code.      
{{< /hint >}}


#### Build JNI library    

Make sure that you have correctly installed JDK and configured `JAVA_HOME` before building Themis for Java.
You can learn more about how to get and install JDK in [Oracle documentation](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/).

After building and installing the core library, use the following line to build the JNI wrapper:    

```bash
make themis_jni
```

To build JNI code for Java, the build system needs to know the location of the `jni.h` header.
By default, it will be looking for the file in `${JAVA_HOME}/include` directory.
You may specify a different location by setting the `JDK_INCLUDE_PATH` environment variable.

_On macOS_, you might need to explicitly specify the path to Java headers with `CFLAGS` (<a href="https://alvinalexander.com/java/mac-os-x-java_home-location">Where to find JDK on macOS</a>):

```bash
# Example path to JAVA_HOME
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_11.jdk/Contents/Home

export CFLAGS="-I$JAVA_HOME/include -I$JAVA_HOME/include/darwin"
make themis_jni
```

Performing `make themis_jni` will produce the `libthemis_jni.so` shared library in the build directory (`build` by default).

#### Link Themis to your project     

Copy Themis Java files from [`themis/src/wrappers/themis/java`](https://github.com/cossacklabs/themis/tree/master/src/wrappers/themis/java/com/cossacklabs/themis). Paste them into your project `src` folder.    

Copy `libthemis_jni` library to your project `lib` folder, link it as `lib` to your project.    

See [Themis Java examples](https://github.com/cossacklabs/themis-java-examples) for illustration.      
 

### iOS/macOS wrapper installation     

Building from source is not available for iOS/macOS. Refer to language guide for ([Swift Themis](/docs/themis/languages/swift) or [Objective-C Themis](/docs/themis/languages/objc)).


### C++ wrapper installation      

{{< hint info >}}
Building Themis wrappers from source is not recommended for casual or first-time use! [Install C++ Themis from packages](/docs/themis/languages/cpp) unless you know why exactly you need to build your Themis wrapper from the source code.    
{{< /hint >}}


After building and installing the core library,
use the following line to install ThemisPP:    

```bash
make themispp_install
```

You can then run ThemisPP test suite to verify the installation:    

```bash
make prepare_tests_all test_cpp
```

ThemisPP is a _header-only_ library. Instead of installing it into your system you can just copy the header files to your project. You will need to copy the following directory: [`src/wrappers/themis/themispp`](https://github.com/cossacklabs/themis/tree/master/src/wrappers/themis/themispp)


### WebAssembly wrapper installation      

{{< hint info >}}
Building Themis wrappers from source is not recommended for casual or first-time use! [Install WebAssembly Themis from packages](/docs/themis/languages/wasm) unless you know why exactly you need to build your Themis wrapper from the source code.      
{{< /hint >}}


{{< hint info >}}
WasmThemis wrapper cannot be built from source for i386 architecture, Debian 8 "Jessie" (and below), CentOS 7 (and below). But you can still _install_ it on these operating systems using the [following instruction](/pages/js-wasm-howto/).    
{{< /hint >}}


Make sure that you have a working [Emscripten](https://github.com/emscripten-core/emscripten) installation and that it is activated in your environment:

```bash
$ emcc -v
emcc (Emscripten gcc/clang-like replacement + linker emulating GNU ld) 1.39.4
clang version 6.0.1 (emscripten 1.38.31 : 1.38.31)
Target: x86_64-apple-darwin18.7.0
```

WasmThemis currently supports only the **fastcomp** flavor of Emscripten.
Upstream (LLVM) flavor is known to be unstable and is unlikely to work at the moment.
Upstream is installed by default, so you need to switch to fastcomp like this:

 <pre>
 $ ~/emsdk/emsdk install  latest-fastcomp
 $ ~/emsdk/emsdk activate latest-fastcomp
 $ source ~/emsdk/emsdk_env.sh
 </pre>

> Read [Emscripten documentation](https://emscripten.org/docs/tools_reference/emsdk.html) to learn more about managing toolchain versions.

If you haven't used Emscripten before, [take a look at this tutorial](https://emscripten.org/docs/getting_started/Tutorial.html).

Next, make sure that BoringSSL submodule is checked out:

```bash
git submodule sync && git submodule update --init
```

Now you can build WasmThemis. The following command will build and package WasmThemis wrapper, core Themis library, and BoringSSL cryptographic backend:

```bash
emmake make wasmthemis
```

To run the test suite for WasmThemis wrapper (and a more extensive one for the core library), type:

```bash
emmake make test_wasm
emmake make test
```

To install WasmThemis, type:

```bash
make wasmthemis_install
```

### Node.js wrapper installation     

Building from source is not available for jsthemis. Refer to language guide for [Node.js](/docs/themis/languages/nodejs).


### PHP wrapper installation      

{{< hint info >}}
Building Themis wrappers from source is not recommended for casual or first-time use! [Install Themis PHP from packages](/docs/themis/languages/php) unless you know why exactly you need to build your Themis wrapper from the source code.   
{{< /hint >}}


After building and installing the core library, use the following line to install PHPThemis:     

```bash
make phpthemis_install
```

This will build and install `phpthemis.so` to the standard Zend extension directory.

You will need to add the following line to your `php.ini` file in order to enable Themis extension:

```
extension=phpthemis.so
```

You can then verify if PHPThemis is correctly installed using     

```bash
php --ri phpthemis
```

PHPThemis test suite can be run in the following manner:     

```bash
make prepare_tests_all test_php
```   


### Go wrapper installation      

{{< hint info >}}
Building Themis wrappers from source is not recommended for casual or first-time use! [Install GoThemis from packages](/docs/themis/languages/go) unless you know why exactly you need to build your Themis wrapper from the source code. 
{{< /hint >}}


Make sure that Themis is installed because Gothemis is a wrapper for Themis (uses CGO). Make sure that you have a working [Go installation](https://golang.org/doc/install) and your $GOPATH is set properly. Then just "go get" the code:

```
go get -u github.com/cossacklabs/themis/gothemis/...
```


### Python wrapper installation     

{{< hint info >}}
Building Themis wrappers from source is not recommended for casual or first-time use! [Install pyThemis from packages](/docs/themis/languages/python) unless you know why exactly you need to build your Themis wrapper from the source code.    
{{< /hint >}}

After building and installing the core library, use the following line to install PyThemis:    

```bash
make pythemis_install
```

You can then run PyThemis test suite to verify the installation:   

```bash
make prepare_tests_all test_python
```

### Ruby wrapper installation       

{{< hint info >}}
Building Themis wrappers from source is not recommended for casual or first-time use! [Install rubyThemis from packages](/docs/themis/languages/ruby) unless you know why exactly you need to build your Themis wrapper from the source code.   
{{< /hint >}}

After building and installing the core library, use the following line to install RubyThemis:    

```bash
make rbthemis_install
```

If you want to install RubyThemis into the user folder, use GEM_INSTALL_OPTIONS:    

```bash
GEM_INSTALL_OPTIONS=--user-install make rbthemis_install
```

You can then run RubyThemis test suite to verify the installation:

```bash
make prepare_tests_all test_ruby
```

### Rust wrapper installation   

Building from source is not available for rust-themis. Refer to language guide for [RustThemis](/docs/themis/languages/rust).
