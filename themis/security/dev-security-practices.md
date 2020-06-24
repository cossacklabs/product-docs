---
weight: 2
title:  Development practices
---

# Themis development security practices

Our approach to testing Themis:

 1. Every Themis PR is checked with
    [CircleCI](https://circleci.com/gh/cossacklabs/themis),
    [Bitrise](https://www.bitrise.io),
    and [GitHub Actions](https://github.com/features/actions),
    which run a set of tests on the whole code base across 13 languages.

 2. Every major Themis release is tested by our internal systems,
    by building it on a number of platforms
    (including intentionally broken builds with wrong parameters).

 3. Every time some new security-related features are introduced to Themis,
    they undergo a brief 3rd-party code review.

## Automated security checks

All new code in pull requests and all existing code is continuously checked
by a number of security tools:

  - [clang-tidy](https://clang.llvm.org/extra/clang-tidy/) —
    a linter and static analysis tool to diagnose and fix common mistakes and bugs.
  - [ASan, MSan, UBSan](https://github.com/google/sanitizers) —
    dynamic analysis tools for detection of memory corruption, memory leaks,
    use of uninitialised memory, and undefined behaviour—all known
    to be a source of the most disastrous bugs,
  - [Valgrind](https://www.valgrind.org/) —
    a dynamic analysis tool that detects memory leaks and memory management issues.
    It's another line of defence against a well-known source of bugs.
  - [american fuzzy lop](https://lcamtuf.coredump.cx/afl/) —
    a fuzzer to exercise uncommon code paths and trigger weird behaviour where you least expect it.
  - Several cryptography-specific tests
    – like NIST statistical test suite and cross-compatibility tests –
    to ensure that no errors in cryptographic dependencies
    and random number generation might creep into this exact build.

We use tools like clang-tidy and Valgrind to test the very core of Themis library written in C.
But since there is also a number of wrappers written in other high-level languages,
we use standard language-specific means for them.

For example,
Rust code is inspected by [Clippy](https://github.com/rust-lang/rust-clippy),
Go code is vetted by [a number of linters](https://goreportcard.com/),
and of course each language wrapper has an extensive test suite
which is often larger than the code it verifies.

Testing mobile wrappers for iOS and Android has its own difficulties:
Android emulator needs 5–10 minutes just to start up,
and iOS testing requires provisioning of hardware running macOS.

## Testing cryptography

We have a [dedicated cryptography test suite](https://github.com/cossacklabs/themis/tree/master/tests/soter)
that contains test initialisation vectors for testing the donor cryptographic libraries
with known parameters and results.
We check that all supported libraries –
[OpenSSL](https://www.openssl.org/),
[LibreSSL](http://www.libressl.org/),
[BoringSSL](https://boringssl.googlesource.com/boringssl/) –
agree with each other and implement the same algorithms in the same way.

The [statistical test developed by NIST](https://github.com/cossacklabs/themis/tree/master/tests/soter/nist-sts)
is used to verify the quality of pseudo-random number generators in the donor libraries.

For symmetric encryption, we also run a selected set of NIST-recommended tests for AES-256.
Such test sets contain both the initialsation vectors and the expected output.

The only cryptographic implementation provided by Themis directly
(ed25519-driven Socialist Millionaire Protocol
used in [Secure Comparator](/themis/crypto-theory/crypto-systems/secure-comparator/))
is tested against known attacks via a separate [security test](https://github.com/cossacklabs/themis/blob/master/tests/themis/themis_secure_comparator_security.c).

## Testing compatibility

We strive to build the most complete and explicit tests for Themis.
They include both the functional and the API tests
that check if correct and expected errors are returned for unexpected/invalid values.

For the core functionality and every language wrapper
we have created an extensive unit test suite
which can be found in the [`tests`](https://github.com/cossacklabs/themis/tree/master/tests) directory.

Besides, we built an [integration test suite](https://github.com/cossacklabs/themis/tree/master/tests/_integration)
which verifies:

- Compatibility between language wrappers:
  i.e., that data encrypted by RubyThemis can be decrypted using Gothemis
  and vice versa for all supported platforms.
- Compatibility of the previous and current versions of Themis to ensure smooth updates.
- Running Themis on different architectures: i386, x86_64, all of the ARMs, etc.
- Running Themis on different OS distributions: Ubuntu, Debian, CentOS, macOS.

Of course, we also run [GCC](https://gcc.gnu.org/) and [Clang](http://clang.org/)
in maximum warning verbosity mode to see all the possible warnings.
The two compilers used side by side return the most complete tests
and bridge the majority of the possible testing gaps.
