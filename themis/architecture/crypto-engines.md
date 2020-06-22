---
weight: 6
title:  Cryptography engines
---

# Cryptography engines

All the files in the root directory of Soter
– [`src/soter`](https://github.com/cossacklabs/themis/tree/master/src/soter) –
are engine-independent.
Files that depend on the interface and implementation details of a particular cryptography engine
are placed into the corresponding subdirectory of Soter:

  - [`src/soter/openssl`](https://github.com/cossacklabs/themis/tree/master/src/soter/openssl)
    for OpenSSL and LibreSSL
  - [`src/soter/boringssl`](https://github.com/cossacklabs/themis/tree/master/src/soter/boringssl)
    for BoringSSL

The engine is selected during the build phase of Themis
by setting the `ENGINE` variable in the Makefile.
The following values are supported:

  - `openssl` (default option)
  - `libressl`
  - `boringssl`

Check out the page on [building and installing Themis](/themis/installation/installation-from-sources/) to learn more.

#### Adding new cryptography engines

To add support for the new crypto engine to Themis:

  - write engine adapter with Soter interface
    (see [`src/soter/soter.h`](https://github.com/cossacklabs/themis/blob/master/src/soter/soter.h))
  - put it into `${your_engine}` subdirectory in Soter's root directory
  - add the following engine-selecting block to the Makefile:
    ```bash
    ifeq ($(ENGINE),your_engine)
        CRYPTO_ENGINE_DEF  = YOUR_ENGINE    # C preprocessor definitions
        CRYPTO_ENGINE_PATH = your_engine    # subdirectory name
    endif
    ```
