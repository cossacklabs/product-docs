---
title: Searchable encryption
weight: 2
---

# Searchable encryption

Store data encrypted in a database, yet keep the ability to run simple queries over encrypted fields without decrypting them.

A trivial way of searching through rows with encrypted columns would require downloading part of encrypted database, decrypting
all those columns and comparing decrypted values with what is being searched.
Obviously, this is quite inefficient as it requires one to iterate over the whole table.

Searchable encryption makes it much more efficient.

It makes AcraServer/AcraTranslator to generate a hash of data, to store this hash next to encrypted data and then to use it during search.

Current implementation uses hashes created by HMAC-SHA256 and **only finds columns with the values exactly the same as was searched**.

This means only queries like
```
SELECT ... FROM ... WHERE encrypted_column = "value"
```
will work, but not
```
SELECT ... FROM ... WHERE encrypted_column LIKE "prefix%"
```

{{< hint info >}}
AcraServer supports `SELECT/UPDATE/INSERT/DELETE` SQL statements for searchable encryption queries.
{{< /hint >}}

AcraServer/AcraTranslator also provide the ability to join tables rows using `JOIN` queries through searchable functionality.

For example, queries like that:
```
SELECT ... FROM ... join table on table.searchable_encrypted_column = "value"
```

Moreover, table rows could be joined not only via `ON searchable_encrypted_column = <value>`, but via the searchable column of another table as well.
```
SELECT ... FROM table1 join table on table1.searchable_encrypted_column = table2.searchable_encrypted_column
```

In such cases, it is important to have searchable data in both tables encrypted via the same ClientID to have the same calculated keyed hash, otherwise, rows won't be joined.

Consider an example of modification of the searchable query received in AcraServer/AcraTranslator.

Initial query received by AcraServer/AcraTranslator:
```
SELECT ... FROM ... WHERE searchable_column = "value"
```

Under the hood, AcraServer/AcraTranslator will calculate a keyed hash of plaintext data (`blind index`), then actually encrypt the data into AcraStruct/AcraBlock, then return `"blind index|AcraStruct or AcraBlock"` envelope to store in a database. Thus, the actual plaintext data is encrypted and searching is based on keyed hashes.

The left expression of the WHERE statement is changed on `substring` operator over the searchable binary data column to extract and check matching with the calculated hash, represented as the right side expression.

Ultimately, the final view of the searchable query constructed by AcraServer/AcraTranslator and sent to the database will look like this:
```
SELECT ... FROM ... WHERE substring(searchable_column, 1, <HMAC_size>) = X'HASH_value'`
```

If the query is a parameterized prepared statement query:
```
SELECT ... FROM ... WHERE searchable_column = $1
```

then AcraServer/AcraTranslator reconstruct the query in the same manner but calculates the keyed hash during the processing of bound values for prepared statements.
```
SELECT ... FROM ... WHERE substring(searchable_column, 1, <HMAC_size>) = $1
```

{{< hint info >}}
Due to MySQL has ambiguous behaviour with filtering over binary data in text format, for MySQL added explicit casting search hash to bytes:

```
SELECT ... FROM ... WHERE convert(substr(searchable_column, ...), binary) = 0xFFFFF
```
{{< /hint >}}


Two components can provide searchable encryption functionality:

* AcraServer — transparent searchable encryption of fields marked as `searchable` for `INSERT` and `UPDATE` queries,
  calculating hash and searching by hash for `SELECT` queries, with per column configuration.
* AcraTranslator — provides gRPC and HTTP API calls to encrypt data field into searchable form, and to generate searchable hash from plaintext search query.


{{< hint info >}}
The fact that one can only search for exact value is the consequence of using secure keyed hash function.
Such functions are very sensitive to the input and will return completely different result even
with the smallest change of input data (column value in our case).
{{< /hint >}}


<!--One more thing to take into account is that you can send AcraStructs instead of plaintext
in `SELECT` queries as well, AcraServer will decrypt them and search for decrypted value.-->

## AcraServer configuration

Searchable encryption can be configured for individual columns in `--encryptor_config_file`.

For example:

<!-- Config struct lives in encryptor/config/encryptionSettings.go -->
```yaml
schemas:
  - table: table_name
    columns:
      # ...
      - email

    encrypted:
      - column: email

        # In order to make column searchable,
        # simply set `searchable` property to `true`,
        # this feature is disabled by default
        searchable: true
