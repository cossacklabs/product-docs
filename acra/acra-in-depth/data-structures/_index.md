---
title: Data structures
bookCollapseSection: true
---

## AcraBlock

### Container structure

AcraBlock is a container format. Acra uses an envelope encryption strategy: plaintext data is encrypted using data encryption key (DEK), and then DEK is encrypted using key encryption key (KEK). AcraBlock uses AES-GCM for both encryption procedures.

AcraBlock supports key rotation: it's possible to rotate only KEK without re-encrypting the data (known as "key rotation without data re-encryption"), or re-encrypt data and rotate both keys ("key rotation with data re-encryption").

To generate AcraBlocks Acra-Server uses symmetric keys generated for every ClientID/ZoneID.

`AcraBlock = Begin_Tag + Rest_AcraBlock_Length + Key_Encryption_Backend_Identifier + Key_Encryption_Key_ID + Data_Encryption_Backend_Identifier + Data_Encryption_Key_Length + Encrypted_Data_Encryption_Key + Encrypted_Data`
* `Begin_Tag[4]` - 4 bytes, header tag. Contains 4 bytes with byte value = 34: [34, 34, 34, 34].
* `Rest_AcraBlock_Length[8]` - 8 bytes in Little-Endian byte order that store length of whole AcraBlock excluding length of Begin_Tag.
* `Key_Encryption_Backend_Identifier[1]` - identifier of encryption backend used to encrypt DEK which is random symmetric key. For now AcraBlock supports only one backend that uses Themis Secure Cell in Seal mode with identifier `0` and may be changed.
* `Key_Encryption_Key_ID[2]` - this field stores KEK's identifier. Main goal of this ID is to simplify search of KEK in a keychain related to specific ClientID/ZoneID. Now Acra-Server generates ID by hashing with `SHA256(KEK || ClientID/ZoneID)` and uses first 2 bytes as ID.
* `Data_Encryption_Backend_Identifier[1]` -  identifier of encryption backend used to encrypt plaintext. For now AcraBlock supports only one backend that uses Themis Secure Cell in Seal mode with identifier `0`. Same as for DEK encryption and may be changed too.
* `Data_Encryption_Key_Length[2]` - 2 bytes of DEK's length in Little-Endian byte order. Key size should be synchronized with data encryption backend.
* `Encrypted_Data_Encryption_Key[*]` - encrypted DEK of size `Data_Encryption_Key_Length`, used to encrypt data and data encryption backend. For each new AcraBlock Acra-Server generates new random DEK and encrypts with DEK encryption backend and Context (ClientID/ZoneID).
* `Encrypted_Data[*]` encrypted data with data encryption backend and random DEK.

Now exists only one key and data decryption backends that use Secure Cell in Seal Mode.

Available **key** encryption backends and their identifiers:
* `Secure Cell in Seal Mode` - `0`

Available **data** encryption backends and their identifiers:
* `Secure Cell in Seal Mode` - `0`


AcraBlock example for plaintext: `example`:

`[34 34 34 34 141 0 0 0 0 0 0 0 0 119 199 0 76 0 0 1 1 64 12 0 0 0 16 0 0 0 32 0 0 0 74 57 33 205 212 208 201 173 5 49 141 175 138 74 129 21 72 124 140 56 23 187 147 90 79 15 192 32 164 252 144 234 120 9 212 13 105 61 48 221 98 14 188 170 171 97 212 137 231 11 99 218 252 110 120 212 32 72 195 54 0 1 1 64 12 0 0 0 16 0 0 0 7 0 0 0 72 81 94 231 179 35 95 35 89 97 196 52 15 142 126 144 136 26 86 192 3 92 233 23 106 136 192 110 24 237 45 62 109 105 70]`

