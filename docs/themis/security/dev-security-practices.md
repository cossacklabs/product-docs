---
weight: 2
title: "Development Security Practices"
---

## Themis Development Security Practices

### Testing during the build process

Our approach to testing Themis:

1. Every Themis PR is checked with [CircleCI](https://circleci.com/gh/cossacklabs/themis), [Bitrise](https://www.bitrise.io), and [GitHub Actions](https://github.com/features/actions), which run a set of tests on the whole code base across 13 languages. 
2. Every major Themis release is manually tested by building it on a number of platforms (including with intentionally building Themis with wrong parameters).
3. Every time some new security-related features are introduced to Themis/summarised in a Themis release, they undergo a brief 3rd party code review. 


In CI, every PR gets checked by:

* [clang-tidy](https://clang.llvm.org/extra/clang-tidy/) as a linter and static analysis tool to diagnose and fix common mistakes and bugs,
* [ASan, MemSan, and UBSan](https://github.com/google/sanitizers) as dynamic analysis tools for detection of memory corruption, memory leaks, use of uninitialised memory, and undefined behaviour—all known to be a source of the most disastrous bugs,
* [Valgrind](http://valgrind.org/) as a dynamic analysis tool that detects memory leaks and memory management problems because we understand that poor memory management is often the source of the most catastrophic bugs.
* [american fuzzy lop](https://lcamtuf.coredump.cx/afl/) as fuzzer to exercise uncommon code paths and trigger weird behaviour where you least expect it,
* several cryptography-specific tests (like NIST statistical test suite and cross-compatibility tests) to ensure that no errors in cryptographic dependencies and random number generation might creep into this exact build.


We use tools like ASan and Valgrind for testing the very core of Themis library written in C. But since there is also a number of wrappers written in other popular languages, we use standard language-specific means for them. 

For example, Rust code is inspected by [Clippy](https://github.com/rust-lang/rust-clippy), Go code is vetted by [a number of linters](https://goreportcard.com/), and of course each language wrapper has an extensive test suite which is often larger than the code it verifies. 

Testing mobile wrappers for iOS and Android has its own difficulties: Android emulator needs 5–10 minutes just to start up, and iOS testing requires using the macOS.


### Testing cryptography 

We have a [special cryptographic test suite](https://github.com/cossacklabs/themis/tree/master/tests/soter) that contains test initialisation vectors for testing the donor cryptographic libraries with known parameters and results. These donor libraries are: [OpenSSL](https://www.openssl.org/), [LibreSSL](http://www.libressl.org/), [BoringSSL](https://boringssl.googlesource.com/boringssl/), [Libsodium](https://download.libsodium.org/doc/), [BearSSL](https://bearssl.org/). 

The [NIST-developed test](https://github.com/cossacklabs/themis/tree/master/tests/soter/nist-sts) is used for testing the quality of pseudo-random number generators in the donor libraries.

For symmetric encryption, we run a selected set of NIST-recommended tests for AES256. Such test sets contain both the initialsation vectors and the expected output.

The only cryptographic implementation hardcoded into Themis (ed25519-driven Socialist Millionaire Protocol used in [Secure Comparator](/docs/themis/crypto-theory/crypto-systems/secure-comparator/)) is tested against known attacks via [a separate test](https://github.com/cossacklabs/themis/blob/master/tests/themis/themis_secure_comparator_security.c). 

## Testing Builds and Major Changes 

We strive to build the most complete and explicit tests for Themis. They include both the functional and the API tests (that also check if correct error messages are returned for unexpected/invalid values).

For the core functionality and every language wrapper, including mobile, we created a unit test suit, placed in [tests](https://github.com/cossacklabs/themis/tree/master/tests) folder. 

Besides, we built an [integration test suit](https://github.com/cossacklabs/themis/tree/master/tests/_integration), to check:

- compatibility between language wrappers (f.e. encrypting using rubythemis, decrypting using gothemis);
- previous and current versions of Themis (backwards compatibility checks); 
- running Themis on different architectures (x86, x86_64, ARM);
- running Themis on different desktop OS (Ubuntu, Debian and CentOS).

On many important occasions, we run Themis through: 

- Several source code analysis tools like [Cppcheck](http://cppcheck.sourceforge.net/) (after an issue [#130](https://github.com/cossacklabs/themis/issues/130) raised by awesome [briongloden](https://github.com/bryongloden)) to provide different static analysis output to verify against the output provided by [Splint](https://sourceforge.net/projects/splint/). Cppcheck is particularly good at identifying undefined behaviour.
- [GCC](https://gcc.gnu.org/) and [Clang](http://clang.org/) in maximum warning verbosity mode to see all the possible warnings. The two compilers used side by side return the most complete tests and bridge the majority of the possible testing gaps.