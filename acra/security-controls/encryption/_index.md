---
title: Encryption
weight: 1
---

# Application-level encryption

Acra prevents adversaries with access to database from seeing sensitive plaintexts, if it has been configured so.
Acra does that by encrypting the sensitive data selectively and keeping the keys to itself. In this, Acra acts as security boundary in front of sensitive data. 

What Acra does can be described as [application-level encryption](https://www.infoq.com/articles/ale-software-architects/).

## Encryption

Acra encrypts data into special cryptographic containers: AcraStructrs and AcraBlocks.
Refer to [Acra in depth / Data structures](/acra/acra-in-depth/data-structures/) to learn the different and to select suitable for you (use AcraBlock by default).

There are three ways to encrypt data:

* AcraServer transparent encryption: if AcraServer has been set up in transparent mode, encryption happens on AcraServer during INSERT/UPDATE queries. You configure which fields should be encrypted in `encryptor_config`.
* AcraTranslator: encryption happens as result of gRPC or HTTP API call from client application.
* [Client-side encryption using AcraWriter SDK](/acra/acra-in-depth/architecture/sdks/#acrawriter): it is possible to generate AcraStructs/AcraBlocks using AcraWriter library inside your application using appropriate keys.

## Decryption

There are three ways to encrypt data from AcraStructs/AcraBlocks back in plaintext:

* AcraServer transparent decryption: if AcraServer has been set up in transparent mode, decryption happens on AcraServer during SELECT queries. Same fields as configured as encrypted will be decrypted.
* AcraTranslator: decryption happens as result of gRPC or HTTP API call from client application.
* [Client-side decryption using AcraReader SDK](/acra/acra-in-depth/architecture/sdks/#acrareader): it is possible to decrypt data using AcraReader library inside your application using appropriate keys.

Decryption is a risky operation, because decryption entity should have access to the keys (and should protect them).


## Interoperability 

All Acra services use the same cryptographic envelopes: AcraStructs and AcraBlocks. They can be encrypted and decrypted in the same fashion across Acra services mentioned above.

## AcraServer behavior

AcraServer works as a proxy between database client and the database itself.
When a column is configured to be encrypted, AcraServer will transparently encrypt its value.
You can also encrypt the data manually on the client side using
[AcraWriter SDK](/acra/acra-in-depth/architecture/sdks/#acrawriter).

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
  part of data won't be encrypted (depending on configuration) and
  the response will be different depending on whether the client has proper keys as well.
* When [tokenization](/acra/security-controls/tokenization/) is enabled,
  returned values will be anonymized, they will be different from the actual plaintext.

You don't have to run a single AcraServer instance and give it all the keys.
Many instances can be launched, each responsible for different tables and/or clients and/or zones.

For example, you can have few clusters, each responsible for
protection of different data based on its confidentiality level:

* Several AcraServers that process common requests like "find user by email" or "get user name".
* Dedicated AcraServers for specific geographic regions, with different keys used to
  encrypt user activity based on their location at that moment.

When combined with proper network settings, you can end up with a complex system
where each component can only access data it was created to work with.

And when combined with other features like
[SQL firewall](/acra/security-controls/sql-firewall/) and
[audit logging](/acra/security-controls/security-logging-and-events/audit-logging/),
it will be impossible for somebody to perform malicious activity without being noticed.

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
  # AcraStruct will be used, but here we switch to the alternative, AcraBlock
  crypto_envelope: acrablock

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

        # Invert behavior of "acrablock by default"
        # set in the beginning of the file
        crypto_envelope: "acrastruct"

      - column: zone_id

        # This is a special column that affects which keys will be used when
        # AcraServer performs crypto operations with other encrypted columns
        zone_id: DDDDDDDDMatNOMYjqVOuhACC
```

Some of the flags in the second example are part of a speific feature
rather than encryption configuration, you can read more about them on their pages:

* [Masking](/acra/security-controls/masking/) —
  partial column encryption, with configurable placeholder for unauthenticated reads.
* [Searchable encryption](/acra/security-controls/searchable-encryption/) —
  allows efficient search when you know exact value (plaintext) inside encrypted column
* [Tokenization](/acra/security-controls/tokenization/) —
  when you want to anonymize data returned to clients
* [Zones](/acra/security-controls/zones/) —
  one of the approaches to make Acra use different encryption keys for different data,
  depending on zone ID specified in the request or stored in column


## AcraTranslator API

Compared to AcraServer, AcraTranslator explicitly handles each encryption/decryption request instead of doing it silently in transparent mode.

This section describes how to perform encryption/decryption using the Translator API.

### HTTP API

#### Request

Method: `GET`

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
It won't work and you will get decryption errors.

And remember that these AcraStruct/AcraBlock are the same ones AcraServer can use.
You can, for example, encrypt something into AcraStruct with AcraTranslator, store it in database,
and then AcraServer will be able to transparently decrypt it.
Or use transparent encryption via AcraServer, then read it manually directly from database,
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

**TODO** should gRPC be here as well?
