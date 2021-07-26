---
title: Client-side encryption
bookCollapseSection: true
---

## Client side: AcraConnector and AcraWriter

### AcraConnector and AcraWriter

AcraConnector is a (separate) service running alongside your application — it pretends to be a database listener, relays all the requests to AcraServer, receives the responses, and returns them to the app, just like a normal database listener would do.

To talk to AcraServer, you'll need to run AcraConnector on the same host as your application, in a separate container or as a separate user. You'll also need to route database requests to its address.

To talk to AcraTranslator you'll need to do the same: run AcraConnector on the same host as your application, in a separate container or as a separate user, and use its URL as destination URL from your application.

#### Why do we need a special piece of software to talk to your other piece of software?

Acra needs a trusted agent on the application's side to protect the sensitive decrypted responses, to provide basic channel authentication, and to enforce certain behaviours.

AcraConnector acts as a local proxy that receives requests from the app and returns decrypted answers. AcraConnector provides an encrypted and authenticated connection to AcraServer, which, in turn, fetches the response to the request from the database and decrypts all the data. AcraServer then returns the data to AcraConnector via a secure connection.

AcraConnector works in a similar fashion with AcraTranslator, redirecting AcraStructs from application to AcraTranslator and delivering the decrypted response back.

This enforces maximum secrecy, employing authentication that is easy to manage (pre-shared private keys), and requires minimal intervention into your code for successful implementation!


### Getting started with AcraConnector

#### Method 1A. Launch AcraConnector using Docker (the fastest way to try AcraConnector)
> Note: Using Docker is recommended for testing purposes only. Please don't rely on Docker in real-life production settings.    
> Note: The following examples focus on using AcraConnector and AcraWriter with PostgreSQL, but Acra also supports MySQL.

Clone the Acra repository, build images, and start Docker compose with PostgreSQL, AcraServer, AcraConnector, and Secure Session between them:

```
git clone https://github.com/cossacklabs/acra.git
make docker
docker-compose -f docker-compose.pgsql-nossl-server-ssession-connector.yml up
```

After running this command, the basic infrastructure is all set up, all components are connected, and the keys are distributed into the appropriate folder.

Now, proceed to step [launching AcraConnector]({{< ref "acra/configuring-maintaining/general-configuration/acra-connector.md#launching-acraconnector-INVALID" >}}).
Or install AcraConnector manually.

#### Method 1B. Manual launch

> Note: Skip this if you've used the Docker method described above.

- Install dependencies: [Themis]({{< ref "/themis/installation/" >}}) cryptographic library:

```
git clone https://github.com/cossacklabs/themis.git
cd themis
make
sudo make install
```

- Install AcraConnector:

```
go get github.com/cossacklabs/acra/cmd/acra-connector
```

> Note: Hereinafter all the commands starting with 'go' are meant to be executed from the 'acra' folder (the folder with the repository code).

- Install key generation utility:

```
go get github.com/cossacklabs/acra/cmd/acra-keymaker
```

- Use `acra-keymaker` to generate master key into `master.key` file and assign it into the environment variable like this:
```
$GOPATH/bin/acra-keymaker --generate_master_key=master.key
export ACRA_MASTER_KEY=`cat master.key | base64`
``` 

Read more about the different types of keys used in Acra in the [Key Management]({{< ref "acra/acra-in-depth/cryptography-and-key-management/#-INVALID" >}}) section of the documentation.

- Generate the "client" proxy keypair:

```
$GOPATH/bin/acra-keymaker --client_id=client_name --generate_acraconnector_keys
```

The name of the key should be longer than 5 characters. It is also used as an identifier for the [Secure Session]({{<ref "themis/crypto-theory/cryptosystems/secure-session.md" >}}) connection between AcraConnector and AcraServer.

The generated keypair `client_name` and `client_name.pub` will appear in .acrakeys (or anywhere you ask with `--keys_output_dir=/path/to/dir` argument).

- Exchange public keys:

    - You should put public key `client_name.pub` into the corresponding folder (.acrakeys) on AcraServer.
    - You should put AcraServer's public key (called `client_name_server.pub`) to AcraConnector's key folder (`.acrakeys` or anything you chose in `--keys_output_dir`).

