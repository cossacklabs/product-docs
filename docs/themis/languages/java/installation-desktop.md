---
weight: 3
title:  Installation for desktop
---

# Installing JavaThemis for desktop development

JavaThemis package for desktop and server systems is currently in development.
For now you will have to build it partially from source code.
JavaThemis also requires JNI library to be installed on your system.

Themis JNI library is available as a system package for Linux and macOS.
Usually you want to install the stable package to benefit from automatic dependency management and security updates.
However, you can also build and install the latest version of JNI library from the source code as well.

## Installing stable version on Linux

The easiest way to install JavaThemis on Linux is to use package repositories for your system.
Currently we build packages for a multitude of Linux distributions.

 1. [Add Cossack Labs package repositories](/docs/themis/installation/installation-from-packages) to your system.

 2. Install Themis JNI package.

    For Debian, Ubuntu:

    ```
    sudo apt install libthemis-jni
    ```

    For CentOS, RHEL:

    ```
    sudo yum install libthemis-jni
    ```

 3. [Build JavaThemis JAR](#build-jar-with-java-code) and add it to your project.

Once JavaThemis is installed, you can [try out examples on your machine](../examples).

## Installing stable version on macOS

The easiest way to install ThemisPP on macOS is to use Homebrew.

 1. Add Cossack Labs tap to your system:

    ```bash
    brew tap cossacklabs/tap
    ```

 2. Install Themis JNI package:

    ```bash
    brew install themis --with-jni
    ```

 3. Make sure Java can locate the JNI library.

    Java distributions for macOS typically do not include `/usr/local/lib`
    into their `java.library.path`.
    You will get a warning from Homebrew if that’s the case for your system:

        Your Java installation does not seem to have "/usr/local/lib" in its
        search path for JNI libraries:

            /Users/your_name/Library/Java/Extensions
            /Library/Java/Extensions
            /Network/Library/Java/Extensions
            /System/Library/Java/Extensions
            /usr/lib/java
            .

        You will need to either add it to the "java.library.path" property
        on application startup, or to move libthemis_jni.dylib manually
        to one of these locations so that Java could find it.

 4. [Build JavaThemis JAR](#build-jar-with-java-code) and add it to your project.

Once JavaThemis is installed, you can [try out examples on your machine](../examples).

## Building latest version from source

If the stable package version does not suit your needs,
you can manually build and install the latest version of Themis from source code.

For now, you have to build the JAR part from source code
even when the JNI library is installed by the package manager.
Please use the stable version if you do not have a reason to use the latest, unstable code.

The build system requires Java 8 or later.
You need to have JDK 8 (or later) installed and selected as your default JDK.
You can learn more about how to get and install JDK
in [Oracle documentation](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/).

### Build JNI library with native code

 1. [Build and install Themis Core library](/docs/themis/installation/installation-from-sources)
    into your system.

 2. In the same source tree, build and and then install the JNI library:

    ```bash
    make themis_jni
    sudo make themis_jni_install
    ```

 3. Make sure Java can locate the JNI library.

    By default, the library will be installed with the `/usr/local` prefix.
    Some Java installations do not search this location.
    You will get a warning if that’s the case for your system:

        Your Java installation does not seem to have "/usr/local/lib" in its
        search path for JNI libraries:

            /usr/java/packages/lib
            /usr/lib/x86

        You will need to either add it to the "java.library.path" property
        on application startup, or to move libthemis_jni.so manually
        to one of these locations so that Java could find it.

#### Specifying JDK location

To build JNI code for Java, the build system needs to know the location of the `jni.h` header.
The build system should automatically detect it in most cases.
If automatic detection fails, you can help it by setting the `JAVA_HOME` variable
(the build will look into `$JAVA_HOME/include`).

On certain _macOS_ systems you may need to specify
the [JDK location](https://alvinalexander.com/java/mac-os-x-java_home-location) manually:

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.0.2.jdk/Contents/Home
export CFLAGS="-I$JAVA_HOME/include -I$JAVA_HOME/include/darwin"
make themis_jni
```

### Build JAR with Java code

Since Themis 0.13, JavaThemis uses Gradle build system.
A Gradle wrapper is included in the root directory of the project
so you do not have to install Gradle manually.

```bash
./gradlew :desktop:jar
```

The resulting JAR file `java-themis-X.Y.Z.jar` will be placed into `src/wrappers/themis/java/build/libs`.
You then need to add it to your project.

To build older versions of Themis
you need to copy the entire [`com.cossacklabs.themis` package](https://github.com/cossacklabs/themis/tree/master/src/wrappers/themis/java)
and configure your build system to build it as a part of the application.

See [JavaThemis examples](https://github.com/cossacklabs/themis-java-examples)
for illustration of how to integrate JavaThemis into your project.
