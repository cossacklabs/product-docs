---
weight: 40
title:  Secure Cell examples
---

# Secure Cell examples

Now let's look at and dissect sample data protected by Secure Cell.
You can try it out yourself using [command-line utilities](/themis/debugging/cli-utilities/) if you have Themis installed,
or with [Themis Server](/themis/debugging/themis-server/) from your web browser.

## Symmetric key encryption

With the following inputs
for [the `scell_seal_string_echo` utility](/themis/debugging/cli-utilities/):

| Input          | Value |
| -------------- | ----- |
| encryption key | `au6aimoa8Pee8wahxi4Aique6eaxai2a` |
| plaintext      | `encrypted message` |
| context data   | `additional context` |

Secure Cell in Seal mode produces the following output (encoded in base64):

    AAEBQAwAAAAQAAAAEQAAAM5da3KkReYC7++OPbrI13UycoVi3s01Ji64WQ/KIe+3oF8cgLle19WC+tnaCg==

which looks like this in hexadecimal (61 bytes):

```
00000000  00 01 01 40 0c 00 00 00  10 00 00 00 11 00 00 00  |...@............|
00000010  ce 5d 6b 72 a4 45 e6 02  ef ef 8e 3d ba c8 d7 75  |.]kr.E.....=...u|
00000020  32 72 85 62 de cd 35 26  2e b8 59 0f ca 21 ef b7  |2r.b..5&..Y..!..|
00000030  a0 5f 1c 80 b9 5e d7 d5  82 fa d9 da 0a           |._...^.......|
```

There you can note the authentication token (44 bytes):

```
00000000  00 01 01 40 0c 00 00 00  10 00 00 00 11 00 00 00  |...@............|
00000010  ce 5d 6b 72 a4 45 e6 02  ef ef 8e 3d ba c8 d7 75  |.]kr.E.....=...u|
00000020  32 72 85 62 de cd 35 26  2e b8 59 0f -- -- -- --  |2r.b..5&..Y.    |
00000030  -- -- -- -- -- -- -- --  -- -- -- --              |             |
```

and the actual encrypted data (17 bytes) in the end:

```
00000000  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000010  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000020  -- -- -- -- -- -- -- --  -- -- -- -- ca 21 ef b7  |            .!..|
00000030  a0 5f 1c 80 b9 5e d7 d5  82 fa d9 da 0a           |._...^.......|
```

Since Seal mode has been used, the token and data are concatenated.
In Token Protect mode they would have been returned as separate buffers.
Here's how they look encoded in base64:

    AAEBQAwAAAAQAAAAEQAAAM5da3KkReYC7++OPbrI13UycoVi3s01Ji64WQ8=

    yiHvt6BfHIC5XtfVgvrZ2go=

Try decrypting this data in Token Protect mode, it should work!

