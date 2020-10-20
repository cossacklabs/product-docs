---
weight: 2
title:  Installation for Android
---

# Installing JavaThemis for Android development

JavaThemis for Android is [available on JCenter and Bintray via **Maven**](https://bintray.com/cossacklabs/maven/themis).

Usually you want to install the stable package to benefit from automatic dependency management and security updates.
However, you can also build and install the latest JavaThemis from the source code.

## Installing stable version with Gradle

Just add the following lines to your `build.gradle` file:

```groovy
repositories {
    // Repositories for JavaThemis dependencies:
    google()
    jcenter()
}

dependencies {
    // Add JavaThemis as runtime dependency of your application.
    // Always pin the latest version, you can find it here:
    // https://bintray.com/cossacklabs/maven/themis
    implementation 'com.cossacklabs.com:themis:0.13.1'
}
```

{{< hint note >}}
If you experience difficulties with jcenter repository, try using maven instead: `maven { url "https://dl.bintray.com/cossacklabs/maven/" }`
{{< /hint >}}

Once JavaThemis is installed, you can [try out examples on your machine](../examples/).


## Configuring ProGuard / R8 rules

Sometimes when working with Android projects in `Release` configuration you might get the following runtime error:

```
Java.Lang.IncompatibleClassChangeError: no non-static method "Lcom/cossacklabs/themis/SecureCellSeal;.decrypt([B[B)[B"
[orion.mobile]   at Java.Interop.JniEnvironment+InstanceMethods.GetMethodID (Java.Interop.JniObjectReference type, System.String name, System.String signature) [0x0005b] in <42d2b7086f0a46efb99253c5db1ecca9>:0 
[orion.mobile]   at Android.Runtime.JNIEnv.GetMethodID (System.IntPtr kls, System.String name, System.String signature) [0x00007] in <3080427739614e60a939a88bf3f838d5>:0 
[orion.mobile]   at Com.Cossacklabs.Themis.SecureCell+ISealInvoker.Decrypt (System.Byte[] p0, System.Byte[] p1) [0x00017] in <cd618986d1ce4194b63cdd3366dad291>:0 
[orion.mobile]   at Themis.Droid.CellSealDroid.UnwrapData (Themis.ISecureCellData cipherTextData, System.Byte[] context) [0x0007e] in <a492e7118e094c3296442a386fe5d80e>:0 
[orion.mobile]    --- End of inner exception stack trace --
```

It is caused by ProGuard / R8 "over-optimizing" a build, stripping native Java classes as a result.

An easy solution is to add the following lines to the `proguard.cfg` file of your Android app project:

```
-keep class com.cossacklabs.themis.**
-keep class com.cossacklabs.themis.** {*;}
```

This tells ProGuard to keep Themis classes, not strip them from the final app.

Please refer to [the issue #716](https://github.com/cossacklabs/themis/issues/716) for details, and to the [example application made by @dodikk](https://github.com/dodikk/themis-xamarin-prototype/pull/10) who has discovered and troubleshot the issue.

## Building latest version from source

If the stable package version does not suit your needs,
you can manually build and install the latest version of Themis from source code.

The easiest way to do this is use the Docker container we use to build the packages.
Alternatively, you can set up the development environment yourself.

### Using Docker

The following command runs complete Themis build from source in our `android-build` container:

```bash
docker run --rm -it -v $(pwd):/projects cossacklabs/android-build \
    bash -c 'git clone https://github.com/cossacklabs/themis.git && \
             cd themis && git submodule update --init && \
             ./gradlew :android:assembleRelease'
```

The resulting Android library (AAR) will be placed into
`src/wrappers/themis/android/build/outputs/aar/android.aar`.
You can then rename it and add to your project.

### Manual setup

If you do not have Docker or wish to follow the build process yourself,
here are instructions for complete manual build.

#### Configure prerequisites

Themis for Android uses Gradle build system.
A Gradle wrapper is included in the root directory of the project
so you do not have to install Gradle manually.

The build system requires Java 8 or later,
but Android SDK does not support Java 9 or later versions at the moment.
You need to have JDK 8 installed and selected as your default JDK.

Like the rest of the modern Android ecosystem,
Themis uses [BoringSSL](https://boringssl.googlesource.com/boringssl/) as its cryptographic backend.
BoringSSL is included as a submodule in the Themis repository
and needs to be checked out.

You will need to install [Android SDK tools or Android Studio](https://developer.android.com/studio/index.html).
You don’t need the full Android Studio to build Themis, just the command line tools.

#### Build JavaThemis AAR

 1. Make sure to specify the correct path to your Android SDK.
    It is is typically installed into you home directory:

    ```bash
    # On Linux the SDK is usually located here:
    export ANDROID_HOME=$HOME/Android/sdk

    # On macOS the SDK is usually located here:
    export ANDROID_HOME=$HOME/Library/Android/sdk
    ```

 2. Make sure your SDK has the necessary build tools and Android NDK:

    ```bash
    $ANDROID_HOME/tools/bin/sdkmanager --update
    $ANDROID_HOME/tools/bin/sdkmanager 'build-tools;27.0.3' \
                                       'platforms;android-27' \
                                       'ndk-bundle'
    ```

 3. Since BoringSSL is included as a submodule,
    make sure all the Git submodules are initialised in your working copy:

    ```bash
    git submodule update --init
    ```

 4. Build JavaThemis for Android:

    ```bash
    ./gradlew :android:assembleRelease
    ```

   The resulting Android library (AAR) will be placed into
   `src/wrappers/themis/android/build/outputs/aar/android.aar`.
   You can then rename it and add to your project.

If you wish, you can run JavaThemis test suite on the connected device or emulator.
Make sure ADB is installed and enabled, then run:

```bash
./gradlew :android:connectedAndroidTest
```
