---
title: Acra from sources
weight: 3
---

# Installing Acra from sources

These are the instruction for installation of [AcraServer](/acra/acra-in-depth/architecture/acraserver/) from the [Cossack Labs' GitHub repository for Acra](https://github.com/cossacklabs/acra/). You will need the same set of dependencies for each component.

## Installing the dependencies

Install the dependencies for Acra:

**Debian / Ubuntu**

```bash
sudo apt-get install git libssl-dev make build-essential
```

**RHEL / CentOS / OEL**

```bash
sudo yum groupinstall 'Development Tools'
sudo yum install openssl-devel
```

## Install Go

[Install and configure the latest stable version of Golang](https://golang.org/doc/install).

## Install Themis

Install [Themis](https://www.github.com/cossacklabs/themis) library:

```bash
git clone https://github.com/cossacklabs/themis.git
cd themis
make
sudo make install
```

## Build the key generator and generate the keys

```bash
go get github.com/cossacklabs/acra/cmd/acra-keymaker
```

Then [generate the keys](/acra/security-controls/key-management/operations/generation/) and distribute them across the infrastructure.

Remember to generate `ACRA_MASTER_KEY` and assign it to the environmental variable!

## Set up the environment for AcraServer

On a separate machine, create a user for AcraServer and make sure your GOBIN is in PATH:
```bash
sudo useradd -m acra-server
sudo su acra-server
cd ~/
export PATH=$PATH:${GOBIN:-${GOPATH:-$HOME}/go/bin}
```

## Build AcraServer

```bash
go get github.com/cossacklabs/acra/cmd/acra-server
```    

Place `someid.pub`, `someid_storage` and `someid_server` keys to .acrakeys directory for AcraServer.
Now you can finally launch the AcraServer.

## Run AcraServer

Running AcraServer is easy, just point it to the database:

```bash
acra-server --db_host=127.0.0.1
```

If you see an error message `"master key is empty"`, it means that you haven't generated `ACRA_MASTER_KEY`, please return to the [Key Generation step](/acra/security-controls/key-management/operations/generation/).

> You can complement the command above with `--db_port=5432 -v` to adjust the listener port and add logs to get going quickly. For all the available CLI parameters, refer to the corresponding section in [How AcraServer works](/acra/configuring-maintaining/general-configuration/acra-server/#command-line-flags).

AcraServer listens to port **9393** by default.


## Set up the environment for AcraTranslator

On a separate machine, create a user for AcraTranslator and make sure your GOBIN is in PATH:
```bash
sudo useradd -m acra-translator
sudo su acra-translator
cd ~/
export PATH=$PATH:${GOBIN:-${GOPATH:-$HOME}/go/bin}
```

## Build AcraTranslator

```bash
go get github.com/cossacklabs/acra/cmd/acra-translator
```    

Place `someid_translator.pub` and `someid_translator` keys to .acrakeys directory for AcraTranslator.
Now you can finally launch the AcraTranslator.

## Run AcraTranslator

```bash
acra-translator
```

If you see an error message `"master key is empty"`, it means that you haven't generated `ACRA_MASTER_KEY`, please return to the [Key Generation step](/acra/security-controls/key-management/operations/generation/).

If no `incoming_connection_{http|grpc}_string` is set, AcraTranslator will serve gRPC connections on port **9696** by default.


## Set up the environment for AcraConnector

Create a user for AcraConnector:

```bash
sudo useradd -m acra-connector
sudo su acra-connector
cd ~/
export PATH=$PATH:${GOBIN:-${GOPATH:-$HOME}/go/bin}
```

## Build AcraConnector

```bash
go get github.com/cossacklabs/acra/cmd/acra-connector
```
Put `someid` and `someid_server.pub` keys into .acrakeys directory for AcraConnector.

## Run AcraConnector

```bash
acra-connector --acraserver_connection_host=127.0.0.1 --client_id=someid -v
```

If you see error message similar to "Configuration error: AcraConnector private key .acrakeys/someid doesn't exists", it means that you haven't generated keys or keys are placed in a wrong folder, please return to the [Key Generation step](/acra/security-controls/key-management/operations/generation/).

AcraConnector is now listening on the localhost port **9494**. Now try accessing your database via AcraConnector to make sure that everything actually works after installation.

---

## Guides

As further steps, we recommend reading the following sections:
* [Acra in depth](/acra/acra-in-depth/)
* [Configuring & maintaining](/acra/configuring-maintaining/)
