---
weight: 2
title: What is Hermes
---

# What is Hermes? An overview.

**Hermes** — cryptographic framework for building multi-user end-to-end encrypted data storage and sharing/processing with zero leakage risks from storage and transport infrastructure (so called **end-to-end encrypted zero knowledge architectures**).

Hermes acts as a **protected data circulation layer** with cryptographic access control for your distributed application, with zero security risk of data exposure from servers and storage.

Hermes allows deploying end-to-end encrypted data exchange, sharing, and collaboration in your apps. Hermes is platform-agnostic: it works for mobile, web, or server applications storing data in any database/datastore.

[Hermes-core](https://github.com/cossacklabs/hermes-core/) is a proof of concept implementation for Hermes — a practical data security scheme with the reference implementation, which enables distributed sharing and collaboration, enforcing access control cryptographically, while the maximum possible number of security guarantees for the protected data is preserved even in the case when one or more parts of the system are compromised.

## Hermes in a nutshell

Hermes-core is a proof of concept for Hermes – a practical data security scheme with the reference implementation, which enables distributed sharing and collaboration, enforcing access control cryptographically, while the maximum possible number of security guarantees for the protected data is preserved even in the case when one or more parts of the system are compromised.

Hermes is an end-to-end encryption methodology for manipulating structured records with crypto-controlled CRUD rights. Hermes-core is a proof-of-concept implementation of Hermes as a standalone library, which can be easily embedded into a networked or local application.

Hermes maps privileges — read, write, update, delete — to cryptographic keys, in arbitrary granularity towards protected object’s structure. Hermes does that via cryptographic process, so no attack on Hermes’s execution flow can affect the protected data - in the worst case, it will lead to nothing worse than a denial of service.

Hermes relies on stacking several cryptographic processes (symmetric and asymmetric encryption without interactive key exchange, MACs) and managing keys/data structures/encryption scopes. It uses battle-proven cryptographic algorithms and their implementations and is built using special encryption abstraction [library Themis](/themis/), which allows swapping problematic crypto-primitives or even whole algorithm families without changing a line of high-level code.

Access is managed via private keys, sharing, and permission set assignments. These procedures rely on the use of Public Key Infrastructure. A bare-bones version of such infrastructure is aimed at [easy integration](/hermes/hermes-in-depth/architecture/hermes-core-server/#сredential-store) using a simple flat file storage because Hermes is aimed at integration with any data and trust sources.

[Hermes is a proprietary framework](https://www.cossacklabs.com/hermes/) licensed by Cossack Labs.

**Hermes-core** [code repository](https://github.com/cossacklabs/hermes-core) is open-source (AGPL 3.0), created for developers and security community to illustrate the proof of concept of Hermes, which should be used for studying and verification of the methodology and cryptographic backend. Hermes-core is not a production version of Hermes but more of a sneak peek at its core layer.

Drop us an email to [info@cossacklabs.com](mailto:info@cossacklabs.com) if you are interested in commercial license for [Hermes](https://www.cossacklabs.com/hermes/) or support.


## Features

|   |   |
| - | - |
| End-to-end data security | Client apps are responsible for data encryption and access control through using Hermes, while the server-side knows nothing about the nature of data. |
| Data model-agnostic | Hermes imposes no limitations on data structure and database choice. |
| Bulletproof cryptographically | The ACL in Hermes relies completely on cryptography, where trust is bound to client’s keys. As long as the keys are safe – the system is safe. |
| Security cornerstone | With a solid security foundation on the data layer, building other security controls gets easier, the risk model becomes precise, and the overall security cost goes down considerably. |
| Defence in depth | Hermes provides a foundation layer of data protection, Hermes is fully compatible with the following layers of security controls: TLS, firewalls, WAFs, SIEM, IDS, etc. |
| Searchable encryption ᵉ | available for [enterprise customers in a separate license](mailto:info@cossacklabs.com) |
| Provides pseudonymisation ᵉ | available for [enterprise customers in a separate license](mailto:info@cossacklabs.com) |
| Audit log protected cryptographically ᵉ | available for [enterprise customers in a separate license](mailto:info@cossacklabs.com) |

## Use cases and industries

|   |   |
| - | - |
|     Healthcare     | Share FHIR and other medical records safely and distribute granular access to personnel in a secure way. Cut HIPAA costs by pushing many security controls to the encryption layer. |
|      Finance       | Store and process customer payment data securely, minimise insider threats and enable secure, accountable cross-organisation data exchange. |
|     Enterprise     | Protect commercially sensitive data and enforce access control, integrate with existing PKI and IAM stack, enforce group policies and efficient key/storage management – while keeping the data end-to-end encrypted. |
| B2C: Customer apps | Instill greater trust in your product by implementing end-to-end encryption of customer data. It’s not only E2EE messengers that deserve the right to use user trust as competitive advantage. |


## How Hermes works

Hermes operates with data that is subdivided into records that represent the hierarchy of recordsets and groups of recordsets. Each blob of data is encrypted using a symmetric key, from which a set of hashes is generated. Possession of a symmetric key by a user allows reading and carrying out other processes on hashes (including with writing data).

In Hermes-core `a document` equals `a block` and is not subdivided further as it is a basic building block for the hierarchic infrastructure of Hermes.

![Hermes core](/files/hermes/hhcoredigsnew.png)


## Hermes entities

There are 3 storage entities in Hermes (and, consequently, in Hermes-core) that constitute the **Server side**: 

- **Data store** contains the hierarchy of encrypted objects. 
- **Credential store** stores keys and hashes, asymmetrically encrypted in such a way that can only be decrypted by authorised user’s private key. Those can contain access control key which grants READ access and Update Tag which allows performing WRITE operations. 
- **Keystore** contains the symmetric keys (for READ and UPDATE), with as many copies of these keys as there are users authorised to access to the record, where every copy is wrapped (asymmetrically encrypted) with a public credential of the respective authorised user. If the permissions to READ and to WRITE extend to not just blocks, but to the list of blocks, they turn into permissions to DELETE/ADD elements.

The 4th entity of Hermes is **Client**: 

- **Client** (or clients) is the active entity in the Hermes architecture, the one that actually produces or consumes the data. Client only possesses the keypair that allows decrypting the asymmetrically encrypted data from the Server. The READ permissions are always checked on Client. The absence of the key for performing READ operations will not allow Client to decrypt the downloaded piece of data. The WRITE permissions are checked both on Client and Server so they cannot “fool” each other.


## Glossary of common Hermes' terminology

This is a table of common terms used to describe the processes and notions of Hermes (and, consequently, Hermes-core).

| Term | Definition |
| -- | -- |
|            Record           | Atomic (granular) data unit within the Hermes’ scheme.                                                                                   |
|          Recordset          | A document that consists of all records with appropriate Update tags.                                                                    |
|       Update tag (UT)       | Message authentication code of a record. A UT is used for the UPDATE authorisation process. Belongs to the Data store.                   |
|  Access control key (ACK)   | Symmetric key that allows performing operations on data. Belongs to the Keystore.                                                        |
| Access control policy (ACP) | A combination of access rules set for the specified records.                                                                             |
|    READ ACK (READ token)    | ACK for performing READ function on the data. Belongs to the Keystore.                                                                   |
|  UPDATE ACK (UPDATE token)  | Symmetric key for performing UPDATE function on the data. Belongs to the Keystore.                                                       |
|   Key encryption key (KEK)  | Cryptographic key (symmetric or asymmetric) used for encrypting other cryptographic keys in the Hermes’ scheme. Belongs to the Keystore. |


## Documentation and papers

* [Hermes page](https://www.cossacklabs.com/hermes/) and [Hermes product sheet](https://www.cossacklabs.com/files/hermes-productsheet.pdf) contain latest details about features and technical environments (supported technological stacks, databases and client sides).

* [Project's GitHub Wiki](https://www.github.com/cossacklabs/hermes-core/wiki) contains the ever-evolving official documentation, which contains everything from deployment guidelines to use-cases, including charts and tutorials you might find useful.

* Ever-evolving [Implementing Hermes-based Security Systems](https://www.cossacklabs.com/hermes/implementing-hermes-based-systems/) document describes the details of implementing Hermes-based systems in the real world.

* The scientific paper ["Hermes – a framework for cryptographically assured access control and data security"](https://www.cossacklabs.com/files/hermes-theory-paper-rev1.pdf) explains the concept behind Hermes, math model, risk & threats analysis and provides implementation details. Useful for security engineers and cryptographers.