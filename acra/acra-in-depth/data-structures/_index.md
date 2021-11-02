---
title: Data structures
bookCollapseSection: true
weight: 7
---

# Data structures Acra operates with

Acra operates with a number of different data structures for storing protected data. Two historical ones are AcraBlock and AcraStruct, outlined below. They have different security implications and performance requirements. 

Acra supports custom data structures and encryption/decryption handlers for [Acra Enterprise Edition](/acra/enterprise-edition) use cases and for extending the compatibility without breaking existing implementations. 


## General overview

Acra uses encryption during every of these operations: [data encryption](/acra/security-controls/encryption/), [searchable encryption](/acra/security-controls/searchable-encryption/), [masking](/acra/security-controls/masking/) and [tokenization](/acra/security-controls/tokenization/).

Data field (plaintext data that you try to protect) is encrypted into certain cryptographic container that contains metadata, encrypted data field, encrypted keys. 

For humans, these cryptographic containers look like binary blobs of data – nothing special. But Acra knows how to recognize its cryptographic containers by their special headers.

After encryption, a client application or Acra stores encrypted data (resulted cryptographic containers) in a database/datastore, and operate on them.

## AcraBlock

Both encryption and decryption of AcraBlock are performed with the same secret key. In a nutshell, AcraBlock uses symmetric encryption and key wrapping to encrypt data field.

Only AcraServer and AcraTranslator can encrypt/decrypt AcraBlocks. 

AcraBlock supports key rotation: it's possible to rotate only KEK without re-encrypting the data (known as "key rotation without data re-encryption"), or re-encrypt data and rotate both keys ("key rotation with data re-encryption").

AcraBlock supports searchable encryption.

Refer to [AcraBlock](/acra/acra-in-depth/data-structures/acrablock) page to learn cryptographic details.


## AcraStruct

Encryption and decryption of AcraStruct is performed by distinct keys (public key and private key respectively). In a nutshell, AcraStruct encrypts data using symmetric encryption, and then encrypts the key using asymmetric encryption. 

AcraServer and AcraTranslator can encrypt/decrypt AcraStructs, but the main gem of AcraStructs is client-side encryption. Due to the asymmetric nature, client application can generate AcraStructs (encrypt data into AcraStructs) without a risk of exposing secret keys, as only Acra's public key is exposed.

AcraStruct supports key rotation: it's possible to rotate only KEK without re-encrypting the data (known as "key rotation without data re-encryption"), or re-encrypt data and rotate both keys ("key rotation with data re-encryption").

AcraStruct supports searchable encryption.

Refer to [AcraStruct](/acra/acra-in-depth/data-structures/acrastruct) page to learn cryptographic details.


## AcraBlocks / AcraStructs use cases

If you need end-to-end encryption then you should choose AcraStructs and encrypt data on a client side using Acra's public key. In all other cases you should prefer AcraBlocks that have less output size, fewer keys size and are more performant because use only symmetric key encryption. AcraStructs rely on asymmetric plus symmetric encryption algorithms, and are slower. 

Prefer using AcraBlocks in a more-or-less trusted environment with trusted KMS/keystore, and don't want any cryptographic code on the application side.

Prefer using AcraStructs in a less trusted environment: put data encryption on a client-side for applications that don't have secure channel to AcraServer/AcraTranslator. AcraStructs allow building separate dataflows for writing data (encrypting on client-side and placing to the database) and reading data (decrypting through Acra). However, if you don't want any cryptographic code on the application side, feel free to encrypt/decrypt AcraStructs via AcraServer/AcraTranslator as well.

AcraServer and AcraTranslator support transparent AcraBlock/AcraStruct encryption and decryption with equal functionality.

Starting from Acra 0.90.0, AcraStructs and AcraBlocks [support interoperability](/acra/acra-in-depth/data-structures/interoperability/).

Read more about [optimizations related to AcraStructs vs AcraBlocks](/acra/configuring-maintaining/optimizations/acrastructs_vs_acrablocks/).


## Storage Models

AcraServer stores AcraStructs and AcraBlocks inside database cells. In rare cases, you might need to "mix" encrypted data and plaintext data inside the same database cell. 

Refer to [Storage models](/acra/acra-in-depth/data-structures/storage-models) page to learn how it works.


## Zone Ids

Zone Ids are identifiers of EC keys used for matching Zones to cryptographic keys. The current format is 8 bytes "begin tag" + 16 symbols a-zA-Z. For example: `DDDDDDDDzxzXVyBBaNclkgPS` where `DDDDDDDD` is "begin tag" and `zxzXVyBBaNclkgPS` is unique key identifier. 

Learn more about [Zones](/acra/security-controls/zones/).


## Additional data structures
  
Additionally, Acra operates with a number of other data structures that enable different security mechanisms.


### Acra's token

During [tokenization](/acra/security-controls/tokenization/) Acra generates encrypted data and token ("pseudonym") for data fields. Token structure is similar to AcraBlock.

  
### Acra's searchable hash

Acra generates so-called "blind index" for data fields that are searchable encrypted. Searchable hash is based on HMAC-SHA256. 

Refer to the [Searchable encryption](/acra/security-controls/searchable-encryption/) section to learn more.  
