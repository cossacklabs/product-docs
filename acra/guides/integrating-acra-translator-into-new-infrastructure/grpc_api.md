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

Start AcraTranslator using gRPC API using Themis Secure Session:
```bash
acra-translator --securesession_id:acra_translator \
--incoming_connection_grpc_string=tcp://127.0.0.1:9595
```
{{< /hint >}}


Additionally, you can find a bunch of examples of using gRPC client in the [security-controls](/acra/security-controls/tokenization#grpc) section