Now, proceed to [launching AcraConnector]({{< ref "acra/configuring-maintaining/general-configuration/acra-connector.md#launching-acraconnector-INVALID" >}}).

⚙️**Not sure how to configure AcraConnector? Check out the [engineering examples](https://github.com/cossacklabs/acra-engineering-demo/)!** ⚙️

### Launching AcraConnector

By default, AcraConnector is ready to talk to AcraServer. You need to use a one-line command:

```
$GOPATH/bin/acra-connector --client_id=client_name --acraserver_connection_host=acra.server.host
```

To point AcraConnector to AcraTranslator, configure an appropriate connection host/port/string and mode:

```
$GOPATH/bin/acra-connector --client_id=client_name --acratranslator_connection_host=acra.translator.host --mode=acratranslator
```

For security reasons, consider configuring your firewall to allow the connections only from legit AcraConnector IPs. If an attacker compromises your client application and AcraConnector, filtering IP addresses might prevent DoS.

#### AcraConnector CLI reference

The following parameters can be used for configuring AcraConnector from the command line or from the configuration file (see below). Both ways can be used (and are, in fact, used by most users). The typical flow is to:

* run AcraConnector with CLI parameters while testing/debugging, then
* save them to a file,
* and the run production AcraConnector instances from the configuration file.

```
--acraserver_api_connection_port
  Port of Acra HTTP API (default 9090)
--acraserver_api_connection_string
  Connection string to Acra's API like tcp://x.x.x.x:yyyy or unix:///path/to/socket
--acraserver_connection_host
  IP or domain to AcraServer daemon
--acraserver_connection_port
  Port of AcraServer daemon (default 9393)
--acraserver_connection_string
  Connection string to AcraServer like tcp://x.x.x.x:yyyy or unix:///path/to/socket
--acraserver_securesession_id
  Expected id from AcraServer for Secure Session (default "acra_server")
--acraserver_tls_transport_enable
  Use tls to encrypt transport between AcraServer and AcraConnector/client
--acraserver_transport_encryption_disable
  Enable this flag to omit AcraConnector and connect the client app to AcraServer directly using raw transport (tcp/unix socket). For security reasons, at the very least, use TLS encryption (over tcp socket) between AcraServer and the client app.
acraserver_transport_encryption_disable: false
--acratranslator_connection_host
  IP or domain to AcraTranslator daemon (default "0.0.0.0")
--acratranslator_connection_port
  Port of AcraTranslator daemon (default 9696)
--acratranslator_connection_string
  Connection string to AcraTranslator like grpc://0.0.0.0:9696 or http://0.0.0.0:9595
--acratranslator_securesession_id
  Expected id from AcraTranslator for Secure Session (default "acra_translator")
--client_id
  Client ID
--config_file
  path to config
-d  Log everything to stderr
--dump_config
  dump config
--generate_markdown_args_table
  Generate with yaml config markdown text file with descriptions of all args
--http_api_enable
  Enable connection to AcraServer via HTTP API
--incoming_connection_api_port
  Port for AcraConnector HTTP API (default 9191)
--incoming_connection_api_string
  Connection string like tcp://x.x.x.x:yyyy or unix:///path/to/socket (default "tcp://127.0.0.1:9191/")
--incoming_connection_port
  Port to AcraConnector (default 9494)
--incoming_connection_prometheus_metrics_string
  URL (tcp://host:port) which will be used to expose Prometheus metrics (use <URL>/metrics address to pull metrics)
--incoming_connection_string
  Connection string like tcp://x.x.x.x:yyyy or unix:///path/to/socket (default "tcp://127.0.0.1:9494/")
--jaeger_agent_endpoint
  Jaeger agent endpoint that will be used to export trace data (default "127.0.0.1:6831")
--jaeger_basic_auth_password
  Password used for basic auth (optional) to jaeger
--jaeger_basic_auth_username
  Username used for basic auth (optional) to jaeger
--jaeger_collector_endpoint
  Jaeger endpoint that will be used to export trace data (default "127.0.0.1:14268")
--keys_dir
  Folder from which will be loaded keys (default ".acrakeys")
--logging_format
  Logging format: plaintext, json or CEF (default "plaintext")
--mode
  Expected mode of connection. Possible values are: AcraServer or AcraTranslator. Corresponded connection host/port/string/session_id will be used. (default "AcraServer")
--tls_acraserver_sni
  Expected Server Name (SNI) from AcraServer
--tls_auth
  Set authentication mode that will be used in TLS connection with AcraServer/AcraTranslator. Values in range 0-4 that set auth type (https://golang.org/pkg/crypto/tls/#ClientAuthType). Default is tls.RequireAndVerifyClientCert (default 4)
--tls_ca
  Path to root certificate which will be used with system root certificates to validate AcraServer's certificate
--tls_cert
  Path to certificate
--tls_key
  Path to private key that will be used in TLS handshake with AcraServer
--tracing_jaeger_enable
  Export trace data to jaeger
--tracing_log_enable
  Export trace data to log
--user_check_disable
  Disable checking that connections from app running from another user
-v  Log to stderr all INFO, WARNING and ERROR logs
```    

### Changing configuration options for AcraConnector

> Reminder: Before changing the configuration file, don't forget to backup your current file.

You can copy the original example config from [GitHub](https://github.com/cossacklabs/acra/blob/master/configs/acra-connector.yaml), from the downloaded repository `$REPO_DIR/configs/acra-connector.yaml`, or from GOPATH `$GOPATH/src/github.com/cossacklabs/acra/configs/acra-connector.yaml`.

##### Configuring Client ID

```
--client_id
```

ClientID is used to identify this AcraConnector instance (and client application it's connected to) in front of AcraServer. AcraConnector uses ClientID to read the appropriate [transport encryption keys]({{< ref "acra/acra-in-depth/cryptography-and-key-management/#-INVALID" >}}). If the ClientID is wrong, AcraConnector won't launch and will print an error message.

##### Configuring incoming connections

```
--incoming_connection_port
--incoming_connection_string
```

You can change the port on which AcraConnector will be listening to receive the data from AcraServer/AcraTranslator:

For example, setting the listening port to 5432:

```
$GOPATH/bin/acra-connector --acraserver_connection_host=acra.server.host --client_id=client_name --incoming_connection_port=5432
```

##### Configuring connections to AcraServer's HTTP API

```
--http_api_enable
```

AcraServer supports two modes: binary data and HTTP API commands.

Start AcraConnector with HTTP API port open to accept API requests for AcraWebConfig and new Zones' requests by sending a request to http://127.0.0.1:9191/getNewZone. With the former, you will receive a json file `{"id": "zoneid", "public_key": "base 64 encoded zone public key"}` in the response.

```
$GOPATH/bin/acra-connector --client_id=client_name --acraserver_connection_host=acra.server.host --http_api_enable
```

Incoming connection API port:

```
--incoming_connection_api_port
--incoming_connection_api_string
```

You can change the port for listening to AcraServer responses made through HTTP API:

```
$GOPATH/bin/acra-connector --client_id=client_name --acraserver_connection_host=acra.server.host --http_api_enable --incoming_connection_api_port=12345
```

If you're running AcraConnector from the same machine that contains your app's code (and remember - you must run AcraConnector from a different user!), you can connect to `locahost:5432` from your app to have a normal database experience.


##### Configuring connections to AcraServer

```
--acraserver_connection_string
--acraserver_connection_port
--acraserver_api_connection_string
--acraserver_api_connection_port
```

You might specify custom binary data and API connection strings (or a host/port pair) to connect to AcraServer:

```
$GOPATH/bin/acra-connector --client_id=client_name --acraserver_connection_host=127.0.0.1 --acraserver_connection_port=10000
```

Secure transport between AcraConnector and AcraServer:
```
--acraserver_securesession_id
--acraserver_tls_transport_enable
--tls_auth
--tls_ca
--tls_cert
--tls_key
```

Set `SecureSessionId` to use [Themis Secure Session]({{<ref "themis/crypto-theory/cryptosystems/secure-session.md" >}}) between AcraConnector and AcraServer.

Alternatively, you can use TLS: set `acraserver_tls_transport_enable` to `true` to enable using TLS between AcraConnector and AcraServer.

`tls_auth` defines an authentication mode that will be used in TLS connection; possible values are taken from [TLS configuration in Go](https://golang.org/pkg/crypto/tls/#ClientAuthType) - from line 0 (don't request, don't check certificate) to line 4 (request and verify the client certificate):

```
type ClientAuthType int
```   
```
const (
        NoClientCert ClientAuthType = iota
        RequestClientCert
        RequireAnyClientCert
        VerifyClientCertIfGiven
        RequireAndVerifyClientCert
)
```

AcraConnector requires the path to keys and certificates: `tls_ca` is the path to root certificate; `tls_cert` path to the TLS server certificate and `tls_key` is the path to the TLS server key.

```
--acraserver_transport_encryption_disable
```

Disable SecureSession/TLS encryption between AcraConnector and AcraServer.

You may also want to read [Using TLS/SSL in Acra](/pages/documentation-acra/#using-tls-ssl-in-acra).

> Note on troubleshooting: If you keep getting TLS/SSL-related errors in the logs while trying to configure AcraConnector, make sure that you have filled ALL the data fields. Pay attention that such fields as O, ST, C, OU, L must be filled it, too. If at least one of the fields remains unfilled, you are likely to be getting errors because of the way SSL is implemented in Go.

##### Configuring connections to the database

```
--tls_acraserver_sni
```
If the client application is connecting to the database with SSL enabled (i.e. sslmode values either allowed or required), you should define `tls_acraserver_sni` as the database hostname that AcraConnector checks during TLS handshake on the connection attempt.


##### Configuring connections to AcraTranslator

```
--mode=acratranslator
--acratranslator_connection_host
--acratranslator_connection_port
--acratranslator_connection_string
--acratranslator_securesession_id
```

To connect to AcraTranslator, you should specify the exact mode and provide the connection parameters:

```
$GOPATH/bin/acra-connector --client_id=client_name --mode=acratranslator --acratranslator_connection_host=127.0.0.1 --acratranslator_connection_port=10000
```

##### Other important configuration options:

```
--keys_dir
```

Sets a custom key directory location. By default, AcraConnector is looking for keys in `.acrakeys`, but you can specify another location.

```
--disable_user_check
``` 

Turns off the test that checks if AcraConnector has started from under a user different from the one running the app. This option was only added to simplify your tests!

```
$GOPATH/bin/acra-connector --client_id=client_name --acraserver_connection_host=127.0.0.1 --disable_user_check
``` 


##### Logging, tracing, metrics

To change the logging format to plaintext, CEF, or json, use:

```
--logging_format      
```

Read more about [analysing logs here]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#logging" >}}).

```
--incoming_connection_prometheus_metrics_string
```

Configure the URL to be used to expose Prometheus metrics (use <URL>/metrics address to pull metrics).


```
--tracing_enable
--tracing_jaeger_enable
--tracing_log_enable
```

Enable the collecting of tracing by setting `tracing_enable` to `true`. You can print traces to log or export to Jaeger (see below).

```
--jaeger_agent_endpoint
--jaeger_basic_auth_password
--jaeger_basic_auth_username
--jaeger_collector_endpoint
```

Setup Jaeger and Jaeger agent endpoints and credentials to Jaeger.

See real-world applications where Acra's configuration is heavily changed in [Acra example projects](https://github.com/cossacklabs/acra-engineering-demo/).

### AcraWriter

After you have configured AcraConnector, your application can keep using your database handling code as before — all the extra work will now be taken care of by Acra's components.

AcraWriter is a library for your code that can be used anywhere within your app whenever you need to encrypt sensitive records.

Under the hood, it is basically the [Themis](/products/themis/) library generating AcraStructs with the keys you've provided to AcraWriter.

To start protecting your data, pick a place in your code where and integrate AcraWriter library (we support 8 languages, see the [Building AcraWriter for your language](/pages/documentation-acra/#building-acrawriter-for-your-language) section). Don't see your language? Write your own [AcraStruct]({{< ref "acra/acra-in-depth/data-structures/#understanding-acrastruct" >}}) encrypter, it's easy!


If you plan to use Acra with:

- PostgreSQL — use BYTEA binary type.

- MySQL — use mysql binary type.


### Acra example usage scenario

You can encrypt the sensitive data by generating AcraStructs with AcraWriter anywhere across your app. Send INSERTS/UPDATES to the database either through AcraConnector or directly via a separate connection.

You can decrypt AcraStructs by sending database requests to AcraConnector and receive responses that went through AcraServer.

Acra does not dictate a way of storing database requests in the database. If your code is a monolith running on one server as one service, it might make sense to point the writes into the same connections as reads, i.e. AcraConnector.

However, if your code is a huge family of microservices where some of them just write data and some just read it, it is essential to be able to do it the way you want it. You can write AcraStructs generated by AcraWriter directly into the database so that you don't need to carry all the AcraConnector keys with every piece of code on every machine.

For example, we're aware of a setup where AcraStructs are sent down the Kafka stream and emerge in the database at some further point in the future.

### Client-side without Zones

This is an instruction for PostgreSQL.

#### Writes

When you need to store some sensitive data:

- before doing `INSERT`/`UPDATE` on data, you should use AcraWriter libraries
  specific to your language, encrypting sensitive data into AcraStruct with AcraServer's
  public key with suffix `_storage` (`some_client_id_storage.pub`) that is different from the keypair used by AcraConnector for communicating with AcraServer.
- then you can proceed with doing `INSERT`/`UPDATE`, either through AcraConnector or directly.

#### Reads

Read requests are the same as the regular reads, but their remote address is AcraConnector instead of your database listener. A typical PostgreSQL connection address would look like this: `postgresql://user:password@127.0.0.1:9494/db_name`.

> Note for PostgreSQL: In the current layout, you aren't required to use SSL when trying to connect to the database. Transport protection for sensitive (decrypted) data is provided between AcraServer and AcraConnector via [Secure Session]({{<ref "themis/crypto-theory/cryptosystems/secure-session.md" >}}). However, you can setup using SSL connection, too.

### Client-side with Zones

Description of the client-side with Zones for PostgreSQL.

Zone-based encryption is the best way to cryptographically compartmentalise the data that comes from different sources, following the user's choice. Cryptographically, the Zones are a mechanism for modifying the AcraServer key according to the Zone Id and for mapping Zone's private keys during the decryption. In theory, you could use a new key for every record. However, it would introduce an unwanted overhead on AcraServer's performance.

#### Writing

To write AcraStruct with Zone keys, you need to:

* generate the Zone keys on AcraServer,
* acquire Zone public key and Zone Id from AcraServer,
* encrypt data using this key as AcraServer key in a standard AcraStruct process.

There are two ways you can generate the keys:

- First, make sure that you already generated ACRA_MASTER_KEY and out it into an environmental variable, or generate it like this:
```
export ACRA_MASTER_KEY=$(echo -n "My_Very_Long_Key_Phrase_ge_32_chars" | base64)
```
Read more about different types of keys used in Acra on [Key Management]({{< ref "acra/acra-in-depth/cryptography-and-key-management/#-INVALID" >}}) page.

- Then build `acra-addzone` utility in AcraServer from Acra repository:

```
go build acra-addzone
./acra-addzone
``` 
When you run it, you should get JSON object that looks something like this:

```
{"id":"DDDDDDDDQHpbUSOgYTzqCktp","public_key":"VUVDMgAAAC3yMBGsAmK/wBXZkL8iBv/C+7hqoQtSZpYoi4fZYMafkJbWe2dL"}
```

By decoding base64-wrapped public key, you get the binary Zone public key, which can be used for generating AcraStructs.

- AcraConnector locally provides HTTP API to add Zones and return public keys on `127.0.0.1:9191/getNewZone`. You can change the port via `--incoming_connection_api_port` argument.

Both approaches provide identical results.

#### Reading

Reading with Zones takes place just as it does without Zones. However, to point AcraServer to the exact Zone key, it has to use, you need to structure your query in such a way that AcraStruct is preceded by the corresponding Zone Id in its answer. For example, you may want to store the Zone Id in the preceding column and execute the query in the following way:

```
SELECT id, lastname, zone, data, datetime FROM table;
```

where `zone` contains Zone Id and `data` stands for AcraStruct.

If you keep the Zone Id in some other place (i.e. configuration file, other tables, or other database storage), you need to explicitly state it in the select, for example:

```
SELECT id, lastname, 'DDDDDDDDQHpbUSOgYTzqCktp'::bytea, data, datetime FROM table;
```

> Note: It's worth mentioning that `::bytea` conversion is necessary for PostgreSQL to work properly. 