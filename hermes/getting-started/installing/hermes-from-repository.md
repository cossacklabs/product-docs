---
title: Hermes from repository
---

# Installing Hermes from repository

To see Hermes-core working, you need to perform the following actions.

## Install or build Hermes-core

Hermes-core is available for the following versions of operating systems:
`*.deb:` - Debian: Wheezy, Jessie, Stretch; - Ubuntu: Trusty Tahr, Xenial Xerus, Yakkety Yak, Zesty Zapus.

`*.rpm:` - CentOS: 7.

Installing for Debian / Ubuntu

1. **Import the public key used by Cossack Labs to sign packages:**

```wget -qO - https://pkgs.cossacklabs.com/gpg | sudo apt-key add -```

{{< hint info >}}
Note: If you wish to validate key fingerprint, it is: `29CF C579 AD90 8838 3E37 A8FA CE53 BCCA C8FF FACB`.
{{< /hint >}}

2. **You may need to install the apt-transport-https package before proceeding:**

```sudo apt-get install apt-transport-https```

3. **Add Cossack Labs repository to your** `sources.list.` You should add a line that specifies your OS name and the release name:

`deb https://pkgs.cossacklabs.com/stable/$OS $RELEASE main`

* `$OS` should be `debian` or `ubuntu`.
* `$RELEASE` should be one of Debian or Ubuntu release names. You can determine this by running `lsb_release -cs`, if you have `lsb_release` installed.

We currently build packages for the following OS and RELEASE combinations:

* *Debian "Wheezy" (Debian 7)*
* *Debian "Jessie" (Debian 8)*
* *Debian "Stretch" (Debian 9)*
* *Ubuntu Trusty Tahr (Ubuntu 14.04)*
* *Ubuntu Xenial Xerus (Ubuntu 16.04)*
* *Ubuntu Yakkety Yak (Ubuntu 16.10)*
* *Ubuntu Zesty Zapus (Ubuntu 17.04)*

For example, if you are running *Debian 8 "Jessie"*, run:

```
echo "deb https://pkgs.cossacklabs.com/stable/debian jessie main" | \
  sudo tee /etc/apt/sources.list.d/cossacklabs.list
  ```

4. **Reload local package database:**

`sudo apt-get update`

5. **Install the package**

`sudo apt-get install libhermes-core`

If you want to run examples or tests, install dev packages, too:

`sudo apt-get install libhermes-core libhermes-core-dev libthemis-dev`

## Installing for CentOS / RHEL / OEL

{{< hint info >}}
    Note, we only build RPM packages for x86_64.
{{< /hint >}}

1. **Import the public key used by Cossack Labs to sign packages:**

`sudo rpm --import https://pkgs.cossacklabs.com/gpg`

{{< hint info >}}
    Note: If you wish to validate key fingerprint, it is: `29CF C579 AD90 8838 3E37 A8FA CE53 BCCA C8FF FACB`.
{{< /hint >}}

2. **Create a Yum repository file for Cossack Labs package repository:**

```
wget -qO - https://pkgs.cossacklabs.com/stable/centos/cossacklabs.repo | \
sudo tee /etc/yum.repos.d/cossacklabs.repo
```

3. **Install the package:**

```sudo yum install libhermes-core```

If you want to run examples or tests, install dev packages, too:

```sudo yum install libhermes-core libhermes-core-devel libthemis-devel```

## What to do after the installation

Consider checking full tutorials to understand how to add and update blocks, grant READ and UPDATE access right for users and revoke access rights.

* [Usage examples](https://docs.cossacklabs.com/pages/documentation-hermes/#building-example-apps) describe how examples work and what are possible usages for Hermes-core.
* [C tutorial](https://docs.cossacklabs.com/pages/c-tutorial-hermes/), where both service and client app are written in C.
* [Python tutorial](https://docs.cossacklabs.com/pages/python-tutorial-hermes/), where service side is C-based, but client code runs on Python.
* [Go tutorial](https://docs.cossacklabs.com/pages/go-tutorial-hermes/), where service side is C-based, but client code runs on Go.