Let's inspect the authentication token now.
Match [the reference](/themis/spec/secure-cell/layout/#authentication-token--symmetric-keys)
with the data as follows:

| Field           | Offset | Data          | Meaning |
| --------------- | ------ | ------------- | ------- |
| algorithm ID    | 0x00   | `00 01 01 40` | `0x40010100` – AES-GCM-256, Soter KDF, PKCS#7 padding |
| IV length       | 0x04   | `0c 00 00 00` | IV data is 12 bytes long |
| auth tag length | 0x08   | `10 00 00 00` | auth tag is 16 bytes long |
| message length  | 0x0C   | `11 00 00 00` | payload is 17 bytes long |
| IV data         | 0x10   | `ce . . . 3d` | initialisation vector data |
| auth tag        | 0x1C   | `ba . . . 0f` | authentication tag data |

All the encoded values match the expectations.

## Pssphrase encryption

With the following inputs
for [the `scell_seal_string_echo_pw` utility](/themis/debugging/cli-utilities/):

| Input        | Value |
| ------------ | ----- |
| passphrase   | `correct horse battery staple` |
| plaintext    | `encrypted message` |
| context data | `additional context` |

Secure Cell in Seal mode produces the following output (encoded in base64):

    AAEBQQwAAAAQAAAAEQAAABYAAACM/x16YGKwIuBTawsFRQGgiBsJjuw8nHwShTmmQA0DABAA1a5WowtWsVhDAh/ZChtv+NKLyNk7N4KUsEd+6wvDl5rO

which looks like this in hexadecimal (87 bytes):

```
00000000  00 01 01 41 0c 00 00 00  10 00 00 00 11 00 00 00  |...A............|
00000010  16 00 00 00 8c ff 1d 7a  60 62 b0 22 e0 53 6b 0b  |.......z`b.".Sk.|
00000020  05 45 01 a0 88 1b 09 8e  ec 3c 9c 7c 12 85 39 a6  |.E.......<.|..9.|
00000030  40 0d 03 00 10 00 d5 ae  56 a3 0b 56 b1 58 43 02  |@.......V..V.XC.|
00000040  1f d9 0a 1b 6f f8 d2 8b  c8 d9 3b 37 82 94 b0 47  |....o.....;7...G|
00000050  7e eb 0b c3 97 9a ce                              |~......|
```

There you can note the extended authentication token (48 bytes):

```
00000000  00 01 01 41 0c 00 00 00  10 00 00 00 11 00 00 00  |...A............|
00000010  16 00 00 00 8c ff 1d 7a  60 62 b0 22 e0 53 6b 0b  |.......z`b.".Sk.|
00000020  05 45 01 a0 88 1b 09 8e  ec 3c 9c 7c 12 85 39 a6  |.E.......<.|..9.|
00000030  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000040  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000050  -- -- -- -- -- -- --                              |       |
```

the passphase key derivation context (22 bytes):

```
00000000  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000010  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000020  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000030  40 0d 03 00 10 00 d5 ae  56 a3 0b 56 b1 58 43 02  |@.......V..V.XC.|
00000040  1f d9 0a 1b 6f f8 -- --  -- -- -- -- -- -- -- --  |....o.          |
00000050  -- -- -- -- -- -- --                              |       |
```

and the actual encrypted data (17 bytes) in the end:

```
00000000  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000010  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000020  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000030  -- -- -- -- -- -- -- --  -- -- -- -- -- -- -- --  |                |
00000040  -- -- -- -- -- -- d2 8b  c8 d9 3b 37 82 94 b0 47  |      ....;7...G|
00000050  7e eb 0b c3 97 9a ce                              |~......|
```

Secure Cell supports passphrases only in Seal mode,
therefore the authentication token cannot be detached from the encrypted data.

Let's inspect the authentication token now.
Match [the reference](/themis/spec/secure-cell/layout/#authentication-token--passphrases)
with the data as follows:

| Field           | Offset | Data          | Meaning |
| --------------- | ------ | ------------- | ------- |
| algorithm ID    | 0x00   | `00 01 01 41` | `0x41010100` – AES-GCM-256, PBKDF2, PKCS#7 padding |
| IV length       | 0x04   | `0c 00 00 00` | IV data is 12 bytes long |
| auth tag length | 0x08   | `10 00 00 00` | auth tag is 16 bytes long |
| message length  | 0x0C   | `11 00 00 00` | payload is 17 bytes long |
| KDF length      | 0x10   | `16 00 00 00` | KDF context is 22 bytes long |
| IV data         | 0x14   | `8c . . . 0b` | initialisation vector data |
| auth tag        | 0x20   | `05 . . . a6` | authentication tag data |

and the PBKDF context data is interpreted like this:

| Field           | Offset | Data          | Meaning |
| --------------- | ------ | ------------- | ------- |
| iteration count | 0x30   | `40 0d 03 00` | 200,000 iterations |
| salt length     | 0x34   | `10 00`       | salt is 16 bytes long |
| salt            | 0x36   | `d5 . . . f8` | salt data |

All the encoded values match the expectations.

## Context Imprint mode

With the following inputs
for [the `scell_context_string_echo` utility](/themis/debugging/cli-utilities/):

| Input          | Value |
| -------------- | ----- |
| encryption key | `au6aimoa8Pee8wahxi4Aique6eaxai2a` |
| plaintext      | `encrypted message` |
| context data   | `additional context` |

Secure Cell in Context Imprint mode produces the following output (encoded in base64):

    egHLD0020cqhs5uB93CqdNA=

which looks like this in hexadecimal (17 bytes):

```
00000000  7a 01 cb 0f 4d 36 d1 ca  a1 b3 9b 81 f7 70 aa 74  |z...M6.......p.t|
00000010  d0                                                |.|
```

Note that the output has exactly the same length as the original plaintext.
It also never changes on repeated encryption,
contrary to the behaviour of other modes
which always produce a slightly different output each time with the same input parameters.
