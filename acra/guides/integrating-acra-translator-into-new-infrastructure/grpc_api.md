---
title: gRPC API
bookCollapseSection: true
---

## gRPC API

gRPC API is the recommended way of using AcraTranslator for high-load services. Each gRPC request contains a ClientID, a ZoneID, and a crypto container itself.
Due to some peculiarities of the gRPC protocol, it's required to send a ClientID in every request, so ClientID is a required parameter.

See a gRPC’s [AcraStruct]({{< ref "/acra/acra-in-depth/data-structures/#understanding-acrastruct" >}}) request and response structure below:

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

gRPC’s request and response structure for [AcraBlocks]({{< ref "acra/acra-in-depth/data-structures/#acrablock" >}}) look similar but have `Sym`(symmetric) suffix additionally:

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
You can find complete content of [api.proto](https://github.com/cossacklabs/acra-Q12021/blob/master/cmd/acra-translator/grpc_api/api.proto) file in the AcraTranslator source code.
{{< /hint >}}


## Setup AcraConnector and AcraTranslator manually

1. Generate the [Master Key]({{< ref "/acra/security-controls/key-management/operations/generation#master-keys" >}})
2. Generate the transport keys using [acra-keymaker]({{< ref "/acra/configuring-maintaining/general-configuration/acra-keymaker.md" >}}). AcraConnector and AcraTranslator should have appropriate keypairs for initializing the [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/) connection. Use the same ClientID as for keys used for generation ([AcraStruct]({{< ref "/acra/acra-in-depth/data-structures/#understanding-acrastruct" >}})/[AcraBlocks]({{< ref "acra/acra-in-depth/data-structures/#acrablock" >}}).

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