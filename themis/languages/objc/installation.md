---
weight: 2
title:  Installation
---

# Installing Themis for iOS and macOS

Themis can be installed with **SPM**, **CocoaPods** and **Carthage**.
Usually you want to install the stable package to benefit from automatic dependency management and security updates.

It is also possible to build the latest version of Themis from source,
but it is highly non-trivial.
Please [drop us an email](mailto:dev@cossacklabs.com) if you need assistance.

## Installing with SPM

Themis is available via SPM (Swift Package Manager).

Use the repository link:

```
https://github.com/cossacklabs/themis
```

[Here are examples](../examples/) of SPM projects with Themis in Swift and Objective-C.

## Installing with CocoaPods

{{< hint info >}}
Use Themis version `0.13.10` or newer for full Apple Silicon support.
{{< /hint >}}

Themis is [available via **CocoaPods**](https://cocoapods.org/pods/themis).

 1. Add the following line to your `Podfile`:

    ```
    pod 'themis'
    ```

 2. Install Themis pod:

    ```bash
    pod install
    ```

[Here are examples](../examples/) of CocoaPods projects with Themis in Swift and Objective-C. These example projects are updated for Xcode 12.

#### Using BoringSSL

{{< hint warning >}}
BoringSSL subspec is deprecated and will be removed in Themis 0.14. Please switch to the default subspec.
{{< /hint >}}

By default, Themis uses OpenSSL as its crypto-engine.

If your project uses BoringSSL or gRPC libraries,
you might want to switch to BoringSSL crypto-engine for Themis.
Currently, BoringSSL is only available via CocoaPods:

```
pod 'themis/themis-boringssl'
```

{{< hint warning >}}
Unfortunately, BoringSSL for iOS doesn’t support _bitcode_,
so Themis with BoringSSL also doesn’t support bitcode :(
Please disable bitcode for your application before archiving it to App Store, and everything will be fine.
{{< /hint >}}

#### Using OpenSSL Alternative

{{< hint warning >}}
`themis-openssl` subspec based on GRKOpenSSLFramework is deprecated and will be removed in Themis version 0.14. Please switch to the default subspec.
{{< /hint >}}

## Installing with Carthage

{{< hint info >}}
Xcode 12 has introduced Apple Silicon support on macOS. Since [0.13.9](https://github.com/cossacklabs/themis/releases/tag/0.13.9) Themis uses XCFrameworks to support ARM64 architecture on macOS and ARM64-iphonesimulator architecture slice for iOS. First support of Apple Silicon was introduced in [0.13.4](https://github.com/cossacklabs/themis/releases/tag/0.13.4), but excluded ARM64-iphonesimulator architecture slice for iOS.

The required Carthage version to build Themis XCFramework is 0.38.0. You can continue using previous Carthage version with older Themis version where ARM64-iphonesimulator architecture slice is excluded.
{{< /hint >}}


Themis is also available via [**Carthage**](https://github.com/Carthage/Carthage).

 1. Add the following line to your `Cartfile`:

    ```
    github "cossacklabs/themis"
    ```

 2. Download and build Themis:

    ```bash
    carthage update --use-xcframeworks
    ```

 3. Integrate **themis.framework** into your project
    according to [Carthage instructions](https://github.com/Carthage/Carthage#adding-frameworks-to-an-application).

    {{< hint warning >}}
You should drag&drop only **themis.xcframework** into your applications from `Cartage/Build/themis.xcframework`. Do not add **openssl.xcframework** manually from `Cartage/Build/themis.xcframework`, as it is statically linked with Themis (Carthage handles linking.). 
    {{< /hint >}}

[Here are examples](../examples/) of Carthage projects with Themis in Swift and Objective-C. These example projects are updated for Xcode 12.
