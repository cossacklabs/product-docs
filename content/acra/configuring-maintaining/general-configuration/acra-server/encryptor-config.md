---
title: Encryptor config
weight: 1
---

# Encryptor config

This config is responsible for configuration of proactive security controls of AcraServer and can be specified
via `--encryptor_config=<path>` CLI parameter or `encryptor_config` key in YAML configuration file for AcraServer.

The following security controls can be configured:
- Transparent encryption
- Searchable encryption
- Masking
- Tokenization


There is full example of configuration file with all options:

```
defaults:
  crypto_envelope: "<acrablock|acrastruct>" # [optional] [default=acrablock] 
  reencrypting_to_acrablocks: false # [optional] [default=false]

schemas:
  - table: example_table
    columns:
      - id
      - data_column
     
    encrypted:
      - column: data_column
      
        # General options
        client_id: "<string>" # [optional] [conflicts_with=zone_id]
        zone_id: "<string>" # [optional] [conflicts_with=client_id]
        crypto_envelope: "<acrablock|acrastruct>" # [optional]
        reencrypting_to_acrablocks: <false|true> # [optional] [default=false]
        data_type: "<str|bytes|int32|int64>" # [optional] [conflicts_with=token_type|tokenized|consistent_tokenization]
        default_data_value: "<string value>" # [optional] [required_with=data_type] may be a string literal or a valid int32/int64 value
        
        # Tokenization
        token_type: "<email|str|bytes|int32|int64>" # [optional] [required_with=tokenized | consistent_tokenization] 
        tokenized: true # [optional] [default=false] [required_with=token_type]
        consistent_tokenization: true # [optional] [default=false] [required_with=token_type]
        
        # Masking
        masking: "xxxx" # [optional] [required_with=plaintext_length | plaintext_side]
        plaintext_length: 9  # [optional] [required_with=masking | plaintext_side]
        plaintext_side: "<right|left>" # [optional] [required_with=masking | plaintext_side]
        
        # Searching
        searchable: true # [optional] [default=false]
```

The encryption configuration file has two top-level sections: `defaults` and `schemas`.

## **defaults section**

The **defaults** section allows to specify common parameters for the whole configuration file, all the tables and columns, not to repeat it for each column. This section supports `crypto_envelope` and `reencrypting_to_acrablocks` options. 

```
defaults:
  crypto_envelope: "<acrablock|acrastruct>" # [optional] [default=acrablock] 
  reencrypting_to_acrablocks: true # [optional] [default=true]
```

### **crypto_envelope**

Required: `false`

Type: `string` 

Default value: `acrablock`

Description: select which cryptographic algorithm and crypto envelope to use to encrypt fields. Don't change if you 
don't know what it means. Supports: `acrablock` (default), `acrastruct`. 
[Read more](/acra/acra-in-depth/data-structures/) about crypto envelopes, their purpose and difference.

### **reencrypting_to_acrablocks**

Required: `false`

Type: `boolean`

Default value: `false`


Description: turns on the re-encryption of AcraStructs generated on application side to AcraBlocks before passing it to database. 
It replaces less performant AcraStructs to the [more performant AcraBlocks](/acra/configuring-maintaining/optimizations/acrastructs_vs_acrablocks/).

If application generates AcraStructs, writes once and reads often then we suggest to set `reencrypting_to_acrablocks: true`.
It makes slower write operations due to decryption AcraStructs generated on application side and encrypting into 
AcraBlocks on AcraServer side. But it significantly improves read operations performance due to faster decryption KEK 
with symmetric cryptography in comparison with asymmetric.

If application doesn't generate AcraStructs and rely only on transparent encryption on AcraServer side then we suggest
turn it off. AcraServer will not try to recognize AcraStruct on every AcraBlock matching failure and slightly improve
performance for write operations.

[Read more](/acra/acra-in-depth/data-structures/) about crypto envelopes, their purpose and difference.
## **schemas section**

This section defines the table schema, and how AcraServer should process each column field. This field is array
with items:
```
schemas:
  - table: <string>
    columns: <array of strings>
    encrypted: <array of structured items>
  - table: <string>
    columns: <array of strings>
    encrypted: <array of structured items>
```

### **table section**

Required: `true`

Type: `string`

Description: a table name which columns will be processed (encrypted, tokenized, etc).
{{< hint warning >}}
Keep in mind that AcraServer 0.93.0 and earlier processes table name as case-sensitive identifier. Thus, "emails" and "Emails" are processed as different tables.
{{</ hint  >}}

### **columns section**

Required: `false`

Type: `array of strings`

Description: defines all table's columns in order how they were declared in the database. AcraServer doesn't require
access to the database or configuring access to database. So it can't get database's metadata with tables' schemas
and works fully as transparent SQL proxy. 

