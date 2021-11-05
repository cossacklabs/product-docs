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

Method: `GET`

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

{{< hint info >}}
**Optional:**

If you want to start AcraTranslator using [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session), make sure you generated corresponding transport keys.
AcraConnector and AcraTranslator should have appropriate keypairs for initializing the [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/) connection. Use the same ClientID as for keys used for generation ([AcraStructs](/acra/acra-in-depth/data-structures/acrastruct) or [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock)).

To start AcraConnector:
```bash
acra-connector --mode=acratranslator --client_id=client \
 --acratranslator_securesession_id=acra_translator \
 --incoming_connection_string=tcp://127.0.0.1:8000 \
 --acratranslator_connection_string=tcp://127.0.0.1:9595
```

Start AcraTranslator using HTTP API using Themis Secure Session:
```bash
acra-translator --securesession_id:acra_translator \
--incoming_connection_http_string=tcp://127.0.0.1:9595
```
{{< /hint >}}

4. Generate [AcraStruct](/acra/acra-in-depth/data-structures/acrastruct) or [AcraBlock](/acra/acra-in-depth/data-structures/acrablock) and send HTTP request:
```bash
curl -X POST --data-binary @client.acrastruct \
--header "Content-Type: application/octet-stream" http://127.0.0.1:8000
```