* Begin_Tag[4] - `[34 34 34 34]`
* Rest_AcraBlock_Length[8] - `[141 0 0 0 0 0 0 0]`
* Key_Encryption_Backend_Identifier[1] - `[0]`
* Key_Encryption_Key_ID[2] - `[119 199]`
* Data_Encryption_Backend_Identifier[1] - `[0]`
* Data_Encryption_Key_Length[2] - `[76 0]`
* Encrypted_Data_Encryption_Key[*] - `[0 1 1 64 12 0 0 0 16 0 0 0 32 0 0 0 74 57 33 205 212 208 201 173 5 49 141 175 138 74 129 21]`
* Encrypted_Data[*] - `[72 124 140 56 23 187 147 90 79 15 192 32 164 252 144 234 120 9 212 13 105 61 48 221 98 14 188 170 171 97 212 137 231 11 99 218 252 110 120 212 32 72 195 54 0 1 1 64 12 0 0 0 16 0 0 0 7 0 0 0 72 81 94 231 179 35 95 35 89 97 196 52 15 142 126 144 136 26 86 192 3 92 233 23 106 136 192 110 24 237 45 62 109 105 70]`



### Generation

To generate AcraBlock in transparent mode Acra-Server performs following steps:
1. Generates new random DEK for default data encryption backend. DEK length is 32 bytes.
2. Encrypts plaintext with DEK and Context of specified ClientID/ZoneID using default backend for data encryption.
3. Securely cleans up memory of plaintext data (erases/fills with zeros).
4. Encrypts DEK with KEK from KeyStore for specified ClientID/ZoneID and use it as Context.
5. Securely cleans up memory of DEK (erases/fills with zeros).
6. Forms a container: packs together Begin_Tag, length of all other parts, KEK encryption backend identifier, KEK identifier, data encryption backend identifier, encrypted DEK and ciphertext.

### Decryption

1. Validates Begin_Tag.
2. Validates length of rest of AcraBlock.
3. Extracts KEK backend identifier and validates, checks that this identifier is registered in Acra-Server.
4. Extracts data encryption backend identifier and validates, checks that this identifier is registered in Acra-Server.
5. Extracts length of DEK.
6. Extracts DEK.
7. Iterates over KEKs (passed from KeyStore) for decryption and search correct for DEK decryption.
8. Decrypts DEK with correct KEK.
9. Erases/fills with zeros memory area of the KEK.
10. Decrypts data with decrypted DEK.
11. Erases/fills with zeros memory area of the DEK.

## AcraStruct
### Container structure

AcraStruct is a cryptographic container with specific format. Before generating each AcraStruct, AcraWriter generates a keypair of throwaway keys that are used in the encryption process and then get zeroed (turned into zeros) in the memory once the process is over.

```AcraStruct = Begin_Tag + Throwaway_Public_Key + Encrypted_Random_Key + Data_Length + Encrypted_Data```

- `Begin_Tag[8]` — 8 bytes, header tag (can be changed);
- `Throwaway_Public_Key[45]` — temporary public key generated by AcraWriter;
- `Encrypted_Random_Key[84]` — encrypted Random Key by using SMessage (see next);
- `Data_Length[8]` — length of the Encrypted data (see next);
- `Encrypted_Data[Data_Length]` — payload encrypted with Random Key.

AcraStruct example for plaintext: `example`:

