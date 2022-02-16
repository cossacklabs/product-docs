---
weight: 2
title: React Native Themis installation
---

# Installing Themis for React Native

TBD

Themis can be installed with **SPM**, **CocoaPods** and **Carthage**.
Usually you want to install the stable package to benefit from automatic dependency management and security updates.

It is also possible to build the latest version of Themis from source,
but it is highly non-trivial.
Please [drop us an email](mailto:dev@cossacklabs.com) if you need assistance.

## Installing with CocoaPods

TBD

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

[Here are examples](../examples/) of CocoaPods projects with Themis in React Native Themis. These example projects are updated for Xcode 13.
