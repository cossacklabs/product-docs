---
title: Trying Acra with Docker
bookCollapseSection: true
---

# Acra + Docker

You can use containers with Acra. Acra works well with [Docker](https://www.docker.com/what-docker). However, we advise only going the "Acra in Docker containers" route for testing purposes, and NOT in a real-world production environment.

This is why this document is called "Trying Acra with Docker", not "Using Acra with Docker in a Production Setting".

### Precautions

Storing keys safely when using Docker is problematic. Docker is immutable while [Zones]({{< ref "acra/acra-in-depth/cryptography-and-key-management#zones-INVALID" >}})/[keys]({{< ref "acra/acra-in-depth/cryptography-and-key-management#-INVALID" >}}) are not. This means that you might want to attach some storage and end up making the keys accessible to attackers. There are multiple ways to solve this problem and it will be addressed in a convenient and secure fashion in the future releases of Acra.

## Using Acra in Docker

The following example relies on pre-made config files and pre-made examples. They were prepared for a quick try-out and for product architecture learning purposes. The idea was to show the interactions between Acra components in detail and to simplify the process of first acquaintance with the product. We recommend that you create your own configurations for the production environment, the one strictly dependent on your infrastructure requirements.

Our Docker Compose files were created using v3 compose file format. Please check your docker engine and Docker Compose versions in the [docker official compatibility table](https://docs.docker.com/compose/compose-file/compose-versioning/#compatibility-matrix).

### Download Acra

```bash
git clone https://github.com/cossacklabs/acra
cd acra
```


### Quick launch!

> WARNING! Do not use these configurations to store sensitive data! It is dangerous! They are meant for test-driving purposes only!

All that you need for your first try of Acra is to launch the selected scheme from the `docker` subdirectory:

```bash
docker-compose -f docker/<compose_file_name>.yml up
```    

This will create `docker/.acrakeys` directory structure, generate all the key pairs, put them into appropriate directories, create DB, add DB user, grant appropriate privileges and launch all the components.

Now you can connect to (you can see the default DB name and credentials inside the Docker Compose file):

|   Port   |          Component           |     In docker-compose examples with     |
|----------|------------------------------|-----------------------------------------|
| 9191/tcp | AcraServer/AcraConnector API | zonemode                                |
| 9393/tcp | AcraServer                   | absent AcraConnector                    |
| 9494/tcp | AcraConnector                | present AcraConnector                   |
| 8000/tcp | AcraWebconfig                | present AcraConnector and SecureSession |
| 5432/tcp | PostgreSQL                   | PostgreSQL                              |
| 3306/tcp | MySQL                        | MySQL                                   |


### Normal launch

#### Description of components

There are several different dockerfiles in `docker` subdirectory:

* `acra-authmanager.dockerfile` – resulting image with AcraAuthmanager tool
* `acra-connector.dockerfile` – resulting image with AcraConnector
* `acra-server.dockerfile` – resulting image with AcraServer
* `acra-keymaker.dockerfile` – resulting image with AcraKeymaker tool
* `acra-webconfig.dockerfile` – resulting image with AcraWebconfig component
* `acra-build.dockerfile` – intermediate image for compiling all the Acra components
* `mysql-nossl.dockerfile` – MySQL server container with disabled SSL
* `mysql-ssl.dockerfile` – MySQL server container with example SSL certificates (located at ssl/mysql directory)
* `postgresql-ssl.dockerfile` – Postgresql server container with example SSL certificates (located at ssl/postgresql directory)

All the images are already built and uploaded to the [Docker Hub Cossack Labs repository](https://hub.docker.com/u/cossacklabs/), so you can use them in a traditional manner:

```bash
docker run <options> cossacklabs/<component> <arguments>
```    

You do not need to do it, but you may want to build all the images from current sources manually. To do that, type:

```bash
make docker
```    

After that step, you'll get the described above pre-built images (intermediate `acra-build` image will be wiped out after the build is complete).

All docker images have tags. When we build them, we set appropriate tags for each image:

* sliding tags:
    - `stable` and `latest` - stable branch, recommended, default;
    - `master` and `current` - master branch of GitHub repository.

* fixed tags:
    - `<full_commit_tag>` - specify the exact commit in the repository;
    - `<version>` - choose version tag.

An image usually has two (commit, version) or four (+ branch, latest/current) tags.

#### Compose files

We wanted you to be able to easily try the most useful schemes that we prepared as Docker Compose files in the `docker` subdirectory. The name of each Docker Compose file describes its components and their interconnections in a simple form. For example: `docker-compose.pgsql-nossl-server-ssession-proxy.yml` is a scheme with Postgresql DB, AcraServer, and AcraConnector, connected to AcraServer through the Secure Session link.

The examples contain references to `acra-keymaker` and `acra-authmanager` containers inside. They are used for creation and distribution of the necessary keys. They were included for simplification of the test launch and should not be used in production schemes (where the keys should be generated manually and deployed to an appropriate host according to the security rules of your infrastructure).

Check out the [docker/README](https://github.com/cossacklabs/acra/blob/master/docker/README.md) for examples and descriptions of compose files.

Most likely you would like to set some variables before launch.

Please set `ACRA_MASTER_KEY` environmental variable, or check [KeyManagement]({{< ref "acra/acra-in-depth/cryptography-and-key-management/#-INVALID" >}}) page for more details:
```bash

export ACRA_SERVER_MASTER_KEY=$(echo -n "My_Very_Long_Key_Phrase_ge_32_chars" | base64)
export ACRA_CONNECTOR_MASTER_KEY=$(echo -n "My_Very_Long_Key_Phrase_ge_32_chars" | base64)
```

Define the Client ID:
```bash
export ACRA_CLIENT_ID="MyClientID"
```

Optionally you may specify a docker image tag, which can be one of the following:

* `stable` or `latest` - stable branch, recommended, default;
* `master` or `current` - master branch of the GitHub repository;
* `<full_commit_tag>` - specify the exact commit in repository;
* `<version>` - choose version tag.

```bash
# Examples:
# branch
export ACRA_DOCKER_IMAGE_TAG="master"
# commit tag
export ACRA_DOCKER_IMAGE_TAG="2d2348f440aa0c20b20cd23c49dd34eb0d42d6a5"
# version
export ACRA_DOCKER_IMAGE_TAG="0.76-33-g8b16bc2"
```

Please define the database name and user credentials:

```bash
# for Postgresql
export POSTGRES_DB="<db_name>"
export POSTGRES_USER="<user_name>"
export POSTGRES_PASSWORD="<user_password>"

# for MySQL
export MYSQL_ONETIME_PASSWORD="<mysql_onetime_password>"
export MYSQL_ROOT_PASSWORD="<mysql_root_password>"
export MYSQL_DATABASE="<db_name>"
export MYSQL_USER="<user_name>"
export MYSQL_PASSWORD="<user_password>"
```

In order to access AcraWebConfig HTTP interface, you can define:
```bash
export ACRA_HTTPAUTH_USER=<http_auth_user>
export ACRA_HTTPAUTH_PASSWORD=<http_auth_password>
```

Now you can run `docker-compose`:
```bash
    docker-compose -f docker/<compose_file_name> up
```

And connect to ports described above.

## Example application

In the following examples, we assume that the schemes are running and all the environment variables are set as described in the code block below. For your convenience, we recommend that you perform the following actions in two different shell windows:  run the Docker in one and the examples in another.

Please define the same set of environment variables in **both** shell windows before proceeding to the next steps:
```bash
export ACRA_SERVER_MASTER_KEY=$(echo -n "My_Very_Long_Key_Phrase_ge_32_chars" | base64)
export ACRA_CONNECTOR_MASTER_KEY=$(echo -n "My_Very_Long_Key_Phrase_ge_32_chars" | base64)
export ACRA_CLIENT_ID="test"
export POSTGRES_DB="acra"
export POSTGRES_USER="dbuser"
export POSTGRES_PASSWORD="dbpassword"
export ACRA_CLIENT_ID="acraclient"
```    

### Install the dependencies for the example application
(shell window #2)

> Important: You must start with installing Themis encryption library for Acra to work. Please follow either [these instructions]({{< ref "themis/installation/" >}}) or use a simple [script](https://pkgs.cossacklabs.com/scripts/libthemis_install.sh) to install Themis before proceeding.

Before running `examples/python/*.py`, please perform these initial steps:
```bash
python3 -m venv acra_env
source acra_env/bin/activate
pip install -U pip
pip install -r examples/python/requirements.txt    
apt install libpq-dev    
```    

### To Use Acra without Zones:

**Launch docker-compose file**
(shell window #1)
```bash
docker-compose -f docker/docker-compose.pgsql-nossl-server-ssession-connector.yml up
```

**Print data in the database**
(shell window #2)

Depending on your system configurations, you may be required to change the owner of the `docker/.acrakeys` directory, which is created by Docker daemon, to have access to it. In this case, use:
```bash
sudo chown $(whoami) -R docker/.acrakeys
```

```bash
python examples/python/example_without_zone.py \
--public_key=docker/.acrakeys/acra-writer/${ACRA_CLIENT_ID}_storage.pub \
    --db_user=${POSTGRES_USER} \
    --db_password=${POSTGRES_PASSWORD} \
    --host=127.0.0.1 \
    --port=5432 \
    --print
```

You should see nothing.

**But let's add some data now!**
(shell window #2)
```bash
python examples/python/example_without_zone.py \
--public_key=docker/.acrakeys/acra-writer/${ACRA_CLIENT_ID}_storage.pub \
    --db_user=${POSTGRES_USER} \
    --db_password=${POSTGRES_PASSWORD} \
    --host=127.0.0.1 \
    --port=5432 \
    --data="data1"

python examples/python/example_without_zone.py \
--public_key=docker/.acrakeys/acra-writer/${ACRA_CLIENT_ID}_storage.pub \
    --db_user=${POSTGRES_USER} \
    --db_password=${POSTGRES_PASSWORD} \
    --host=127.0.0.1 \
    --port=5432 \
    --data="data2"
```     

We've added data, let's print it:

```bash
python examples/python/example_without_zone.py \
--public_key=docker/.acrakeys/acra-writer/${ACRA_CLIENT_ID}_storage.pub \
    --db_user=${POSTGRES_USER} \
    --db_password=${POSTGRES_PASSWORD} \
    --host=127.0.0.1 \
    --port=5432 \
    --print
```

You will see some incomrehensible string of characters, something like `b'""""""""UEC2\x00\x00\x00-d\x18e\xbc\x03.\x9fi\xecc\xbb\xfe\xa0...`. This is what the data looks like in an encrypted form.

To make sure that the data is really encrypted, you can connect to the database directly and make a pure `select`
in the psql terminal (you will be asked for password, which you set for variable `POSTGRES_PASSWORD`):
```bash
echo "select * from test_example_without_zone" | \
    psql -h127.0.0.1 -p5432 -U${POSTGRES_USER} acra
```

Now it is encrypted data. Let's read the data through AcraConnector by specifying port 9494 instead of 5432:

```bash
python examples/python/example_without_zone.py \
--public_key=docker/.acrakeys/acra-writer/${ACRA_CLIENT_ID}_storage.pub \
    --db_user=${POSTGRES_USER} \
    --db_password=${POSTGRES_PASSWORD} \
    --host=127.0.0.1 \
    --port=9494 \
    --print
```    

Now you will see the decrypted data via Acra in the `data` column, i.e. `b'data1'`.

### Using Acra in Docker with Zones

> WARNING: Shutdown the previous containers and delete `docker/.acrakeys` first!

Use:         
(shell window #1)
```bash
docker-compose -f docker/docker-compose.pgsql-nossl-server-ssession-connector.yml down
rm -rf docker/.acrakeys
```

**Launch docker-compose file**
(shell window #1)
```bash
docker-compose -f docker/docker-compose.pgsql-nossl-server-ssession-connector_zonemode.yml up
```

**Print data in database**:
(shell window #2)
Depending on your system configurations, you may be required to change the owner of the `docker/.acrakeys` directory, which is created by the Docker daemon, to have access to it. In this case, use:
```bash
sudo chown $(whoami) -R docker/.acrakeys
```    

```bash
python examples/python/example_with_zone.py \
    --db_user=${POSTGRES_USER} \
    --db_password=${POSTGRES_PASSWORD} \
    --host=127.0.0.1 \
    --port=5432 \
    --print
```    

Nothing should be printed. But let's add some data using a Python script `example_with_zone.py`:

```bash
python examples/python/example_with_zone.py \
    --db_user=${POSTGRES_USER} \
    --db_password=${POSTGRES_PASSWORD} \
    --host=127.0.0.1 \
    --port=5432 \
    --data="data1"
```

The script will print:

```
data: data1
zone: DDDDDDDDmufclpqHJfnTDJZW
saved with zone: DDDDDDDDmufclpqHJfnTDJZW
```

This script made a request to HTTP API of AcraServer through AcraConnector to add a new Zone and used the response (Zone ID and Zone public key) for encrypting the data. `zone: DDDDDDDDmufclpqHJfnTDJZW` is the Zone ID that should be used for [fetching the decrypted data]({{< ref "acra/guides/advanced-integrations#client-side-with-zones-INVALID" >}}) via AcraServer.

**Let's print the data now:**
(shell window #2)
```bash
python examples/python/example_with_zone.py \
    --db_user=${POSTGRES_USER} \
    --db_password=${POSTGRES_PASSWORD} \
    --host=127.0.0.1 \
    --port=5432 \
    --print
```     

We should see something like:
```
id  - zone - data -   raw_data
92075 - b'without zone' - b'""""""""UEC2\x00\x00\x00-E\xf90\x93\x031]\xb8\xd9\x04\xf3\xc1R\x95U1sd\xcd\xe6\xca\xef4\x14K.\xd3\xa7\xbb\x8d\x80\x18\x84v4o\x1d \'\x04&T\x00\x00\x00\x00\x01\x01@\x0c\x00\x00\x00\x10\x00\x00\x00 \x00\x00\x00Ri\xf0,\x91\xe8\xb3Y\x861\xaend\x10\x89t\xe3\xa6\x8e\xe3\xbf8+."\x17\xd2s\xd3\xc4m\xa5\xbf+\xce\x85G9\xca\x15\x01X\xd3\x87;$2\xed\xd5\xca7\xec!\x07\xcb\xee\xd9\xd7\xd8Y1\x00\x00\x00\x00\x00\x00\x00\x00\x01\x01@\x0c\x00\x00\x00\x10\x00\x00\x00\x05\x00\x00\x00\x9f\xd0\x1f\x7fkZ\xaah\xb9\xe2s\x15!#wj2(\x0b[o\r\x01\xcf\xacC\xdbt\x86\xae\xd4\xb2\xb8' - (zone: DDDDDDDDmufclpqHJfnTDJZW) - data1
```
Here `b'without zone'` is a hardcoded string in example script for demonstrating the usage without Zones.

**Let's try to print what's going on with AcraProxy on port 9494**:
(shell window #2)
```bash
python examples/python/example_with_zone.py \
    --db_user=${POSTGRES_USER} \
    --db_password=${POSTGRES_PASSWORD} \
    --host=127.0.0.1 \
    --port=9494 \
    --print
```    

We will see that nothing happened because AcraServer now fails to match Zone ID and so it doesn't decrypt the data. The only logging that happens now happens on AcraServer. This needs to be done to make sure that the attackers are not able to figure out what exactly is wrong with their attempts to perform decryption.

**Let's try print for using AcraProxy port 9494 and passing the correct Zone ID**
(shell window #2)

```bash
python examples/python/example_with_zone.py \
    --db_user=${POSTGRES_USER} \
    --db_password=${POSTGRES_PASSWORD} \
    --host=127.0.0.1 \
    --port=9494 \
    --print \
    --zone_id=DDDDDDDDmufclpqHJfnTDJZW
```    

> Note: Use your own generated Zone ID here, it should be different from the one in the example

Now we can see the decrypted data:

```
use zone_id:  DDDDDDDDmufclpqHJfnTDJZW
id  - zone - data -   raw_data
92075 - b'DDDDDDDDmufclpqHJfnTDJZW' - data1 - (zone: DDDDDDDDmufclpqHJfnTDJZW) - data1
```

Let's see how the data is stored in the database (you will be asked for the password, which you set for the variable `POSTGRES_PASSWORD`):

```bash
echo "select * from test_example_with_zone" | \
    psql -h127.0.0.1 -p5432 -U${POSTGRES_USER} acra
```

Now, let's try print for the data with incorrect Zone ID through AcraConnector:

```bash
python examples/python/example_with_zone.py \
    --db_user=${POSTGRES_USER} \
    --db_password=${POSTGRES_PASSWORD} \
    --host=127.0.0.1 \
    --port=9494 \
    --print \
    --zone_id=DDDDDDDDINCORRECTZONEIDW
```    

You will see that AcraServer couldn't decrypt and passed the data as is.