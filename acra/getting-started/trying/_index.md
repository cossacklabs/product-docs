---
title: Trying
bookCollapseSection: true
weight: 3
---

# Trying Acra

There are many ways to quickly get working Acra installations which allow you to test the features Acra provides and integration approaches with your applications.

> WARNING! Do not use these configurations to store sensitive data! It is dangerous! They are meant for test-driving purposes only!

## Docker + Docker Compose

The following example relies on pre-made config files and pre-made examples which are the part of the [Acra repository](https://github.com/cossacklabs/acra). They were prepared for a quick try-out and for product architecture learning purposes. The idea was to show the interactions between Acra components in detail and to simplify the process of first acquaintance with the product. We recommend that you create your own configurations for the production environment, the one strictly dependent on your infrastructure requirements.

Our Docker Compose files were created using v3 compose file format. Please check your Docker engine and Docker Compose versions in the [docker official compatibility table](https://docs.docker.com/compose/compose-file/compose-versioning/#compatibility-matrix).

### Quick launch!

```bash
# get Acra repository
git clone https://github.com/cossacklabs/acra.git
cd acra
# list available Docker Compose demos
ls docker/docker-compose.*
# choose one of them and launch in the common way
docker-compose -f docker/docker-compose.pgsql-ssl-server-ssl.yml up
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

Please refer to the [Launching Acra from Docker images](/acra/getting-started/installing/launching-acra-from-docker-images/) ff you need more information about Docker images.

### Compose files

We want you to be able to easily try the most useful schemes that we prepared as Docker Compose files in the `docker` subdirectory. The name of each Docker Compose file describes its components and their interconnections in a simple form. For example: `docker-compose.pgsql-nossl-server-ssession-proxy.yml` is a scheme with Postgresql DB, AcraServer, and AcraConnector, connected to AcraServer through the Themis Secure Session link.

The examples contain references to `acra-keymaker` and `acra-authmanager` containers inside. They are used for creation and distribution of the necessary keys. They were included for simplification of the test launch and should not be used in production schemes (where the keys should be generated manually and deployed to an appropriate host according to the security rules of your infrastructure).

Check out the [docker folder](https://github.com/cossacklabs/acra/blob/master/docker) for examples of compose files.

Most likely you would like to set some variables before launch.

Please set `ACRA_MASTER_KEY` environmental variable, or check [Key Management](/acra/security-controls/key-management/operations/generation/#11-generating-acra-master-key) page for more details:
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

And connect to ports [described above](#quick-launch).

## Engineering Demos

For a more detailed study of the Acra's capabilities, we prepared [a couple of complete engineering demo repositories](https://github.com/cossacklabs/acra-engineering-demo#what-is-this). These demos include:
* Integration examples for languages and frameworks: Python, Django, Rails
* Integration examples for DBs: PostgreSQL and TimescaleDB
* Launching Acra in different behaviors:
  - Asymmetric encryption mode
  - Transparent encryption mode
* SQL injection prevention
* Monitoring: metrics and tracing
* HA / Balancing

and many more.

## Digital Ocean 1-Click App

For another quick start with Acra, you can get a [minimalistic version of Acra Community Edition as a 1-Click App](/acra/guides/acra-on-digital-ocean/) running in a [1-Click App on DigitalOcean Marketplace](https://marketplace.digitalocean.com/apps/acra). If you're new to DigitalOcean, you can use [Cossack Labs referral code](https://marketplace.digitalocean.com/apps/acra?refcode=3477f5f54884) to register and get $100 for 60 days for free. 

[Refer to the guide](/acra/guides/acra-on-digital-ocean/).


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

This script made a request to HTTP API of AcraServer through AcraConnector to add a new Zone and used the response (Zone ID and Zone public key) for encrypting the data. `zone: DDDDDDDDmufclpqHJfnTDJZW` is the Zone ID that should be used for fetching the decrypted data via AcraServer.

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

---

## Guides

For the further guides on how to integrate Acra, see
* [Installing](/acra/getting-started/installing/)
* [Integrating AcraServer into infrastructure]({{< ref "acra/guides/integrating-acra-server-into-infrastructure/" >}})
* [Integrating AcraTranslator into infrastructure]({{< ref "acra/guides/integrating-acra-translator-into-new-infrastructure/" >}})
