---
title: Installing from GitHub
bookCollapseSection: true
---

### Installing from GitHub

These are the instruction for installation of [AcraServer]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#-INVALID" >}}) from the [Cossack Labs' GitHub repository for Acra](https://github.com/cossacklabs/acra/). You will need the same set of dependencies for each component.

#### Installing the dependencies

Install the dependencies for Acra:

```
sudo apt-get install git golang libssl-dev make build-essential
```

Set up your `$GOPATH` to some place where you will store the code.

#### Install [Themis](https://www.github.com/cossacklabs/themis)

```
git clone https://github.com/cossacklabs/themis.git
cd themis
make
sudo make install
```

#### Build the key generator and generate the keys

```
go get github.com/cossacklabs/acra/cmd/acra-keymaker
```

Then [generate the keys]({{< ref "acra/acra-in-depth/cryptography-and-key-management/#generating-all-the-acra-keys-in-one-go-INVALID" >}}) and distribute them across the infrastructure.

Remember to generate `ACRA_MASTER_KEY` and assign it to the environmental variable!

#### Set up the environment for AcraServer

On a separate machine, create a user for AcraServer:
```
sudo useradd -m acra-server
sudo su acra-server
cd ~/
export GOPATH=`pwd`
```

#### Build AcraServer

```
go get github.com/cossacklabs/acra/cmd/acra-server
```    

Place `someid.pub`, `someid_storage` and `someid_server` keys to .acrakeys directory for AcraServer.
Now you can finally launch the AcraServer.

#### Launching AcraServer

Running AcraServer is easy, just point it to the database:

```
$GOPATH/bin/acra-server --db_host=127.0.0.1
```

If you see an error message `"master key is empty"`, it means that you haven't generated `ACRA_MASTER_KEY`, please return to the [Key Generation step]({{< ref "acra/acra-in-depth/cryptography-and-key-management/#generating-all-the-acra-keys-in-one-go-INVALID" >}}).

> You can complement the command above with `--db_port=5432 -v` to adjust the listener port and add logs to get going quickly. For all the available CLI parameters, refer to the corresponding section in [How AcraServer works]({{< ref "acra/configuring-maintaining/general-configuration/acra-server.md#acraserver-cli-reference-INVALID" >}}).

AcraServer listens to port 9393 by default.

#### AcraConnector

Create a user for AcraConnector:

```
sudo useradd -m acra-connector
sudo su acra-connector
cd ~/
export GOPATH=`pwd`
```

#### Build AcraConnector

```
go get github.com/cossacklabs/acra/cmd/acra-connector
```
Put `someid` and `someid_server.pub` keys into .acrakeys directory for AcraConnector.

#### Run AcraConnector

```
$GOPATH/bin/acra-connector --acraserver_connection_host=127.0.0.1 --client_id=someid -v
```

If you see error message similar to "Configuration error: AcraConnector private key .acrakeys/someid doesn't exists", it means that you haven't generated keys or keys are placed in a wrong folder, please return to the [Key Generation step]({{< ref "acra/acra-in-depth/cryptography-and-key-management/#generating-all-the-acra-keys-in-one-go-INVALID" >}}).

AcraConnector is now listening on the localhost port **9494**. Now try accessing your database via AcraConnector to make sure that everything actually works after installation.