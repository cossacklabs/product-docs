---
title: HTTP API
bookCollapseSection: true
---

## HTTP API

HTTP API is useful for the non-highload services. The server responds with decrypted data or with a decryption error. 
HTTP API is a recommended way of debugging AcraTranslator's configuration (to do it, you need to check your connection and make sure that keys are placed in the correct folders).

{{< hint info >}}
**Note:**
Currently, [AcraTranslator]({{< ref "/acra/configuring-maintaining/general-configuration/acra-translator.md" >}}) supports two versions of HTTP API `/v1/*` and `/v2/*`, where `v2` version is more extended and contains additional functionality. 

Importantly, for backward compatibility reasons `/v1/*` only supports working with [AcraStructs](/acra/acra-in-depth/data-structures/acrastruct). So, if you want to use HTTP API along with [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock), you should take `v2` version.
{{< /hint >}}


### Handling errors and troubleshooting

When using AcraTranslator service, make sure you understand error codes and take appropriate actions.

1. **API versioning**. Remember to indicate the correct API version into the request URI. If the request has no version or features an unsupported version number, the server will return HTTP Code `400 BAD REQUEST`, and error string in the body of the message.
2. **HTTP Code 400 BAD REQUEST** is the result of an invalid (misconfigured) request URL or of a missing body. The possible reasons could be: 
    - unsupported parameters' name
    - unsupported endpoint 
    - empty body 
    - mismatch of the content's length and the body length
   
   To fix the errors of this kind, please make double sure that your application sends correct parameters.
3. **HTTP Code 422 Unprocessable Entity** is the result of an error during decryption. The possible causes for getting this error could be: 
    - missing or invalid (wrong) decryption keys 
    - invalid ([AcraStruct](/acra/acra-in-depth/data-structures/acrastruct) or [AcraBlock](/acra/acra-in-depth/data-structures/acrablock)) structure (if an envelope is corrupt or the binary data doesn't have proper header at all)
    - detection of a poison record (being addressed)
    
   For the security reasons, AcraTranslator doesn't return the real cause of the error message, masking it with a generic message "Can't decrypt AcraStruct". The underlying error is being logged to the AcraTranslator console/log file, so the only person who has the access to logs can see the error message.


### Setup AcraConnector and AcraTranslator manually

1. Generate the [Master Key]({{< ref "/acra/security-controls/key-management/operations/generation#master-keys" >}})
2. Generate the transport keys using [acra-keymaker]({{< ref "/acra/configuring-maintaining/general-configuration/acra-keymaker.md" >}}). AcraConnector and AcraTranslator should have appropriate keypairs for initializing the [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/) connection. Use the same ClientID as for keys used for generation ([AcraStruct](/acra/acra-in-depth/data-structures/acrastruct) or [AcraBlock](/acra/acra-in-depth/data-structures/acrablock)).

```bash
acra-keymaker --client_id=client --generate_acratranslator_keys \
 --generate_acraconnector_keys
```

Put `_translator.pub` into the AcraConnector keys' folder and also put `.pub` into the AcraTranslator keys' folder.

3. Start AcraConnector:
```bash
acra-connector --mode=acratranslator --client_id=client \
 --acratranslator_securesession_id=acra_translator \
 --incoming_connection_string=tcp://127.0.0.1:8000 \
 --acratranslator_connection_string=tcp://127.0.0.1:9595
```

4. Start AcraTranslator using HTTP API:
```bash
acra-translator --securesession_id:acra_translator \
--incoming_connection_http_string=tcp://127.0.0.1:9595
```

5. Generate [AcraStruct](/acra/acra-in-depth/data-structures/acrastruct) or [AcraBlock](/acra/acra-in-depth/data-structures/acrablock) and send HTTP request:
```bash
curl -X POST --data-binary @client.acrastruct \
--header "Content-Type: application/octet-stream" http://127.0.0.1:8000
```