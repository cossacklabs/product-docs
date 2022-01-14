---
title: Tokenization
bookCollapseSection: true
weight: 4
---

# Tokenization

Tokenization (also known as tokenisation) is a way to transform some sensitive data into pseudo-random representation of same data type. 

A number (32 or 64-bit signed integer) will remain a number.
String will be string.
There is also special variant for string that contains email, it will be transformed to email-looking string as well.

It is better to see than to read:

* `789` → `156749362`
* `testing testing` → `lwcIvM3zaJN9cbN`
* `kate@example.com` → `sVAOfOwF@mSuGPog.et`

The tokenization process has few interesting properties:

* Tokenized value is simply random, it is neither encrypted nor hashed version of the input;
* Tokenization supports two modes:
  * Consistent tokenization — result will always remain the same for the same input (`hello` might be tokenized into `wshfwSjdsn`),
  * Inconsistent tokenization — result will be different every time, even for the same input (`hello` might be tokenized into `KishJs` or `KdCbshQoP` or `KeitAyheof`),
* Tokenization can be reversed, but only for valid (previously returned) values.

Two components can provide tokenization functionality:

* AcraServer — transparent tokenization for `INSERT` and `UPDATE` queries,
  transparent detokenization for `SELECT` queries, with per column configuration.
* AcraTranslator — provides gRPC and HTTP API for tokenization.

{{< hint warning >}}
Currently, AcraTranslator only supports consistent tokenization.
If you need inconsistent tokenization, [contact us](mailto:sales@cossacklabs.com) to get this feature in Acra Enterprise Edition.
{{< /hint >}}

Both tokenization types require deploying an additional database, Redis by default, to store pairs: token <-> encrypted data.

Refer to [Acra in depth / Architecture](/acra/acra-in-depth/architecture/key-storage-and-kms/) and [Configuring and maintaining / Key storing](/acra/configuring-maintaining/key-storing/kv-stores/) to learn more about Redis token storage.


## AcraServer configuration

In configuration file, passed by `--encryptor_config_file` flag, you can individually configure
tokenization for any field of any table, if that field has tokenizable type.

These options are accepted:

* `tokenized` — boolean, use `true` to enable tokenization
* `consistent_tokenization` — boolean, use `true` to make tokenization consistent
* `token_type` — string representing type of token:
  * `int32` — 32-bit signed integer
  * `int64` — 64-bit signed integer
  * `str` — text string
  * `bytes` — byte string (for column types like `bytea`, `BLOB`, `VARBINARY`)
  * `email` — text string that contains email, tokenized version will also look like email
  * `int32_string` and `int64_string` — similar to `int32` and `int64`,
     but for columns that contain number in text (decimal) representation,
     that number will be parsed, tokenized, and then converted to text again

## AcraTranslator API

Among all the crypto-related operations, AcraTranslator includes tokenization.
Both protocols (gRPC and HTTP) provide the same functionality, but from different angles.
You decide which one fits best for your application.

### gRPC

In order to use the translator gRPC API you have to take
[api.proto](https://github.com/cossacklabs/acra/blob/master/cmd/acra-translator/grpc_api/api.proto),
and use either `service Tokenizator` or `service BulkProcessing` (with one or more `TokenizeRequest` inside, enterprise only).

Tokenize & detokenize with `service Tokenizator`:
```
message TokenizeRequest {
    bytes client_id = 1;
    bytes zone_id = 2;
    oneof value {
        string str_value = 3;
        string email_value = 4;
        int32 int32_value = 5;
        int64 int64_value = 6;
        bytes bytes_value = 7;
    }
}

message TokenizeResponse {
    oneof response {
        string str_token = 1;
        string email_token = 2;
        int32 int32_token = 3;
        int64 int64_token = 4;
        bytes bytes_token = 5;
    };
}

service Tokenizator {
    rpc Tokenize (TokenizeRequest) returns (TokenizeResponse) {}
    rpc Detokenize (TokenizeRequest) returns (TokenizeResponse) {}
}
```

{{< hint info >}}
Detokenization is performed by creating `TokenizeRequest` with the token as value and passing it to `Detokenize` method.
Don't forget to use the same type (str / email / int32 / int64 / bytes).
{{< /hint >}}

### HTTP

#### Request

Method: `POST` (available since 0.91.0), `GET` (deprecated since 0.91.0)

Path: `/v2/tokenize` for tokenization, `/v2/detokenize` for detokenization

Mime-Type: `application/json`

Body:
```json
{ "zone_id": "",
  "type": 3,
  "data": "hidden message" }
```

> `zone_id` is _optional_ field specifying the zone ID you want to associate with this request

> `type` is a number that tells AcraTranslator the type of value being tokenized
> * `1` — 32-bit signed integer
> * `2` — 64-bit signed integer
> * `3` — text string
> * `4` — byte string (for column types like `bytea`, `BLOB`, `VARBINARY`)
> * `5` — text string that contains email, tokenized version will also look like email

> `data` contains data (for tokenization) or token (for reverse operation), the exact type depends on `type`:
> for integral types you'd make `data` a number, for string or email — string, and for bytes — base64-encoded string

#### Response

Status code: `200`

Mime-Type: `application/json`

Body:
```json
{ "data": "CWce2KYUPVYHlq" }
```

> type of `data` will depend on request, no matter what operation you perform, you will get same looking thing,
> string for string, number for number and so on

#### Examples

You can use [this docker-compose file](https://github.com/cossacklabs/acra/blob/master/docker/docker-compose.translator-tls-http.yml)
as a playground, it will bring up AcraTranslator and expose its HTTP server at `127.0.0.1:9494`.

Here you can see few examples using `curl`.
HTTP API allows bulk requests as well as simple ones (one at a time).
This example includes few simple ones.

```
curl \
    --request POST \
    --header 'Content-Type: application/json' \
    --data '{"zone_id":"","type":3,"data":"hidden message"}' \
    http://127.0.0.1:9494/v2/tokenize
{"data":"CWce2KYUPVYHlq"}

curl \
    --request POST \
    --header 'Content-Type: application/json' \
    --data '{"zone_id":"","type":5,"data":"me@domain.com"}' \
    http://127.0.0.1:9494/v2/tokenize
{"data":"wFOn@KseW.net"}
```

Here `type` can be a number from `1` to `5`, where `1` is `int32` and `5` is `email`
(see list of possible values for `token_type` in [AcraServer configuration](#acraserver-configuration), the order is the same).

<!-- TODO add link to docs that precisely describe HTTP API -->
