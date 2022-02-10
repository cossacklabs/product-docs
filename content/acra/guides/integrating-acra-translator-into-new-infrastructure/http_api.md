---
title: HTTP API
bookCollapseSection: true
---

## HTTP API

HTTP API is useful for the non-highload services. The server responds with decrypted data or with a decryption error. 
HTTP API is a recommended way of debugging AcraTranslator's configuration (to do it, you need to check your connection and make sure that keys are located in the correct folders).

{{< hint info >}}
**Note:**
Currently, [AcraTranslator](/acra/configuring-maintaining/general-configuration/acra-translator/) supports two versions of HTTP API `/v1/*` and `/v2/*`, where `v2` version is more extended and contains additional functionality. 

For backward compatibility reasons `/v1/*` only supports working with [AcraStructs](/acra/acra-in-depth/data-structures/acrastruct). So, if you want to use HTTP API along with [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock), you should take `v2` version.
{{< /hint >}}

### HTTP API v1

#### Encrypt

##### Request

Method: `POST`

Path: `/v1/encrypt`

URL parameter:
- `zone_id` [optional] - ZoneID value to use instead of Client ID. If ZoneID empty then used ClientID from connection

Mime-Type: `application/octet-stream`

Body: `<binary plaintext pyaload>`

##### Response

Status code: `200`

Mime-Type: `application/octet-stream`

Body: `<AcraStruct>`

##### Errors

| Status | Payload | Description
| ---    |  ---    | ---
| 404    | `HTTP request doesn't have a body, expected to get data` | Empty payload
| 404    | `Can't parse body from HTTP request, expected to get data` | Inappropriate Content-Type
| 422    | `Can't encrypt data` | Something went wrong with encryption process: invalid ZoneID, problems with keys, internal issues

#### Decrypt

##### Request

Method: `POST`

Path: `/v1/decrypt`

URL parameter:
- `zone_id` [optional] - ZoneID value to use instead of Client ID. If ZoneID empty then used ClientID from connection

Mime-Type: `application/octet-stream`

Body: `<AcraStruct>`

##### Response

Status code: `200`

Mime-Type: `application/octet-stream`

Body: `<plaintext>`

##### Errors

| Status | Payload | Description
| ---    |  ---    | ---
| 404    | `HTTP request doesn't have a body, expected to get data` | Empty payload
| 404    | `Can't parse body from HTTP request, expected to get data` | Inappropriate Content-Type
| 422    | `Can't encrypt data` | Something went wrong with encryption process: invalid ZoneID, problems with keys, internal issues

### HTTP API v2

#### Encrypt with AcraStruct

##### Request

Method: `POST` (available since 0.91.0), `GET` (deprecated since 0.91.0)

Path: `/v2/encrypt`

Mime-Type: `application/json`

Body:
```json
{
   "data": "c29tZSBkYXRhCg==", 
   "zone_id":"DDDDDDDDLCMwagaNUONtEFWy"
}
```

> `data` — Base64 encoded plaintext to encrypt

> `zone_id` [optional] - ZoneID used to encrypt instead of ClientID has got from connection

##### Response

Status code: `200`

Mime-Type: `application/json`

Body: 
```json
{
   "data": "JSUl0wAAAAAAAADxIiIiIiIiIiJVRUMyAAAALUMO+pUDtl8vX/Zw2USDP+E/Lp0gsxIQcDpymRPhYXFZw+cY0tAgJwQ..."
}
```

> `data` — Base64 encoded AcraStruct

##### Errors

| Status | Payload | Description
| ---    |  ---    | ---
| 400    | `{"code":400,"message":"invalid request body"}` | Empty payload
| 400    | `{"code":400,"message":"Invalid request data"}` | Inappropriate JSON object in payload
| 422    | `{"code":422,"message":"Can't encrypt data"}` | Something went wrong with encryption process: invalid ZoneID, problems with keys, internal issues

#### Decrypt AcraStruct

##### Request

Method: `POST` (available since 0.91.0), `GET` (deprecated since 0.91.0)

Path: `/v2/decrypt`

