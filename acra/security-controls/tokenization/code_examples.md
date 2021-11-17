---
title: Code examples
weight: 4
---

## Code examples

<!-- TODO move code examples to repo -->

### Golang gRPC example

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

### Rust gRPC example

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