`[34, 34, 34, 34, 34, 34, 34, 34, 85, 69, 67, 50, 0, 0, 0, 45, 17, 107, 171, 101, 3, 5, 207, 103, 32, 150, 35, 237, 58, 19, 79, 215, 123, 254, 205, 12, 154, 149, 16, 116, 80, 130, 110, 20, 249, 80, 253, 209, 219, 167, 55, 50, 135, 32, 39, 4, 38, 84, 0, 0, 0, 0, 1, 1, 64, 12, 0, 0, 0, 16, 0, 0, 0, 32, 0, 0, 0, 63, 95, 208, 109, 191, 139, 244, 155, 230, 168, 180, 64, 234, 84, 240, 17, 116, 147, 64, 73, 253, 86, 60, 226, 127, 240, 170, 251, 229, 234, 145, 85, 88, 142, 29, 221, 12, 230, 72, 4, 254, 95, 243, 71, 174, 9, 126, 41, 221, 0, 127, 202, 160, 42, 53, 72, 218, 86, 141, 248, 51, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 64, 12, 0, 0, 0, 16, 0, 0, 0, 7, 0, 0, 0, 34, 115, 175, 148, 77, 152, 188, 222, 105, 123, 145, 77, 152, 254, 160, 19, 183, 122, 53, 138, 147, 149, 157, 223, 238, 71, 133, 139, 117, 210, 232, 110, 181, 241, 3]`

* Begin_Tag[8] - `[34, 34, 34, 34, 34, 34, 34, 34]`
* Throwaway_Public_Key[45] - `[85, 69, 67, 50, 0, 0, 0, 45, 17, 107, 171, 101, 3, 5, 207, 103, 32, 150, 35, 237, 58, 19, 79, 215, 123, 254, 205, 12, 154, 149, 16, 116, 80, 130, 110, 20, 249, 80, 253, 209, 219, 167, 55, 50, 135]`
* Encrypted_Random_Key[84] - `[32, 39, 4, 38, 84, 0, 0, 0, 0, 1, 1, 64, 12, 0, 0, 0, 16, 0, 0, 0, 32, 0, 0, 0, 63, 95, 208, 109, 191, 139, 244, 155, 230, 168, 180, 64, 234, 84, 240, 17, 116, 147, 64, 73, 253, 86, 60, 226, 127, 240, 170, 251, 229, 234, 145, 85, 88, 142, 29, 221, 12, 230, 72, 4, 254, 95, 243, 71, 174, 9, 126, 41, 221, 0, 127, 202, 160, 42, 53, 72, 218, 86, 141, 248]`
* Data_Length[8] - `[51, 0, 0, 0, 0, 0, 0, 0]`
* Encrypted_Data[51] - `[0, 1, 1, 64, 12, 0, 0, 0, 16, 0, 0, 0, 7, 0, 0, 0, 34, 115, 175, 148, 77, 152, 188, 222, 105, 123, 145, 77, 152, 254, 160, 19, 183, 122, 53, 138, 147, 149, 157, 223, 238, 71, 133, 139, 117, 210, 232, 110, 181, 241, 33]`

### Generation

AcraWriter is used to generate AcraStruct, but the generation process is quite simple and can be implemented in any custom writer:

- AcraWriter generates a keypair of throwaway keys using Themis EC key generator:<br/>
  `Throwaway_Keypair = (Throwaway_Public_Key, Throwaway_Private_Key)`.
- Generates Random Symmetric Key (`RK`), 32 bytes long.
- Encrypts `RK` using [Secure Message]({{< ref "themis/crypto-theory/cryptosystems/secure-message.md" >}}) with `Throwaway_Private_Key` and `Acra_Public_Key`(or Zone key – see [Zones]({{< ref "acra/acra-in-depth/cryptography-and-key-management/#zones-INVALID" >}})):<br/>
  `Encrypted_Random_Key = SMessage(RK, Throwaway_Private_Key, Acra_Public_Key)`.
- Encrypts the payload with [Secure Cell]({{< ref "themis/crypto-theory/cryptosystems/secure-cell.md" >}}) in Seal mode:<br/>
  `Encrypted_Data = SCell(RK, payload)`.
- Erases/fills with zeros memory area of the `RK`.
- Calculates the encrypted payload length and transforms it into little endian 8 bytes long (`Data_Length`).
- Connects attributes together as described in the original formula.
- Erases/fills with zeros the memory area containing the `Throwaway_Keypair` and original payload.

