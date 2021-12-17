---
title: On Hermes Security
---

# TESTING THE PERFORMANCE OF HERMES-CORE

We thoroughly tested Hermes-core to ensure it tends to be bug-free.
The testing process was subdivided into the following stages:

* [Module testing](https://docs.cossacklabs.com/pages/testing-hermes-core/#module-testing),
* [Static code analysis](https://docs.cossacklabs.com/pages/testing-hermes-core/#static-code-analysis),
* [Dynamic code analysis](https://docs.cossacklabs.com/pages/testing-hermes-core/#dynamic-code-analysis).

Here's what we did and here's how it worked:

## Module testing

Unit testing involves writing several test procedure calls and verifying the correctness of the returned values.

The majority of the interface functions of Hermes-core demands backends (for Data store/Credential store/Keystore) and transport to be implemented beforehand.

To simplify the testing and eliminate the influence of additional factors, simplified in-memory backends have been implemented for Stores (Data store, Credential store, Keystore) and transport using *pipes*.

The implementation and tests of backend and transport can be found in the corresponding folder of the `tests` [folder in Hermes-core repository](https://github.com/cossacklabs/hermes-core/tree/master/tests). The tests/rpc folder contains unit tests of the RPC implemented with the help of the transport mentioned above.

A standard target test was also added to the main Makefile for building tests. This means that you need to type the following command into the command line to build and run the tests:

```
make test
```

It's worth mentioning that the check target does not build the project.

In addition to unit testing, Hermes-core was also tested using static and dynamic code analysers.

## Static code analysis

For static code analysis, we used [cppcheck](http://cppcheck.sourceforge.net/) and [clang](https://clang.llvm.org/) static analysis tools.

```
$ cppcheck --force --enable=warning,performance,portability,information,missingInclude --inconclusive --std=posix --std=c89 -I include --error-exitcode=1 ./src
Checking src/common/buffer.c...
Checking src/common/buffer.c: DEBUG...
1/32 files checked 4% done
Checking src/common/hm_hash_table.c...
Checking src/common/hm_hash_table.c: DEBUG...
...
31/32 files checked 99% done
Checking src/secure_transport/utils.c...
Checking src/secure_transport/utils.c: DEBUG...
32/32 files checked 100% done
```

## Dynamic code analysis

While the static code analysis is performed without executing the code (i.e. on the compilation stage), dynamic analysis is performed during the code execution. When analysing the compiled code from a security standpoint, dynamic analysis often means ["fuzzing"](https://en.wikipedia.org/wiki/Fuzzing).

The advantage of fuzzing is that it is almost fully devoid of false positives (which quite often take place when static analyzers are used).

Usually, a fuzzer feeds the test data into the STDIN of the app through using a temporary file. If the process crashes - the fuzzer will notice it and write the data into the crashes directory. An important moment for a successful fuzzing is that Address Sanitizer is added - this way the app is guaranteed to crash when even one byte of the dynamic memory is overwritten. We use [sanitizers](https://github.com/google/sanitizers) embedded into the compiler and find it to be a highly rewarding and advisable testing practice.

There are two approaches to fuzzing: - fuzzing separate functions that look suspicious, - fuzzing the whole app.

The libFuzzer library was used for fuzzing. For implementing the first approach, a minimal wrapper needs to be written for the application:
```(fuzz.c) int LLVMFuzzerTestOneInput(const uint8t *Data, sizet Size) { functionForTest(Data, Size); return 0; }```

```
Compiling the wrapper with the addition of libFuzzer library:
```c
clang++ -g -fsanitize=address -fsanitize-coverage=trace-pc-guard FTS/tutorial/fuzz.c libFuzzer.a
```

In contrast to AFL, the `libFuzzer.a` library provides the `main` function (which simplifies the process as we don't need to implement it ourselves).

After compiling the test, let's launch:

```
$ ./a.out
```

If you've read this far into the documentation, congratulations! Contact us via [info@cossacklabs.com](mailto:info@cossacklabs.com), mention this paragraph — we have a nice surprise for you :)

For all the tested Hermes-core functions, the result is the same — error-free:

```
INFO: Seed: 3918206239
INFO: Loaded 1 modules (14 guards): [0x73be00, 0x73be38),
INFO: -max_len is not provided, using 64
INFO: A corpus is not provided, starting from an empty corpus
#0      READ units: 1
#1      INITED cov: 3 ft: 3 corp: 1/1b exec/s: 0 rss: 26Mb
#8      NEW    cov: 4 ft: 4 corp: 2/29b exec/s: 0 rss: 26Mb L: 28 MS: 2 InsertByte-InsertRepeatedBytes-
#3405   NEW    cov: 5 ft: 5 corp: 3/82b exec/s: 0 rss: 27Mb L: 53 MS: 4 InsertByte-EraseBytes-...
#8664   NEW    cov: 6 ft: 6 corp: 4/141b exec/s: 0 rss: 27Mb L: 59 MS: 3 CrossOver-EraseBytes-...
#272167 NEW    cov: 7 ft: 7 corp: 5/201b exec/s: 0 rss: 51Mb L: 60 MS: 1 InsertByte-
```