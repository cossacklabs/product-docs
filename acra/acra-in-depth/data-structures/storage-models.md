---
title: Storage models
weight: 4
---

# Data storage models

There are two storage model modes used in Acra to store data in database cell: WholeCell and InjectedCell.

In WholeCell mode, CryptoEnvelope ([AcraStruct](/acra/acra-in-depth/data-structures/acrastruct) or [AcraBlock](/acra/acra-in-depth/data-structures/acrablock)) represents a complete piece of data (i.e. database cell, a file, or some data transmitted into AcraTranslator). 

In this mode it is expected that the encrypted data will look something like:

1. `<CryptoEnvelope>`,
2. `<CryptoEnvelope>`,
3. `<CryptoEnvelope>`.

In InjectedCell mode, CryptoEnvelope is stored inside some piece of data, i.e. inside some file or in a database cell with a file inside, with CryptoEnvelope as a piece of that file, not the whole file. In this mode, the encrypted data will look something like this:

1. `<Some CryptoEnvelope data, some other CryptoEnvelope data>`,
2. `<CryptoEnvelope>`,
3. `<File containing CryptoEnvelope alongside other data>`.

The main difference between these modes is performance. 

In the WholeCell mode, CryptoEnvelope are simply decrypted. In InjectedCell mode, AcraServer needs to find CryptoEnvelopes inside some other data element first and then decrypt them, which takes obviously take longer. The process of searching for the necessary piece of data takes place as the data is going through Acra. Acra will look for CryptoEnvelopes in every piece of data in InjectedCell mode.

## Which mode should you choose?

{{< hint warning >}}
We are deprecating InjectedCell mode due to performance reasons. It will be removed in the next versions of Acra.
{{< /hint >}}

Let’s consider an example where we’re storing an email in a database and we’d like to encrypt it, “wrapping” it into an CryptoEnvelope. We’d get a table:

| Email        | Column 2     | Column 3     |
|--------------|--------------|--------------|
| `<CryptoEnvelope>` | Column2Value | Column3Value |
| `<CryptoEnvelope>` | Column2Value | Column3Value |

In this case, an CryptoEnvelope takes up a whole cell and we are trying to decrypt it as is, without searching for anything.
But things can be different. In InjectedCell mode a binary [MsgPack](https://msgpack.org/index.html) or [protobuf](https://developers.google.com/protocol-buffers/) could be stored in a table, and it is possible that in those data entities only one field is encrypted.

Such data entity wouldn’t be a single CryptoEnvelope - it would be a data entity that contains an CryptoEnvelope or several CryptoEnvelopes. This means that in the InjectedCell mode we stop assuming that the database cells can only contain complete CryptoEnvelopes. CryptoEnvelopes can be inside some other pieces of data and that’s where we’re starting to look for them. This consequently slows down the processing speed. However, not every task needs the InjectedCell mode, which is why one can switch between modes, depending on what you’re encrypting and how you’re storing it.

By default, the WholeCell mode is active (`--acrastruct_wholecell_enable`). You can switch between the modes using startup parameters:

```
--acrastruct_injectedcell_enable
    AcraStruct may be injected into any place of data cell
--acrastruct_wholecell_enable
    AcraStruct will stored in whole data cell (default true)
```

Both these flags switch mode for AcraBlocks too.

Also see the [AcraServer CLI reference](/acra/configuring-maintaining/general-configuration/acra-server/).