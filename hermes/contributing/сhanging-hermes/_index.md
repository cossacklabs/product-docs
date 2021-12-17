---
weight: 1
title: Changing Hermes
---

# HOW TO IMPLEMENT CHANGES IN HERMES-CORE

Hermes-core is a complex project. Changing something in Hermes-core is not easy, but quite possible. The following instructions will guide you through the steps necessary to do that.

## Read the papers

Initially, you might want to (re-)read the [scientific paper accompanying Hermes](https://www.cossacklabs.com/files/hermes-theory-paper-rev1.pdf) to understand that all its functions and models are interconnected. There is also a document addressing the implementation issues specifically — [Implementing Hermes-based Security Systems](https://www.cossacklabs.com/hermes/implementing-hermes-based-systems/), please read it, too. This will help you a lot.

## When changing data structures, change them everywhere

All the data structures used in Hermes-core are aimed at implementing the current Hermes-core architecture. If you want to extend or change one or more structure, don't forget to change its implementation and the implementation of the component that uses the changed structure. In most parts of Hermes-core, you should use object-oriented approach for implementation of components. Even though Hermes-core is written using C (not an OOP language), we try to use the OOP approach everywhere. This is why, as a rule, declaration of data structures is logically (and often also physically) located "close" to the logic that uses them.

## Processes can be changed discretely

All the processes in Hermes-core are separated into different functions and primitives and can be changed independently if the interface remains unchanged. If the interface changes, the necessity to check and change all the parts it is using will arise.