Mime-Type: `application/json`

Body:
```json
{
   "data": "JSUl0wAAAAAAAADxIiIiIiIiIiJVRUMyAAAALUMO+pUDtl8vX/Zw2USDP+E/Lp0gsxIQcDpymRPhYXFZw+cY0tAgJwQ...", 
   "zone_id":"DDDDDDDDLCMwagaNUONtEFWy"
}
```

> `data` — Base64 encoded AcraStruct

> `zone_id` [optional] - ZoneID used to encrypt instead of ClientID has got from connection

##### Response

Status code: `200`

Mime-Type: `application/json`

Body:
```json
{
   "data": "c29tZSBkYXRhCg=="
}
```

> `data` — Base64 encoded decrypted plaintext

##### Errors

| Status | Payload | Description
| ---    |  ---    | ---
| 400    | `{"code":400,"message":"invalid request body"}` | Empty payload
| 400    | `{"code":400,"message":"Invalid request data"}` | Inappropriate JSON object in payload
| 422    | `{"code":422,"message":"Can't decrypt data"}` | Something went wrong with decryption process: invalid ZoneID, problems with keys, internal issues

#### Encrypt with searchable AcraStruct

##### Request

Method: `POST` (available since 0.91.0), `GET` (deprecated since 0.91.0)

Path: `/v2/encryptSearchable`

Mime-Type: `application/json`

Body:
```json
{
   "data": "c29tZSBkYXRhCg==", 
   "zone_id":"DDDDDDDDLCMwagaNUONtEFWy"
}
```

> `data` — Base64 encoded plaintext to encrypt

> `zone_id` [optional] - ZoneID used to encrypt instead of ClientID has got from connection

##### Response

Status code: `200`

Mime-Type: `application/json`

Body:
```json
{
   "data": "f62rEKgDLJs77Fytfn8GHrXb4E428JQoQLxZtBl5F0PpJSUl0wAAAAAAAADxIiIiIiIiIiJV..."
}
```

> `data` — Base64 encoded searchable AcraStruct

##### Errors

| Status | Payload | Description
| ---    |  ---    | ---
| 400    | `{"code":400,"message":"invalid request body"}` | Empty payload
| 400    | `{"code":400,"message":"Invalid request data"}` | Inappropriate JSON object in payload
| 422    | `{"code":422,"message":"Can't encrypt data"}` | Something went wrong with encryption process: invalid ZoneID, problems with keys, internal issues

#### Decrypt searchable AcraStruct

##### Request

Method: `POST` (available since 0.91.0), `GET` (deprecated since 0.91.0)

Path: `/v2/decryptSearchable`

Mime-Type: `application/json`

Body:
```json
{
   "data": "f62rEKgDLJs77Fytfn8GHrXb4E428JQoQLxZtBl5F0PpJSUl0wAAAAAAAADxIiIiIiIiIiJV...", 
   "zone_id":"DDDDDDDDLCMwagaNUONtEFWy"
}
```

> `data` — Base64 encoded AcraStruct

> `zone_id` [optional] - ZoneID used to encrypt instead of ClientID has got from connection

##### Response

Status code: `200`

Mime-Type: `application/json`

Body:
```json
{
   "data": "c29tZSBkYXRhCg=="
}
```

> `data` — Base64 encoded decrypted plaintext

##### Errors

| Status | Payload | Description
| ---    |  ---    | ---
| 400    | `{"code":400,"message":"invalid request body"}` | Empty payload
| 400    | `{"code":400,"message":"Invalid request data"}` | Inappropriate JSON object in payload
| 422    | `{"code":422,"message":"Can't decrypt data"}` | Something went wrong with decryption process: invalid ZoneID, problems with keys, internal issues

#### Encrypt with AcraBlock

##### Request

Method: `POST` (available since 0.91.0), `GET` (deprecated since 0.91.0)

Path: `/v2/encryptSym`

Mime-Type: `application/json`

Body:
```json
{
   "data": "c29tZSBkYXRhCg==", 
   "zone_id":"DDDDDDDDLCMwagaNUONtEFWy"
}
```