So, it's important to declare correct order of columns due to it is only one way how to process queries like 
`SELECT * FROM table1` or `INSERT INTO table1 VALUES (...)`. In first query it helps to understand how much and 
which columns expect from the database, how to expand `*` value. In the second query it helps support `INSERT` command without explicitly 
declared columns due to omitted section between table name `table1` and `VALUES` as it could be 
`INSERT INTO table1 (column1, column2) VALUES(<value1>, <value2>)` with explicitly declared columns and order. 

Without declared columns AcraServer **will not** support these kinds of queries.

### **encrypted**

This section declares security controls like `encryption`, `searchable encryption`, `masking`, `tokenization` on 
per-column basis for specified table.

```
schemas:
- table: <...>
  columns:
    - data_column
  encrypted:
    - column: data_column

      # General options
      client_id: "<string>" # [optional] [conflicts_with=zone_id]
      zone_id: "<string>" # [optional] [conflicts_with=client_id]
      crypto_envelope: "<acrablock|acrastruct>" # [optional]
      data_type: "<str|bytes|int32|int64>" # [optional] [conflicts_with=token_type|tokenized|consistent_tokenization]
      default_data_value: "<string value>" # [optional] [required_with=data_type] may be string literal or valid int32/int64 yaml values

      # Tokenization
      token_type: "<int64|int32|str|bytes|email>" # [optional] [required_with=tokenized | consistent_tokenization]
      tokenized: true # [optional] [default=false] [required_with=token_type]
      consistent_tokenization: true # [optional] [default=false] [required_with=token_type]

      # Masking
      masking: "xxxx" # [optional] [required_with=plaintext_length | plaintext_side]
      plaintext_length: 9  # [optional] [required_with=masking | plaintext_side]
      plaintext_side: "<right|left>" # [optional] [required_with=masking | plaintext_side]

      # Searching
      searchable: true # [optional] [default=false]
```

Required: `true`

Type: `array of items`

Description: defines which security controls to apply on column's data. Several options are possible: [transparent encryption](/acra/security-controls/encryption/), 
[masking](/acra/security-controls/masking/), [searchable encryption](/acra/security-controls/searchable-encryption/), 
[tokenization](/acra/security-controls/tokenization/).

This section allows to configure several groups of settings:
- **common** 
- **encryption**
- **searchable encryption**
- **masking**
- **tokenization**

<!-- TODO maybe it hard to understand and should be rephrased. -->
Options from `common` group can be used together with options from other groups. But options from different groups 
cannot be used together except `common` (options from `masking` cannot be used together with `tokenization` or 
`searchable encryption`). 

Some of them can be used for several groups (for example `data_type` can be used for 
`masking`, `encryption`, `searchable encryption`, but not for `tokenization`). 

One column can be configured only with options from the one group and from `common`. 

#### **column**

Required: `true`

Type: `string`

Group: `common`

Description: column's name which data should be processed. By default, it encrypts column's data using `crypto_envelope`
value from `defaults` section as envelope and [ClientID](/acra/guides/integrating-acra-server-into-infrastructure/client_id/) 
from TLS certificates or `--client_id` [CLI parameter](/acra/configuring-maintaining/general-configuration/acra-server/). 
If were specified options for `masking` or `tokenization` then it overrides default behaviour of encryption and applies them. 
Default `crypto_envelope` also applied for masking.

{{< hint warning >}}
Keep in mind that till 0.93.0 AcraServer processes column name as case-sensitive identifier
{{</ hint  >}}

#### **client_id**

Required: `false`

Type: `string`

Group: `common`

Description: specifies which ClientID keys to use for encryption/masking/tokenizing column's data. AcraServer will use 
encryption keys related to specified ClientID. This option overrides ClientID from TLS certificate (default behavior) or 
`--client_id` CLI parameter.

#### **zone_id**

Required: `false`

Type: `string`

Group: `common`

