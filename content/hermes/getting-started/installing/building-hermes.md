---
weight: 2
title: Building Hermes
---

# Building Hermes

You need to start with installing the libraries and utilities that we're going to need.

For Debian the command is:

```bash
sudo apt-get update && sudo apt-get install build-essential libssl-dev git
```

We need `build-essential` for building binary libraries and `libssl-dev` as backend for [Themis](https://github.com/cossacklabs/themis).

Let's download and install Themis into your system:

```bash
git clone https://github.com/cossacklabs/themis
cd themis
make && sudo make install
cd ..
```

Now you should download and install Hermes-core:

```bash
git clone https://github.com/cossacklabs/hermes-core
cd hermes-core
make && sudo make install
```

#### Verify Hermes-core

To verify Hermes-core, build and run the tests:

```bash
make test
```

You're going to see a similar output on success:

```bash
== Entering suite #1, "rpc test" ==

--> 3 check(s), 3 ok, 0 failed (0.00%)

==> 3 check(s) in 1 suite(s) finished after 0.00 second(s),
    3 succeeded, 0 failed (0.00%)

[SUCCESS]

build/tests/credential_store_test
== Entering suite #1, "credential_store test" ==

--> 97 check(s), 97 ok, 0 failed (0.00%)

==> 97 check(s) in 1 suite(s) finished after 1.00 second(s),
    97 succeeded, 0 failed (0.00%)

[SUCCESS]

build/tests/data_store_test
== Entering suite #1, "data_store test" ==

--> 28 check(s), 28 ok, 0 failed (0.00%)

==> 28 check(s) in 1 suite(s) finished after 1.00 second(s),
    28 succeeded, 0 failed (0.00%)

[SUCCESS]

build/tests/key_store_test
== Entering suite #1, "key_store test" ==

--> 26 check(s), 26 ok, 0 failed (0.00%)

==> 26 check(s) in 1 suite(s) finished after 1.00 second(s),
    26 succeeded, 0 failed (0.00%)

[SUCCESS]

build/tests/client_test
== Entering suite #1, "client test" ==

--> 93 check(s), 93 ok, 0 failed (0.00%)

==> 93 check(s) in 1 suite(s) finished after 1.00 second(s),
    93 succeeded, 0 failed (0.00%)

[SUCCESS]

build/tests/mid_hermes_test

== Entering suite #1, "mid hermes test" ==

--> 1492 check(s), 1492 ok, 0 failed (0.00%)

==> 1492 check(s) in 1 suite(s) finished after 7.00 second(s),
    1492 succeeded, 0 failed (0.00%)

[SUCCESS]


build/tests/mid_hermes_ll_test
== Entering suite #1, "mid hermes ll test" ==

--> 28 check(s), 28 ok, 0 failed (0.00%)

==> 28 check(s) in 1 suite(s) finished after 0.00 second(s),
    28 succeeded, 0 failed (0.00%)

[SUCCESS]
```

Congratulations, you've successfully built Hermes-core.