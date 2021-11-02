---
title: Acra from Docker images
weight: 2
---

# Launching Acra from Docker images

You can use containers with Acra. Acra works well with [Docker](https://www.docker.com/what-docker).

## Precautions

Storing keys safely when using Docker is problematic. Docker is immutable while [Zones](/acra/security-controls/zones/)/[keys](/acra/security-controls/key-management/inventory/) are not. This means that you might want to attach some storage and end up making the keys accessible to attackers.

There are multiple ways to solve this problem and it can be addressed in a convenient and secure fashion depending on your specific infrastructure.

## Images

There are pre-built images that you can obtain from the [Docker Hub Cossack Labs repository](https://hub.docker.com/u/cossacklabs/):

* [`acra-server`](https://hub.docker.com/r/cossacklabs/acra-server) – with AcraServer
* [`acra-translator`](https://hub.docker.com/r/cossacklabs/acra-translator) – with AcraTranslator
* [`acra-tools`](https://hub.docker.com/r/cossacklabs/acra-tools) – with Acra tools including AcraKeymaker
* [`acra-keymaker`](https://hub.docker.com/r/cossacklabs/acra-keymaker) – with AcraKeymaker (deprecated in favoe `acra-tools`)
* [`acra-connector`](https://hub.docker.com/r/cossacklabs/acra-connector) – with AcraConnector
* [`acra-authmanager`](https://hub.docker.com/r/cossacklabs/acra-authmanager) – with AcraAuthmanager tool
* [`acra-webconfig`](https://hub.docker.com/r/cossacklabs/acra-webconfig) – with AcraWebconfig component

Docker images have tags. When we build them, we set appropriate tags for each image:

* rolling tags:
    - `stable` and `latest` - stable branch, recommended, default;
    - `master` and `current` - master branch of [Acra GitHub repository](https://github.com/cossacklabs/acra).

* fixed tags:
    - `<full_commit_tag>` - specify the exact commit in the repository;
    - `<version>` - choose version tag.

An image usually has two (commit, version) or four (+ branch, latest/current) tags.

All these images can be used in a traditional manner:

```bash
docker run <options> cossacklabs/<component> <arguments>
```

Usually you do not need to do it, but you may want to build all the images from current sources manually. To do that, type:

```bash
make docker-build
```

---

## Guides

As further steps, we recommend reading the following sections:
* [Acra in depth](/acra/acra-in-depth/)
* [Configuring & maintaining](/acra/configuring-maintaining/)
