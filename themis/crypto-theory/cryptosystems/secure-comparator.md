---
weight: 5
title:  Secure Comparator
---

# Secure Comparator

**Secure Comparator** is an implementation of
[_Zero-Knowledge Proof_](https://en.wikipedia.org/wiki/Zero-knowledge_proof)-based protocol,
built around [OTR] [SMP] implementation,
but ported to ECC domain and reinforced with additional checks and features.

[OTR]: https://otr.cypherpunks.ca/
[SMP]: http://twistedoakstudios.com/blog/Post3724_explain-it-like-im-five-the-socialist-millionaire-problem-and-secure-multi-party-computation

Secure Comparator allows two parties to compare a shared secret
without revealing it to potentially dishonest party
(as well as to any listening-in third-party, of course).

{{< hint info >}}
If you want to study security and cryptography of Secure Comparator in depth,
you might want to consult [our whitepaper](https://cossacklabs.com/files/secure-comparator-paper-rev12.pdf)
describing the development and cryptographic protocol.
(Or there is a lighter
["Explain me like I'm 5"-style article](https://hackernoon.com/eli5-zero-knowledge-proof-78a276db9eff)
on zero-knowledge proofs in Cossack Labs blog.)

You may also want to read [this comment](https://github.com/cossacklabs/themis/issues/529#issuecomment-531731507)
on comparing the design goals and usage of [Secure Session](../secure-session/)
and [Secure Comparator](../secure-comparator/)
with [SRP](https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol).
{{< /hint >}}

## Secure Comparator use cases

- **Login/password authentication**:
  by sending login, client allows the server to locate the password (or its secure derivative)
  and start comparing it.
- **OTP reinforcement**:
  authenticating actions within an already established communication/trust protocol.
- **Request authentication**:
  authenticating a data request by proving the knowledge of some significant part
  of the data's identification fields.
- **Repeated authentication**:
  authenticating already established trust relationships
  using initial tokens and shared state data accumulated during the session.

## Availability in Themis

Being the most recent addition to the mainline Themis code to the date,
Secure Comparator is yet to get all the shine and polish that our other features have.
However, Secure Comparator is already available in multiple languages:

  - [C++](/themis/languages/cpp/features/#secure-comparator)
  - [Go](/themis/languages/go/features/#secure-comparator)
  - [JavaScript (WebAssembly)](/themis/languages/wasm/features/#secure-comparator)
  - [JavaScript (Node.js)](/themis/languages/nodejs/features/#secure-comparator)
  - [Java](/themis/languages/java/features/#secure-comparator)
  - [Kotlin](/themis/languages/kotlin/features/#secure-comparator)
  - [Objective-C](/themis/languages/objc/features/#secure-comparator)
  - [Swift](/themis/languages/swift/features/#secure-comparator)
  - [Python](/themis/languages/python/features/#secure-comparator)
  - [Ruby](/themis/languages/ruby/features/#secure-comparator)
  - [Rust](/themis/languages/rust/features/#secure-comparator)

## Protocol description

Our SMP protocol is very similar to the SMP implementation in the Cypherpunk’s OTR,
except for the fact that we use ECC for all computations.

Let’s suppose we have two parties with secrets x and y respectively,
and they wish to know whether x = y.
They use ed25519 curve with G as a base point.
Alice starts the protocol.

*Alice:*

 1. Picks two random numbers: a<sub>2</sub> and a<sub>3</sub>.
 2. Computes G<sub>2a</sub> = a<sub>2</sub> × G and G<sub>3a</sub> = a<sub>3</sub> × G.
 3. Sends G<sub>2a</sub> and G<sub>3a</sub> to Bob.

*Bob:*

 4. Picks two random numbers: b<sub>2</sub> and b<sub>3</sub>.
 5. Computes G<sub>2b</sub> = b<sub>2</sub> × G and G<sub>3b</sub> = b<sub>3</sub> × G.
 6. Computes G<sub>2</sub> = b<sub>2</sub> × G<sub>2a</sub> and G<sub>3</sub> = b<sub>3</sub> × G<sub>3a</sub>.
 7. Picks a random number r.
 8. Computes P<sub>b</sub> = r × G<sub>2</sub> and Q<sub>b</sub> = r × G + y × G<sub>2</sub>.
 9. Sends G<sub>2b</sub>, G<sub>3b</sub>, P<sub>b</sub> and Q<sub>b</sub> to Alice.

*Alice:*

10. Computes G<sub>2</sub> = a<sub>2</sub> × G<sub>2b</sub> and G<sub>3</sub> = a<sub>3</sub> × G<sub>3b</sub>.
11. Picks a random number s.
12. Computes P<sub>a</sub> = s × G<sub>3</sub> and Q<sub>a</sub> = s × G + x × G<sub>2</sub>.
13. Computes R<sub>a</sub> = a<sub>3</sub> × (Q<sub>a</sub> − Q<sub>b</sub>).
14. Sends P<sub>a</sub>, Q<sub>a</sub>, R<sub>a</sub> to Bob.

*Bob:*

15. Computes R<sub>b</sub> = b<sub>3</sub> × (Q<sub>a</sub> − Q<sub>b</sub>).
16. Computes R<sub>ab</sub> = b<sub>3</sub> × R<sub>a</sub>.
17. Checks whether R<sub>ab</sub> = P<sub>a</sub> − P<sub>b</sub>.
18. Sends R<sub>b</sub> to Alice.

*Alice:*

19. Computes R<sub>ab</sub> = a<sub>3</sub> × R<sub>b</sub>.
20. Checks whether R<sub>ab</sub> = P<sub>a</sub> − P<sub>b</sub>.

If the R<sub>ab</sub> = P<sub>a</sub> − P<sub>b</sub> check is successful,
each party is then convinced that x = y.
Since R<sub>ab</sub> = (P<sub>a</sub> − P<sub>b</sub>) +
(a<sub>3</sub> × b<sub>3</sub> × (x − y)) × G<sub>2</sub>,
if x = y then R<sub>ab</sub> = (P<sub>a</sub> − P<sub>b</sub>) +
0 × G<sub>2</sub> = P<sub>a</sub> − P<sub>b</sub>.
If x ≠ y, then a<sub>3</sub> × b<sub>3</sub> × (x − y) × G<sub>2</sub>
is a random ECC point not known to any of the interacting parties,
so no information is revealed.

## Usage model

Secure Comparator has two parties: initiator (client) and responder (server).
They both initialise the Secure Comparator object,
and, upon receiving anything from the communication channel,
execute the next protocol step until the protocol is either successful or failed.

For example, you may look at
the [client](https://github.com/cossacklabs/themis/blob/master/docs/examples/python/scomparator_test_client.py)
and [server](https://github.com/cossacklabs/themis/blob/master/docs/examples/python/scomparator_test_server.py)
in Python.

## Implementation details

Secure Comparator interface is described in
[`src/themis/secure_comparator.h`](https://github.com/cossacklabs/themis/blob/master/src/themis/secure_comparator.h).

Secure Comparator does not implement the network layer,
it is your responsibility to send and receive the messages from one side to another.

To create a Secure Comparator object, use the `secure_comparator_create()` function,
then enter secret data you want to compare using `secure_comparator_append_secret()`.
When the comparison is complete, destroy the Secure Comparator object with `secure_comparator_destroy()`:

```c
secure_comparator_t* secure_comparator_create(void);

themis_status_t secure_comparator_append_secret(
    secure_comparator_t* ctx,
    const void* secret_data,
    size_t      secret_data_length);

themis_status_t secure_comparator_destroy(secure_comparator_t* comp_ctx);
```

The side that initiates the comparison is called the _client_ –
you need to call `secure_comparator_begin_compare()`
and send the resulting data to the other party.

```c
themis_status_t secure_comparator_begin_compare(
    secure_comparator_t* ctx,
    void*   hello_data,
    size_t* hello_data_length);
```

Then the client and responding _server_ proceed with the protocol,
accepting messages with `secure_comparator_proceed_compare()`
which returns replies that should be sent to the other party.

```c
themis_status_t secure_comparator_proceed_compare(
    secure_comparator_t* ctx,
    const void* request_data,
    size_t      request_data_length,
    void*       response_data,
    size_t*     response_data_length);
```

When both reach `THEMIS_SUCCESS` status,
the comparison is complete and the result can be checked with `secure_comparator_get_result()`
which returns either `THEMIS_SCOMPARE_MATCH` or `THEMIS_SCOMPARE_NO_MATCH`.

```c
themis_status_t secure_comparator_get_result(const secure_comparator_t *ctx);
```

## Thread safety

Secure Comparator requires additional synchronisation to be used concurrently from multiple threads.
Read more about [Themis thread safety guarantees](/themis/debugging/thread-safety/).
