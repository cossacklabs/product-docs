---
title: AcraBlock
weight: 2
---

# AcraBlock

AcraBlock is a symmetric cryptographic container, it is more compact than [AcraStruct](/acra/acra-in-depth/data-structures/acrastruct). Acra uses an envelope encryption strategy: plaintext data is encrypted using data encryption key (DEK), and then DEK is encrypted using key encryption key (KEK). 

AcraBlock uses AES-256-GCM-PKCS#7 for both encryption procedures. See [Cryptography and key management / Application level encryption](/acra/acra-in-depth/cryptography-and-key-management/#application-level-encryption).

AcraBlock supports key rotation: it's possible to rotate only KEK without re-encrypting the data (known as "key rotation without data re-encryption"), or re-encrypt data and rotate both keys ("key rotation with data re-encryption").

AcraBlock supports searchable encryption.

Prefer using AcraBlocks anytime.

## Container structure

To generate AcraBlocks, AcraServer/AcraTranslator uses symmetric keys generated for every ClientID/ZoneID.

First, AcraServer/AcraTranslator generates a random symmetric data encryption key (DEK) and encrypts the data with it. Then it uses one more symmetric layer to encrypt the DEK, the same key will be used for both encryption and decryption.

`AcraBlock = Begin_Tag + Rest_AcraBlock_Length + Key_Encryption_Backend_Identifier + Key_Encryption_Key_ID + Data_Encryption_Backend_Identifier + Data_Encryption_Key_Length + Encrypted_Data_Encryption_Key + Encrypted_Data`

* `Begin_Tag[4]` - 4 bytes, header tag. Contains 4 bytes with byte value = 34: [34, 34, 34, 34].
* `Rest_AcraBlock_Length[8]` - 8 bytes in Little-Endian byte order that store length of whole AcraBlock excluding length of Begin_Tag.
* `Key_Encryption_Backend_Identifier[1]` - identifier of encryption backend used to encrypt DEK which is random symmetric key. For now AcraBlock supports only one backend that uses Themis Secure Cell in Seal mode with identifier `0` and may be changed.
* `Key_Encryption_Key_ID[2]` - this field stores KEK's identifier. Main goal of this ID is to simplify search of KEK in a keychain related to specific ClientID/ZoneID. Now AcraServer generates ID by hashing with `SHA256(KEK || ClientID/ZoneID)` and uses first 2 bytes as ID.
* `Data_Encryption_Backend_Identifier[1]` -  identifier of encryption backend used to encrypt a plaintext. For now AcraBlock supports only one backend that uses Themis Secure Cell in Seal mode with identifier `0`. Same as for DEK encryption and may be changed too.
* `Data_Encryption_Key_Length[2]` - 2 bytes of DEK's length in Little-Endian byte order. Key size should be synchronized with data encryption backend.
* `Encrypted_Data_Encryption_Key[*]` - encrypted DEK of size `Data_Encryption_Key_Length`, used to encrypt data and data encryption backend. For each new AcraBlock AcraServer generates new random DEK and encrypts with DEK encryption backend and Context (ClientID/ZoneID).
* `Encrypted_Data[*]` encrypted data with data encryption backend and random DEK.

Right now, Acra Community Edition uses the same key and data decryption backends – both use Secure Cell in Seal Mode.

Available **key** encryption backends and their identifiers:
* `Secure Cell in Seal Mode` - `0`

Available **data** encryption backends and their identifiers:
* `Secure Cell in Seal Mode` - `0`


Starting from Acra 0.90.0, AcraStructs and AcraBlocks [support interoperability](/acra/acra-in-depth/data-structures/interoperability/).

## Example

AcraBlock example for the `example` plaintext:

`[34 34 34 34 141 0 0 0 0 0 0 0 0 119 199 0 76 0 0 1 1 64 12 0 0 0 16 0 0 0 32 0 0 0 74 57 33 205 212 208 201 173 5 49 141 175 138 74 129 21 72 124 140 56 23 187 147 90 79 15 192 32 164 252 144 234 120 9 212 13 105 61 48 221 98 14 188 170 171 97 212 137 231 11 99 218 252 110 120 212 32 72 195 54 0 1 1 64 12 0 0 0 16 0 0 0 7 0 0 0 72 81 94 231 179 35 95 35 89 97 196 52 15 142 126 144 136 26 86 192 3 92 233 23 106 136 192 110 24 237 45 62 109 105 70]`

* Begin_Tag[4] - `[34 34 34 34]`
* Rest_AcraBlock_Length[8] - `[141 0 0 0 0 0 0 0]`
* Key_Encryption_Backend_Identifier[1] - `[0]`
* Key_Encryption_Key_ID[2] - `[119 199]`
* Data_Encryption_Backend_Identifier[1] - `[0]`
* Data_Encryption_Key_Length[2] - `[76 0]`
* Encrypted_Data_Encryption_Key[*] - `[0 1 1 64 12 0 0 0 16 0 0 0 32 0 0 0 74 57 33 205 212 208 201 173 5 49 141 175 138 74 129 21]`
* Encrypted_Data[*] - `[72 124 140 56 23 187 147 90 79 15 192 32 164 252 144 234 120 9 212 13 105 61 48 221 98 14 188 170 171 97 212 137 231 11 99 218 252 110 120 212 32 72 195 54 0 1 1 64 12 0 0 0 16 0 0 0 7 0 0 0 72 81 94 231 179 35 95 35 89 97 196 52 15 142 126 144 136 26 86 192 3 92 233 23 106 136 192 110 24 237 45 62 109 105 70]`


## Generation (encryption)

AcraServer generates AcraBlocks in a transparent mode. AcraTranslator – as response to client application's HTTP or gRPC request.

The generation contains the following steps:

1. Generates new random DEK for default data encryption backend. DEK length is 32 bytes.
2. Encrypts a plaintext with DEK and Context of specified ClientID/ZoneID using default backend for data encryption.
3. Securely cleans up memory of plaintext data (erases/fills with zeros).
4. Encrypts DEK with KEK from KeyStore for specified ClientID/ZoneID and use it as Context.
5. Securely cleans up memory of DEK (erases/fills with zeros).
6. Forms a container: packs together Begin_Tag, length of all other parts, KEK encryption backend identifier, KEK identifier, data encryption backend identifier, encrypted DEK and ciphertext.

## Decryption

1. Validates Begin_Tag.
2. Validates length of rest of AcraBlock.
3. Extracts KEK backend identifier and validates, checks that this identifier is registered in AcraServer.
4. Extracts data encryption backend identifier and validates, checks that this identifier is registered in AcraServer.
5. Extracts length of DEK.
6. Extracts DEK.
7. Iterates over KEKs (passed from KeyStore) for decryption and search correct for DEK decryption.
8. Decrypts DEK with correct KEK.
9. Erases/fills with zeros memory area of the KEK.
10. Decrypts data with decrypted DEK.
11. Erases/fills with zeros memory area of the DEK.
