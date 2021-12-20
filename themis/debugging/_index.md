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

## Thread safety

Themis is safe to use from multiple threads for non-interactive cryptosystems
but interactive protocols have to be correctly synchronised.
[Learn more about thread safety](/themis/debugging/thread-safety/).
