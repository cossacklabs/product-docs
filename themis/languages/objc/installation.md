---
weight: 2
title:  Installation
---

# Installing Themis for iOS and macOS

Themis can be installed with **CocoaPods** and **Carthage**.
Usually you want to install the stable package to benefit from automatic dependency management and security updates.

It is also possible to build the latest version of Themis from source,
but it is highly non-trivial.
Please [drop us an email](mailto:dev@cossacklabs.com) if you need assistance.

## Installing with CocoaPods

{{< hint info >}}
Xcode 12 has introduced Apple Silicon support on macOS. Themis currently doesn't support the new ARM64 architecture on macOS. Follow the issue [#725](https://github.com/cossacklabs/themis/issues/725) for updates.

**iOS apps:**

  - Xcode 12: use latest Themis (`0.13.3` and later). It excludes ARM64-iphonesimulator architecture slice for now. Resulting app can be submitted to App Store.
  - Xcode 11: use `pod themis, "0.13.0"` for now. Newer releases are not compatible with older Xcode version. We are working on improved compatibility.

See issues [#715](https://github.com/cossacklabs/themis/issues/715), [#725](https://github.com/cossacklabs/themis/issues/725).

**macOS:**

If you're supporting `x86_64` and `arm64`, use Themis `0.13.4` and later. Previous versions don't contain `arm64` slice.
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

## Installing with Carthage

{{< hint info >}}
Xcode 12 has introduced Apple Silicon support on macOS. Since [0.13.4](https://github.com/cossacklabs/themis/releases/tag/0.13.4) Themis supports ARM64 architecture on macOS, but excludes ARM64-iphonesimulator architecture slice for iOS. Follow the issue [#725](https://github.com/cossacklabs/themis/issues/725) for details.

**iOS:**
Exclude arm64-iphonesimulator architecture slice for now (see issue [#713](https://github.com/cossacklabs/themis/issues/713)).

**macOS:**
If you're supporting `x86_64` and `arm64`, use Themis `0.13.4` and later. Previous versions don't contain `arm64` slice. See issues [#725](https://github.com/cossacklabs/themis/issues/725), [#713](https://github.com/cossacklabs/themis/issues/713).
{{< /hint >}}


Themis is also available via [**Carthage**](https://github.com/Carthage/Carthage).

 1. Add the following line to your `Cartfile`:

    ```
    github "cossacklabs/themis"
    ```

 2. Download and build Themis:

    ```bash
    carthage update
    ```

 3. Integrate **themis.framework** into your project
    according to [Carthage instructions](https://github.com/Carthage/Carthage#adding-frameworks-to-an-application).

    {{< hint warning >}}
You should drag&drop only **themis.framework** into your applications from `Cartage/Build/iOS/themis.framework`. Do not add **openssl.framework** manually from `Cartage/Build/iOS/themis.framework`, as it is statically linked with Themis (Carthage handles linking.). 
    {{< /hint >}}

[Here are examples](../examples/) of Carthage projects with Themis in Swift and Objective-C. These example projects are updated for Xcode 12.