> `data` — Base64 encoded plaintext to encrypt

> `zone_id` [optional] - ZoneID used to encrypt instead of ClientID has got from connection

##### Response

Status code: `200`

Mime-Type: `application/json`

Body:
```json
{
   "data": "JSUloAAAAAAAAADwIiIiIpAAAAAAAAAAACdqAEwAAAEBQAwAAAAQAAAAIAAAANw9..."
}
```

> `data` — Base64 encoded AcraBlock

##### Errors

| Status | Payload | Description
| ---    |  ---    | ---
| 400    | `{"code":400,"message":"invalid request body"}` | Empty payload
| 400    | `{"code":400,"message":"Invalid request data"}` | Inappropriate JSON object in payload
| 400    | `{"code":400,"message":"Invalid request data, empty data"}` | Empty string value in data field in JSON object
| 422    | `{"code":422,"message":"Can't encrypt data"}` | Something went wrong with encryption process: invalid ZoneID, problems with keys, internal issues

#### Decrypt AcraBlock

##### Request

Method: `POST` (available since 0.91.0), `GET` (deprecated since 0.91.0)

Path: `/v2/decryptSym`

Mime-Type: `application/json`

Body:
```json
{
   "data": "JSUloAAAAAAAAADwIiIiIpAAAAAAAAAAACdqAEwAAAEBQAwAAAAQAAAAIAAAANw9...",
   "zone_id":"DDDDDDDDLCMwagaNUONtEFWy"
}
```

> `data` — Base64 encoded AcraBlock

> `zone_id` [optional] - ZoneID used to encrypt instead of ClientID has got from connection

##### Response

Status code: `200`

Mime-Type: `application/json`

Body:
```json
{
   "data": "c29tZSBkYXRhCg=="
}
```

> `data` — Base64 encoded decrypted plaintext

##### Errors

| Status | Payload | Description
| ---    |  ---    | ---
| 400    | `{"code":400,"message":"invalid request body"}` | Empty payload
| 400    | `{"code":400,"message":"Invalid request data"}` | Inappropriate JSON object in payload
| 422    | `{"code":422,"message":"Can't decrypt data"}` | Something went wrong with decryption process: invalid ZoneID, problems with keys, internal issues

#### Encrypt with searchable AcraBlock

##### Request

Method: `POST` (available since 0.91.0), `GET` (deprecated since 0.91.0)

Path: `/v2/encryptSymSearchable`

Mime-Type: `application/json`

Body:
```json
{
   "data": "c29tZSBkYXRhCg==", 
   "zone_id":"DDDDDDDDLCMwagaNUONtEFWy"
}
```

> `data` — Base64 encoded plaintext to encrypt

> `zone_id` [optional] - ZoneID used to encrypt instead of ClientID has got from connection

##### Response

Status code: `200`

Mime-Type: `application/json`

Body:
```json
{
   "data": "f62rEKgDLJs77Fytfn8GHrXb4E428JQoQLxZtBl5F0PpJSUloAAAAAAAAADwIiIiIpAAAAAAAAAAAC..."
}
```

> `data` — Base64 encoded searchable AcraBlock

##### Errors

| Status | Payload | Description
| ---    |  ---    | ---
| 400    | `{"code":400,"message":"invalid request body"}` | Empty payload
| 400    | `{"code":400,"message":"Invalid request data"}` | Inappropriate JSON object in payload
| 400    | `{"code":400,"message":"Invalid request data, empty data"}` | Empty string value in data field in JSON object
| 422    | `{"code":422,"message":"Can't encrypt data"}` | Something went wrong with encryption process: invalid ZoneID, problems with keys, internal issues

#### Decrypt searchable AcraBlock

##### Request

Method: `POST` (available since 0.91.0), `GET` (deprecated since 0.91.0)

Path: `/v2/decryptSymSearchable`

Mime-Type: `application/json`

Body:
```json
{
   "data": "f62rEKgDLJs77Fytfn8GHrXb4E428JQoQLxZtBl5F0PpJSUloAAAAAAAAADwIiIiIpAAAAAAAAAAAC...",
   "zone_id":"DDDDDDDDLCMwagaNUONtEFWy"
}
```

