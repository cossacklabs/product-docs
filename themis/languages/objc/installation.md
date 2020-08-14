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

Themis is [available via **CocoaPods**](https://cocoapods.org/pods/themis).

 1. Add the following line to your `Podfile`:

    ```
    pod 'themis'
    ```

 2. Install Themis pod:

    ```bash
    pod install
    ```

[Here are examples](../examples/) of CocoaPods projects with Themis in Swift and Objective-C.

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
This might prevent your app from being accepted to the App Store.
{{< /hint >}}

## Installing with Carthage

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
**Important:**
You should integrate *themis.framework* into your applications.
    {{< /hint >}}

[Here are examples](../examples/) of Carthage projects with Themis in Swift and Objective-C.
