---
title: Guides
bookCollapseSection: true
weight: 5
---

# Welcome to Acra guides

This section contains a couple of guides you might find useful.

* [Integrating AcraServer into infrastructure]({{< ref "integrating-acra-server-into-infrastructure" >}})

  Contains steps to do in order to make AcraServer part of your infrastructure.

* [Integrating AcraTranslator into infrastructure]({{< ref "integrating-acra-translator-into-new-infrastructure" >}})

  Similar guide, but for AcraTranslator, a separate service that performs cryptographic operations.

* Integrating AcraWriter with Django project

  Describes how to make Django application locally encrypt data before it is sent to the AcraServer (or the database).
  Uses `acrawriter` Python package for this purpose.

  * [short tutorial]({{< ref "djangoproject-short-tutorial.md" >}}) with most important things only
  * full [step-by-step tutorial]({{< ref "djangoproject-step-by-step.md" >}})

* Integrating AcraWriter with Ruby on Rails project

  Describes how to make Ruby application (based on Ruby on Rails framework) locally encrypt data
  before it is sent to the AcraServer (or the database).
  Uses `acrawriter` Ruby gem for this purpose.

  * [short tutorial]({{< ref "ruby-on-rails-short-tutorial.md" >}}) with most important things only
  * full [step-by-step tutorial]({{< ref "ruby-on-rails-tutorial.md" >}})

* [Trying Acra](/acra/getting-started/trying/)

  Many different ways to get completely working Acra environment from scratch.

There is also [advanced integrations]({{< ref "advanced-integrations" >}}) page
about more complex integration that involves cloud technologies and/or more components.
