---
title: Storage models
weight: 4
---

# Data storage models

There are two storage model modes used in Acra to store data in database cell: WholeCell (deprecated) and InjectedCell.

In WholeCell mode, CryptoEnvelope ([AcraStruct](/acra/acra-in-depth/data-structures/acrastruct) or [AcraBlock](/acra/acra-in-depth/data-structures/acrablock)) represents a complete piece of data (i.e. database cell, a file, or some data transmitted into AcraTranslator). 

In this mode it is expected that the encrypted data will look something like:

1. `<CryptoEnvelope>`,
2. `<CryptoEnvelope>`,
3. `<CryptoEnvelope>`.

In InjectedCell mode, CryptoEnvelope is stored inside some piece of data, i.e. inside some file or in a database cell with a file inside, with CryptoEnvelope as a piece of that file, not the whole file. In this mode, the encrypted data will look something like this:

1. `<Some CryptoEnvelope data, some other CryptoEnvelope data>`,
2. `<CryptoEnvelope>`,
3. `<File containing CryptoEnvelope alongside other data>`.

The difference between these modes is in performance and usage scenarios.

In the WholeCell mode, CryptoEnvelope is simply decrypted.

In InjectedCell mode, AcraServer needs to find CryptoEnvelopes inside some other data element first and then decrypt them, which may take a bit longer.
The process of searching for the necessary piece of data takes place as the data is going through Acra.
Acra will look for CryptoEnvelopes in every piece of data in InjectedCell mode.

## Comparison

{{< hint warning >}}
Since Acra 0.90.0 release, the WholeCell mode is now deprecated and AcraServer is always working in InjectedCell mode.
Related configuration flags (`--acrastruct_injectedcell_enable` and `--acrastruct_wholecell_enable`) no longer have effect.
{{< /hint >}}

Let’s consider an example where we’re storing an email in a database and we’d like to encrypt it, “wrapping” it into an CryptoEnvelope. We’d get a table:

| Email        | Column 2     | Column 3     |
|--------------|--------------|--------------|
| `<CryptoEnvelope>` | Column2Value | Column3Value |
| `<CryptoEnvelope>` | Column2Value | Column3Value |

In this case, an CryptoEnvelope takes up a whole cell and we are trying to decrypt it as is, without searching for anything.
But things can be different. In InjectedCell mode a binary [MsgPack](https://msgpack.org/index.html) or [protobuf](https://developers.google.com/protocol-buffers/) could be stored in a table, and it is possible that in those data entities only one field is encrypted.

Such data entity wouldn’t be a single CryptoEnvelope - it would be a data entity that contains an CryptoEnvelope or several CryptoEnvelopes.
This means that in the InjectedCell mode we stop assuming that the database cells can only contain complete CryptoEnvelopes.
CryptoEnvelopes can be inside some other pieces of data and that’s where we’re starting to look for them.
