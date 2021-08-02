---
title: Tokenisation
bookCollapseSection: true
---

# Tokenization

## Description

Tokenization is a way to transform some sensitive data into pseudo-random representation of same data type.
A number will remain a number, string will be string, email will be email.
But the tokenized version will look like a random value.
Better see than read:

* `789` -> `156749362`
* `testing testing` -> `lwcIvM3zaJN9cbN`
* `kate@example.com` -> `sVAOfOwF@mSuGPog.et`

The tokenization process has few interesting properties:

* Tokenized value is simply random, it is neither encrypted nor hashed version of the input
* Tokenization of the same value more than once will return same result
* Tokenization can be reversed, but only for valid (previously returned) values

## API

Tokenization is done by Acra Translator.
Both protocols (gRPC and HTTP) provide the same functionality, but from different angles.
You decide which one fits best for your application.

### gRPC

In order to use the translator gRPC API you have to take
[api.proto](https://github.com/cossacklabs/acra-Q12021/blob/master/cmd/acra-translator/grpc_api/api.proto)
and use either `service Tokenizator` or `service BulkProcessing` (with one one more `TokenizeRequest` inside).

#### Golang example

TODO add golang example

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

TODO add example of using curl or whatever
