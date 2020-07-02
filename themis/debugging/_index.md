---
weight: 40
title: "Debugging and troubleshooting"
bookCollapseSection: true
---

# Debugging and troubleshooting

## Updating Themis

Most of the time switching to a newer Themis version is easy and straightforward. But sometimes a breaking change is necessary and you might need to update the application code.

[Check out migration guides](/themis/debugging/migration-guides/) to see if you are affected and what you should do to upgrade.

## Debugging Themis behaviour

Sometimes encryption doesn't work the way you'd like it to.
The problem often lies in decoding or encoding data correctly and in using the correct keys.

Here are some tools that might help you pinpoint the issue.

### Command-line utilites

[Use command-line utilities](/themis/debugging/cli-utilities/) to test encryption/decryption locally.
It's useful when your application generates encrypted data and you want to be sure that data can be decrypted on the other side.
CLI utilities support Secure Cell and Secure Message and are available in most languages.

### Themis Server

If you don't want to build and run CLI utilities,
[check out Themis server](/themis/debugging/themis-server/).
It's an interactive web server that we run, you can access it freely.

Themis Server allows you to test Secure Cell in all modes.
It can also act as a second party for Secure Message and Secure Session communications.
Use Themis server as if it was your backend, or your second app,
and make sure that you are using correct encoding and keys.

## Thread safety

Themis is safe to use from multiple threads for non-interactive cryptosystems
but interactive protocols have to be correctly synchronised.
[Learn more about thread safety](/themis/debugging/thread-safety/).
