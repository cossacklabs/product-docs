---
weight: 10
title:  EC keys
---

# EC keys

In *elliptic curve cryptography* (ECC), keys are defined by a number of parameters.
**Domain parameters** describe a particular curve used for operations.
It is critical to use a curve with validated security properties,
therefore usually one of the well-known respectable curves is chosen.

As of Themis 0.13 released in 2020,
the following elliptic curves are supported:

  - NIST P-256, aka secp256r1, aka prime256v1 **(current default)**
  - NIST P-384, aka secp384r1
  - NIST P-521, aka secp521r1

All of them have been recommended by the NSA Suite B.

{{< hint info >}}
Migration to more recent recommendations of the CNSA Suite is pending.
{{< /hint >}}

As for variable parameters of the key,
a scalar integer **k** is used as a private key.
A point on the curve **P**, obtained by multiplying the base point of the curve by **k**, is the corresponding public key.

## Layout

EC keys are stored in [Soter containers](../../common/#soter-container).
The tags for the supported curves are as follows:

| Curve | Public key tag | Private key tag |
| ----- | -------------- | --------------- |
| P-256 | `UEC2`         | `REC2`          |
| P-384 | `UEC3`         | `REC3`          |
| P-521 | `UEC5`         | `REC5`          |

The payload of Soter container stores the key data encoded according to ANSI X9.62.
All fields are stored in big-endian (network) byte order.

Public key layout (for the P-256 curve):

     0 1                                                               33
    +-+-------+-------+-------+-------+-------+-------+-------+-------+
    |z|                               x                               |
    +-+-------+-------+-------+-------+-------+-------+-------+-------+

where

  - **z** (1 byte) is an indicator of the y coordinate value
  - **x** (32 bytes) is the x coordinate of the public point **P**

**z** is equal to `02` if the y coordinate of the public point is even, or `03` if it is odd.
No other values are permitted.
This is known as *compressed representation* of an elliptic curve point,
possible due to the fact that there are at most two points on a curve with a given x coordinate.

Private key layout (for the P-256 curve):

     0 1                                                               33
    +-+-------+-------+-------+-------+-------+-------+-------+-------+
    |0|                               k                               |
    +-+-------+-------+-------+-------+-------+-------+-------+-------+

where

  - **k** (32 bytes) is the private key **k**, a scalar integer

{{< hint info >}}
**Note:**
Due to historical reasons, private keys in Themis have the same length as public keys.
They include an additional octet in the beginning, always set to zero,
which is preserved for compatibility.
{{< /hint >}}

The size of the fields depends on the curve in use.
Total key size includes the length of Soter container header.

| Curve |  z | x, k | *Total key size* |
| ----- | --:| ----:| ----------------:|
| P-256 |  1 |   32 |         45 bytes |
| P-384 |  1 |   48 |         61 bytes |
| P-521 |  1 |   66 |         79 bytes |

## Example

Example public key:

```
00000000  55 45 43 32 00 00 00 2d  6c d5 6e f8 03 a4 b1 f7  |UEC2...-l.n.....|
00000010  28 43 ca 03 61 e1 81 1b  d0 b4 a1 2d 9a c4 81 3a  |(C..a......-...:|
00000020  2c 60 5d b2 45 51 b8 a4  71 a8 69 ae 8d           |,`].EQ..q.i..|
```

where you can see the data fields:

| Field   | Offset | Data                     | Meaning |
| ------- | ------ | ------------------------ | ------- |
| header  | 0x00   | `55 45 43...` (12 bytes) | `UEC2` – EC public key for the P-256 curve |
| z       | 0x0C   | `03`                     | the **y** coordinate of the public point is odd |
| x       | 0x0D   | `A4 B1 F7...` (32 bytes) | the **x** coordinate value |

Example private key, corresponding to the above public key:

```
00000000  52 45 43 32 00 00 00 2d  57 d9 cd ac 00 d2 80 f9  |REC2...-W.......|
00000010  a3 ce c1 71 2a f9 53 d0  48 aa 63 d3 b2 d9 3b bc  |...q*.S.H.c...;.|
00000020  20 14 29 a6 54 4a 84 4f  fc ba 68 ab c9           | .).TJ.O..h..|
```

where you can see the data fields:

| Field   | Offset | Data                     | Meaning |
| ------- | ------ | ------------------------ | ------- |
| header  | 0x00   | `52 45 43...` (12 bytes) | `REC2` – EC private key for the P-256 curve |
| padding | 0x0C   | `00`                     | a padding byte which must be set to zero |
| k       | 0x0D   | `D2 80 F9...` (32 bytes) | the **k** value |

You can verify that the keys match each other on the P-256 curve
and that the **y** coordinate value is indeed odd
using the following snippet in Go:

```go
package main

