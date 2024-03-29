---
title: Encryption
weight: 1
---

# Application-level encryption

Acra prevents adversaries with access to database from seeing sensitive data in a plaintext.
Acra selectively encrypts sensitive data using securely stored cryptographic keys. Thus, Acra acts as a security boundary in front of sensitive data.

Essentially, Acra provides [application-level encryption](https://www.infoq.com/articles/ale-software-architects/) by implementing it as a field-level encryption before data gets into the database.

## Encryption

Acra encrypts data using two special cryptographic containers at choice: AcraStructs and AcraBlocks.
Refer to [Acra in depth / Data structures](/acra/acra-in-depth/data-structures/) to learn the differences and to select suitable for you (by default, always use AcraBlock).

There are three ways to encrypt data:

* AcraServer transparent encryption: if AcraServer has been set up in a transparent mode, encryption happens on AcraServer during INSERT/UPDATE queries. You configure which fields should be encrypted in `encryptor_config`.
* AcraTranslator: encryption happens as a result of gRPC or HTTP API call from client application.
* [Client-side encryption using AcraWriter SDK](/acra/acra-in-depth/architecture/sdks/acrawriter/): it is possible to generate AcraStructs/AcraBlocks using AcraWriter library inside your application using appropriate keys.

{{< hint warning >}}
Read detailed technical blogpost about [transparent data encryption for SQL databases](https://www.cossacklabs.com/blog/acra-transparent-data-encryption-for-sql-databases/).
{{</ hint >}}

## Decryption

There are three ways to decrypt data from AcraStructs/AcraBlocks back into a plaintext:

* AcraServer transparent decryption: if AcraServer has been set up in a transparent mode, decryption happens on AcraServer during SELECT queries. Same fields as configured as encrypted will be decrypted.
* AcraTranslator: decryption happens as a result of gRPC or HTTP API call from client application.
* [Client-side decryption using AcraReader SDK](/acra/acra-in-depth/architecture/sdks/acrareader/): it is possible to decrypt data using AcraReader library inside your application using appropriate keys.

Decryption is a risky operation, because decryption entity should have access to the keys (and should protect them).


## Interoperability 

All Acra services use the same cryptographic envelopes: AcraStructs and AcraBlocks. They can be encrypted and decrypted in the same fashion across Acra services mentioned above.

## AcraServer behavior

AcraServer works as a proxy between database client and the database itself.
When a column is configured to be encrypted, AcraServer will transparently encrypt its value.
You can also encrypt the data manually on the client side using
[AcraWriter SDK](/acra/acra-in-depth/architecture/sdks/acrawriter/).

Decryption on the other hand is done automagically: AcraServer will detect encrypted data and will attempt
to decrypt it with all known keys.

However, there are some caveats:

* In simplest scenario, AcraServer clients won't see any difference: they `INSERT` plaintext,
  they get plaintext in `SELECT` queries, just like with direct connection to database.
  At the same time, the data in the database itself will be stored in encrypted form.
  And if the attacker has full access to the database (but not to the AcraServer),
  he won't be able to magically bypass the encryption, no keys means no data.
* Every client application has own unique identifier (usually derived during TLS or Themis Secure Session handshake),
  and keys associated with that identifier.
  If the keystore does not contain keys that were used to encrypt requested data,
  the data will be returned "as is", just like it is stored in database in encrypted form.
* Apart from client IDs, encryption keys can be bound to [zones](/acra/security-controls/zones/),
  in this case clients should set proper zone ID in requests or AcraServer will be unable
  to decrypt data because of the same reason as with client ID, no proper keys.
  Alternatively, zone ID can be stored in database as a separate column.
* When [masking](/acra/security-controls/masking/) is enabled,
  part of the data won't be encrypted (depending on configuration), and
  the response will be different depending on whether the client has proper keys as well.
* When [tokenization](/acra/security-controls/tokenization/) is enabled,
  returned values will be anonymized, they will be different from the actual plaintext (but with the same format).

You don't have to run a single AcraServer instance and give it all the keys.
Many instances can be launched, each responsible for different tables and/or clients and/or zones.

{{< hint warning >}}
Zones are deprecated since 0.94.0, will be removed in 0.95.0.
{{< /hint >}}

For example, you can have few clusters, each responsible for
protection of different data based on its confidentiality level:

* Several AcraServers that process common requests like "find user by email" or "get username".
* Dedicated AcraServers for specific geographic regions, with different keys used to
  encrypt user activity based on their location at that moment.

Combining with proper network settings, you can end up with a complex system
where each component can only access data it was created to work with.

Enabling other features on AcraServer like
[SQL firewall](/acra/security-controls/sql-firewall/) and
[audit logging](/acra/security-controls/security-logging-and-events/audit-logging/),
significantly complicates performing malicious activity without being detected.

## AcraServer configuration

Although AcraServer can work without knowing database schema,
if you want to use features like transparent encryption, masking or tokenization,
you will have to tell AcraServer that schema.

AcraServer needs to know which tables exist, which columns (name/type) are in these tables.
Then, you choose which columns should be encrypted and use different configuration options to tune the behavior.
A simple example of the configuration file may look like this:

<!-- Config struct lives in encryptor/config/encryptionSettings.go -->
```yaml
schemas:
  - table: users
    # Here we specify names of all columns this table contains
    columns:
      - id
      - email
      - address

    # This array should contain list of all columns you want to encrypt
    encrypted:
      - column: address
```

Here we have one table called `users` with three columns: `id`, `email`, `address`.
More tables can be added to `schemas` array as well.

More complete example with non-required options may look like this:
```yaml
defaults:
  # By default, if `crypto_envelope` is not set in column encryption settings,
  # AcraBlock will be used, but here we switch to the alternative, AcraStruct
  crypto_envelope: acrastruct

schemas:
  - table: users
    columns:
      - id
      - name
      - email
      - address
      - zone_id

    encrypted:
      - column: name

        # Enable masking, do not encrypt first byte, show
        # unauthenticated users "*" in place of encrypted data they cannot access
        masking: "*"
        plaintext_length: 1
        plaintext_side: "left"

      - column: email

        # Make it possible to find user knowing his email
        searchable: true

      - column: address

        # Invert behavior of "acrastruct by default"
        # set in the beginning of the file
        crypto_envelope: "acrablock"

      - column: zone_id

        # This is a special column that affects which keys will be used when
        # AcraServer performs crypto operations with other encrypted columns
        zone_id: DDDDDDDDMatNOMYjqVOuhACC
```

Some flags in the second example are part of a specific feature
rather than encryption configuration, you can read more about them on their pages:

* [Masking](/acra/security-controls/masking/) —
  partial column encryption, with a configurable placeholder for unauthenticated reads.
* [Searchable encryption](/acra/security-controls/searchable-encryption/) —
  allows efficient search when you know exact value (plaintext) inside encrypted column
* [Tokenization](/acra/security-controls/tokenization/) —
  when you want to anonymize data returned to clients
* [Zones](/acra/security-controls/zones/) —
  one of the approaches to make Acra using different encryption keys for different data,
  depending on zone ID specified in the request or stored in column

{{< hint warning >}}
Zones are deprecated since 0.94.0, will be removed in 0.95.0. Related parameters will be removed and ignored too.
{{< /hint >}}

## AcraTranslator API

Compared to AcraServer, AcraTranslator explicitly handles each encryption/decryption request instead of doing it silently in a transparent mode.

This section describes how to perform encryption/decryption using the Translator API.

### gRPC API

Encrypt data with `service Writer` or `service WriterSym`:
```protobuf
message EncryptRequest {
    // (optional) use encryption key of this client ID
    // instead of the one derived from the connection
    bytes client_id = 1;
    // (optional) use encryption key of this zone ID
    bytes zone_id = 2;
    // data to encrypt
    bytes data = 3;
}

message EncryptResponse {
    // encrypted data, in AcraStruct crypto envelope
    bytes acrastruct = 1;
}

service Writer {
    rpc Encrypt(EncryptRequest) returns (EncryptResponse) {}
}


// alternative to EncryptRequest, will generate AcraBlock instead
message EncryptSymRequest {
    bytes client_id = 1;
    bytes zone_id = 2;
    bytes data = 3;
}

// like EncryptResponse, but contains AcraBlock
message EncryptSymResponse {
    bytes acrablock = 1;
}

service WriterSym {
    rpc EncryptSym (EncryptSymRequest) returns (EncryptSymResponse) {}
}
```

Decrypt data with `service Reader` or `service ReaderSym`:
```protobuf
message DecryptRequest {
    // (optional) use decryption key of this client ID
    // instead of the one derived from the connection
    bytes client_id = 1;
    // (optional) use decryption key of this zone ID
    bytes zone_id = 2;
    // AcraStruct to decrypt
    bytes acrastruct = 3;
}

message DecryptResponse {
    // plaintext, result of decryption
    bytes data = 1;
}

service Reader {
    rpc Decrypt(DecryptRequest) returns (DecryptResponse) {}
}


// like DecryptRequest, but expects AcraBlock
message DecryptSymRequest {
    bytes client_id = 1;
    bytes zone_id = 2;
    bytes acrablock = 3;
}

message DecryptSymResponse {
    bytes data = 1;
}

service ReaderSym {
    rpc DecryptSym (DecryptSymRequest) returns (DecryptSymResponse) {}
}
```

### HTTP API

#### Request

Method: `POST` (available since 0.91.0), `GET` (deprecated since 0.91.0)

Mime-Type: `application/json`

Body: `{"data":"dGVzdCBkYXRh","zone_id":"DDDDDDDDQHpbUSOgYTzqCktp"}`

> `data` is base64 encoded data you want to encrypt or decrypt,
and `zone_id` is _optional_ field specifying the zone ID you want to associate with this request
(otherwise, AcraTranslator will use the key associated with client ID of the application performing the request).

| Path             | Crypto envelope |
| ----             | :--:            |
| `/v2/encrypt`    | AcraStruct      |
| `/v2/decrypt`    | AcraStruct      |
| `/v2/encryptSym` | AcraBlock       |
| `/v2/decryptSym` | AcraBlock       |

{{< hint info >}}
Do not attempt to mix operations with two different crypto envelopes.
It won't work, and you will get decryption errors.

Note that these AcraStruct/AcraBlock are the same ones AcraServer can use.
You can, for example, encrypt something into AcraStruct with AcraTranslator, store it in a database,
and then AcraServer will be able to transparently decrypt it.
Or use transparent encryption via AcraServer, then manually read it directly from a database,
and ask AcraTranslator to decrypt it.
{{< /hint >}}

#### Response

Status code: `200`

Mime-Type: `application/json`

Body: `{"data":"6xgRpbJLsojSwHgmBHA="}`

> Response data will be base64 encoded as well, even if it contains text string as a result of decryption.

In case of error:
* Status code: `4XX`
* Body: `{"code":400,"message":"invalid request body"}`
  
  `code` will contain error code, and `message` will contain short description of error
