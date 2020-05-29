---
weight: 5
title: "Secure Comparator"
---

## Secure Comparator

Secure Comparator is an implementation of Zero-Knowledge Proof-based protocol, built around [OTR](https://otr.cypherpunks.ca/) [SMP](http://twistedoakstudios.com/blog/Post3724_explain-it-like-im-five-the-socialist-millionaire-problem-and-secure-multi-party-computation) implementation, but ported to ECC domain and reinforced with additional checks and features. 

Secure Comparator allows two parties to compare a shared secret without revealing it to potentially dishonest party. 

You might want to consult our whitepaper on Comparator's development and cryptographic protocol [here](https://cossacklabs.com/files/secure-comparator-paper-rev12.pdf) to study the security/cryptography details (or there is an ["Explain me like I'm 5"-style article on Zero Knowledge Proof](https://hackernoon.com/eli5-zero-knowledge-proof-78a276db9eff) in the Cossack Labs Medium blog). 

> Note: You may also want to read [this comment](https://github.com/cossacklabs/themis/issues/529#issuecomment-531731507) on comparing the design goals and usage of [Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session/) and [Secure Comparator](/docs/themis/crypto-theory/crypto-systems/secure-comparator/) with [SRP](https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol).    

## Secure Comparator use cases

- **Login/password authentication**: by sending login, client allows the server to allocate password (or secure derivative) and start comparing it. 
- **OTP reinforcement**: authenticating action within an already established communication/trust protocol.
- **Request authentication**: authenticating data request by proving the knowledge of some significant part of the data's  identification fields.
- **Repeated authentication**: authenticating already established trust relationships using initial tokens and shared state data accumulated during the session.

## Secure Comparator availability in Themis

Being the most recent addition to the mainline Themis code to the date, Secure Comparator is yet to get all the shine and polish that our other objects do have. However, Secure Comparator is already available in Go, C++, Ruby, Python, NodeJs, Java, and Objective-C/Swift wrappers. You can find the language-specific examples in the [docs/examples](https://github.com/cossacklabs/themis/tree/master/docs/examples) folder.

## Protocol

Our SMP protocol is very similar to the SMP implementation in the Cypherpunk’s OTR, except for the fact that we use ECC for all computations.

Let’s suppose we have two parties with secrets x and y respectively, and they wish to know whether x = y. They use ed25519 curve with G as a base point. Alice starts the protocol:

*Alice:*    

   - picks two random numbers: a<sub>2</sub> and a<sub>3</sub>,     
   - computes G<sub>2a</sub> = a<sub>2</sub> × G and G<sub>3a</sub> = a<sub>3</sub> × G,
   - sends G<sub>2a</sub> and G<sub>3a</sub> to Bob.     

*Bob:*    

   - picks two random numbers: b<sub>2</sub> and b<sub>3</sub>,
   - computes G<sub>2b</sub> = b<sub>2</sub> × G and G<sub>3b</sub> = b<sub>3</sub> × G,
   - computes G<sub>2</sub> = b<sub>2</sub> × G<sub>2a</sub> and G<sub>3</sub> = b<sub>3</sub> × G<sub>3a</sub>,
   - picks a random number r,
   - computes P<sub>b</sub> = r × G<sub>2</sub> and Q<sub>b</sub> = r × G + y × G<sub>2</sub>,
   - sends G<sub>2b</sub>, G<sub>3b</sub>, P<sub>b</sub> and Q<sub>b</sub> to Alice.

*Alice:*

   - computes G<sub>2</sub> = a<sub>2</sub> × G<sub>2b</sub> and G<sub>3</sub> = a<sub>3</sub> × G<sub>3b</sub>,
   - picks a random number s,
   - computes P<sub>a</sub> = s × G<sub>3</sub> and Q<sub>a</sub> = s × G + x × G<sub>2</sub>,
   - computes R<sub>a</sub> = a<sub>3</sub> × (Q<sub>a</sub> − Q<sub>b</sub>),
   - sends P<sub>a</sub>, Q<sub>a</sub>, R<sub>a</sub> to Bob.    

*Bob:*

   - computes R<sub>b</sub> = b<sub>3</sub> × (Q<sub>a</sub> − Q<sub>b</sub>),
   - computes R<sub>ab</sub> = b<sub>3</sub> × R<sub>a</sub>,
   - checks whether R<sub>ab</sub> = P<sub>a</sub> − P<sub>b</sub>,
   - sends R<sub>b</sub> to Alice.      

*Alice:*    

   - computes R<sub>ab</sub> = a<sub>3</sub> × R<sub>b</sub>,    
   - checks whether R<sub>ab</sub> = P<sub>a</sub> − P<sub>b</sub>.     

If the R<sub>ab</sub> = P<sub>a</sub> − P<sub>b</sub> check is successful, each party is then convinced that x = y. Since R<sub>ab</sub> = (P<sub>a</sub> − P<sub>b</sub>) + (a<sub>3</sub> × b<sub>3</sub> × (x − y)) × G<sub>2</sub>, if x = y then R<sub>ab</sub> = (P<sub>a</sub> − P<sub>b</sub>) + 0 × G<sub>2</sub> = P<sub>a</sub> − P<sub>b</sub>. If x ≠ y, then a<sub>3</sub> × b<sub>3</sub> × (x − y) × G<sub>2</sub> is a random ECC point not known to any of the interacting parties, so no information is revealed.

## Secure Comparator usage examples

Secure Comparator has two parties: initiator (client) and responder (server). They both initialise the Secure Comparator object, and, upon receiving anything from the communication channel, execute the next protocol step until the protocol is either successful or failed. 

For example, you may look at the Python [client](https://github.com/cossacklabs/themis/blob/master/docs/examples/python/scomparator_test_client.py) and [server](https://github.com/cossacklabs/themis/blob/master/docs/examples/python/scomparator_test_server.py).

## Implementation details

Secure Comparator interface is described in [src/themis/secure_comparator.h](https://github.com/cossacklabs/themis/blob/master/src/themis/secure_comparator.h). Implementation doesn't cover the network layer, so it is your responsibility to send and receive the messages from one side to another.

To create a Secure Comparator object, use `secure_comparator_create` function, then enter secret data you want to compare using the `secure_comparator_append_secret`. When the comparison is complete you should destroy the Secure Comparator object with `secure_comparator_destroy`:

```c
secure_comparator_t* secure_comparator_create(void);

themis_status_t secure_comparator_append_secret(
        secure_comparator_t* comp_ctx,
        const void* secret_data,
        size_t      secret_data_length);

themis_status_t secure_comparator_destroy(secure_comparator_t* comp_ctx);
```

The first step of comparison is made by the initiator. You need to send `compare_data` to the responder.

```c
themis_status_t secure_comparator_begin_compare(
        secure_comparator_t* comp_ctx,
        void*   compare_data,
        size_t* compare_data_length);
```

Then responder and the initiator are proceeding with message calculations. The results of each step should be sent to the other party.

```c
themis_status_t secure_comparator_proceed_compare(
        secure_comparator_t *comp_ctx,
        const void* peer_compare_data,
        size_t      peer_compare_data_length,
        void*       compare_data,
        size_t*     compare_data_length);
```

The result of the comparison can be checked by calling the `secure_comparator_get_result` function which returns either `THEMIS_SCOMPARE_MATCH` or `THEMIS_SCOMPARE_NO_MATCH`.

```c
themis_status_t secure_comparator_get_result(const secure_comparator_t *comp_ctx);
```


## Secure Comparator across Themis wrappers    

To see how Secure Comparator is implemented in each language supported by Themis, go straight to the language wrapper that interests you:     

* [Secure Comparator in C++](/docs/themis/languages/cpp/#secure-comparator)
* [Secure Comparator in Go](/docs/themis/languages/go/#secure-comparator)
* [Secure Comparator in Java Android](/docs/themis/languages/java-android/#secure-comparator)
* [Secure Comparator in Kotlin Android](/docs/themis/languages/kotlin-android/#secure-comparator) 
* [Secure Comparator in Java Desktop](/docs/themis/languages/java-desktop/#secure-comparator)
* [Secure Comparator in Javascript (WebAssembly)](/docs/themis/languages/wasm/#secure-comparator)
* [Secure Comparator in Node.js](/docs/themis/languages/nodejs/#secure-comparator)
* [Secure Comparator in Objective-C](/docs/themis/languages/objc/#secure-comparator) (iOS, macOS)
* [Secure Comparator in Swift](/docs/themis/languages/swift/#secure-comparator) (iOS, macOS)
* [Secure Comparator in PHP](/docs/themis/languages/php/#secure-comparator)
* [Secure Comparator in Python](/docs/themis/languages/python/#secure-comparator)
* [Secure Comparator in Ruby](/docs/themis/languages/ruby/#secure-comparator)
* [Secure Comparator in Rust](/docs/themis/languages/rust/#secure-comparator)

## Thread Safety

Secure Comparator is not safe to use concurrently from multiple threads. Read more about Themis thread safety guarantees [in the documentation](/docs/themis/debugging/thread-safety/).