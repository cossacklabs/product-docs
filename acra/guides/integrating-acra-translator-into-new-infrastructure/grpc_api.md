---
title: gRPC API
bookCollapseSection: true
---

## gRPC API

gRPC API is the recommended way of using AcraTranslator for high-load services. Each gRPC request contains a ClientID, a ZoneID, and a crypto container itself.
Due to some peculiarities of the gRPC protocol, it's required to send a ClientID in every request, so ClientID is a required parameter.

See a gRPC’s [AcraStruct](/acra/acra-in-depth/data-structures/acrastruct) request and response structure below:

```proto
message DecryptRequest {
    bytes client_id = 1;
    bytes zone_id = 2;
    bytes acrastruct = 3;
}

message DecryptResponse {
    bytes data = 1;
}

service Reader {
    rpc Decrypt(DecryptRequest) returns (DecryptResponse) {}
}

message EncryptRequest {
    bytes client_id = 1;
    bytes zone_id = 2;
    bytes data = 3;
}

message EncryptResponse {
    bytes acrastruct = 1;
}
```

gRPC’s request and response structure for [AcraBlock](/acra/acra-in-depth/data-structures/acrablock) look similar but have `Sym`(symmetric) suffix additionally:

```proto
message DecryptSymRequest {
    bytes client_id = 1;
    bytes zone_id = 2;
    bytes acrablock = 3;
}

message DecryptSymResponse {
    bytes data = 1;
}

service ReaderSym {
    rpc DecryptSym (DecryptSymRequest) returns (DecryptSymResponse) {
    }
}

message EncryptSymRequest {
    bytes client_id = 1;
    bytes zone_id = 2;
    bytes data = 3;
}

message EncryptSymResponse {
    bytes acrablock = 1;
}
```

{{< hint info >}}
**Note:**
You can find complete content of [api.proto](https://github.com/cossacklabs/acra/blob/master/cmd/acra-translator/grpc_api/api.proto) file in the AcraTranslator source code.
{{< /hint >}}

There are dedicated pages about
[encryption]({{< ref "acra/security-controls/encryption/_index.md#grpc-api" >}}),
[searchable encryption]({{< ref "acra/security-controls/searchable-encryption/_index.md#grpc-api" >}}) and
[tokenization]({{< ref "acra/security-controls/tokenization/_index.md#grpc" >}}) in Security controls section.

### Bulk processing API [ENTERPRISE]

All the usual API methods allow one exact operation to be performed per call.
If you need to perform multiple operations in parallel, in single network request, bulk API may be quite useful.

1. Create bulk processing request
2. Put any amount of encryption/decryption/tokenization/detokenization/etc operations inside
   * Each operation will have own input data, client ID, zone ID, just like in usual requests
   * In addition to that, each operation will be marked with an identifier, `request_id`, so when the response is processed you will know what is what
     (reordering is possible due to parallel processing of all requests)
3. Send the bulk processing request
4. Receive the response, use `request_id` to identify what is what

The related part of `protobuf` file is here:
```protobuf
message BulkRequest {
    bytes request_id = 1;
    oneof request {
        TokenizeRequest tokenize = 2;
        TokenizeRequest detokenize = 8;
        SearchableEncryptionRequest searchable_encrypt = 3;
        SearchableDecryptionRequest searchable_decrypt = 4;
        QueryHashRequest query_hash = 5;
        EncryptRequest encrypt = 6;
        DecryptRequest decrypt = 7;
        SearchableSymEncryptionRequest searchable_encrypt_sym = 9;
        SearchableSymDecryptionRequest searchable_decrypt_sym = 11;
        EncryptSymRequest encrypt_sym = 10;
        DecryptSymRequest decrypt_sym = 12;
    };
}

message BulkResponse {
    bytes request_id = 1;
    oneof response {
        TokenizeResponse tokenize = 2;
        TokenizeResponse detokenize = 8;
        SearchableEncryptionResponse searchable_encrypt = 3;
        SearchableDecryptionResponse searchable_decrypt = 4;
        QueryHashResponse query_hash = 5;
        EncryptResponse encrypt = 6;
        DecryptResponse decrypt = 7;
        SearchableSymEncryptionResponse searchable_encrypt_sym = 9;
        EncryptSymResponse encrypt_sym = 10;
        SearchableSymDecryptionResponse searchable_decrypt_sym = 11;
        DecryptSymResponse decrypt_sym = 12;
    };
}

message BulkRequestBatch {
    repeated BulkRequest requests = 1;
}

message BulkResponseBatch {
    repeated BulkResponse responses = 1;
}

service BulkProcessing {
    rpc ProcessBulk (BulkRequestBatch) returns (BulkResponseBatch) {}
}
```

## Setup AcraConnector and AcraTranslator manually

1. Generate the [Master Key]({{< ref "/acra/security-controls/key-management/operations/generation#master-keys" >}})
2. Generate the transport keys using [acra-keymaker]({{< ref "/acra/configuring-maintaining/general-configuration/acra-keymaker.md" >}}). AcraConnector and AcraTranslator should have appropriate keypairs for initializing the [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/) connection. Use the same ClientID as for keys used for generation ([AcraStructs](/acra/acra-in-depth/data-structures/acrastruct) or [AcraBlocks](/acra/acra-in-depth/data-structures/acrablock)).

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
--incoming_connection_grpc_string=tcp://127.0.0.1:9595
```

Additionally, you can find a bunch of examples of using gRPC client in the [security-controls]({{< ref "/acra/security-controls/tokenization/_index.md#grpc" >}}) section
