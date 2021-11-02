---
title: Tokenization
weight: 4
---

# Tokenization

Tokenization (also known as tokenisation) is a way to transform some sensitive data into pseudo-random representation of same data type. 

A number (32 or 64 bit signed integer) will remain a number.
String will be string.
There is also special variant for string that contains email, it will be transformed to email-looking string as well.

It is better to see than to read:

* `789` → `156749362`
* `testing testing` → `lwcIvM3zaJN9cbN`
* `kate@example.com` → `sVAOfOwF@mSuGPog.et`

The tokenization process has few interesting properties:

* Tokenized value is simply random, it is neither encrypted nor hashed version of the input;
* Tokenization supports two modes:
  * Consistent tokenization — result will remain always the same for the same input (`hello` might be tokenized into `wshfwSjdsn`),
  * Inconsistent tokenization — result will be different every time, even for the same input (`hello` might be tokenized into `KishJs` or `KdCbshQoP` or `KeitAyheof`),
* Tokenization can be reversed, but only for valid (previously returned) values.

Two components can provide tokenization functionality:

* AcraServer — transparent tokenization for `INSERT` and `UPDATE` queries,
  transparent detokenization for `SELECT` queries, with per column configuration.
* AcraTranslator — provides gRPC and HTTP API.

Both of the require deploying an additional database, Redis by default, to store token<>encrypted data pairs.

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

<!-- TODO move code examples to repo; add gRPC & HTTP API here, similar to encryption page -->

