---
title: Client-side encryption with AcraConnector and AcraWriter
weight: 1
---

# Client side encryption with AcraConnector and AcraWriter

{{< hint warning >}}
AcraConnector is deprecated since 0.91.0 and is not available since 0.92.0. Use TLS between client application and AcraServer / AcraTranslator instead.
{{< /hint >}}

{{< hint info >}}
AcraWriter is available in [Acra Enterprise Edition](/acra/enterprise-edition/) only.
{{< /hint>}}

This guide describes the process of setting up and configuring [AcraConnector](/acra/security-controls/transport-security/acra-connector/) and [AcraWriter](/acra/acra-in-depth/architecture/sdks/acrawriter/) to encrypt data on client-side application before sending to the database. This is a general guide, the language and framework of client application doesn't matter.

## AcraConnector

AcraConnector is a (separate) service running alongside your application — it pretends to be a database listener, relays all the requests to [AcraServer](/acra/acra-in-depth/architecture/acraserver/), receives the responses, and returns them to the app, just like a normal database listener would do.

To talk to AcraServer, you'll need to run AcraConnector on the same host as your application, in a separate container or as a separate user. You'll also need to route database requests to its address.

To talk to AcraTranslator you'll need to do the same: run AcraConnector on the same host as your application, in a separate container or as a separate user, and use its URL as destination URL from your application.

Refer to [AcraConnector page](/acra/security-controls/transport-security/acra-connector/) to learn more.

## Why do we need a special piece of software to talk to your other piece of software?

Acra needs a trusted agent on the application's side to protect the sensitive decrypted responses, to provide basic channel authentication, and to enforce certain behaviours.

AcraConnector acts as a local proxy that receives requests from the app and returns decrypted answers. AcraConnector provides an encrypted and authenticated connection to AcraServer, which, in turn, fetches the response to the request from the database and decrypts all the data. AcraServer then returns the data to AcraConnector via a secure connection.

AcraConnector works similarly to AcraTranslator, redirecting AcraStructs from application to AcraTranslator and delivering the decrypted response back.

This enforces maximum secrecy, employing authentication that is easy to manage (pre-shared private keys), and requires minimal intervention into your code for successful implementation!


## Getting started with AcraConnector

{{< hint info >}}
Note: The following examples focus on using AcraConnector and AcraWriter with PostgreSQL, but Acra also supports MySQL.
{{< /hint >}}

### Method 1A. Launch AcraConnector using Docker (the fastest way to try AcraConnector)

{{< hint warning >}}
Note: These Docker Compose files are recommended for testing purposes only. Please don't rely on them in real-life production settings.
{{< /hint >}}

Start provided Docker Compose file with PostgreSQL, AcraServer, AcraConnector, and Themis Secure Session between them:

```
git clone https://github.com/cossacklabs/acra.git
docker-compose -f acra/docker/docker-compose.pgsql-nossl-server-ssession-connector.yml up
```

