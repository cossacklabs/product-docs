---
weight: 20
title:  Soter symmetric algorithm descriptor
---

# Soter symmetric algorithm descriptor

**Soter algorithm descriptor** is used by some cryptosystems to identify symmetric encryption algorithms.
While in most cases it is used internally in API,
some cryptosystems actually store corresponding descriptors with encrypted data.

Algorithm descriptors are 32-bit bitmasks with multiple fields:

          28      24      20      16      12       8       4       0
    +-------+-------+-------+-------+-------+-------+-------+-------+
    |  alg. |  KDF  |  ---  |padding|  ---  |      key length       |
    +-------+-------+-------+-------+-------+-------+-------+-------+

where

  - **algorithm** (4 bits) defines the encryption algorithm
  - **KDF** (4 bits) identifies built-in key derivation function
  - **padding** (4 bits) defines padding in use, if any
  - **key length** (12 bits) stores the symmetric key length

Some of the bits are currently unused and reserved.
They are always set to zero.

Supported values for the **algorithm** are:

  - `0x1` — AES-ECB (_deprecated_)
  - `0x2` — AES-CTR
  - `0x3` — AES-XTS
  - `0x4` — AES-GCM

**KDF** choices are as follows:

  - `0x0` — Soter KDF (or no KDF, depending on context)
  - `0x1` — PBKDF2 with HMAC-SHA-256

Supported **padding** options are:

  - `0x0` — no padding
  - `0x1` — PKCS#7 padding

Available **key lengths** are:

  - `0x080` — 128 bits
  - `0x0C0` — 192 bits
  - `0x100` — 256 bits

## Example

Soter algorithm descriptors are most commonly found in [Secure Cells](../../secure-cell/layout/)
where the most common options are AES-GCM variants.
For example: `0x40010100`, where you can see the data fields:

| Field      | Offset | Data            | Meaning        |
| ---------- | ------:| --------------- | -------------- |
| algorithm  |     28 | `4` (4 bits)    | AES-GCM        |
| KDF        |     24 | `0` (4 bits)    | Soter KDF      |
| *reserved* |     20 | `0` (4 bits)    | —              |
| padding    |     16 | `1` (4 bits)    | PKCS#7 padding |
| *reserved* |     12 | `0` (4 bits)    | —              |
| key length |      0 | `100` (12 bits) | 256-bit key    |