```

Searchable encryption is supported for both [AcraStructs](/acra/acra-in-depth/data-structures/acrastruct) and [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock).

## Database configuration

There are also some considerations to take into account when configuring database column to be both searchable and encrypted.
See [DB indexes](/acra/configuring-maintaining/optimizations/db_indexes#searchable-encryption/) page for more details.

## AcraTranslator API

{{< hint warning >}}
Zones are deprecated since 0.94.0, will be removed in 0.95.0. ZoneID parameters will be removed or ignored. AcraTranslator will expect explicitly specified ClientID in gRPC API or will use ClientID from TLS certificates.
{{< /hint >}}

### gRPC API

Encrypt and decrypt data with `service SearchableEncryption`:
```protobuf
message SearchableEncryptionRequest {
    // (optional) use encryption key of this client ID
    // instead of the one derived from the connection
    bytes client_id = 1;
    // (optional) use encryption key of this zone ID
    bytes zone_id = 2;
    // data to encrypt
    bytes data = 3;
}

message SearchableEncryptionResponse {
    // hash of the encrypted value, could be used in search
    bytes hash = 1;
    // encrypted data, in AcraStruct crypto envelope
    bytes acrastruct = 2;
}

message SearchableDecryptionRequest {
    // (optional) use decryption key of this client ID
    // instead of the one derived from the connection
    bytes client_id = 1;
    // (optional) use decryption key of this zone ID
    bytes zone_id = 2;
    // AcraStruct to decrypt
    bytes data = 3;
    // hash of the plaintext, to check decrypted data integrity
    bytes hash = 4;
}

message SearchableDecryptionResponse {
    // plaintext, result of decryption
    bytes data = 1;
}

// alternative to SearchableEncryptionRequest,
// produces AcraBlocks
message SearchableSymEncryptionRequest {
    bytes client_id = 1;
    bytes zone_id = 2;
    bytes data = 3;
}

message SearchableSymEncryptionResponse {
    bytes hash = 1;
    bytes acrablock = 2;
}

message SearchableSymDecryptionRequest {
    bytes client_id = 1;
    bytes zone_id = 2;
    bytes data = 3;
    bytes hash = 4;
}

message SearchableSymDecryptionResponse {
    bytes data = 1;
}

message QueryHashRequest {
    bytes client_id = 1;
    bytes zone_id = 2;
    // (unencrypted) data to hash
    bytes data = 3;
}

message QueryHashResponse {
    // cryptographic hash of input data, will remain the same
    // if all the inputs (including client ID and zone ID) are the same;
    // EncryptSearchable and EncryptSymSearchable will also return
    // the same hash for same inputs, thus you can use hashing to find
    // out whether some encrypted data was the same as the hashed one
    bytes hash = 1;
}

