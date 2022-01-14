---
weight: 10
title:  Soter container
---

# Soter container

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

## Integrity guarantees

Soter container provides only weak integrity guarantees.
CRC is enough to detect random bit flips and accidental data corruption in most cases,
but it provides no protection against malicious tampering and no error correction.

Thus, Soter containers are used in Themis for data which does not have other, cryptographic integrity checks embedded into it.
Most prominently, [asymmetric keys](../../asymmetric-keypairs/) are enclosed in Soter containers.

## Example

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

## Reference implementation

[On GitHub](https://github.com/cossacklabs/themis/blob/master/docs/reference-implementation/soter/soter-container.go)
you can find a reference implementation of Soter container in Go.

For example, here is how it works with the example data from above:

```go
package main

import (
	"encoding/base64"
	"encoding/hex"
	"fmt"

	"github.com/cossacklabs/themis/docs/reference-implementation/soter"
)

func main() {
	containerB64 := "VUVDMgAAAC1s1W74A6Sx9yhDygNh4YEb0LShLZrEgTosYF2yRVG4pHGoaa6N"
	containerBytes, _ := base64.StdEncoding.DecodeString(containerB64)

	fmt.Printf("Soter container:\n")
	fmt.Printf("%s\n", hex.Dump(containerBytes))

	container, _ := soter.ParseSoterContainer(containerBytes)

	fmt.Printf("container tag:  %s\n", container.Tag())
	fmt.Printf("CRC checksum:   %x\n", container.Checksum())
	fmt.Printf("payload length: %d\n", len(container.Payload))
}
```
