---
title: 'Integration example: RubyGems - step-by-step tutorial'
bookCollapseSection: true
---

## Using Acra to Protect Your Rails App
{{< hint info >}}
Note: This tutorial is an extensive step-by-step guide for those who have never used Themis and Acra before. 
There is also a [much shorter version]({{< ref "/acra/guides/ruby-on-rails-short-tutorial.md" >}}) for the experienced 
Acra users. If it’s your very first encounter with Acra, keep reading.
{{< /hint >}}

### Intro

Acra is a database security suite, which protects you against data leaks and many typical application threats through 
strong selective encryption and intrusion detection capabilities.

It is based on our [Themis](https://www.cossacklabs.com/themis/) cryptographic library with extreme security and usability 
for developers in mind (you can read more about Themis' cryptography in Acra [here]({{< ref "/acra/acra-in-depth/cryptography-and-key-management/" >}})).

Acra is most useful for:

- Selective protection of sensitive data,
- Autosharded databases,
- Microservices,
- Situations with severe time constraints (aka "pressing deadlines" ;).

Acra is developer-oriented, with convenient infrastructure, and easily provides strong security and full granular 
control over your data.

The main basic components of Acra are:

- AcraServer - a separate daemon that runs in an isolated environment (separate virtual machine or physical server), 
  which is responsible for holding all the secrets required to decrypt the data and for actually decrypting this data.
- AcraWriter - a client-side library, which integrates into the app flow either through ORM or directly, and provides 
  the means to encrypt the sensitive data via generating AcraStructs.

![](/files/guides/djangoproject-tutorial/acra_simple_scheme_new.png)

This tutorial guides you through a typical process of integrating Acra into an app running on Ruby on Rails framework. 
It is based on the popular example many Ruby users start their development learning with – 
[rubygems.org repository](https://github.com/rubygems/rubygems.org).
[RubyGems](https://rubygems.org/) is a package manager for Ruby that provides a standard format for distributing Ruby
programs and libraries in a self-contained format called a "gem".
We’ll integrate Acra into it to provide cryptographic protection of the gem descriptions – i.e. author name, email, app
description, etc.

### Security model

Acra provides selective encryption and only protects the records you want to protect.

With AcraWriter, the records to be encrypted are wrapped in a function that outputs an AcraStruct (cryptographic 
container decryptable by AcraServer). AcraStruct is then stored in a database.

In Acra’s threat model, we assume that anything but AcraServer can be compromised and that any piece of data can leak 
outside. For Acra to stay secure, only AcraServer must stay secure. However, if AcraServer is compromised, the whole 
implementation of Acra will make no sense.

With Acra we strive to provide 2 main programmatic security guarantees:

- G1: Even if all the other parts of the system are compromised, as long as AcraServer is secure, the attacker won’t 
  collect enough data for decryption of the protected materials (database entries in our case).


- G2: If the attacker alters the app’s behaviour in such a way that makes it request all the protected (encrypted) data 
  from the database, AcraServer detects it and reacts accordingly by triggering pre-set alarms and panic blocks. This is 
  currently carried out with the help of poison records in the database, which would never have been called up - except 
  for an event of a hack/breach. In the future, more intrusion detection features besides poison records are planned.

If it is explicitly stated that the output for Zone ID must precede the AcraStruct, Acra Server will search for certain 
strings called [Zone IDs (“Zones”)]({{< ref "acra/security-controls/zones.md" >}}}) when analysing the database output stream.
Zones let Acra know that within this record a private key corresponding to the Zone ID should be used for the actual 
decryption of AcraStructs.

Zones are the way to cryptographically compartmentalise records in an already-encrypted environment. They rely on 
different private keys on the server side. When using Zone keys, you get an additional 3rd guarantee:

- G3: If the attacker manages to compromise the system and modify the app to extract all the records protected by 
  Zone keys, he/she will have to reverse-engineer both the storage model and the Zone identification to be able to 
  request all of them correctly.

## Deploying infrastructure

In a perfect world, you’d be running different elements of Acra, as well as your database, on 3 separate machines - 
one for PostgreSQL, one for AcraServer, and one for AcraConnector + AcraWriter + your Rails app.
This implies an immediate introduction of Acra into a real production setting, which we realise is far from a realistic 
course of events (at least on your very first try of Acra). So this tutorial is more focused on the things you can 
hands-on try out and tinker with on just 2 or even 1 machine through the creation of different users and containers 
(i.e. Docker, a test-only implementation of which for Acra is described at the end of this tutorial ("If you want to 
try Acra in containers)).

In this detailed architectural scheme we see how components of Acra, application, and database relate and interact with 
each other:
![](/files/guides/djangoproject-tutorial/acra-entities-current.png)

Put simply, the application talks to AcraConnector. AcraConnector pretends to be a database listener that uses standard
PostgreSQL protocol and send the request to AcraServer using [Secure Session]({{< ref "themis/crypto-theory/cryptosystems/secure-session.md" >}}) 
(socket protection protocol). AcraServer sends a request to the database using the regular PostgreSQL protocol and 
receives an answer.
If AcraServer detects the presence of AcraStruct while parsing the answer, it attempts to decrypt it and replace 
AcraStruct with a plaintext result in the answer (if decryption is unsuccessful, AcraServer will forward the answer as 
is). AcraServer returns the data to AcraConnector which returns it to the application.
If Zones are used, AcraServer will use a corresponding private key to decrypt the next detected AcraStruct upon detecting 
ZoneId. AcraServer will ignore the AcraStruct if no Zone ID is detected before the AcraStruct.

All the dependencies mentioned in this tutorial need to be installed on all the machines/containers running Acra (or 
for both separate users of AcraServer and AcraConnector), unless it’s explicitly specified that some Acra components 
should only be installed for a separate user/machine running AcraServer or AcraConnector. All the commands starting
with 'go' are meant to be executed from 'acra' folder (the folder with the repository code) on any machine.

In this tutorial, we assume that you have a fully operational [PostgreSQL](https://www.postgresql.org/docs/current/static/tutorial.html) 
(as Acra transfers and receives data “as is” to and from PostgreSQL database and then processes it - parses the messages - 
according to the PostgreSQL protocol) and operate on Linux machines (with with Ruby environment and Rails framework installed). 
It’s also crucial that you have libssl-dev installed with libcrypto.so in $PATH before proceeding.

This might appear complicated, but in reality, Acra is easy to install. Let’s go!

### Step 1. Install Acra

[Installation guide]({{< ref "/acra/configuring-maintaining/installing/" >}}) - here you can find out how to install Acra
from package repository or sources.

### Step 2. Generate the transport, storage keys, and master key

Generate master key for AcraServer:

```bash
acra-keymaker --generate_master_key=master.key    
``` 

Export the key to the environment variable in `base64` format:

```
export ACRA_MASTER_KEY=`cat master.key | base64`
```    

Generate keys into ./.acrakeys directory structure:

```bash
/bin/bash $GOPATH/src/github.com/cossacklabs/acra/scripts/generate-keys.sh \
    --keys_dir ./.acrakeys \
    --client_id yourID
```

```bash
./.acrakeys/yourID_server
./.acrakeys/yourID_server.pub
./.acrakeys/yourID_storage
./.acrakeys/yourID_storage.pub
```    

Here `yourID` is a placeholder for the ID name of your choice. You’re allowed to use 5-256 symbols (inclusively) that
include Latin symbols, numbers, “-” (minus symbol), “_” (underscore), and “ ” (space).

The generator will generate and place the keys into the `.acrakeys` directory (you can change this with `--output` argument).

For a few minutes, let the keys rest where they are - they will be necessary after you have installed AcraServer, 
AcraProxy, and AcraWriter (if you’d like to read more about the keys, please see 
[Key Management]({{< ref "acra/acra-in-depth/cryptography-and-key-management/#-INVALID" >}})).

### Step 3. Launch AcraServer

{{< hint info >}}
Yet another reminder that AcraServer needs to be installed on a separate computer/virtual machine/container.
{{< /hint >}}

AcraServer should have AcraConnector's public transport key,  and  AcraServer's public transport key must be given 
to AcraConnector.This is necessary for accepting connections via Secure Session from clients.

Put `.acrakeys/yourID.pub` + `.acrakeys/yourID_server` + `.acrakeys/yourID_storage` into AcraServer’s key folder with
proper permissions (folder 700, private keys 600 - permissions are assigned during the generation process, and permissions
for AcraConnector and AcraWriter keys are the same).

Before launching AcraServer, you need to perform the following first (the keys for this were generated in Step 4.):

```bash
/bin/bash $GOPATH/src/github.com/cossacklabs/acra/scripts/generate-keys.sh \
    --keys_dir ./.acrakeys \
    --client_id yourID
```    

Launch AcraServer with:

```bash
acra-server --db_host=127.0.0.1
```    

The command above can be complemented with `--db_port=5432 -v` to adjust the listener port and to add logs quickly. 
There are more parameters available, and you can find them in the 
[documentation page for Acra]({{< ref "/acra/configuring-maintaining/general-configuration/acra-server.md" >}}), but for the present goal - namely, 
for an easy integration of Acra into a Ruby app, the default parameters will do.

You can also run with the options from config. Copy the example config:

```bash
$REPO_DIR/configs/acra-server.yaml
```    

or from

```bash
$GOPATH/src/github.com/cossacklabs/acra/configs/acra-server.yaml
```    

Or generate the config yourself:

```bash
acra-server --dump_config > acra-server.yaml
```    

and run:

```bash    
acra-server --config_file=acra-server.yaml
```     

Proper logging is set with:

```bash
acra-server --db_host=127.0.0.1 -v
```    

You’ll also need an explicit server_id that is used as an identifier for Secure Session between AcraConnector and AcraServer:

```bash
acra-server --db_host=127.0.0.1 --securesession_id=server_id_name_of_your_choice
```     

If you changed the server ID to some `server_id_name_of_your_choice`, specify this ID for AcraConnector using:

```bash
acra-connector --acraserver_securesession_id=server_id_name_of_your_choice
```     

By default, AcraServer listens on port 9393, but you can set a custom port (just don’t forget to follow the instructions 
on specifying a custom port for AcraConnector further in this tutorial) if there is a need:

```bash
acra-server --db_host=127.0.0.1 --incoming_connection_port=3000
```

Here `3000` is the customisable part.

### Step 4. Launch AcraConnector

AcraConnector should run under a separate user on the same machine as your Rails app (or in a separate container for 
testing purposes). All the database requests need to be directed to AcraConnector, which then pretends to be a database
listener (a local proxy) and relays all the requests to AcraServer (on a separate machine/in a separate container), 
listens back and returns the responses to the app.

Put `.acrakeys/yourID` + `.acrakeys/yourID_server.pub` to AcraConnector’s key folder (`.acrakeys` or anything you chose 
in `--keys_output_dir`). AcraConnector’s own public key should already have been given to AcraServer to establish 
[Secure Session](https://github.com/cossacklabs/themis/wiki/Secure-Session-cryptosystem) connection. Pre-shared public 
keys enforce maximum secrecy and easy-to-manage authentication, and - as you can see - require minimal intervention on 
your side or into your code for successful implementation.

Upon launch with the default settings, AcraConnector will start listening on port 9494 and will attempt to connect to 
AcraServer on port 9393. To initialise, use:

```bash
acra-connector --acraserver_connection_host=127.0.0.1 --client_id=yourID -v
```  

Let’s change the port AcraConnector is listening on:

```bash
acra-connector --client_id=client_name --acraserver_connection_host=acra.server.host --acraserver_connection_port=5432
```     

Now AcraConnector will be listening on port `5432` (your custom port).
This is important if you want the launch of AcraConnector to be transparent for the app (if your app connected to PostgreSQL on `5432`).

You can also launch AcraConnector with the options from example config - just copy it from:

```bash
$REPO_DIR/configs/acra-connector.yaml
```     

Or from:

```bash
$GOPATH/src/github.com/cossacklabs/acra/configs/acra-connector.yaml
```  

If you want, you can generate an example config yourself. Use:

```bash
acra-connector --dump_config > acra-connector.yaml
```

And run:

```bash
acra-connector --config_file=acra-connector.yaml
```     

These instructions should be enough to get you up and running with AcraConnector, and you can proceed to the actual 
integration of Acra into a Rails app. For more advanced ways of setting up and launching AcraConnector, please see the 
corresponding fragment of [Acra documentation]({{< ref "/acra/configuring-maintaining/installing/building-acrawriter.md" >}}).

## Integration

### Step 5. Integrating Acra with Rails

Since in our example we’ll be integrating Acra into a Ruby web app - namely RubyGems app running on Ruby on Rails 
framework - to protect the gem descriptions, i.e. name of the app author, email, summary, license, app description, 
etc.. Here, for example, is what
[our own rubygem](https://github.com/cossacklabs/acra/blob/master/wrappers/ruby/acrawriter/acrawriter.gemspec) specification 
for Acra looks like:

![](/files/guides/rubygems-tutorial/rubygem_exmpl.png)

To protect similar fields in your own gems, you need to start with cloning the 
[rubygems.org repository](https://github.com/rubygems/rubygems.org) (to the same machine/container that is running 
AcraConnector) with:

```bash
git clone https://github.com/rubygems/rubygems.org.git
```     

Visit your local [RubyGems sign up page](http://127.0.0.1:3000/users/new) and register with your email address, username, 
and a password. After the registration, verify your email using the following command: 
```bash
psql -h127.0.0.1 --dbname=acra -Utest -c 'update users set email_confirmed=TRUE where id = (select max(id) from users);'
```

AcraWriter comes into play next. It is basically [Themis](https://www.github.com/cossacklabs/themis) that is generating 
AcraStructs with the keys you've made available to AcraWriter. You can encrypt your sensitive data by generating 
AcraStructs with AcraWriter anywhere in your app. AcraWriter can be used whenever you need to encrypt sensitive records 
(in our case - gem descriptions).

Install AcraWriter:

```bash
gem install acrawriter
```    

### Step 5.1 Install activerecord_acrawriter

{{< hint info >}}
Note: This only works with Ruby > 2.2 because that is a requirement of Active Record
{{< /hint >}}

This gem adds a new type to Active Record for transparent encryption:

```bash
gem install activerecord_acrawriter    
```

### Step 6. Add AcraServer public key to config/secrets.yml

To proceed with integrating Acra into your Rails app, you need to add the AcraServer public key into your 
[rubygems.org/config/secrets.yml file](https://github.com/rubygems/rubygems.org/blob/master/config/secrets.yml), like this:

```yaml
Development:
      secret_key_base: 
 01ade4a4dc594f4e2f1711f225adc0ad38b1f4e0b965191a43eea8a658a97d8d5f7a1255791c491f14ca638d4bbc7d82d8990040e266e3d898670605f2e5676f
      acra_public_key: VUVDMgAAAC1w3M1uArNP+AWNhmOi6+bR6SXadlPbAh3XFnBuOnLziPeHn70T # base64
```

### Step 7. Use AcraType on the gem fields you want to encrypt

Encrypt the unresolved_name field in the Dependency model:

```ruby
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

### Step 8. Add activerecord_acrawriter to your gemfile

Add the `activerecord_acrawriter` dependencies to the project:

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

This completes the process of integrating a fully operational Acra into your Ruby on Rails app in a real-life setup 
that uses different machines/users.

## Result and testing
To test your Acra setup:

- Connect AcraConnector to AcraServer, send a regular request to your database through AcraConnector. If you see the 
  answer, AcraConnector and AcraWriter are able to connect and forward signals back and forth. It means that the
  network and the keys are fine.

- Upon integrating AcraWriter into your code, try generating an AcraStruct from some payload. If you succeed in running 
  AcraWriter code, Themis library is installed properly and the keys are located in the expected places.

- Write a row with AcraStruct into the database, either directly or through AcraConnector. Request this row through 
  AcraConnector. If you see the decrypted payload in the response, the scheme works properly.

And now, let’s test the whole setup through pushing a gem with its info protected by Acra. Use the username, email, and 
password you entered during the registration.

{{< hint info >}}
Note: RubyGems saves the credentials in `~/.gem/credentials` so you only need to log in once.
{{< /hint >}}

To publish version 0.1.0 of a new gem named `my-protected-gem`:

```bash
gem push my-protected-gem --host=http://127.0.0.1:3000
Enter your RubyGems.org credentials.
Don't have an account yet? Create one at https://rubygems.org/sign_up
   Email:   email@thatyouregistred.with
Password:
Signed in.
Pushing gem to RubyGems.org...
Successfully registered gem: my-protected-gem (0.1.0)
```    

Now you need to open the gem at:

```bash
http://127.0.0.1:3000/gems/my-protected-gem
```    

It should return you the plaintext data that you’ve entered (author, email, etc). To see that everything is, in fact, 
encrypted and Acra works properly, send these 2 queries directly to the database, they should return an “incomprehensible” 
mishmash of symbols in which the data turns after the encryption:

```sql
select authors, description, summary from versions where rubygem_id=(select max(id) from rubygems);
 
select unresolved_name from dependencies where rubygem_id = (select max(id) from rubygems);
```    

If the database returns all the data it contains in encrypted form, everything is working properly and you’ve 
successfully integrated Acra into your Ruby app!

{{< hint info >}}
Note: A gem can have dependencies and if those are missing from rubygems.org or locally, the names of the unresolved 
dependencies go to the “unresolved_name”. So the latter example will only return the encrypted data for “unresolved_name” 
field if there are some names of dependencies added to "unresolved_name". Otherwise, it will return nothing.
{{< /hint >}}

## If You Want to Try Acra in Containers

We’ve made some special effort to make Acra work with Docker. However, please remember that using Acra with containers 
is violating its basic security guarantee. Docker is immutable, and zones/keys are not. This means you might want to 
attach some storage and end up leaving keys accessible to attackers. So use Acra with Docker for testing purposes only.

To simply test the waters of using Acra, you can use pre-made config files and examples below - they can also serve as
a reference for integrating Acra with a Ruby app.

You’ll need to download Acra, just like it was described above:

```bash
git clone https://github.com/cossacklabs/acra
cd acra
```    

And start AcraServer, AcraConnector, and PostgreSQL in separate Docker containers:

```bash
docker-compose -f docker/docker-compose.pgsql-nossl-server-ssession-connector.yml up -d
```    

- `-f`  use specified docker-compose*.yml file
- `-d`  run in background

After executing this command, you will have a running PostgreSQL with `test:test` `user:password` with forwarded 5432 
port, AcraServer with keys that you generated above, and AcraConnector that forwards port 9494.

{{< hint info >}}
Don’t forget to stop your local PostgreSQL if you run it before launching the Docker with PostgreSQL in a container 
or you’ll get an error from 2 instances of an application trying to listen on the same port.
{{< /hint >}}

By default, Docker will create 3 containers with the following names: `docker_acra-server_1`, `docker_acra-connector_1`,
and `docker_pg_1`.

Install the example application dependencies:

```bash
cd examples/ruby
gem install bundler
bundle install
```    

Create a database:

```bash
psql -h127.0.0.1 -U test -c "create database acra with encoding 'utf8'";
```    

{{< hint info >}}
Note: Either name your database gemcutter_development (to follow the 
[default rubygems practice](https://github.com/rubygems/rubygems.org/blob/master/config/database.yml.example#L3) or 
come up with a custom name - in this case the custom name is `acra`. Don’t forget to change the database name in the   
config/database.yml file afterwards. Use this database name in all the following commands below.
{{< /hint >}}

You’ll be asked to input the password for PostgreSQL (test) and you’re ready to proceed. Copy the keys that we generated previously:

```bash
cp -r ../../.acrakeys
ruby example.rb
```    

To test that the database contains only encrypted data, use:

```bash
psql -h127.0.0.1 -Utest --dbname=acra -c "select * from test"
```    

It will return the data in an encrypted form:

```
    data | raw_data
    FXIYCZZT | FXIYCZZT
    psql -h127.0.0.1 -Utest --dbname=acra -c "select * from test"
    id | data | raw_data
     28215 |
\x2222222222222222554543320000002d0950cb9003c7809eb6371e3bf0609821119b3340cd9e06168f10613d9859773cba97d9c9ca2027042654000000000101400c0000001000000020000000328887e
e14cd2e91c934286e4d47256dc7c5b9bb8bfb42ccee37c6eaa329f03afad64fd87dce9040ee4656108e9a1befedf5ffe70b70a8324ca1ccfe3400000000000000000101400c0000001000000008000000dab41aa5830
54653d79645c723070b7a2e55b9643abbad47cc02843b62e81249ed15ee31 | FXIYCZZT
```

Now the data is encrypted and you see it. Acra is working!

### Using Acra in Docker with Zones

Shut down the previous active Docker containers before proceeding with this method! Use:

```bash
docker-compose -f docker/docker-compose.pgsql-nossl-server-ssession-connector.yml down
```    

Use this .yml file to start AcraServer that supports Zones:

```  bash
docker-compose -f docker/docker-compose.pgsql-nossl-server-ssession-connector_zonemode.yml up -d
```    

Create the database in a new container:

```bash
psql -h127.0.0.1 -U test -c "create database acra with encoding 'utf8'";
```    

{{< hint info >}}
Note: By default, AcraConnector will listen on port 5432.
{{< /hint >}}

Add a new ZoneId:

```bash
docker exec docker_acra-server_1 acra-addzone --output_dir=/keys
```    

The output will look something like this:

```json
{"id":"DDDDDDDDdwjzKTZyKnIprHdc","public_key":"VUVDMgAAAC31i9rcAnNZFHkqfHnbgMQqJWjcXOYGhxAjYHJ5Rh7mMEC5dyjT"}
```

Now you need to copy the info for your "id" and "public key" from the output to the `example_with_zone.rb` and replace
the existing examples `example_with_zone.rb` with your own data.

```ruby
zone_data = JSON.parse('{"id":"DDDDDDDDhydxgNoxWYxYRZzf","public_key":"VUVDMgAAAC11q5/TAmIAS42yyuNISRCsbl56D/yBH0iSZ9nmVfhdaOP0mwSH"}')
```

Let’s run the example:

```bash
ruby example_with_zone.rb    
```    

The output will be:

```
zone | data | raw_data
DDDDDDDDdwjzKTZyKnIprHdc | HDDNXEIU | HDDNXEIU    
```    

And finally, let’s test that the database only contains encrypted data:

```bash
psql -h127.0.0.1 -Utest --dbname=acra -c "select * from test2"
```    

```
id| zone |data | raw_data 
45387 | \x444444444444444464776a7a4b545a794b6e497072486463 | \x2222222222222222554543320000002de7f416d202f70fcae099312ce72ce603d4ed7129cb3f2aca484c572c19a03e81e90a907d5420
27042654000000000101400c0000001000000020000000dd51dcaa49820982611b4544466c4d5422edd0fde075bad9febbcdbbfc4ae61064e8a27ba6935e3d655707f76392bea54ebd14497d56fc07b3e6eb3a340000
0000000000000101400c00000010000000080000005d2cb195d8d0258079b4c5542da9184dc58ae21ce537f61dec7ea457ade32521731dfbdf | HDDNXEIU
```

You see the data is in encrypted form. Congratulations! Acra is now working with Zones!

## Conclusion

As you can see, establishing cryptographic protection for the data in your web app with Acra is a very straightforward 
and simple process. We hope that this tutorial was fun and informative and that you will be using Acra in the future. 
If you only tried the Docker-based examples, try running Acra in a real world setup - it’s just as convenient.

You can also check out a similar [Acra tutorial for Django Project]({{< ref "/acra/guides/djangoproject-step-by-step.md" >}}).