> `data` — Base64 encoded searchable AcraBlock

> `zone_id` [optional] - ZoneID used to encrypt instead of ClientID has got from connection

##### Response

Status code: `200`

Mime-Type: `application/json`

Body:
```json
{
   "data": "c29tZSBkYXRhCg=="
}
```

> `data` — Base64 encoded decrypted plaintext

##### Errors

| Status | Payload | Description
| ---    |  ---    | ---
| 400    | `{"code":400,"message":"invalid request body"}` | Empty payload
| 400    | `{"code":400,"message":"Invalid request data"}` | Inappropriate JSON object in payload
| 422    | `{"code":422,"message":"Can't decrypt data"}` | Something went wrong with decryption process: invalid ZoneID, problems with keys, internal issues

#### Generate searchable hash

##### Request

Method: `POST` (available since 0.91.0), `GET` (deprecated since 0.91.0)

Path: `/v2/generateQueryHash`

Mime-Type: `application/json`

Body:
```json
{
   "data": "c29tZSBkYXRhCg==", 
   "zone_id":"DDDDDDDDLCMwagaNUONtEFWy"
}
```

> `data` — Base64 encoded plaintext to hash

> `zone_id` [optional] - ZoneID used to encrypt instead of ClientID has got from connection

##### Response

Status code: `200`

Mime-Type: `application/json`

Body:
```json
{
   "data": "f62rEKgDLJs77Fytfn8GHrXb4E428JQoQLxZtBl5F0Pp"
}
```

> `data` — Base64 encoded searchable hash

##### Errors

| Status | Payload | Description
| ---    |  ---    | ---
| 400    | `{"code":400,"message":"invalid request body"}` | Empty payload
| 400    | `{"code":400,"message":"Invalid request data"}` | Inappropriate JSON object in payload
| 400    | `{"code":400,"message":"Invalid request data, empty data"}` | Empty string value in data field in JSON object
| 422    | `{"code":422,"message":"Can't calculate hash"}` | Something went wrong with hashing process: invalid ZoneID, problems with keys, internal issues

#### Tokenize data

##### Request

Method: `POST` (available since 0.91.0), `GET` (deprecated since 0.91.0)

Path: `/v2/tokenize`

Mime-Type: `application/json`

Body:
- Int32 value:
  ```json
  {
     "data": 123, 
     "zone_id":"DDDDDDDDLCMwagaNUONtEFWy",
     "type": 1
  }
  ```
- Int64 value:
  ```json
  {
     "data": 123, 
     "zone_id":"DDDDDDDDLCMwagaNUONtEFWy",
     "type": 2
  }
  ```
- String value:
  ```json
  {
     "data": "string value", 
     "zone_id":"DDDDDDDDLCMwagaNUONtEFWy",
     "type": 3
  }
  ```
- Binary Base64 encoded value:
  ```json
  {
     "data": "c29tZSBkYXRhCg==", 
     "zone_id":"DDDDDDDDLCMwagaNUONtEFWy",
     "type": 4
  }
  ```
- E-mail string value:
  ```json
  {
     "data": "some@email.com", 
     "zone_id":"DDDDDDDDLCMwagaNUONtEFWy",
     "type": 5
  }
  ```

> `data` — JSON value appropriate to type. Can be: integer, string, string containing binary base64 encoded value, 
> string with e-mail value.

> `zone_id` [optional] - ZoneID used for tokenization instead of ClientID has got from connection

> `type` - identifier of tokenization type:
> 
> 1 - Int32
> 
> 2 - Int64
> 
> 3 - string
> 
> 4 - bytes
> 
> 5 - e-mail
> 
> [Read more about tokenization](/acra/security-controls/tokenization/)

##### Response

Status code: `200`

Mime-Type: `application/json`

