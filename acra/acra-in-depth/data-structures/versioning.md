---
title: CryptoEnvelopes Versioning
weight: 2
---

## CryptoEnvelopes Versioning

Starting from version 0.90.0, AcraServer supports the ability to use various crypto envelopes by means of their final storage in a single format. 

In terminology of Acra, this functionality is called CryptoEnvelopes Versioning - the main idea which is to provide the ability to use different cryptographic container under the one general container.

CryptoEnvelopes Versioning allows AcraServer to keep the logic for finding and detecting cryptographic containers, but also gives the advantage of expanding and simplifying the processing of new containers.

Currently, it is used only [AcraBlock](/acra/acra-in-depth/data-structures/acrablock)/[AcraStruct](/acra/acra-in-depth/data-structures/acrastruct) as internal container. 

However, the ability to work with pure AcraStruct/AcraBlock also remains the same for backward compatibility reasons.


### General container structure

Before create versioning container you should have already generated internal container (AcraStruct/AcraBlock).

During generation of versioning container AcraServer wraps internal container with several fields required for detection of general container.

```Container = Begin_Tag + Data_Length + Envelope_ID + Internal_Container```

- `Begin_Tag[3]` — 3 bytes, header tag (can be changed);
- `Data_Length[8]` — length of the whole versioning container (in conjunction with internal container length);
- `Envelope_ID[1]` — 1 byte, unique ID that describes type of internal container (AcraBlock - 240(OXF0)/AcraBlock - 241(OXF1));
- `Internal_Container[...]` — internal container payload.


### Example

Versioning example for plaintext: `data`:

`[37 37 37 205 0 0 0 0 0 0 0 241 34 34 34 34 34 34 34 34 85 69 67 50 0 0 0 45 68 50 186 47 3 138 198 170 130 107 250 188 121 105 202 29 19 45 188 66 170 20 102 217 147 76 128 118 54 26 198 65 15 88 185 178 158 32 39 4 38 84 0 0 0 0 1 1 64 12 0 0 0 16 0 0 0 32 0 0 0 182 206 11 242 233 156 212 112 12 130 60 243 62 74 160 133 129 129 29 159 234 128 7 166 129 81 39 111 144 64 118 12 206 226 67 128 71 211 182 84 244 218 28 249 5 233 90 66 12 157 174 138 220 202 16 8 112 42 25 116 48 0 0 0 0 0 0 0 0 1 1 64 12 0 0 0 16 0 0 0 4 0 0 0 47 134 164 182 123 204 103 77 225 147 252 50 197 4 233 13 60 73 97 200 219 57 239 230 110 11 113 135 87 105 77 167]`

* Begin_Tag[3] - `[37 37 34 37]` (currently, **%** is used as tag symbol)
* Data_Length[8] - `[205 0 0 0 0 0 0 0]`
* Envelope_ID[1] - `[241]`
* Internal_Container[...] - `[34 34 34 34 34 34 34 34 85 69 67 50 0 0 0 45 68 50 186 47 3 138 198 170 130 107 250 188 121 105 202 29 19 45 188 66 170 20 102 217 147 76 128 118 54 26 198 65 15 88 185 178 158 32 39 4 38 84 0 0 0 0 1 1 64 12 0 0 0 16 0 0 0 32 0 0 0 182 206 11 242 233 156 212 112 12 130 60 243 62 74 160 133 129 129 29 159 234 128 7 166 129 81 39 111 144 64 118 12 206 226 67 128 71 211 182 84 244 218 28 249 5 233 90 66 12 157 174 138 220 202 16 8 112 42 25 116 48 0 0 0 0 0 0 0 0 1 1 64 12 0 0 0 16 0 0 0 4 0 0 0 47 134 164 182 123 204 103 77 225 147 252 50 197 4 233 13 60 73 97 200 219 57 239 230 110 11 113 135 87 105 77 167]`**


### Encryption/Decryption

The `Envelope_ID` of each container is responsible for a specific handler that is stored in the storage of handlers called `Registry`.

Each handler is described by the [ContainerHandler](https://github.com/cossacklabs/acra/blob/master/crypto/registry_handler.go#L46) interface and responsible for any cryptographic operations associated with the respective containers.

The whole encryption process of versioning container is a simple serialization of the already generated [AcraBlock](/acra/acra-in-depth/data-structures/acrablock/#generation-encryption)/[AcraStruct](/acra/acra-in-depth/data-structures/acrastruct#generation-encryption).

Decryption process consist of next steps:

* detect versioning container;
* deserialize container;
* extract/validate existence of `Envelope_ID`;
* validate container length;
* decrypt internal container via handler from `Registry` ([AcraBlock](/acra/acra-in-depth/data-structures/acrablock/#decryption)/[AcraStruct](/acra/acra-in-depth/data-structures/acrastruct#decryption))