service SearchableEncryption {
    rpc EncryptSearchable (SearchableEncryptionRequest) returns (SearchableEncryptionResponse) {}
    rpc DecryptSearchable (SearchableDecryptionRequest) returns (SearchableDecryptionResponse) {}
    rpc EncryptSymSearchable (SearchableSymEncryptionRequest) returns (SearchableSymEncryptionResponse) {}
    rpc DecryptSymSearchable (SearchableSymDecryptionRequest) returns (SearchableSymDecryptionResponse) {}
    rpc GenerateQueryHash (QueryHashRequest) returns (QueryHashResponse) {}
}
```

### HTTP API

{{< hint info >}}
Searchable encryption/decryption is essentially the same as usual encryption/decryption, but uses methods with slightly different names that do slightly different things.
Due to this difference you should not mix them, `encrypt`+`decryptSearchable` for example will not work as you'd expect.
{{< /hint >}}

#### Encryption/decryption request

Method: `POST`(available since 0.91.0), `GET` (deprecated since 0.91.0)

Mime-Type: `application/json`

Body: `{"data":"dGVzdCBkYXRh","zone_id":"DDDDDDDDQHpbUSOgYTzqCktp"}`

> `data` is base64 encoded data you want to encrypt or decrypt,
and `zone_id` is _optional_ field specifying the zone ID you want to associate with this request
(otherwise, AcraTranslator will use the key associated with client ID of the application performing the request).

| Path                       | Crypto envelope |
| ----                       | :--:            |
| `/v2/encryptSearchable`    | AcraStruct      |
| `/v2/decryptSearchable`    | AcraStruct      |
| `/v2/encryptSymSearchable` | AcraBlock       |
| `/v2/decryptSymSearchable` | AcraBlock       |

{{< hint info >}}
Do not attempt to mix operations with two different crypto envelopes.
It won't work, and you will get decryption errors.

Note that these AcraStruct/AcraBlock are the same ones AcraServer can use.
You can, for example, encrypt something into AcraStruct with AcraTranslator, store it in a database,
and then AcraServer will be able to transparently decrypt it.
Or use transparent encryption via AcraServer, then read it manually directly from a database,
and ask AcraTranslator to decrypt it.
{{< /hint >}}

#### Encryption/decryption response

Status code: `200`

Mime-Type: `application/json`

Body: `{"data":"6xgRpbJLsojSwHgmBHA="}`

> Response data will be base64 encoded as well, even if it contains text string as a result of decryption.

In case of error:
* Status code: `4XX`
* Body: `{"code":400,"message":"invalid request body"}`
  
  `code` will contain error code, and `message` will contain short description of error

#### Hash generation request

Method: `POST`(available since 0.91.0), `GET` (deprecated since 0.91.0)

Path: `/v2/generateQueryHash`

Mime-Type: `application/json`

Body: `{"data":"dGVzdCBkYXRh","zone_id":"DDDDDDDDQHpbUSOgYTzqCktp"}`

> `data` is base64 encoded data you want hash,
and `zone_id` is _optional_ field specifying the zone ID you want to associate with this request
(otherwise, AcraTranslator will use the key associated with client ID of the application performing the request).

#### Hash generation response

Status code: `200`

Mime-Type: `application/json`

Body: `{"data":"6xgRpbJLsojSwHgmBHA="}`

> `data` in this case will contain cryptographic hash of the data passed in the request.

You can later use this hash:
* Take first N bytes (N = length of hash) for every "encrypted" value that requires further searching,
* Compare that prefix with the hash
* If they match, the encrypted data was exactly the same as you've just hashed

Of course, mismatch in client ID or zone ID or the hashed/encrypted data will result in different hashes, so in this case search will not work.

## Limitations

Acra Community Edition does offer core search functionality, which is sufficiently secure for usage in non-security-critical workloads. 

Acra Community Edition has following limitations for searchable encryption:

* Lack of bloom filters - current Acra Community Edition does not contain bloom-filter based improvements for both security and performance.
* Lack of rotating searchable encryption keys (not a very big problem unless you use searchable encryption really a lot).
* Lack of entropy management - Acra Community Edition allows you to generate search indexes as insecure as you want, without warning you. 
* Inability to store search hashes separate from a ciphertext (coming eventually), so search in Acra Community Edition limits you to the databases that support functional indexes.
* Performance optimisations - the way data is fetched, stored and processed is as straightforward as possible, which has certain performance costs. 
* Lack of data normalization - in Acra Community Edition, data normalization duties are laid on database administrator / application developer, thus index efficiency is completely dependent on end-user. 

## Searchable encryption in Acra Enterprise Edition

[Acra Enterprise Edition](/acra/enterprise-edition/) features extended tooling to make use of searchable encryption in production environments with heavy security risks. 

This section will feature description of additional tooling of Acra Enterprise Edition version once updated documentation is finalized. 