Body:
- Int32 value:
```json
{
   "data": 1001178345
}
```
- Int64 value:
```json
{
   "data": -7973202611975177045
}
```
- String value:
```json
{
   "data": "8kastrMORQKZ"
}
```
- Bytes value:
```json
{
   "data": "XWpFrPiMiL85zg=="
}
```
- E-mail value:
```json
{
   "data": "4MmkZ@AITy.edu"
}
```

> `data` — JSON value according to tokenization type. Integer for [1, 2] and String for [3, 4, 5].

##### Errors

| Status | Payload | Description
| ---    |  ---    | ---
| 400    | `{"code":400,"message":"invalid request body"}` | Empty payload
| 400    | `{"code":400,"message":"Invalid request data"}` | Inappropriate JSON object in payload
| 400    | `{"code":400,"message":"Invalid request data, empty data"}` | Missing `data` field in JSON object
| 422    | `{"code":422,"message":"Can't tokenize data"}` | Something went wrong with tokenization process: invalid ZoneID, problems with keys, internal issues

#### Detokenize

##### Request

Method: `POST` (available since 0.91.0), `GET` (deprecated since 0.91.0)

Path: `/v2/detokenize`

Mime-Type: `application/json`

Body:
- Int32 value:
  ```json
  {
     "data": 1001178345, 
     "zone_id":"DDDDDDDDLCMwagaNUONtEFWy",
     "type": 1
  }
  ```
- Int64 value:
  ```json
  {
     "data": -7973202611975177045, 
     "zone_id":"DDDDDDDDLCMwagaNUONtEFWy",
     "type": 2
  }
  ```
- String value:
  ```json
  {
     "data": "8kastrMORQKZ", 
     "zone_id":"DDDDDDDDLCMwagaNUONtEFWy",
     "type": 3
  }
  ```
- Binary Base64 encoded value:
  ```json
  {
     "data": "XWpFrPiMiL85zg==", 
     "zone_id":"DDDDDDDDLCMwagaNUONtEFWy",
     "type": 4
  }
  ```
- E-mail string value:
  ```json
  {
     "data": "4MmkZ@AITy.edu", 
     "zone_id":"DDDDDDDDLCMwagaNUONtEFWy",
     "type": 5
  }
  ```

> `data` — JSON value appropriate to type. Can be: integer, string, string containing binary base64 encoded value,
> string with e-mail value.

> `zone_id` [optional] - ZoneID used for tokenization instead of ClientID has got from connection

> `type` - identifier of tokenization type:
>
> 1 - Int32
>
> 2 - Int64
>
> 3 - string
>
> 4 - bytes
>
> 5 - e-mail
>
> [Read more about tokenization](/acra/security-controls/tokenization/)

##### Response

Status code: `200`

Mime-Type: `application/json`

Body:
- Int32 value:
  ```json
  {
     "data": 123 
  }
  ```
- Int64 value:
  ```json
  {
     "data": 123 
  }
  ```
- String value:
  ```json
  {
     "data": "string value" 
  }
  ```
- Binary Base64 encoded value:
  ```json
  {
     "data": "c29tZSBkYXRhCg==" 
  }
  ```
- E-mail string value:
  ```json
  {
     "data": "some@email.com" 
  }
  ```

> `data` — JSON value according to tokenization type. Integer for [1, 2] and String for [3, 4, 5].

##### Errors

| Status | Payload | Description
| ---    |  ---    | ---
| 400    | `{"code":400,"message":"invalid request body"}` | Empty payload
| 400    | `{"code":400,"message":"Invalid request data"}` | Inappropriate JSON object in payload
| 422    | `{"code":422,"message":"Can't detokenize data"}` | Something went wrong with detokenization process: invalid ZoneID, problems with keys, internal issues

### Bulk processing API [ENTERPRISE]

{{< hint info >}}
This feature is available in [Acra Enterprise Edition](/acra/enterprise-edition/) only.
{{< /hint>}}

All the usual API methods allow one exact operation to be performed per call.
If you need to perform multiple parallel operations within single network request, bulk API may be quite useful.

1. Create bulk processing request;
2. Put any amount of encryption/decryption/tokenization/detokenization/etc operations inside:
   * Each operation will have own input data, client ID, zone ID, just like in usual requests;
   * In addition to that, each operation will be marked with an identifier, `request_id`, so when the response is processed you will know what is what;
     (reordering is possible due to parallel processing of all requests);
