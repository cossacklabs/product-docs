---
weight: 3
title: Security design
---

# Security design

{{< hint info >}}
This security design describes the security model of Hermes. As Hermes-core is a proof-of-concept implementation of Hermes, everything described below holds similarly true for Hermes-core.
{{< /hint >}}

When used correctly, Hermes allows slicing a single data structure into smaller parts and allowing different parties to access various parts of that data structure with different permissions. This significantly limits the attack surface and threat model on the data. What’s more important, no significant alteration of the infrastructure is necessary. The range of tools used by Hermes was built for complementing the existing relationship models, not for coming up with new ones. Built by expert cryptographers and software engineers, it combines strong security guarantees with an API that is easy to use.

Hermes cryptographically enforces the data access control policy and minimises compromisation risks of a single component. Such enforcements are achieved by:

* reducing the risk of potential damage from a security breach thanks to (physical) distribution of the components of Hermes;
* limiting/blocking the exposure to sensitive information for each component and in this way securing the perimeter of a potential security breach;
* relying on strong cryptography for proper access control over sensitive information rather than on organisational operational guidelines and proper software implementation/operation;
* using end-to-end encryption to protect communication channels between the components.

## Threat model

Hermes operates in a very restrictive threat model. 

It is assumed that: 
- each system entity can be compromised; 
- protected data can be partially leaked; 
- a passive/active attacker may be present in communication channels; 
- Data store can be dumped; 
- data object model can be leaked.

Some possible risks are out of the scope of Hermes, i.e. if authorised users deliberately leak sensitive information via out-of-band channels or when the basic execution environment (hardware and/or operating system) has been compromised.


## Trust model

* Users are trusted to properly manage the data they have access to. No security solution can cope if the users publish the data outside of the Hermes-protected infrastructure (or another security system).
* Users are also trusted to further distribute the access rights to the data (the rights that they’ve received from other authorised users) to other users (that don't yet hold the permissions/rights to the data in question). This means that if the user has level-A access rights, he/she may transfer these access rights of level-A (or lower, but never higher than the level they possess themselves) to another user.
* Hermes is able to enforce the existing access control policy, but neither Hermes nor the user granting rights can generate or provide a new access policy or grant more permissions than initially requested. A policy of traitor tracing has to be assigned on a higher-level system.
* It’s assumed that the execution environment of the components of Hermes operates properly: only the Hermes' software is running within the address space of each components’ process, and each instruction is handled according to the appropriate CPU manual.
* It’s also assumed that the operating system for Hermes is properly managed from the perspective of security - that it has proper access control mechanisms and policies, that it is regularly patched for security vulnerabilities, and that it provides proper compartmentalization and separation of processes.

## Security guarantees

1) Compromisation of a single entity from the system causes only limited damage.
2) All the sensitive information only appears in plain text in the system user/service’s context exclusively.
3) Data is protected in granular form (per record/document).
4) All communications are protected with end-to-end encryption. 
5) Data store imports/stores/exports data in encrypted form only.
6) Keystore imports/stores/exports ACKs in encrypted form only.
7) Credential store imports/stores/exports only system user/service’s public credentials.
8) Each data record is protected with a unique key.
9) Each data record may have its own flexible access control policy.

## Additional security reading

For extensive additional information on the security model of Hermes, possible threats, attacks, and mitigations, see:

- theoretical paper [Hermes – a framework for cryptographically assured access control and data security](https://www.cossacklabs.com/files/hermes-theory-paper-rev1.pdf)

* an implementation document [Implementing Hermes-based Security Systems](https://www.cossacklabs.com/hermes/implementing-hermes-based-systems/).