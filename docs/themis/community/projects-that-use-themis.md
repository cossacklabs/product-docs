---
weight: 4
title:  Projects that use Themis
---

# Projects that use Themis

Themis is widely-used for both non-commercial and commercial projects.
We've mentioned some of the [public projects in a blog post in December 2018](https://www.cossacklabs.com/blog/themis-contributors-and-projects-2018.html),
and a more complete list is as follows (in alphabetical order):

* [AppSpector](https://appspector.com/) —
  remote debugging platform for iOS and Android apps.
  Themis is used for end-to-end encryption of stored and transferred session data.

* [Bear App](https://bear.app/) —
  [endorsed by Apple](https://www.apple.com/ios/app-store/principles-practices/) iOS note-taking app.
  (Read more about how we've helped to add end-to-end encryption of user notes
  in this blog post:
  [Implementing End-to-End encryption in Bear App](https://www.cossacklabs.com/blog/end-to-end-encryption-in-bear-app.html).)

* [GoClinic](https://goclinic.io/) —
  healthcare information exchange platform from the Netherlands
  created for safe, effective, expedient, and long-term successful treatment of hospital patients.
  Special thank you goes to [@popaaaandrei](https://github.com/popaaaandrei).

* [Gochat](https://github.com/ys1382/gochat) by [@ys1382](https://github.com/ys1382/) —
  open source secure chat written in Go which uses Themis as the encryption engine.
  If you want to improve your Go knowledge – consider reading the source code.

* [Hashblock-exchange](https://github.com/hashblock/hashblock-exchange) —
  Hyperledger Sawtooth-based blockchain application
  where Themis is used to encrypt transaction content in blocks
  with elliptic cryptography.

* [kit](https://kitapp.co.uk/) —
  personal organiser mobile app for iOS and Android
  for secure storage of logins, passwords, dates, and notes
  with the help of end-to-end encryption.
  Themis is used to encrypt all the data that is shared between the users.

* Secure documents exchange app —
  Themis is used for storage encryption of user's PII, credentials, API keys.

## Libraries

Themis is used as dependency of other libraries:

* [Android secure storage library](https://github.com/epam/Android-Secure-Storage)  by EPAM
  is written on Java and allows storing encrypted values in Secure Preferences
  (supports Themis and Cipher encryption providers).
* [AndroidSecurePreferences](https://github.com/genaku/AndroidSecurePreferences)
  by [@genaku](https://github.com/genaku),
  with data encryption based on Themis.

## Sample projects

During the development stage, we frequently do Proof-of-Concept projects to test different assumptions.They serve as interesting demos (examples) of what Themis is capable of:

* [0fc](https://github.com/cossacklabs/0fc) — anonymous web chat.
  Python + WebThemis (C++, HTML/JS).
  [Read the blog post](https://cossacklabs.com/building-endtoend-webchat.html).

* [Sesto](https://github.com/cossacklabs/sesto) — secure storage.
  Python + WebThemis (C++, HTML/JS).
  [Read the blog post](https://cossacklabs.com/presenting-sesto.html).

* [Swift Alps](https://github.com/cossacklabs/theswiftalpsdemo) — secure communication demo:
  an iOS app with Python server based on Secure Session.
  Swift + Python.
  [Read the blog post](https://speakerdeck.com/vixentael/the-swift-alps-security-workshop).

* [Zero-Knowledge Architectures workshop](https://github.com/vixentael/zka-example) —
  iOS app for storing and sharing encrypted notes stored in Firebase database.
  Swift.

* [Java and Android examples](https://github.com/cossacklabs/themis-java-examples) —
  a set of handy examples that show how to encrypt data for storage (Secure Cell)
  or for sending it over network (Secure Message and Secure Session).
  Java.

## Do you use Themis too?

Want to be featured on our blog and get in the list of contributors, too?
[Write us](mailto:dev@cossacklabs.com) about the project you’ve created using Themis!
