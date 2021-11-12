---
title: 'Integrating Acra with RoR app: short tutorial'
weight: 1
---

# Integrating Acra with Ruby on Rails app: short tutorial

{{< hint info >}}
AcraWriter is available in [Acra Enterprise Edition](/acra/enterprise-edition/) only.
{{< /hint>}}


This tutorial outlines a typical process of integrating Acra into a Ruby web app (more specifically, an 
app running on Ruby on Rails framework). It is based on the popular example where many Ruby users start their
development learning with – [rubygems.org repository](https://github.com/rubygems/rubygems.org).

Here we will integrate [AcraWriter](/acra/acra-in-depth/architecture/sdks/acrawriter/) to protect the
gem descriptions.

This tutorial assumes that you have both AcraServer and PostgreSQL up and running.

You can browse the modified repository [here](https://github.com/cossacklabs/rubygems.org).

## Step 1. Clone repo
```bash
git clone https://github.com/rubygems/rubygems.org.git
```
## Step 2. Install AcraWriter

```bash
gem install acrawriter
```

## Step 2.1 Install activerecord_acrawriter
This gem adds a new type to Active Record for transparent encryption

> Note: This only works with Ruby > 2.2 because that is a requirement of Active Record


```bash
gem install activerecord_acrawriter
```

## Step 3. Add AcraServer public key to config/secrets.yml
```yaml
development:
  secret_key_base: 01ade4a4dc594f4e2f1711f225adc0ad38b1f4e0b965191a43eea8a658a97d8d5f7a1255791c491f14ca638d4bbc7d82d8990040e266e3d898670605f2e5676f
  acra_public_key: VUVDMgAAAC1w3M1uArNP+AWNhmOi6+bR6SXadlPbAh3XFnBuOnLziPeHn70T # base64
```

## Step 4. Use AcraType on the fields that you want to encrypt

Encrypt unresolved_name field in Dependency model:

```ruby
# app/models/dependency.rb
require 'activerecord_acrawriter'
. . .
class Dependency < ActiveRecord::Base
    . . .
    attribute :unresolved_name, AcraType.new
    . . .
```

Encrypt authors, description, and summary fields in the Version model:
```ruby
require 'activerecord_acrawriter'
. . .
class Version < ActiveRecord::Base
    . . .
    class AuthorType < AcraType
      def cast_value(value)
         if value.is_a?(Array)
            value = value.join(', ')
            super(value)
        else
          super
        end
      end
    end
 
    attribute :authors, AuthorType.new
    attribute :description, AcraType.new
    attribute :summary, AcraType.new
```

## Step 5. Add activerecord_acrawriter to Gemfile:

```gemfile
. . .
gem 'sprockets-rails', '~> 3.1.0'
gem 'rack-attack'
gem 'activerecord_acrawriter'

group :development, :test do
  gem 'rubocop', require: false
  gem 'toxiproxy', '~> 0.1.3'
end
. . .
```    

Voila!

Congratulations, you've integrated Acra with Ruby Gems.

Additionally, you can look on our [engineering demo](https://github.com/cossacklabs/acra-engineering-demo#example-4-protecting-data-in-a-rails-application) 
where we show how to run our example with docker-compose with all infrastructure supported by Acra: 
AcraConnector, AcraWebConfig (deprecated after 0.90.0), AcraAuthManager (deprecated after 0.90.0), Prometheus, Jaeger.
