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
Xcode 12 has introduced ARM64 macos architecture, which Themis currently doesn't support. Follow the issue [#725](https://github.com/cossacklabs/themis/issues/725) for updates.

**iOS:**
Xcode 12: use `pod themis, "0.13.3"`. It excludes arm64-iphonesimulator architecture slice for now. Resulting app can be submitted to App Store.
Xcode 11: use `pod themis, "0.13.0"`. It is compatible with Xcode 11, not with Xcode 12.

See [#715](https://github.com/cossacklabs/themis/issues/715), [#725](https://github.com/cossacklabs/themis/issues/725).

**macOS:**
If you use macOS, use `0.13.3`, and please exclude mac-arm64 for now (set `Build Active Architecture Only = YES`). This will build correct x86_64 application.
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
Xcode 12 has introduced ARM64 macos architecture, which Themis currently doesn't support. Follow the issue [#725](https://github.com/cossacklabs/themis/issues/725) for updates and exclude ARM64 architecture for now https://github.com/cossacklabs/themis/issues/713.

**iOS:**
Exclude arm64-iphonesimulator architecture slice for now (see https://github.com/cossacklabs/themis/issues/713).

**macOS:**
If you use macOS, use `0.13.3`, and please exclude mac-arm64 for now (set `Build Active Architecture Only = YES`). This will build correct x86_64 application.

See https://github.com/cossacklabs/themis/issues/725, https://github.com/cossacklabs/themis/issues/713.
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
