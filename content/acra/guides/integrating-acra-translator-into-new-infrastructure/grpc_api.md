---
title: gRPC API
bookCollapseSection: true
---

## gRPC API

gRPC API is the recommended way of using AcraTranslator for high-load services. Each gRPC request contains a ClientID, a ZoneID, and a crypto container itself.
Due to some peculiarities of the gRPC protocol, it's required to send a ClientID in every request, so ClientID is a required parameter.

Look at gRPC’s [AcraStruct](/acra/acra-in-depth/data-structures/acrastruct) request / response structure below:

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

gRPC’s request / response structure for [AcraBlock](/acra/acra-in-depth/data-structures/acrablock) looks similar but has `Sym` (symmetric) suffix additionally:

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

## Setup AcraTranslator manually

1. Generate the [Master Key](/acra/security-controls/key-management/operations/generation/#acra-master-keys)
2. Generate the AcraTranslator keys using [acra-keymaker](/acra/configuring-maintaining/general-configuration/acra-keymaker).

```bash
acra-keymaker --client_id=client --generate_acratranslator_keys 
```

3. Start AcraTranslator using gRPC API using TLS:

 Make sure you have generated all required TLS related files before starting AcraTranslator. 

 There is also additional information about [TLS configuration in AcraTranslator](/acra/configuring-maintaining/general-configuration/acra-translator/#tls).

```bash
acra-translator 
--incoming_connection_grpc_string=tcp://127.0.0.1:9595 \
--tls_key=path_to_tls_private_key \
--tls_cert=path_to_tls_cert \
--tls_ca=path_to_tls_ca 
```

Additionally, you can find a bunch of examples of using gRPC client in the [security-controls](/acra/security-controls/tokenization#grpc) section
