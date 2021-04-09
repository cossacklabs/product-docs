---
title: AcraBlock
bookCollapseSection: true
---

# AcraBlock

## Container structure

AcraBlock is a container format. Acra uses an envelope encryption strategy: plaintext data is encrypted using data encryption key (DEK), and then DEK is encrypted using key encryption key (KEK). AcraBlock uses AES-GCM for both encryption procedures.

AcraBlock supports key rotation: it's possible to rotate only key encryption key without re-encrypting the data (known as "key rotation without data re-encryption"), or re-encrypt data and rotate both keys ("key rotation with data re-encryption").

To generate AcraBlocks Acra-Server uses symmetric keys generated for every ClientID/ZoneID.

`AcraBlock = Begin_Tag + Rest_AcraBlock_Length + Key_Encryption_Backend_Identifier + Key_Encryption_Key_ID + Data_Encryption_Backend_Identifier + Data_Encryption_Key_Length + Encrypted_Data_Encryption_Key + Encrypted_Data`
* `Begin_Tag[4]` - 4 bytes, header tag. Contains 4 bytes with byte value = 34: [34, 34, 34, 34]
* `Rest_AcraBlock_Length[8]` - 8 bytes in Little-Endian byte order that store length of whole AcraBlock excluding length of Begin_Tag
* `Key_Encryption_Backend_Identifier[1]` - identifier of encryption backend that used to encrypt DEK that is random symmetric key. For now AcraBlock supports only one backend that uses Themis Secure Cell with Seal mode with identifier `0` and may be changed.
* `Key_Encryption_Key_ID[2]` - this field store KEK's identifier. Main goal of this ID is to simplify search of KEK in a keychain related to specific ClientID/ZoneID. Now Acra-Server generates ID by hashing with `SHA256(KEK || ClientID/ZoneID)` and uses first 2 bytes as ID.
* `Data_Encryption_Backend_Identifier[1]` - identifier of encryption backend that used to encrypt plaintext. For now AcraBlock supports only one backend that uses Themis Secure Cell with Seal mode with identifier `0`. Same as for DEK encryption and may be changed too.
* `Data_Encryption_Key_Length[2]` - 2 bytes of DEK's length in Little-Endian byte order. Key size should be synchronized with data encryption backend.
* `Encrypted_Data_Encryption_Key[*]` - encrypted DEK of size `Data_Encryption_Key_Length`, used to encrypt data and data encryption backend. For each new AcraBlock Acra-Server generates new random DEK and encrypts with DEK encryption backend and Context (ClientID/ZoneID).
* `Encrypted_Data[*]` encrypted data with data encryption backend and random DEK.

## Generating

To generate AcraBlock in transparent mode Acra-Server does next steps:
* Generates new random DEK for default data encryption backend. DEK length is 32 bytes.
* Encrypts plaintext by DEK and Context of specified ClientID/ZoneID using default backend for data encryption.
* Securely cleans up memory of plaintext data (erases/fills with zeros).
* Encrypts DEK by KEK from KeyStore for specified ClientID/ZoneID and use it as Context
* Securely cleans up memory of DEK (erases/fills with zeros).
* Forms a container: packs Begin_Tag, length of all other parts, DEK encryption backend identifier, KEK identifier, DEK encryption backend identifier, encrypted DEK and ciphertext

## Decrypting

* Validate Begin_Tag
* Validate length of rest of AcraBlock
* Extract KEK backend identifier and validate, check that this identifier registered in Acra-Server
* Extract data encryption backend identifier and validate, check that this identifier registered in Acra-Server
* Extract length of DEK
* Extract DEK
* Iterate over KEKs for decryption passed from KeyStore and search correct for DEK decryption
* Decrypt DEK with correct KEK
* Erase/fill with zeros memory area with the KEK
* Decrypt data with decrypted DEK
* Erase/fill with zeros memory area with the DEK
