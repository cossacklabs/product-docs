---
weight: 90
title:  Common data structures
---

# Common data structures

## Soter container

**Soter container** is used by many cryptosystems as an envelope for data.
It is a relatively lightweight container providing basic integrity checks.

### Data layout

Layout of a Soter container looks like this:

     0       4       8       12
    +-------+-------+-------+---------------------------------------+
    |  tag  |  size |  crc  |                payload                |
    +-------+-------+-------+---------------------------------------+

where

  - **tag** (4 bytes) is an identification code, akin to FourCC
  - **size** (4 bytes) stores the size of the container in bytes
  - **crc** (4 bytes) is a checksum of the container

All fields are stored in big-endian (network) byte order.

The **tag** field provides identification of the data stored in the Soter container.
It can be an arbitrary 4-byte sequence, but Soter and Themis prefer readable ASCII codes.
For example, here are some of the codes in use:

  - `UEC2` and `REC2` – EC keys on the P-256 elliptic curve
  - `TSPM` – Secure Session protocol messages
  - `TSSC` – serialized Secure Session state

The maximum size of a Soter container is limited to 4 GB,
due to the size of the **size** field.
Specifically, the maximum size of Soter container **payload** is 4,294,967,284 bytes.
Note that the **size** field includes both the header (12 bytes) and the payload.

The **crc** field is computed as reflected Castagnoli CRC-32C with polynomial 0x11EDC6F41,
as defined by [RFC 3309](https://tools.ietf.org/html/rfc3309) for SCTP.
The checksum is computed for the entire Soter container,
including the header in which the **crc** field is assumed to be zero.

### Integrity guarantees

Soter container provides only weak integrity guarantees.
CRC is enough to detect random bit flips and accidental data corruption in most cases,
but it provides no protection against malicious tampering and no error correction.

Thus, Soter containers are used in Themis for data which does not have other, cryptographic integrity checks embedded into it.
Most prominently, [asymmetric keys](../asymmetric-keypairs/) are enclosed in Soter containers.

### Example

Example container data (a public key):

```
00000000  55 45 43 32 00 00 00 2d  6c d5 6e f8 03 a4 b1 f7  |UEC2...-l.n.....|
00000010  28 43 ca 03 61 e1 81 1b  d0 b4 a1 2d 9a c4 81 3a  |(C..a......-...:|
00000020  2c 60 5d b2 45 51 b8 a4  71 a8 69 ae 8d           |,`].EQ..q.i..|
```

where you can see the data fields:

| Field   | Offset | Data          | Meaning |
| ------- | ------ | ------------- | ------- |
| tag     | 0x00   | `55 45 43 32` | `UEC2` – EC public key for the P-256 curve |
| size    | 0x04   | `00 00 00 2D` | 45 bytes: 12 bytes of header, 33 bytes of payload |
| crc     | 0x08   | `6C D5 6E F8` | container checksum |
| payload | 0x0C   | `03 A4 B1...` | data payload: public key parameters |

Here is a code snippet in Go, illustrating computation of Soter container checksum:

```go
package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"hash/crc32"
)

func main() {
	containerB64 := "VUVDMgAAAC1s1W74A6Sx9yhDygNh4YEb0LShLZrEgTosYF2yRVG4pHGoaa6N"
	container, _ := base64.StdEncoding.DecodeString(containerB64)

	crc := crc32.New(crc32.MakeTable(crc32.Castagnoli))

	// First write then "tag" and "size" fields, then a zero placeholder
	// for the "crc" field, and finally the payload.
	crc.Write(container[0:8])
	crc.Write(make([]byte, 4))
	crc.Write(container[12:])

	checksum := crc.Sum(nil)

	// Soter uses *reflected* Castagnoli CRC.
	checksum[0], checksum[3] = checksum[3], checksum[0]
	checksum[1], checksum[2] = checksum[2], checksum[1]

	if bytes.Equal(checksum, container[8:12]) {
		fmt.Println("✅ container checksum")
	} else {
		fmt.Println("❌ container checksum")
	}
}
```

## Soter symmetric algorithm descriptor

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
  - `0x0C0` — 196 bits
  - `0x100` — 256 bits

### Example

Soter algorithm descriptors are most commonly found in [Secure Cells](../secure-cell/#layout)
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