After running this command, the basic infrastructure is all set up, all components are connected, and the keys are distributed into the appropriate folder.
Now, proceed to the [Launching AcraConnector](#launching-acraconnector) section.

### Method 1B. Manual launch

> Note: Skip this if you've used the Docker method described above.

- Install dependencies: [Themis](/themis/installation/) cryptographic library
- Install [Acra package](/acra/getting-started/installing/installing-acra-from-repository/) that includes AcraConnector and key generation tools

- Use `acra-keymaker` to generate master key into `master.key` file and assign it into the environment variable like this:
```
acra-keymaker --generate_master_key=master.key
export ACRA_MASTER_KEY=`cat master.key | base64`
``` 

Read more about the different types of keys used in Acra in the [Key Management](/acra/security-controls/key-management/operations/generation/#11-generating-acra-master-key) section of the documentation.

- Generate the "client" proxy keypair:

```
acra-keymaker --client_id=client_name --generate_acraconnector_keys
```

The name of the key should be longer than 5 characters. It is also used as an identifier for the [Themis Secure Session](/themis/crypto-theory/cryptosystems/secure-session/) connection between AcraConnector and AcraServer.

The generated keypair `client_name` and `client_name.pub` will appear in .acrakeys (or anywhere you ask with `--keys_output_dir=/path/to/dir` argument).

- Exchange public keys:

    - You should put public key `client_name.pub` into the corresponding folder (.acrakeys) on AcraServer.
    - You should put AcraServer's public key (called `client_name_server.pub`) to AcraConnector's key folder (`.acrakeys` or anything you chose in `--keys_output_dir`).

⚙️**Not sure how to configure AcraConnector? Check out the [engineering examples](https://github.com/cossacklabs/acra-engineering-demo/)!** ⚙️

## Launching AcraConnector

By default, AcraConnector is ready to talk to AcraServer. You need to use a one-line command:

```
acra-connector --client_id=client_name --acraserver_connection_host=acra.server.host
```

To point AcraConnector to AcraTranslator, configure an appropriate connection host/port/string and mode:

```
acra-connector --client_id=client_name --acratranslator_connection_host=acra.translator.host --mode=acratranslator
```

For security reasons, consider configuring your firewall to allow the connections only from legit AcraConnector IPs. If an attacker compromises your client application and AcraConnector, filtering IP addresses might prevent DoS.

You can get more details about [AcraConnector configuration](/acra/configuring-maintaining/general-configuration/acra-connector/).


## AcraWriter

{{< hint info >}}
AcraWriter is available in [Acra Enterprise Edition](/acra/enterprise-edition/) only.
{{< /hint>}}

After you have configured AcraConnector, your application can keep using your database handling code as before.

AcraWriter is a library for your code that can be used anywhere within your app whenever you need to encrypt sensitive records on application side. Only [AcraServer](/acra/acra-in-depth/architecture/acraserver/) or [AcraTranslator](/acra/acra-in-depth/architecture/acratranslator/) will be able to decrypt this data later.

Refer to [AcraWriter page](/acra/acra-in-depth/architecture/sdks/acrawriter/) to learn more.


To start protecting your data, pick a place in your code where encryption should be performed and integrate AcraWriter library there (AcraWriter supports 8 languages, see the [Building and installing AcraWriter](/acra/getting-started/installing/building-acrawriter/) page). 


Acra's encryption/decryption operations support only binary data. If you plan to use Acra with:

- PostgreSQL — use `BYTEA` binary type.

- MySQL — use `BLOB`, `BINARY`, `VARBINARY` types.


## Acra example usage scenario

You can encrypt the sensitive data by generating AcraStructs with AcraWriter anywhere across your app. Send INSERT / UPDATE queries to the database either through AcraConnector or directly via a separate connection.

You can decrypt AcraStructs by sending database requests to AcraConnector and receive responses passed through AcraServer.

Acra does not dictate a way of storing database requests in the database. If your application is a monolith running on one server as one service, it might make sense to point the writes into the same connections as reads, i.e. AcraConnector.

However, if your application is a huge family of microservices where some of them just write data and some just read it, it is essential to be able to do it the way you want it. You can write AcraStructs generated by AcraWriter directly into the database so that you don't need to carry all the AcraConnector keys with every piece of code on every machine.

For example, we're aware of a setup where AcraStructs are sent down the Kafka stream and emerge in the database at some further point in the future.

## Client-side without Zones

This is an instruction for PostgreSQL.

#### Writes

When you need to store some sensitive data:

1. Use AcraWriter to encrypt sensitive data into an AcraStruct.
   
   Encrypt the data with AcraServer's public key for data storage, it has the `storage.pub` suffix (e.g., `client_id_storage.pub`).
   Note that this key is different from AcraServer's transport public key used by AcraConnector to establish a secure connection to the AcraServer.

2. `INSERT` or `UPDATE` encrypted data, either through AcraConnector or directly.


#### Reads

When you need to retrieve some sensitive data:

1. Connect to AcraConnector instead of the database directly.

   A typical PostgreSQL connection string would look like this:
   `postgresql://user:password@127.0.0.1:9494/db_name`

2. `SELECT` your data as you would do normally.

   AcraServer decrypts database responses automatically
   and AcraConnector ensures that decrypted data remains encrypted until your application receives it.


> Note for PostgreSQL: In the current layout, you aren't required to use TLS when trying to connect to the database. Transport protection for sensitive (decrypted) data is provided between AcraServer and AcraConnector via [Secure Session](/themis/crypto-theory/cryptosystems/secure-session/). However, you can set up TLS connection as well.

## Client-side with Zones

{{< hint warning >}}
Zones are deprecated since 0.94.0, will be removed in 0.95.0.
{{< /hint >}}

Zone-based encryption is the best way to cryptographically compartmentalise the data that comes from different sources, following the user's choice. Cryptographically, the Zones are a mechanism for modifying the AcraServer key according to the Zone Id and for mapping Zone's private keys during the decryption. In theory, you could use a new key for every record. However, it would introduce an unwanted overhead on AcraServer's performance.

### Writing

To write AcraStruct with Zone keys, you need to:

* generate the Zone keys on AcraServer,
* acquire Zone public key and Zone Id from AcraServer,
* encrypt data using this key as AcraServer key and Zone Id as context parameter for AcraWriter.

There are two ways you can generate the keys:

- Using [installed](/acra/getting-started/installing/installing-acra-from-repository/) `acra-addzone` utility from Acra repository.
  
  First, make sure that you already generated master key and exported it as `ACRA_MASTER_KEY` environmental variable, or generate it like this:
  ```
  export ACRA_MASTER_KEY=$(echo -n "My_Very_Long_Key_Phrase_ge_32_chars" | base64)
  ```
  Utility cannot encrypt private keys without master key. Read more about different types of keys used in Acra on [Key Management](/acra/security-controls/key-management/operations/generation/#11-generating-acra-master-key) page. 
  
  Then run utility:
  ```
  acra-addzone
  ``` 
  When you run it, you should get JSON object that looks something like this:
  
  ```
  {"id":"DDDDDDDDQHpbUSOgYTzqCktp","public_key":"VUVDMgAAAC3yMBGsAmK/wBXZkL8iBv/C+7hqoQtSZpYoi4fZYMafkJbWe2dL"}
  ```
  By decoding base64-wrapped public key, you get the binary Zone public key, which can be used for generating AcraStructs.


- AcraConnector provides an HTTP endpoint accessible only from localhost to add Zones and return public keys on `127.0.0.1:9191/getNewZone`. You can change the port via `--incoming_connection_api_port` argument.

  Both approaches provide identical results.

### Reading

Retrieving sensitive data using zones is a bit different. To retrieve sensitive data you need to structure your query in such a way that AcraStruct is preceded by the corresponding Zone Id in its answer. For example, you may want to store the Zone Id in the preceding column and execute the query in the following way:

```
SELECT id, lastname, zone, data, datetime FROM table;
```

where `zone` contains Zone Id and `data` stands for AcraStruct.

If you keep the Zone Id in some other place (i.e. configuration file, other tables, or other database storage), you need to explicitly state it in the select, for example:

```
SELECT id, lastname, 'DDDDDDDDQHpbUSOgYTzqCktp'::bytea, data, datetime FROM table;
```

> Note: It's worth mentioning that `::bytea` conversion is necessary for PostgreSQL to work properly. 
