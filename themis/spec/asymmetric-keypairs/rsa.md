---
weight: 20
title:  RSA keys
---

# RSA keys

The RSA cryptosystem uses three principal parameters:
public exponent **e**, public modulus **n**, and private exponent **d**.
Security of RSA relies on factorization of big integers being a hard problem,
thus using appropriate size of the parameters is crucial (among other factors).

As of Themis 0.13 released in 2020,
the following RSA key sizes are supported:

  - 1024 bits (_deprecated_)
  - 2048 bits **(current default)**
  - 4096 bits
  - 8192 bits

The current default size is consistent with recommendations of the NSA Suite B.

{{< hint info >}}
Migration to more recent recommendations of the CNSA Suite is pending.
{{< /hint >}}

## Layout

RSA keys are stored in [Soter containers](../../common/#soter-container).
The tags for the supported key sizes are as follows:

| Key size  | Public key tag | Private key tag |
| --------- | -------------- | --------------- |
| 1024 bits | `URA1`         | `RRA1`          |
| 2048 bits | `URA2`         | `RRA2`          |
| 4096 bits | `URA4`         | `RRA4`          |
| 8192 bits | `URA8`         | `RRA8`          |

The payload of Soter container stores the encoded key data.
All fields are stored in big-endian (network) byte order.

Public key layout (for 2048 bits):

     0                                                               256
    +---------------------------------------------------------------+
    |                               n                               |
    +-------+-------------------------------------------------------+
    |   e   |
    +-------+
     256     260

where

  - **n** (256 bytes) is the public modulus **n**
  - **e** (4 bytes) is the public exponent **e**

Private key layout (for 2048 bits):

     0                             128                               256
    +---------------------------------------------------------------+
    |                               d                               |
    +-------------------------------+-------------------------------+
    |                p              |               q               |
    +-------------------------------+-------------------------------+
    |               dp              |              dq               |
    +-------------------------------+-------------------------------+
    |               qp              |               n               >
    +-------------------------------+-------+-----------------------+
    >            n (cont.)          |   e   |
    +-------------------------------+-------+
                                     1152    1156

where

  - **d** (256 bytes) is the private exponent **d**
  - **p** (128 bytes) is the first prime multiple of the modulus **p**
  - **q** (128 bytes) is the second prime multiple of the modulus **q**
  - **dp** (128 bytes) is the remainder **d** (mod **p** − 1)
  - **dq** (128 bytes) is the remainder **d** (mod **q** − 1)
  - **qp** (128 bytes) is the inverse **q**⁻¹ (mod **p**)
  - **n** (256 bytes) is the public modulus **n**
  - **e** (4 bytes) is the public exponent **e**

{{< hint info >}}
**Note:**
The only *essential* fields of the private key are **p**, **q**, and **e**.
However, Themis keeps other values around for performance and compatibility reasons.
{{< /hint >}}

The size of the fields depends on the size of the modulus.
Total key sizes include the length of Soter container header.

| Key size  |  e | n, d | p, q, dp, dq, qp | *Total* (private) | *Total* (public) |
| --------- | --:| ----:| ----------------:| -----------------:| ----------------:|
| 1024 bits |  4 |  128 |               64 |         592 bytes |        144 bytes |
| 2048 bits |  4 |  256 |              128 |        1168 bytes |        272 bytes |
| 4096 bits |  4 |  512 |              256 |        2320 bytes |        528 bytes |
| 8192 bits |  4 | 1024 |              512 |        4624 bytes |       1040 bytes |

## Example

Example public key:

```
00000000  55 52 41 32 00 00 01 10  49 f1 25 8f c6 19 c2 c7  |URA2....I.%.....|
00000010  cd 42 2a 00 f5 a7 5e 68  3d 3c 2e fb ac ed e2 79  |.B*...^h=<.....y|
00000020  b3 b5 00 6b 15 62 22 a4  42 94 9a cc 0d 93 78 23  |...k.b".B.....x#|
00000030  7c 1f 44 a3 8e d2 97 83  42 99 fb 28 f6 ad 8e ab  ||.D.....B..(....|
00000040  f8 72 f0 47 ca 3d cc cc  68 6f 84 e5 50 39 6c 1b  |.r.G.=..ho..P9l.|
00000050  22 a3 f4 44 86 ef 3b 81  3b d5 0c db 2c ea b8 b3  |"..D..;.;...,...|
00000060  27 7f ee b2 ad 18 23 51  9f a7 d8 4b 80 76 0e 9b  |'.....#Q...K.v..|
00000070  3a 12 04 4a 6d 5a fa f0  b5 de 68 bb 1c ea 64 c3  |:..JmZ....h...d.|
00000080  3f ca 64 9a 66 5b 3b 6c  ba 8b 8e 9d c5 32 db 5b  |?.d.f[;l.....2.[|
00000090  56 c2 d1 89 69 f5 f6 52  47 90 3f 18 8d f0 6f f8  |V...i..RG.?...o.|
000000a0  2c 0f ed 86 26 ab f4 e6  17 de 1e 59 e2 51 05 95  |,...&......Y.Q..|
000000b0  aa 62 ce 73 cf 45 cd 66  2f 3c 50 bb 03 47 b2 28  |.b.s.E.f/<P..G.(|
000000c0  be f4 75 39 b9 56 73 42  75 ec 53 71 70 e7 6c d3  |..u9.VsBu.Sqp.l.|
000000d0  a8 3c dc 45 f9 2a 29 3f  98 06 2f 91 04 76 e5 74  |.<.E.*)?../..v.t|
000000e0  d9 21 9d 9e 14 2e 56 78  72 f4 84 cc c6 e9 98 3f  |.!....Vxr......?|
000000f0  c9 09 de 1d 8e f5 1f f0  52 73 dd 74 a4 37 d0 18  |........Rs.t.7..|
00000100  c8 72 db 5d 20 c9 a8 a6  67 2c f2 5d 00 01 00 01  |.r.] ...g,.]....|
```

where you can see the data fields:

| Field   | Offset | Data                      | Meaning |
| --------| ------ | ------------------------- | ------- |
| header  | 0x000  | `55 52 41...` (12 bytes)  | `URA2` – RSA public key, 2048 bits |
| n       | 0x00C  | `C6 19 C2...` (256 bytes) | public modulus **n** |
| e       | 0x10C  | `00 01 00 01` (4 bytes)   | public exponent **e** = 65537 |

Example private key, corresponding to the above public key:

```
00000000  52 52 41 32 00 00 04 90  5e 52 fd ff 5b 32 e2 dc  |RRA2....^R..[2..|
00000010  0e df c5 ec 99 2b 0b 28  5c 00 87 f4 af 60 f8 a1  |.....+.(\....`..|
00000020  64 9d 10 6b 3b f5 e8 d2  cc 20 13 bf 9b 04 68 0b  |d..k;.... ....h.|
00000030  96 09 e3 14 95 1c d8 49  c2 70 97 12 fd b5 5a f8  |.......I.p....Z.|
00000040  4a b1 c7 72 95 65 ac 11  f2 86 5c 9d 21 38 be 4f  |J..r.e....\.!8.O|
00000050  23 bc 6d 28 db 21 e9 b8  0e 2e 7f f3 ab 13 08 22  |#.m(.!........."|
00000060  da 2d 68 5b 73 9a a8 2f  dc 9b 6d d5 1c 77 bd 33  |.-h[s../..m..w.3|
00000070  b3 21 36 3e 79 67 a8 1d  06 ed 34 33 e8 14 f4 7c  |.!6>yg....43...||
00000080  7a b2 97 6c 09 71 38 c3  4e 82 0f 0e 3d 45 50 94  |z..l.q8.N...=EP.|
00000090  22 9f ef 36 49 66 14 88  96 3e 95 36 7c 10 fa b5  |"..6If...>.6|...|
000000a0  47 9a f8 15 85 1d 4f 9d  35 66 de 8d 0f 6e 93 9e  |G.....O.5f...n..|
000000b0  83 8a 66 2f de ef 52 6e  dc da 25 e4 5f f2 80 fd  |..f/..Rn..%._...|
000000c0  5c 8f f1 4a 16 22 d4 37  e2 9d 07 4f 93 de 76 5b  |\..J.".7...O..v[|
000000d0  93 88 b6 d1 f7 c9 17 f9  3e 9b 70 7c 4f 39 b9 a5  |........>.p|O9..|
000000e0  e2 be d5 15 c0 8f bf b8  6d 26 d6 5a 8d 9a 88 b7  |........m&.Z....|
000000f0  65 54 f1 12 b4 45 c0 b3  6e f9 e5 51 01 b4 8f dd  |eT...E..n..Q....|
00000100  3c dc 11 db f0 48 e9 b5  5f d0 3c 15 ef f4 25 f8  |<....H.._.<...%.|
00000110  16 09 3a 12 e3 36 91 65  48 e3 c9 9d af de 90 eb  |..:..6.eH.......|
00000120  49 a6 dc e8 23 da d6 d9  58 f8 ed 1a 30 9b 86 d6  |I...#...X...0...|
00000130  10 91 13 87 3f 58 3d 05  e2 22 ef 90 ab 89 57 09  |....?X=.."....W.|
00000140  7c 2d 31 0e 49 72 36 8c  b6 2e 2b 2f 4f 70 98 11  ||-1.Ir6...+/Op..|
00000150  bb 62 29 19 ba f1 22 88  9f c5 c8 4d eb 90 0f 7d  |.b)..."....M...}|
00000160  f2 41 99 ea 45 0a 9e e5  c9 68 bc c1 42 53 12 4c  |.A..E....h..BS.L|
00000170  23 b6 47 0a d5 82 7a 5c  b2 52 55 ef da 83 95 8f  |#.G...z\.RU.....|
00000180  b9 b3 7d b1 f1 f5 86 25  33 78 02 93 d3 59 1d 73  |..}....%3x...Y.s|
00000190  b8 6e 29 62 b7 9e 31 71  19 64 32 70 8c 20 64 17  |.n)b..1q.d2p. d.|
000001a0  aa 88 e7 34 d8 bb 9c 3b  dc d2 34 13 2c 76 ce c7  |...4...;..4.,v..|
000001b0  24 83 ea b5 89 41 d5 64  2f 53 46 50 84 9a c9 98  |$....A.d/SFP....|
000001c0  f9 19 cf 2f e9 dd 1b 55  1f a4 01 d9 a7 5d 79 df  |.../...U.....]y.|
000001d0  eb a5 9f 97 9b 51 be b7  86 5a 1e da 7f 3d 16 2a  |.....Q...Z...=.*|
000001e0  3f e2 80 82 e5 73 63 77  e9 07 40 1a 9f 1c 7b 31  |?....scw..@...{1|
000001f0  82 61 ef 4d 87 e2 1d 32  38 86 d6 60 fb 2c cf ec  |.a.M...28..`.,..|
00000200  66 e7 5b a1 d9 26 10 d1  d0 30 9d 4f 8e 6e 18 9f  |f.[..&...0.O.n..|
00000210  92 cc f5 48 c2 cf e0 2c  03 c1 1a 2a dc 7a bb 00  |...H...,...*.z..|
00000220  be 9e 2a 60 2c f0 38 39  99 43 60 d1 fb ea 45 76  |..*`,.89.C`...Ev|
00000230  09 2d 64 2f 12 9d 98 d3  46 30 c0 8c da 15 52 b1  |.-d/....F0....R.|
00000240  91 a0 ed 8e 72 70 36 0a  fe 14 97 93 a4 8e cb e5  |....rp6.........|
00000250  32 9a 08 95 7a 4e a9 d5  f9 28 98 46 10 3e 59 c3  |2...zN...(.F.>Y.|
00000260  c3 a9 c6 e7 b5 05 a1 dd  f9 d8 8e ba 14 59 64 f2  |.............Yd.|
00000270  06 fc aa 5c b6 f1 95 1a  32 cb 06 b1 b1 be 0b 67  |...\....2......g|
00000280  dd ad ba 3d 86 c6 db 52  77 a3 93 bb 08 f6 3f 6c  |...=...Rw.....?l|
00000290  77 c6 9c 14 a6 8a 9b b8  1b 06 87 a9 04 18 1f 86  |w...............|
000002a0  6d 61 ce c4 0b e8 b0 b0  4d 25 d0 b5 7b 6e 32 48  |ma......M%..{n2H|
000002b0  79 80 ea 83 f6 25 07 82  6f 0b 4d f0 fe 1e 7e 2b  |y....%..o.M...~+|
000002c0  f1 6c 29 bf f3 5f bf d7  f5 36 84 29 91 92 42 27  |.l).._...6.)..B'|
000002d0  bf 9b 4f 50 23 72 ec ee  65 51 0e fb de e7 5d 38  |..OP#r..eQ....]8|
000002e0  3f 6b 40 5d cc 92 ff 05  c7 a8 da 0c 06 f1 33 3c  |?k@]..........3<|
000002f0  1f 36 3d ea 80 b7 92 db  5d 50 42 68 ec 5d b3 17  |.6=.....]PBh.]..|
00000300  68 29 a9 56 0c 9a 33 9e  62 00 9d bb 52 c5 4d b6  |h).V..3.b...R.M.|
00000310  f3 36 16 be d5 79 42 ea  ae 55 b1 54 ba 5f ec f2  |.6...yB..U.T._..|
00000320  d1 a5 35 41 67 2d 31 64  c5 92 9f 90 b0 5b 08 7a  |..5Ag-1d.....[.z|
00000330  70 12 8a 4f 48 c8 6f ce  e8 e2 37 ba 4c 18 4a 44  |p..OH.o...7.L.JD|
00000340  50 56 ab c9 70 64 e0 bf  cd 95 d8 ef 83 08 49 17  |PV..pd........I.|
00000350  49 68 c8 e2 66 29 c4 5d  7f df 9a 01 cb e7 e9 de  |Ih..f).]........|
00000360  51 ad ca 95 44 79 a2 14  12 3c 9e 9f 27 36 f3 c9  |Q...Dy...<..'6..|
00000370  1b f7 83 70 0a 38 a8 a5  aa 3a 08 af 20 64 27 b4  |...p.8...:.. d'.|
00000380  d7 5a 68 69 61 71 6e 69  14 6f 24 8b c6 19 c2 c7  |.Zhiaqni.o$.....|
00000390  cd 42 2a 00 f5 a7 5e 68  3d 3c 2e fb ac ed e2 79  |.B*...^h=<.....y|
000003a0  b3 b5 00 6b 15 62 22 a4  42 94 9a cc 0d 93 78 23  |...k.b".B.....x#|
000003b0  7c 1f 44 a3 8e d2 97 83  42 99 fb 28 f6 ad 8e ab  ||.D.....B..(....|
000003c0  f8 72 f0 47 ca 3d cc cc  68 6f 84 e5 50 39 6c 1b  |.r.G.=..ho..P9l.|
000003d0  22 a3 f4 44 86 ef 3b 81  3b d5 0c db 2c ea b8 b3  |"..D..;.;...,...|
000003e0  27 7f ee b2 ad 18 23 51  9f a7 d8 4b 80 76 0e 9b  |'.....#Q...K.v..|
000003f0  3a 12 04 4a 6d 5a fa f0  b5 de 68 bb 1c ea 64 c3  |:..JmZ....h...d.|
00000400  3f ca 64 9a 66 5b 3b 6c  ba 8b 8e 9d c5 32 db 5b  |?.d.f[;l.....2.[|
00000410  56 c2 d1 89 69 f5 f6 52  47 90 3f 18 8d f0 6f f8  |V...i..RG.?...o.|
00000420  2c 0f ed 86 26 ab f4 e6  17 de 1e 59 e2 51 05 95  |,...&......Y.Q..|
00000430  aa 62 ce 73 cf 45 cd 66  2f 3c 50 bb 03 47 b2 28  |.b.s.E.f/<P..G.(|
00000440  be f4 75 39 b9 56 73 42  75 ec 53 71 70 e7 6c d3  |..u9.VsBu.Sqp.l.|
00000450  a8 3c dc 45 f9 2a 29 3f  98 06 2f 91 04 76 e5 74  |.<.E.*)?../..v.t|
00000460  d9 21 9d 9e 14 2e 56 78  72 f4 84 cc c6 e9 98 3f  |.!....Vxr......?|
00000470  c9 09 de 1d 8e f5 1f f0  52 73 dd 74 a4 37 d0 18  |........Rs.t.7..|
00000480  c8 72 db 5d 20 c9 a8 a6  67 2c f2 5d 00 01 00 01  |.r.] ...g,.]....|
```

where you can see the data fields:

| Field   | Offset | Data                      | Meaning |
| --------| ------ | ------------------------- | ------- |
| header  | 0x000  | `52 52 41...` (12 bytes)  | `RRA2` – RSA private key, 2048 bits |
| d       | 0x00C  | `5B 32 E2...` (256 bytes) | private exponent **d** |
| p       | 0x10C  | `EF F4 25...` (128 bytes) | the first prime **p** |
| q       | 0x18C  | `D3 59 1D...` (128 bytes) | the second prime **q** |
| dp      | 0x20C  | `8E 6E 18...` (128 bytes) | remainder **d** (mod **p** − 1)
| dq      | 0x28C  | `08 F6 3F...` (128 bytes) | remainder **d** (mod **q** − 1)
| qp      | 0x30C  | `52 C5 4D...` (128 bytes) | inverse **q**⁻¹ (mod **p**)
| n       | 0x38C  | `C6 19 C2...` (256 bytes) | public modulus **n** |
| e       | 0x48C  | `00 01 00 01` (4 bytes)   | public exponent **e** = 65537 |

You can verify the parameter values with the following snippet in Go:

```go
package main

import (
	"encoding/base64"
	"fmt"
	"math/big"
)

func main() {
	privateKeyBase64 := `
UlJBMgAABJBeUv3/WzLi3A7fxeyZKwsoXACH9K9g+KFknRBrO/Xo0swgE7+bBGgLlgnjFJUc2EnC
cJcS/bVa+Eqxx3KVZawR8oZcnSE4vk8jvG0o2yHpuA4uf/OrEwgi2i1oW3OaqC/cm23VHHe9M7Mh
Nj55Z6gdBu00M+gU9Hx6spdsCXE4w06CDw49RVCUIp/vNklmFIiWPpU2fBD6tUea+BWFHU+dNWbe
jQ9uk56DimYv3u9SbtzaJeRf8oD9XI/xShYi1DfinQdPk952W5OIttH3yRf5PptwfE85uaXivtUV
wI+/uG0m1lqNmoi3ZVTxErRFwLNu+eVRAbSP3TzcEdvwSOm1X9A8Fe/0JfgWCToS4zaRZUjjyZ2v
3pDrSabc6CPa1tlY+O0aMJuG1hCRE4c/WD0F4iLvkKuJVwl8LTEOSXI2jLYuKy9PcJgRu2IpGbrx
IoifxchN65APffJBmepFCp7lyWi8wUJTEkwjtkcK1YJ6XLJSVe/ag5WPubN9sfH1hiUzeAKT01kd
c7huKWK3njFxGWQycIwgZBeqiOc02LucO9zSNBMsds7HJIPqtYlB1WQvU0ZQhJrJmPkZzy/p3RtV
H6QB2added/rpZ+Xm1G+t4ZaHtp/PRYqP+KAguVzY3fpB0Aanxx7MYJh702H4h0yOIbWYPssz+xm
51uh2SYQ0dAwnU+Obhifksz1SMLP4CwDwRoq3Hq7AL6eKmAs8Dg5mUNg0fvqRXYJLWQvEp2Y00Yw
wIzaFVKxkaDtjnJwNgr+FJeTpI7L5TKaCJV6TqnV+SiYRhA+WcPDqcbntQWh3fnYjroUWWTyBvyq
XLbxlRoyywaxsb4LZ92tuj2GxttSd6OTuwj2P2x3xpwUpoqbuBsGh6kEGB+GbWHOxAvosLBNJdC1
e24ySHmA6oP2JQeCbwtN8P4efivxbCm/81+/1/U2hCmRkkInv5tPUCNy7O5lUQ773uddOD9rQF3M
kv8Fx6jaDAbxMzwfNj3qgLeS211QQmjsXbMXaCmpVgyaM55iAJ27UsVNtvM2Fr7VeULqrlWxVLpf
7PLRpTVBZy0xZMWSn5CwWwh6cBKKT0jIb87o4je6TBhKRFBWq8lwZOC/zZXY74MISRdJaMjiZinE
XX/fmgHL5+neUa3KlUR5ohQSPJ6fJzbzyRv3g3AKOKilqjoIryBkJ7TXWmhpYXFuaRRvJIvGGcLH
zUIqAPWnXmg9PC77rO3iebO1AGsVYiKkQpSazA2TeCN8H0SjjtKXg0KZ+yj2rY6r+HLwR8o9zMxo
b4TlUDlsGyKj9ESG7zuBO9UM2yzquLMnf+6yrRgjUZ+n2EuAdg6bOhIESm1a+vC13mi7HOpkwz/K
ZJpmWztsuouOncUy21tWwtGJafX2UkeQPxiN8G/4LA/thiar9OYX3h5Z4lEFlapiznPPRc1mLzxQ
uwNHsii+9HU5uVZzQnXsU3Fw52zTqDzcRfkqKT+YBi+RBHbldNkhnZ4ULlZ4cvSEzMbpmD/JCd4d
jvUf8FJz3XSkN9AYyHLbXSDJqKZnLPJdAAEAAQ==`
	privateKey, _ := base64.StdEncoding.DecodeString(privateKeyBase64)

	// Extract the values of key parameters
	d := new(big.Int).SetBytes(privateKey[0x00C:0x10C])
	p := new(big.Int).SetBytes(privateKey[0x10C:0x18C])
	q := new(big.Int).SetBytes(privateKey[0x18C:0x20C])
	dp := new(big.Int).SetBytes(privateKey[0x20C:0x28C])
	dq := new(big.Int).SetBytes(privateKey[0x28C:0x30C])
	qp := new(big.Int).SetBytes(privateKey[0x30C:0x38C])
	n := new(big.Int).SetBytes(privateKey[0x38C:0x48C])
	e := new(big.Int).SetBytes(privateKey[0x48C:0x490])

	// p and q must be primes (well, with a 1 − 1/4^25 confidence)
	if p.ProbablyPrime(25) && q.ProbablyPrime(25) {
		fmt.Println("✅ p and q are primes")
	} else {
		fmt.Println("❌ p and q are primes")
	}
	// ...and by definition, n = p⋅q
	nComputed := new(big.Int).Mul(p, q)
	if nComputed.Cmp(n) == 0 {
		fmt.Println("✅ n = p⋅q")
	} else {
		fmt.Println("❌ n = p⋅q")
	}

	pMinusOne := new(big.Int).Sub(p, big.NewInt(1))
	qMinusOne := new(big.Int).Sub(q, big.NewInt(1))

	// By definition, λ(n) = λ(p⋅q) = LCM(λ(p), λ(q)) =
	//   = LCM(p−1, q−1) = (p−1)(q−1) / GCD(p−1, q−1)
	pq1Mul := new(big.Int).Mul(pMinusOne, qMinusOne)
	pq1GCD := new(big.Int).GCD(nil, nil, pMinusOne, qMinusOne)
	totient := new(big.Int).Div(pq1Mul, pq1GCD)

	// e must be within 1 < e < λ(n)
	if (big.NewInt(1).Cmp(e) == -1) && (e.Cmp(totient) == -1) {
		fmt.Println("✅ 1 < e < λ(n)")
	} else {
		fmt.Println("❌ 1 < e < λ(n)")
	}
	// ...plus, e and λ(n) must be coprime (i.e., GCD(e, λ(n)) = 1)
	gcd := new(big.Int).GCD(nil, nil, e, totient)
	if gcd.Cmp(big.NewInt(1)) == 0 {
		fmt.Println("✅ e is coprime with λ(n)")
	} else {
		fmt.Println("❌ e is coprime with λ(n)")
	}

	// It must be that d⋅e ≡ 1 (mod λ(n))
	dXe := new(big.Int).Mod(new(big.Int).Mul(d, e), totient)
	if dXe.Cmp(big.NewInt(1)) == 0 {
		fmt.Println("✅ d⋅e ≡ 1 (mod λ(n))")
	} else {
		fmt.Println("❌ d⋅e ≡ 1 (mod λ(n))")
	}

	// By definition, dp ≡ d (mod p−1)
	dpComputed := new(big.Int).Mod(d, pMinusOne)
	if dpComputed.Cmp(dp) == 0 {
		fmt.Println("✅ dp ≡ d (mod p−1)")
	} else {
		fmt.Println("❌ dp ≡ d (mod p−1)")
	}

	// By definition, dq ≡ d (mod q−1)
	dqComputed := new(big.Int).Mod(d, qMinusOne)
	if dqComputed.Cmp(dq) == 0 {
		fmt.Println("✅ dq ≡ d (mod q−1)")
	} else {
		fmt.Println("❌ dq ≡ d (mod q−1)")
	}

	// It must be that qp⋅q ≡ 1 (mod p)
	qpXq := new(big.Int).Mod(new(big.Int).Mul(qp, q), p)
	if qpXq.Cmp(big.NewInt(1)) == 0 {
		fmt.Println("✅ qp⋅q ≡ 1 (mod p)")
	} else {
		fmt.Println("❌ qp⋅q ≡ 1 (mod p)")
	}
}
```

## Generating RSA keys

The recommended way to generate RSA keypairs is to use a cryptographic library.

See also our [key management guide](/themis/crypto-theory/key-management/)
for advice on securing the keys after you have generated them.

Here is a snippet in Go, illustrating how to generate a good RSA keypair:

```go
package main

import (
	"crypto/rand" // Use a cryptographic RNG.
	"crypto/rsa"  // Use a cryptographic library.
	"encoding/binary"
	"fmt"
)

func main() {
	// A good choice of a key size is essential.
	keyBits := 2048

	key, err := rsa.GenerateKey(rand.Reader, keyBits)
	if err != nil {
		// Not handling RNG failure is a common critical error.
		// If not handled, you might return an invalid key.
		panic("failed to generate a key")
	}

	// Themis public key contains "e" and "n" parameters.
	publicKey := make([]byte, 0, 260)
	publicKey = append(publicKey, key.N.Bytes()...)
	publicKey = append(publicKey, uint32BE(key.E)...)

	// Themis private key contains "e", "n", "d" parameters
	// as well as a number of intermediate values.
	privateKey := make([]byte, 0, 1156)
	privateKey = append(privateKey, key.D.Bytes()...)
	privateKey = append(privateKey, key.Primes[0].Bytes()...)
	privateKey = append(privateKey, key.Primes[1].Bytes()...)
	privateKey = append(privateKey, key.Precomputed.Dp.Bytes()...)
	privateKey = append(privateKey, key.Precomputed.Dq.Bytes()...)
	privateKey = append(privateKey, key.Precomputed.Qinv.Bytes()...)
	privateKey = append(privateKey, key.N.Bytes()...)
	privateKey = append(privateKey, uint32BE(key.E)...)

	fmt.Printf("✅ public key:  %x\n", publicKey)
	fmt.Printf("✅ private key: %x\n", privateKey)
}

func uint32BE(e int) []byte {
	buffer := make([]byte, 4)
	binary.BigEndian.PutUint32(buffer, uint32(e))
	return buffer
}
```

{{< hint warning >}}
The following description is provided for illustrative purposes.

Consult your nearby friendly cryptographer on how RSA keys should be generated
and what are the common implementation pitfalls that you need to avoid.

In particular, ask them how easy it is to accidentally generate a weak key,
receive a long list of papers with introductory overview of the subject,
and consider using a cryptographic library after all.
{{< /hint >}}

The process of generating an RSA keypair is not so simple:

 1. Select a secure key size which you will be using.

 2. Securely choose two big random prime numbers half that size, **p** and **q**.

    They should be of similar size, but not *too* similar.
    This is a critical part of the process as you need to avoid *weak* prime pairs
    which can be easily factored.
    There are number of requirements, several algorithms to test the pairs, etc.

    Also, it is essential to use a good, cryptographically secure pseudorandom number generator
    to make your key unpredictable.

 3. Compute the public modulus **n** = **p** ⋅ **q**.

 4. Compute the totient value λ(n) = LCM(**p** − 1, **q** − 1).

 5. Choose a suitable public exponent **e**.

    **e** must be sufficiently big, but smaller than λ(n), and also coprime with λ(n).
    Typically, the prime number 65537 is used.
    If it's not possible to choose a good **e**, try again from step 2.

 6. Compute **d** ≡ **e**⁻¹ (mod λ(n)).

 7. Compute intermediate helper values:

    - **dp** ≡ **d** (mod **p** − 1)
    - **dq** ≡ **d** (mod **q** − 1)
    - **qp** ≡ **q**⁻¹ (mod **p**)

 8. Pack **n** and **e** into an appropriate Soter container to form the public key.

 9. Pack **d**, **p**,  **q**,  **dp**,  **dq**, **qp**, **n**, and **e**
    into an appropriate Soter container to form the private key.
