---
weight: 80
title:  Symmetric keys
---

# Symmetric keys

Symmetric keys are used by [**Secure Cell**](../secure-cell/) cryptosystem.

As of Themis 0.13 released in 2020,
the following symmetric encryption algorithms are supported
(in a multitude of modes):

  - AES-128 (_deprecated_)
  - AES-192
  - AES-256 **(current default)**

Each of the AES flavors has its own specific requirements for the key size.

Secure Cell uses a [_key derivation function_ (KDF)](/themis/crypto-theory/cryptosystems/secure-cell/#key-derivation-functions)
to transform user-provided key material into a symmetric key of suitable size.
Therefore, keys used with Secure Cell do not have a particular format:
they are just arbitrary non-empty byte strings.

## Generating symmetric keys

The recommended way to generate a symmetric key is to use a cryptographically secure pseudorandom number generator
to obtain a sufficient number of random bytes, and that's your new symmetric key.

{{< hint danger >}}
**Warning:**
It is crucial to use a *cryptographically secure* RNG so that the key is unpredictable.
Do not use general-purpose random number generators – typically found in “math” libraries –
unless they are explicitly designed for cryptographic purposes.
{{< /hint >}}

As of 2020,
[NIST recommends](https://www.keylength.com/en/4/)
symmetric keys to be at least 128 bits long for them to be future-proof.
Themis currently generates 256-bit keys by default (i.e., 32 bytes).

See also our [key management guide](/themis/crypto-theory/key-management/)
for advice on securing the key after you have generated it.

### Example

Here is a snippet in Go, illustrating how to generate a good symmetric key:

```go
package main

import (
	"crypto/rand" // Use a cryptograpic RNG.
	"fmt"
)

func main() {
	// Generate keys of sufficient length.
	const keyBytes = 32
	key := make([]byte, keyBytes)
	_, err := rand.Read(key)
	if err != nil {
		// Not handling RNG failure is a common critical error.
		// If errors are ignored, you might return a predictable key,
		// such as "all zeros" initial value of the byte array.
		panic("failed to generate a key")
	}
	fmt.Printf("✅ symmetric key: %x\n", key)
}
```

## Passphrases

Alternatively, Secure Cell can work with passphrases.
From the cryptographic point of view, a passphrase is essentially a symmetric key with lower entropy per byte.
Themis encodes textual passphrases in UTF-8 and uses the resulting byte string.

Since passphrases are typically shorter than keys and have less entropy (randomness),
Secure Cell uses [additional KDF rounds](/themis/crypto-theory/cryptosystems/secure-cell/#key-derivation-functions)
to preprocess passphrase data into an encryption key.
This slightly augments the security of the passphrase, making it harder to crack.
Currently, the KDF accounts for about 15 bits of additional entropy for passphrases.
This is not something groundbreaking, but at least it makes 4-digit PIN codes
and terrible passphrases a bit less terrible, just in case they are used.

### Generating passphrases

The recommended approach to generating passphrases is to generate a symmetric key of an adequate length,
then render it into a mnemonic which is easier for humans to remember.
For example, you can use a list of 2048 words to convert a 128-bit key into a sequence of 12 words.

[NIST SP 800-63b](https://pages.nist.gov/800-63-3/sp800-63b.html)
suggests using 8 characters as minimum, and up to 64 characters for user-generated passphrases
(see [NIST SP 800-63b, 5.1.1 Memorized Secrets](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63b.pdf)).
