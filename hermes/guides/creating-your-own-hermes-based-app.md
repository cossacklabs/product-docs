---
title: "Creating your own Hermes-based app"
---

# Creating your own Hermes-based app

It is highly advisable to familiarise yourself with the [scientific Hermes paper](https://www.cossacklabs.com/files/hermes-theory-paper-rev1.pdf) 
and [Hermes Implementation paper](https://www.cossacklabs.com/hermes/implementing-hermes-based-systems/) to deeply understand the core components and processes of Hermes, before getting down to the creating a Hermes-based app.

## Applied Theory

Building Hermes-based app starts with understanding the architecture of target solution: do the clients and data stores reside on different servers? Should the app perform remote or local operations? What can be trusted and what cannot? Depending on these factors, different layouts should be chosen:

* Distributed, client-server;
* Integrated, client-server, pieces aligned in a custom way;
* Compact, single-node.

For example, let's take one typical use-case for Hermes — [an online medical service where the patients securely interact with the staff of multiple medical institutions](https://docs.cossacklabs.com/pages/documentation-hermes/#hermes-usage-ideas). Let's say, we have patient's records that contain a number of medical examination results, and the patient’s personal physician needs to be able to access all of them, while the employees of the medical institutions need to be able to access only the latest results to adjust their activities towards the patient.

Our goal would be to implement such an encryption scheme, where the patient (User) is the only one who can read his/her every medical record, and is the one who can further distribute the rights to some pieces of data. The User's MD gets access to all of the medical data, a surgeon gets access to most of the User's data, while a nurse can only see a limited number of records necessary for the upcoming procedures. We must also decide where we are going to store the records, tokens, users credentials, etc.

Having decided upon the general outline of the Hermes-based app we want to build, we can proceed to the [App building plan](https://docs.cossacklabs.com/pages/create-your-client-server-app-step-by-step/).

## Practice

#### 01. (Make sure you) Understand the integration points.

Hermes-core doesn't include communication and storage components, only interfaces. Communication and storage must be implemented separately (through external means) before you'll be able to start building and using Hermes-core.

There is only one requirement towards the communication between the components of Hermes-core — security. For this reason, Hermes-core has a built-in wrapper that creates Themis' [Secure Session](https://docs.cossacklabs.com/pages/secure-session-cryptosystem/) communication channel under the abstract transport that needs to be implemented by the user. Such transport can be created using any available mechanism and it must be able to implement the following interface:

(`include/hermes/rpc/transport.h`)

Hermes-core requires three separate storage entities:

* Data store (`include/hermes/data_store/db.h`):
* Credential store (`include/hermes/credential_store/db.h`):
* Keystore (`include/hermes/key_store/db.h`):

#### 02\. Plan out the key life cycle and the trust scheme.

All the necessary ephemeral key pairs and symmetric keys are only stored in memory when they are needed. After usage, they are securely zero-filled (replaced with zeros). The only secret that the user needs to control him/herself is the private user key. The main requirement for the private key is that it mustn't ever leave the client machine (as in "leak outside the machine").

#### 03\. Integrate Client & Server.

Now that all the components (backends) are ready, the actual implementation of the client and server parts of the application can be carried out.

Hermes-core includes helper objects for implementing the Server side:

* `hm_data_store_service_t`,
* `hm_credential_store_service_t`,
* `hm_key_store_service_t`.

A typical usage of helper objects looks like this:

```
hm_credential_store_service_t* service=hm_credential_store_service_create(client_transport, db);
if(!service){
// handle error
}
hm_credential_store_service_start(service);
hm_credential_store_service_destroy(&service);
```

#### 04\. Implement key lifecycle scheme in Client.

For implementing the client side, Hermes-core provides an object `mid_hermes_t`, which provides an interface that includes all the necessary functions. You can see an example implementation of `mid_hermes_t` in [docs/examples/c/mid_hermes/client/hermes_client.c](https://github.com/cossacklabs/hermes-core/blob/master/docs/examples/c/mid_hermes/client/hermes_client.c). The key lifecycle scheme on the Client is fully controlled by the `mid_hermes_t` instance.

#### What's next

Read a detailed explanation of app components in [Create your client server app](https://docs.cossacklabs.com/pages/create-your-client-server-app-step-by-step/) in the tutorials section.

Consider checking full tutorials to understand how to add and update blocks, grant READ and UPDATE access right for users and revoke access rights.

* [Usage examples](https://docs.cossacklabs.com/pages/documentation-hermes/#building-example-apps) describe how examples work and what are possible usages for Hermes-core.
* [C tutorial](https://docs.cossacklabs.com/pages/c-tutorial-hermes/), where both service and client app are written in C.
* [Python tutorial](https://docs.cossacklabs.com/pages/python-tutorial-hermes/), where service side is C-based, but client code runs on Python.
* [Go tutorial](https://docs.cossacklabs.com/pages/go-tutorial-hermes/), where service side is C-based, but client code runs on Go.