Description: specifies which static [ZoneID](/acra/security-controls/zones/#static-zoneid) keys to use for 
encryption/masking/tokenizing column's data. AcraServer will use encryption keys related to specified ZoneID even if 
`--zonemode_enable=false` passed. This option overrides ClientID from TLS certificate or `--client_id` CLI parameter.

#### **crypto_envelope**

Required: `false`

Type: `string`

Values: `acrablock`, `acrastruct`

Group: `common` (doesn't work for `tokenization`)

Description: configures which [crypto envelope](/acra/acra-in-depth/data-structures/) use for transparent encryption or masking. It overrides same option in the 
`defaults` section.

#### **reencrypting_to_acrablocks**

Required: `false`

Type: `boolean`

Group: `encryption`, `searchable encryption`

Description: turns on re-encryption AcraStructs generated on application side to AcraBlock before passing it to database.
It overrides same option from `defaults` section.

#### **searchable**

Required: `false`

Type: `boolean`

Group: `searchable encryption`

Description: turns on encryption with [ability to run simple](/acra/security-controls/searchable-encryption/) queries over 
encrypted data. Final ciphertext will store more data with additional hash value at the beginning of data. Searchable encryption
supports `acrablock` and `acrastruct` crypto envelopes. This option cannot be used together with masking or tokenization
related options.

#### **data_type**

Required: `false`

Type: `string`

Values: `str`, `int64`, `int32`, `bytes`

Group: `encryption`, `searchable encryption`, `masking` (`int32`, `int64` not supported for masking)

Description: configures how AcraServer will replace real type of data stored in database with application's type. Due to
storing data as blobs, AcraServer allow change type on DB protocol level. After that binary data will look like 
Text/Integer/Binary data types for application. 

How AcraServer maps types from configuration file to DB specific type:
- `str` - [text](https://www.postgresql.org/docs/current/datatype-character.html) (PostgreSQL, [oid](https://www.postgresql.org/docs/current/datatype-oid.html)=25); [MYSQL_TYPE_STRING](https://dev.mysql.com/doc/internals/en/com-query-response.html#packet-Protocol::ColumnDefinition) (MySQL, 0xfe)
- `int32` - [integer](https://www.postgresql.org/docs/current/datatype-numeric.html) (PostgreSQL, oid=23), [MYSQL_TYPE_LONG](https://dev.mysql.com/doc/internals/en/com-query-response.html#packet-Protocol::ColumnDefinition) (MySQL, 0x03)
- `int64` - [bigint](https://www.postgresql.org/docs/current/datatype-numeric.html) (PostgreSQL, oid=20), [MYSQL_TYPE_LONGLONG](https://dev.mysql.com/doc/internals/en/com-query-response.html#packet-Protocol::ColumnDefinition) (MySQL, 0x08)
- `bytes` - [bytea](https://www.postgresql.org/docs/current/datatype-binary.html) (PostgreSQL, oid=17), [MYSQL_TYPE_BLOB](https://dev.mysql.com/doc/internals/en/com-query-response.html#packet-Protocol::ColumnDefinition) (MySQL, 0xfc)

#### **default_data_value**

Required: `false`

Type: `string`, `integer`, `base64`

Depends on: `data_type`

Group: `encryption`, `searchable encryption`, `masking` (`int32`, `int64` not supported for masking)

Description: configures default value if data cannot be decrypted. Type of value depends on `data_type`. 

For `int32` and `int64` types should be integer YAML literal. For example: `123`, `-321`, `0`. Value should be in the proper range
according to the type. `int32` has range &#91;-2^31, 2^31-1&#93;, `int64` has range &#91;-2^63, 2^63-1&#93;.

Type `str` accepts string literals `"string value"`. 

Type `bytes` accepts string literals with base64 values. For example to set binary array `{0, 1, 2, 3}` we should 
encode it to base64: `"AAECAw=="`. AcraServer will decode base64 values and pass it as binary array according to database's protocol.

#### **tokenized**

Required: `false`

Type: `boolean`

Group: `tokenization`

Description: turns on tokenization for column.

#### **token_type**

Required: `false`

Type: `string`

Values: `str`, `email`, `int64`, `int32`, `bytes`, `int32_string`, `int64_string`

Depends on: `tokenized`

Group: `tokenization`

Description: configures type of [tokens](/acra/security-controls/tokenization/). Works only together with `tokenized` option. 
AcraServer catches values in queries from application to a database, encrypts them, stores in separate token
database. Then generates new random value instead of encrypted and pass it to a database. In opposite direction it catches
tokenized value, finds it in the token database, decrypts source value and returns it to the application if it has permission
for this value. Otherwise, AcraServer returns tokenized value.

`str` - generates new random string with same length as source value. To generate string Acra uses next characters: `[a-zA-Z0-9]`.

`bytes` - generates new random string with same length as source value.

`email` - generates new random email with same length as source value. 

Acra in a random way selects one of a [pre-defined](https://github.com/cossacklabs/acra/blob/0.92.0/pseudonymization/random.go#L58) top-level domain (TLD), generates random string and compiles new random email. 
For example if input email is: `john.snow@got.com`. This email has length 17 characters. So, AcraServer randomly choose TLDs, 
for example `.org`. After that calculates remaining length for rest part of email: `17 - len('.org') = 13`. 
Generates random 13 characters string: `Zii7ydUhDPXzV`. And finally place `@` character at the middle of string: `Zii7yd@hDPXzV.org`.

So, eventually in the database will be stored `Zii7yd@hDPXzV.org`. When owner of data will query this value from database,
Acra will replace it with source value `john.snow@got.com`. If someone else will query this data (with different ClientID/ZoneID)
then Acra will return tokenized value as is: `Zii7yd@hDPXzV.org`. 

`int64` - generates new random 64-bit value.

`int32` - generates new random 32-bit value.

`int64_string` - generates new random 64-bit value and pass as string literal.

`int32_string` - generates new random 32-bit value and pass as string literal.

#### **consistent_tokenization**

Required: `false`

Type: `boolean`

Depends on: `tokenized`

Group: `tokenization`

Description: turns on consistent tokenization. By default (`consistent_tokenization: false`), Acra generates new value 
for every input value. For example, if application sends query `INSERT INTO table1 (age) values (25)` then Acra will
generate 25 new values (if `token_type: int32` or `int64`) and replace `25` with new values. If `consistent_tokenization: true`
then Acra will generate one random output value per input value. For `25` it will generate `76982` (just for example) and
everytime re-use it for input value `25`.

#### **masking**

Required: `false`

Type: `string`

Depends on: `plaintext_length`, `plaintext_side`

Group: `masking`

Description: turns on masking and specify pattern that will replace ciphertext. For example: masked `1234-5678-9123-4567`
value with `plaintext_length: 4`, `plaintext_side: left` and `masking: "-XXXX-XXXX-XXXX"`. Value in the database will look like `1234<ciphertext>` where
`<ciphertext>` is AcraStruct or AcraBlock. If user has access to data, it will get `1234-5678-9123-4567` after unmasking.
If user doesn't have permission then will get `1234-XXXX-XXXX-XXXX`.

#### **plaintext_length**

Required: `false`

Type: `integer`

Depends on: `masking`, `plaintext_side`

Group: `masking`

Description: configures plaintext length that will be untouched and not encrypted.
{{< hint warning >}}
If `plaintext_length` >= `len(data)` then whole `data` will be encrypted without leaving any plaintext.
{{</ hint >}}

#### **plaintext_side**

Required: `false`

Type: `string`

Depends on: `plaintext_side`, `plaintext_length`

Group: `masking`

Description: configures side of plaintext that will be left untouched according to `plaintext_length`. 
- `left` - value will be stored as `<plaintext[:plaintext_length]><ciphertext>`.
- `right` - value will be stored as `<ciphertext[:plaintext_length]><plaintext>`.

### **Matrix of options compatibility**

Here is matrix of all options supported in the `encrypted` section where showed which of them can be used together and 
which cannot be. 


| ---                     | client_id | zone_id | crypto_envelope | data_type[bytes] | data_type[str] | data_type[int32] | data_type[int64] | data_default_value | token_type | tokenized | consistent_tokenization | masking | plaintext_length | plaintext_side |
|-------------------------|-----------|---------|-----------------|------------------|----------------|------------------|------------------|--------------------|------------|-----------|-------------------------|---------|------------------|----------------|
| client_id               | +         | -       | +               | +                | +              | +                | +                | +                  | +          | +         | +                       | +       | +                | +              |
| zone_id                 | -         | +       | +               | +                | +              | +                | +                | +                  | +          | +         | +                       | +       | +                | +              |
| crypto_envelope         | +         | +       | +               | +                | +              | +                | +                | +                  | -          | -         | -                       | +       | +                | +              |
| data_type[bytes]        | +         | +       | +               | +                | -              | -                | -                | +                  | -          | -         | -                       | +       | +                | +              |
| data_type[str]          | +         | +       | +               | -                | +              | -                | -                | +                  | -          | -         | -                       | +       | +                | +              |
| data_type[int32]        | +         | +       | +               | -                | -              | +                | -                | +                  | -          | -         | -                       | -       | -                | -              |
| data_type[int64]        | +         | +       | +               | -                | -              | -                | +                | +                  | -          | -         | -                       | -       | -                | -              |
| data_default_value      | +         | +       | +               | +                | +              | +                | +                | +                  | -          | -         | -                       | -       | -                | -              |
| token_type              | +         | +       | -               | -                | -              | -                | -                | -                  | +          | +         | +                       | -       | -                | -              |
| tokenized               | +         | +       | -               | -                | -              | -                | -                | -                  | +          | +         | +                       | -       | -                | -              |
| consistent_tokenization | +         | +       | -               | -                | -              | -                | -                | -                  | +          | +         | +                       | -       | -                | -              |
| masking                 | +         | +       | +               | +                | +              | -                | -                | -                  | -          | -         | -                       | +       | +                | +              |
| plaintext_length        | +         | +       | +               | +                | +              | -                | -                | -                  | -          | -         | -                       | +       | +                | +              |
| plaintext_side          | +         | +       | +               | +                | +              | -                | -                | -                  | -          | -         | -                       | +       | +                | +              |
