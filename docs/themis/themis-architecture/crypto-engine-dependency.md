---
weight: 6
title: "Crypto engine dependencies"
---

## Crypto engine dependencies

All the files in the root directory of Soter — **src/soter** are engine-independent. Files that depend on the sources of crypto engine are in the corresponding subfolder of Soter (look into **openssl** for **LibreSSL/OpenSSL** crypto engine and into **boringssl** for BoringSSL respectively).

The crypto engine is selected during the build phase of Themis by setting `ENGINE` variable in [Makefile](https://github.com/cossacklabs/themis/blob/master/Makefile#L81). The following values are supported: `openssl` (default option), `libressl`, and `boringssl`. Check out a detailed document on [building and installing Themis](/docs/themis/installation/installation-from-sources/) in the corresponding section.

To add support for the new crypto engine to Themis:

- write engine wrapper with Soter interface (see `src/soter/soter.h`);  
- put it in the _engine_ subfolder in Soter's root directory;  
- add  the following engine-selecting block to makefile:  


```bash
    ifeq ($(ENGINE),engine)
        CRYPTO_ENGINE_DEF= #engine defines if needed
        CRYPTO_ENGINE_PATH= #engine files path name
```