---
title: acra-tokens
bookCollapseSection: true
---

## acra-tokens

`acra-tokens` is a command-line utility used for different token operations.

Each tokenization process performed by AcraServer or AcraTranslator adds
one more token/plaintext pair into token storage (BoltDB or Redis).
As a result, the token storage only grows in size.
The amount of unused, unneeded tokens will grow as well.
Obviously, this will sooner or later cause performance issues, not talking about wasted resources.

And this is where `acra-tokens` utility can help.
Since Acra tracks token access time, you can, for example,
use `acra-tokens` to remove tokens that were accessed more than N days ago.
In some cases, "accessed long time ago" does not mean it is useless now, you can first `disable` old tokens
and then run some tests of you application to ensure it works properly.
If turns out some disabled token is actually needed, you can `enable` it back.
And then, if everything is OK, `remove` remaining disabled tokens.

Here are supported sub-commands:

* [`status`]({{< ref "status" >}}) —
  show token storage statistics

* [`disable`]({{< ref "disable" >}}) —
  disable tokens, preventing their use

* [`enable`]({{< ref "enable" >}}) —
  enable back once disabled tokens, allowing their use

* [`remove`]({{< ref "remove" >}}) —
  remove tokens from the storage