You can use [this docker-compose file](https://github.com/cossacklabs/acra/blob/master/docker/docker-compose.translator-ssession-connector-grpc.yml)
as a playgroung, it will bring up AcraTranslator and expose its gRPC server at `127.0.0.1:9494`.

In order to use the translator gRPC API you have to take
[api.proto](https://github.com/cossacklabs/acra/blob/master/cmd/acra-translator/grpc_api/api.proto)
and use either `service Tokenizator` or `service BulkProcessing` (with one or more `TokenizeRequest` inside).

#### Golang example

```golang
package main

import (
    "bytes"
    "context"
    "fmt"
    "google.golang.org/grpc"

    // package containing compiled api.proto
    "translator-example.cossacklabs.com/m/v2/grpc_api"
)

func main() {
    clientId := "testclientid"
    zoneId := ""

    conn, err := grpc.Dial("127.0.0.1:9494", grpc.WithInsecure())
    if err != nil {
        panic(err)
    }

    client := grpc_api.NewBulkProcessingClient(conn)

    testEmail := "kate@example.com"
    testString := "testing testing"
    testInt32 := int32(789)

    resp, err := client.ProcessBulk(context.TODO(), &grpc_api.BulkRequestBatch{
       Requests: []*grpc_api.BulkRequest{
           &grpc_api.BulkRequest{
               RequestId: []byte{0},
               Request: &grpc_api.BulkRequest_Tokenize{
                   Tokenize: &grpc_api.TokenizeRequest{
                       ClientId: []byte(clientId),
                       ZoneId: []byte(zoneId),
                       Value: &grpc_api.TokenizeRequest_EmailValue{
                           EmailValue: testEmail,
                       },
                   },
               },
           },
           &grpc_api.BulkRequest{
               RequestId: []byte{1},
               Request: &grpc_api.BulkRequest_Tokenize{
                   Tokenize: &grpc_api.TokenizeRequest{
                       ClientId: []byte(clientId),
                       ZoneId: []byte(zoneId),
                       Value: &grpc_api.TokenizeRequest_StrValue{
                           StrValue: testString,
                       },
                   },
               },
           },
           &grpc_api.BulkRequest{
               RequestId: []byte{2},
               Request: &grpc_api.BulkRequest_Tokenize{
                   Tokenize: &grpc_api.TokenizeRequest{
                       ClientId: []byte(clientId),
                       ZoneId: []byte(zoneId),
                       Value: &grpc_api.TokenizeRequest_Int32Value{
                           Int32Value: testInt32,
                       },
                   },
               },
           },
       },
    })
    if err != nil {
       panic(err)
    }

    var tokenizedEmail, tokenizedString string
    var tokenizedInt32 int32

    for _, response := range resp.Responses {
        if bytes.Equal(response.RequestId, []byte{0}) {
            tokenizedEmail = response.GetTokenize().GetEmailToken()
            fmt.Printf("TOKENIZED EMAIL `%s` is `%s`\n", testEmail, tokenizedEmail)
        } else if bytes.Equal(response.RequestId, []byte{1}) {
            tokenizedString = response.GetTokenize().GetStrToken()
            fmt.Printf("TOKENIZED STRING `%s` is `%s`\n", testString, tokenizedString)
        } else if bytes.Equal(response.RequestId, []byte{2}) {
            tokenizedInt32 = response.GetTokenize().GetInt32Token()
            fmt.Printf("TOKENIZED INT32 %d is %d\n", testInt32, tokenizedInt32)
        }
    }

    resp, err = client.ProcessBulk(context.TODO(), &grpc_api.BulkRequestBatch{
        Requests: []*grpc_api.BulkRequest{
            &grpc_api.BulkRequest{
                RequestId: []byte{0},
                Request: &grpc_api.BulkRequest_Detokenize{
                    Detokenize: &grpc_api.TokenizeRequest{
                        ClientId: []byte(clientId),
                        ZoneId: []byte(zoneId),
                        Value: &grpc_api.TokenizeRequest_EmailValue{
                            EmailValue: tokenizedEmail,
                        },
                    },
                },
            },
            &grpc_api.BulkRequest{
                RequestId: []byte{1},
                Request: &grpc_api.BulkRequest_Detokenize{
                    Detokenize: &grpc_api.TokenizeRequest{
                        ClientId: []byte(clientId),
                        ZoneId: []byte(zoneId),
                        Value: &grpc_api.TokenizeRequest_StrValue{
                            StrValue: tokenizedString,
                        },
                    },
                },
            },
            &grpc_api.BulkRequest{
                RequestId: []byte{2},
                Request: &grpc_api.BulkRequest_Detokenize{
                    Detokenize: &grpc_api.TokenizeRequest{
                        ClientId: []byte(clientId),
                        ZoneId: []byte(zoneId),
                        Value: &grpc_api.TokenizeRequest_Int32Value{
                            Int32Value: tokenizedInt32,
                        },
                    },
                },
            },
        },
    })
    if err != nil {
        panic(err)
    }

    for _, response := range resp.Responses {
        if bytes.Equal(response.RequestId, []byte{0}) {
            detokenizedEmail := response.GetDetokenize().GetEmailToken()
            fmt.Printf("DETOKENIZED EMAIL `%s` is `%s`\n", tokenizedEmail, detokenizedEmail)
        } else if bytes.Equal(response.RequestId, []byte{1}) {
            detokenizedString := response.GetDetokenize().GetStrToken()
            fmt.Printf("DETOKENIZED STRING `%s` is `%s`\n", tokenizedString, detokenizedString)
        } else if bytes.Equal(response.RequestId, []byte{2}) {
            detokenizedInt32 := response.GetDetokenize().GetInt32Token()
            fmt.Printf("DETOKENIZED INT32 %d is %d\n", tokenizedInt32, detokenizedInt32)
        }
    }
}
```

#### Rust example

Using [tonic](https://lib.rs/crates/tonic) for gRPC and [tokio](https://lib.rs/crates/tokio) for its async runtime,
with multiple different tokenization requests packed into single `BulkRequest`

```rust
// build.rs
// assuming you got a copy of api.proto in proto/ dir

fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::configure()
        .build_server(false)
        .compile(&["proto/api.proto"], &["proto"])?;
    Ok(())
}

// src/main.rs

use tonic::Request;

use grpc_api::{bulk_processing_client::BulkProcessingClient, BulkRequest, BulkRequestBatch};
use grpc_api::bulk_request::Request as BulkRequestItem;
use grpc_api::bulk_response::Response as BulkResponseItem;

use grpc_api::tokenize_request::Value as TokenizeValue;
use grpc_api::tokenize_response::Response as TokenizedValue;
use grpc_api::{TokenizeRequest, TokenizeResponse};

pub mod grpc_api {
    tonic::include_proto!("grpc_api");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut client = BulkProcessingClient::connect("http://127.0.0.1:9494").await?;

    let client_id = b"testclientid";
    let zone_id = b"";

    let email = "kate@example.com";
    let string = "testing testing";
    let int32 = 789;

    let request = Request::new(BulkRequestBatch {
        requests: vec![
            BulkRequest {
                request: Some(BulkRequestItem::Tokenize(TokenizeRequest {
                    value: Some(TokenizeValue::EmailValue(email.to_string())),
                    zone_id: zone_id.iter().cloned().collect(),
                    client_id: client_id.iter().cloned().collect(),
                })),
                request_id: vec![0],
            },
            BulkRequest {
                request: Some(BulkRequestItem::Tokenize(TokenizeRequest {
                    value: Some(TokenizeValue::StrValue(string.to_string())),
                    zone_id: zone_id.iter().cloned().collect(),
                    client_id: client_id.iter().cloned().collect(),
                })),
                request_id: vec![1],
            },
            BulkRequest {
                request: Some(BulkRequestItem::Tokenize(TokenizeRequest {
                    value: Some(TokenizeValue::Int32Value(int32)),
                    zone_id: zone_id.iter().cloned().collect(),
                    client_id: client_id.iter().cloned().collect(),
                })),
                request_id: vec![2],
            },
        ],
    });

    eprintln!("TOKENIZE REQUEST: {:?}", &request.get_ref());

    let response = client.process_bulk(request).await?;

    eprintln!("TOKENIZE RESPONSE: {:?}", &response.get_ref());

    let mut tokenized_email = String::new();
    let mut tokenized_string = String::new();
    for resp in response.get_ref().responses.iter() {
        match &resp.response {
            Some(BulkResponseItem::Tokenize(TokenizeResponse { response: Some(TokenizedValue::EmailToken(tok_email)) })) => {
                println!("TOKENIZED EMAIL `{}` is `{}`", email, tok_email);
                tokenized_email = tok_email.clone();
            }
            Some(BulkResponseItem::Tokenize(TokenizeResponse { response: Some(TokenizedValue::StrToken(tok_string)) })) => {
                println!("TOKENIZED STRING `{}` is `{}`", string, tok_string);
                tokenized_string = tok_string.clone();
            }
            Some(BulkResponseItem::Tokenize(TokenizeResponse { response: Some(TokenizedValue::Int32Token(tok_int32)) })) => {
                println!("TOKENIZED INT32 {} is {}", int32, tok_int32);
            }
            Some(_) | None => unreachable!("expected Tokenize response"),
        }
    }

    let request = Request::new(BulkRequestBatch {
        requests: vec![
            BulkRequest {
                request: Some(BulkRequestItem::Detokenize(TokenizeRequest {
                    value: Some(TokenizeValue::EmailValue(tokenized_email)),
                    zone_id: zone_id.iter().cloned().collect(),
                    client_id: client_id.iter().cloned().collect(),
                })),
                request_id: vec![0],
            },
            BulkRequest {
                request: Some(BulkRequestItem::Detokenize(TokenizeRequest {
                    value: Some(TokenizeValue::StrValue(tokenized_string)),
                    zone_id: zone_id.iter().cloned().collect(),
                    client_id: client_id.iter().cloned().collect(),
                })),
                request_id: vec![1],
            },
        ],
    });

    eprintln!("DETOKENIZE REQUEST: {:?}", &request.get_ref());

    let response = client.process_bulk(request).await?;

    eprintln!("DETOKENIZE RESPONSE: {:?}", &response.get_ref());

    Ok(())
}
```

### HTTP

You can use [this docker-compose file](https://github.com/cossacklabs/acra/blob/master/docker/docker-compose.translator-ssession-connector-http.yml)
as a playgroung, it will bring up AcraTranslator and expose its HTTP server at `127.0.0.1:9494`.

Here you can see few examples using `curl`.
HTTP API allows bulk requests as well as simple ones (one at a time).
This example includes few simple ones.

```
curl \
    --request GET \
    --header 'Content-Type: application/json' \
    --data '{"zone_id":"","type":3,"data":"hidden message"}' \
    http://127.0.0.1:9494/v2/tokenize
{"data":"CWce2KYUPVYHlq"}

curl \
    --request GET \
    --header 'Content-Type: application/json' \
    --data '{"zone_id":"","type":5,"data":"me@domain.com"}' \
    http://127.0.0.1:9494/v2/tokenize
{"data":"wFOn@KseW.net"}
```

Here `type` can be a number from `1` to `5`, where `1` is `int32` and `5` is `email`
(see list of possible values for `token_type` in [AcraServer configuration](#acraserver-configuration), the order is the same).

<!-- TODO add link to docs that precisely describe HTTP API -->
