---
weight: 3
title:  Contributing to Themis
---

# Contributing to Themis

Themis is an open-source, Apache 2 licensed software,
maintained by [Cossack Labs](https://www.cossacklabs.com)
for building reliable cryptography in our products:
[Acra](https://www.github.com/cossacklabs/acra),
[Hermes](https://github.com/cossacklabs/hermes-core)
and [Toughbase](https://www.cossacklabs.com/toughbase).
You can hack it in any way you want and contribute things back
if you need something more than what we provide.

As a development company, we focus on implementing features that are important to our products
but would gladly spend some time to make Themis useful for everybody.

Every commit that goes into the master branch is audited and reviewed by somebody from Cossack Labs,
don't be surprised if the review takes longer than you expect.

#### I'd like to help somehow, but don't know what will be useful. What should I do?

If you're looking for something to contribute to and gain eternal respect,
just pick the things in the [list of issues](https://github.com/cossacklabs/themis/issues)
and let us know via [email](mailto:dev@cossacklabs.com),
or raise a [new issue](https://github.com/cossacklabs/themis/issues)
to make sure nobody's on it yet.

Issues marked as ["enhancement"](https://github.com/cossacklabs/themis/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3Aenhancement%20) are a great place to start.

If you'd like to work on independent parts, like implement a useful new method
or build a language wrapper for a language or platform we don't have and don't even plan yet –
just go ahead and let us know when you finish.

If you'd like to participate in the core development more closely,
[get in touch](mailto:dev@cossacklabs.com).

## Development quickstart

### Getting ready

 1. Read the [Themis architecture](/themis/themis-architecture/) section of the documentation,
    make sure that you understand everything
    (or at least you start thinking you understand everything).

 2. Get familiar with the [directory structure](/themis/themis-architecture/directory-structure/)
    and the way the [build system](/themis/installation/installation-from-sources/) works.

 3. Brace yourself for a lengthy session of reading the source code.

### Writing code

  - Themis Core is written in portable C so we kindly ask you to stick to the coding style you see.

    The same goes for the language wrappers written in high-level languages.

  - Themis Core uses object-oriented design patterns.

    The first parameter in most calls is an object context pointer
    passed back and forth through all calls of related functions (object methods).

    Each object has a "constructor" - `themis_object_create()` method
    that allocates an object in the memory, initialises it, and returns the pointer to it.

    Each object also has a "destructor" – `themis_object_destroy()` method
    that accepts an object context pointer, correctly destroys its members, and frees the memory.

  - Keep the code working for everyone.

    We wrote high-level wrappers and examples in the way
    we think would be the most beneficial to the end-users.
    However, we're boring system-level programmers who could've missed some important style-related things.

    Feel free to introduce stylistic or ergonomic changes to anything in the high-level area,
    just make sure that they work the way they were supposed to initially
    and any existing application code does not break.

### Submitting changes

 1. [Fork the repository](https://github.com/cossacklabs/themis/) on GitHub
    and `git clone` the **master** branch.

 2. Modify the source to fix or improve something.
    Supply the change with a test if you can.

 3. Create a GitHub pull request
    (or send us as a patch via [email](mailto:dev@cossacklabs.com), if you insist).

 4. Wait for the team members to review, accept or discuss the changes you're proposing.

In a perfect world, you would also raise an issue
in [GitHub Issues](https://github.com/cossacklabs/themis/issues)
to make sure no duplicate work takes place, but that's up to you :)
