---
title: acra-tokens
bookCollapseSection: true
weight: 7
---

## acra-tokens

`acra-tokens` is a command-line utility used for various token operations.

Each tokenization process performed by AcraServer or AcraTranslator adds
one more token/encrypted-data pair into token storage (BoltDB or Redis).
As a result, the token storage only grows in size.
The amount of unused, unneeded tokens will grow as well.
Obviously, this will sooner or later cause performance issues, not talking about wasted resources.

And this is where `acra-tokens` utility can help.
Since Acra tracks token access time, you can, for example,
use `acra-tokens` to remove tokens that were accessed more than N days ago.
In some cases, "accessed long time ago" does not mean it is useless now, you can first `disable` old tokens
and then run some tests of your application to ensure it works properly.
If some disabled token is actually needed, you can `enable` it back.
And then, if everything is OK, `remove` remaining disabled tokens.

Here is the list of `acra-tokens` subcommands:

* [`status`]({{< ref "status" >}}) —
  shows token storage statistics;

* [`disable`]({{< ref "disable" >}}) —
  disables tokens, preventing their use;

* [`enable`]({{< ref "enable" >}}) —
  enables back once disabled tokens, allowing their usage;

* [`remove`]({{< ref "remove" >}}) —
  removes tokens from the storage.
