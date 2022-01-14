---
title: Acra from the repository
weight: 1
---

# Installing Acra from the repository

## Debian / Ubuntu

**1. Import the public key used by Cossack Labs to sign packages:**

```bash
wget -qO - https://pkgs.cossacklabs.com/gpg | sudo apt-key add -
```    

> Note: If you wish to validate the key fingerprint, it is:
> ```
> 29CF C579 AD90 8838 3E37 A8FA CE53 BCCA C8FF FACB
> ```

**2. Add the Cossack Labs repository to your `sources.list`.**
You should add a line that specifies your OS name and the release name:

```bash
deb https://pkgs.cossacklabs.com/stable/$OS $RELEASE main
```    

* `$OS` should be `debian` or `ubuntu`.
* `$RELEASE` should be one of Debian or Ubuntu release names. You can determine this by running `lsb_release -cs`, if you have `lsb_release` installed.

We currently build packages for the following OSs and RELEASE combinations:

{{< hint info >}}
We stopped shipping binaries for 32-bit OSs. These binaries are available on demand for [Acra Enterprise Edition](/acra/enterprise-edition/) only.
{{< /hint>}}


- *Debian 11 "Bullseye" (amd64)*
- *Debian 10 "Buster" (amd64)*
- *Debian 9 "Stretch" (amd64)*
- *Ubuntu 20.04 LTS "Focal Fossa" (amd64)*
- *Ubuntu 18.04 LTS "Bionic Beaver" (amd64)*
- *Ubuntu 16.04 LTS "Xenial Xerus" (amd64)*

For example, if you are running *Debian 11 "Bullseye"*, run:

```bash
echo "deb https://pkgs.cossacklabs.com/stable/debian bullseye main" | \
    sudo tee /etc/apt/sources.list.d/cossacklabs.list
```    

**3. Reload local package database:**

```bash
sudo apt-get update
```    

**4. Install the package**

```bash
sudo apt-get install acra
```

## RHEL / CentOS / OEL

We currently build packages for the following OSs and RELEASE combinations:

{{< hint info >}}
We stopped shipping binaries for 32-bit OSs. These binaries are available on demand for [Acra Enterprise Edition](/acra/enterprise-edition/) only.
{{< /hint>}}


* *RHEL / CentOS / OEL 8 (x86_64)*
* *RHEL / CentOS / OEL 7 (x86_64)*

**1. Import the public key used by Cossack Labs to sign packages:**

```bash
sudo rpm --import https://pkgs.cossacklabs.com/gpg
```

> Note: If you wish to validate the key fingerprint, it is:
> ```
> 29CF C579 AD90 8838 3E37 A8FA CE53 BCCA C8FF FACB
> ```

**2. Create a Yum repository file for Cossack Labs package repository:**

```bash
wget -qO - https://pkgs.cossacklabs.com/stable/centos/cossacklabs.repo | \
    sudo tee /etc/yum.repos.d/cossacklabs.repo
```    

**3. Install the package:**

```bash
sudo yum install acra
```

That's it! You've successfully installed Acra from the Cossack Labs repository.


## macOS

Use [Acra as Docker image](/acra/getting-started/installing/launching-acra-from-docker-images/) on macOS. Alternatively, you may use Linux inside virtual machine and [install Linux packages from the Cossack Labs repository](/acra/getting-started/installing/installing-acra-from-repository/).


## Windows

The server-side Acra components should not run on Windows OS as host OS, consider using Linux. Of course, there are ways to use intermediate Linux virtual machines over Windows, but we strongly discourage this approach in production.

---

## Guides

As further steps, we recommend reading the following sections:
* [Guide: Integrating AcraServer into infrastructure](/acra/guides/integrating-acra-server-into-infrastructure/).
* [Guide: Integrating AcraTranslator into infrastructure](/acra/guides/integrating-acra-translator-into-new-infrastructure/).
* [Acra in depth](/acra/acra-in-depth/).
* [Configuring & maintaining](/acra/configuring-maintaining/).
