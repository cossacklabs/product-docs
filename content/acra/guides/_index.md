---
title: Guides
bookCollapseSection: true
weight: 5
---

# Welcome to Acra guides

This section contains a couple of guides you might find useful.

## General guidelines

* [Trying Acra](/acra/getting-started/trying/).

  Describes a lot of different ways to get completely working Acra environment from scratch – including docker composes and example apps.

* [Integrating AcraServer into infrastructure](/acra/guides/integrating-acra-server-into-infrastructure).

  A set of steps for deploying and configuring AcraServer in your infrastructure.

* [Integrating AcraTranslator into infrastructure](/acra/guides/integrating-acra-translator-into-new-infrastructure).

  A set of steps for deploying and configuring AcraTranslator in your infrastructure.

* [Using Acra 1-Click App on Digital Ocean](/acra/guides/acra-on-digital-ocean).

  Quick & easy way to deploy & configure Acra on Digital Ocean using our pre-configured environment.


## Advanced guidelines with client-side encryption

* [Integrating AcraConnector and AcraWriter for client-side encryption](/acra/guides/advanced-integrations/client-side-integration-with-acra-connector).

  Describes the process of setting up and configuring AcraConnector and AcraWriter to encrypt data on client-side application before sending to the database. This is a general guide, the language and framework of client application doesn't matter.


* [Integrating Acra to protect Django app](/acra/guides/advanced-integrations/django-acra-tutorials/).

  Describes process of tuning up the Django application for local data encryption before sending the data to the AcraServer and the database.
  Uses `acrawriter` Python package for this purpose.


* [Integrating Acra to protect Ruby on Rails app](/acra/guides/advanced-integrations/ruby-on-rails-acra-tutorials/).

  Describes process of tuning up the Ruby on Rails application for local data encryption
  before sending data to the AcraServer and the database.
  Uses `acrawriter` Ruby gem for this purpose.