We recommend you to check out AcraStruct [examples](https://github.com/cossacklabs/acra/tree/master/examples) and try the [⚙️Acra Engineering Demo⚙️](https://github.com/cossacklabs/acra-engineering-demo/#what-is-this).

You can check your own AcraWriter implementation with our online [AcraStruct validator]({{< ref "acra/acra-in-depth/data-structures/acrastruct-validator.md" >}}) and try to decrypt generated AcraStructs.

### Decryption

AcraServer, upon receiving and detecting valid AcraStruct, is able to:

- Extracts Throwaway Public Key (`TPK`).
- Decrypts asymmetric envelope with `TPK` and Acra's Private Key (or [Zone key]({{< ref "acra/guides/integrating-acra-server-into-infrastructure#with-zones-INVALID">}})).
- Extracts Random Key (`RK`) for Secure Cell container out of a decrypted envelope;
- Decrypts Secure Cell, extracts payload;
- Reconstructs database answer in such a way that AcraStruct is replaced by decrypted data.

Check implementation in [decryptor/base/utils.go](https://github.com/cossacklabs/acra/blob/master/decryptor/base/utils.go#L29).


## Storage Models

There are two storage model modes used in Acra: WholeCell and InjectedCell.

In WholeCell mode, CryptoEnvelope ([AcraStruct]({{< ref "acra/acra-in-depth/data-structures/#acrastruct" >}}) or [AcraBlock]({{< ref "acra/acra-in-depth/data-structures/#acrablock" >}})) represents a complete piece of data (i.e. database cell, a file, or some data transmitted into [AcraTranslator]({{< ref "acra/configuring-maintaining/general-configuration/acra-translator.md#-INVALID" >}})). In this mode it is expected that the encrypted data will look something like:

1. `<CryptoEnvelope>`,
2. `<CryptoEnvelope>`,
3. `<CryptoEnvelope>`.

In InjectedCell mode, CryptoEnvelope is stored inside some piece of data, i.e. inside some file or in a database cell with a file inside, with CryptoEnvelope as a piece of that file, not the whole file. In this mode, the encrypted data will look something like this:

1. `<Some CryptoEnvelope data, some other CryptoEnvelope data>`,
2. `<CryptoEnvelope>`,
3. `<File containing CryptoEnvelope alongside other data>`.

The main difference between these modes is performance. In the WholeCell mode, CryptoEnvelope are simply decrypted. In InjectedCell mode, [AcraServer]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#-INVALID">}}) needs to find CryptoEnvelopes inside some other data element first and then decrypt them, which takes obviously take longer. The process of searching for the necessary piece of data takes place as the data is going through Acra. Acra will look for CryptoEnvelopes in every piece of data in InjectedCell mode.

Which mode should you choose?

Let’s consider an example where we’re storing an email in a database and we’d like to encrypt it, “wrapping” it into an CryptoEnvelope. We’d get a table:

| Email        | Column 2     | Column 3     |
|--------------|--------------|--------------|
| <CryptoEnvelope> | Column2Value | Column3Value |
| <CryptoEnvelope> | Column2Value | Column3Value |

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

Also see the [CLI reference]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#acraserver-cli-reference-INVALID" >}}).

## Zone Ids

Zone Ids are identifiers of EC keys used for matching Zones to keys. The current format is 8 bytes "begin tag" + 16 symbols a-zA-Z. For example: `DDDDDDDDzxzXVyBBaNclkgPS` where `DDDDDDDD` is "begin tag" and `zxzXVyBBaNclkgPS` is unique key identifier. 

## When use AcraBlocks and when AcraStructs

If you need end-to-end encryption then you should choose AcraStructs and encrypt data on client side using public key. In all other cases you should prefer AcraBlocks that have less output size, fewer keys size and are more performant because use only symmetric key encryption. When AcraStructs rely on asymmetric plus symmetric encryption algorithms and are slower. AcraServer supports transparent AcraBlock/AcraStruct encryption and decryption with equal functionality.