import (
	"crypto/elliptic"
	"encoding/base64"
	"fmt"
	"math/big"
)

func main() {
	xB64 := "pLH3KEPKA2HhgRvQtKEtmsSBOixgXbJFUbikcahpro0="
	kB64 := "0oD5o87BcSr5U9BIqmPTstk7vCAUKaZUSoRP/Lpoq8k="
	x, _ := base64.StdEncoding.DecodeString(xB64)
	k, _ := base64.StdEncoding.DecodeString(kB64)

	curve := elliptic.P256()

	xComputed, yComputed := curve.ScalarBaseMult(k)

	// Computed x coordinate must match the one from the public key
	if xComputed.Cmp(new(big.Int).SetBytes(x)) == 0 {
		fmt.Println("✅ P = k × G (x coordinate correct)")
	} else {
		fmt.Println("❌ P = k × G (x coordinate correct)")
	}

	// Computed y coordinate must be odd, as indicated by the public key
	rem := new(big.Int).Mod(yComputed, big.NewInt(2))
	if rem.Cmp(big.NewInt(1)) == 0 {
		fmt.Println("✅ P = k × G (y coordinate is odd)")
	} else {
		fmt.Println("❌ P = k × G (y coordinate is odd)")
	}
}
```

## Generating EC keys

The recommended way to generate EC keypairs is to use a cryptography library.

See also our [key management guide](/themis/crypto-theory/key-management/)
for advice on securing the keys after you have generated them.

Here is a snippet in Go, illustrating how to generate a good EC keypair:

```go
package main

import (
	"crypto/elliptic" // Use a cryptography library.
	"crypto/rand"     // Use a cryptographic RNG.
	"fmt"
)

func main() {
	// A good choice of a well-known secure curve is essential.
	curve := elliptic.P256()

	k, x, y, err := elliptic.GenerateKey(curve, rand.Reader)
	if err != nil {
		// Not handling RNG failure is a common critical error.
		// If not handled, you might return an invalid key.
		panic("failed to generate a key")
	}

	// In Themis, private keys have an extra zero padding at the beginning.
	// The public keys are stored in ANSI X9.62 compressed form.
	privateKey := append([]byte{0}, k...)
	publicKey := elliptic.MarshalCompressed(curve, x, y)

	fmt.Printf("✅ private key: %x\n", privateKey)
	fmt.Printf("✅ public key:  %x\n", publicKey)
}
```

{{< hint warning >}}
The following description is provided for illustrative purposes.

Consult your nearby friendly cryptographer on how EC keys should be generated
and what are the common implementation pitfalls that you need to avoid.
{{< /hint >}}

The process of generating an ellliptic keypair is relatively simple:

 1. Select a secure elliptic curve which you will be using.

 2. Securely choose a random integer **k** from a range of [1, **n**)
    where **n** is the order of the selected curve.
    This is your private key.

    It is essential to use a good, cryptographically secure pseudorandom number generator
    so that the generated key is unpredictable.

 3. Compute the point **P** = **k** × **G**
    where **G** is the base point of the curve (the generator).
    This is your public key.

 4. Encode **k** and **P** according to ANSI X9.62
    and pack them into appropriate Soter containers.
