---
weight: 40
title: "Debugging and troubleshooting"
bookCollapseSection: true
---


# Debugging and troubleshooting

## Updating Themis version

Most times, updating Themis version is easy and transparent. Sometimes, you might need to update code. [Checkout migration guides.](/docs/themis/debugging/migration-guides/)


## Debugging Themis behaviour

Sometimes, encryption doesn't work as you'd like. Most times, that problem lies in data decoding/encoding and using correct keys.


### Using local CLI utils

Use [command line utilities](/docs/themis/debugging/cli-utilities/#python-console-utils) to test encryption/decryption locally. It's useful when you application generates encrypted data and you want to be sure that data can be decrypted on other side. CLI utils support SecureCell and SecureMessage and are available in most languages.


### Themis server

If you don't want to run CLI utils, [checkout Themis server](/docs/themis/debugging/themis-server/). It's a webserver that we built and deployed, so you can access it freely.

Themis server allows you to test SecureCell in all modes, as well as gives you second party of Secure Message and Secure Session communication. Use Themis server as if it was your backend, or your second app, and make sure that you are using correct encoding and keys.


## Thread safety

Themis as a library is safe to use from multiple threads for non-interactive cryptosystems (Secure Cell and Secure Message) and isn’t thread safe for interactive protocols (Secure Comparator and Secure Session). Learn more about [thread safety](/docs/themis/debugging/thread-safety/).