3. Send the bulk processing request;
4. Receive the response, use `request_id` to identify what is what.

#### Request

Method: `POST` (available since 0.91.0), `GET` (deprecated since 0.91.0)

Path: `/v2/bulkProcessing`

Mime-Type: `application/json`

Body:
```json
{ "requests": [
    { "request_id": 1,
      "operation": "encrypt",
      "request_data": { "data": "dGVzdCBzdHJpbmc=" } },
    { "request_id": 2,
      "operation": "tokenize",
      "request_data": { "data": 2001, "zone_id": "DDDDDDDDjKjECtcRBDkmHVBh" } }
] }
```

> `request_id` — that unique identifier you can later use to match responses with requests

> `operation` — string identifying what you want to do;
for example if the usual way to symmetrically encrypt stuff would be to send request to `/v2/encryptSym`,
then `encryptSym` is the corresponding operation for bulk processing

> `request_data` — object containing data for this specific request;
if usual encryption requires you to send `{ "data": "dGVzdCBzdHJpbmc=" }` as request body,
then in bulk processing this object will be the value for `request_data`

#### Response

Status code: `200`

Mime-Type: `application/json`

Body:
```json
[
    { "request_id": 2,
      "response_data": { "data": 300291 } },
    { "request_id": 1,
      "response_data": { "data": "QqO+jei4r2lPGNOpBEARqSoB5oM=" } }
]
```

### Handling errors and troubleshooting

When using AcraTranslator service, make sure you understand error codes and take appropriate actions.

1. **API versioning**. Remember to include correct version of API into the URI request. If the URI request has no version or version number is not supported, the server will return HTTP Code `400 BAD REQUEST`, and error string in the body of the message.
2. **HTTP Code 400 BAD REQUEST** is the result of an invalid (misconfigured) request. Possible reasons are following:
    - unsupported parameters' name;
    - unsupported endpoint;
    - empty body;
    - mismatch of the content's length and the body length.
   
   To fix mentioned errors, make sure that your application sends correct parameters.
3. **HTTP Code 422 Unprocessable Entity** is the result of an error during decryption. The possible causes for getting this error could be: 
    - missing or invalid (wrong) decryption keys;
    - invalid ([AcraStruct](/acra/acra-in-depth/data-structures/acrastruct) or [AcraBlock](/acra/acra-in-depth/data-structures/acrablock)) structure (if an envelope is corrupted, or the binary data doesn't have proper header at all);
    - detection of a poison record (being addressed).
    
   For the security reasons, AcraTranslator doesn't return the real cause of the error message, masking it with a generic message "Can't decrypt AcraStruct". The underlying error is being logged to the AcraTranslator console/log file, so the only person who has the access to logs can see the error message.


### Setup AcraTranslator manually

1. Generate the [Master Key](/acra/security-controls/key-management/operations/generation/#acra-master-keys);
2. Generate the AcraTranslator keys using [acra-keymaker](/acra/configuring-maintaining/general-configuration/acra-keymaker):

```bash
acra-keymaker --client_id=client --generate_acratranslator_keys 
```

3. Start AcraTranslator using HTTP API using TLS

Make sure you have generated all required TLS related files before starting AcraTranslator.

There is also additional information about [TLS configuration in AcraTranslator](/acra/configuring-maintaining/general-configuration/acra-translator/#tls).

```bash
acra-translator 
--incoming_connection_http_string=tcp://127.0.0.1:9595 \
--tls_key=path_to_tls_private_key \
--tls_cert=path_to_tls_cert \
--tls_ca=path_to_tls_ca 
```

4. Generate [AcraStruct](/acra/acra-in-depth/data-structures/acrastruct) or [AcraBlock](/acra/acra-in-depth/data-structures/acrablock) and send HTTP request:
```bash
curl -X POST --data-binary @client.acrastruct \
--header "Content-Type: application/octet-stream" http://127.0.0.1:8000
```
