---
title: Installing Acra from the Cossack Labs repository
bookCollapseSection: true
---

### Installing Acra from the Cossack Labs repository

> Note: A quick reminder - the server-side Acra components are not compatible with Windows OS as host OS, consider [using Docker]({{< ref "acra/guides/trying-acra-with-docker/" >}}).

#### Debian / Ubuntu

**1. Import the public key used by Cossack Labs to sign packages:**

```console
wget -qO - https://pkgs.cossacklabs.com/gpg | sudo apt-key add -
```    

> Note: If you wish to validate the key fingerprint, it is: `29CF C579 AD90 8838 3E37 A8FA CE53 BCCA C8FF FACB`.

**2. You may need to install the `apt-transport-https` package before proceeding:**

```console
sudo apt-get install apt-transport-https
```    

**3. Add the Cossack Labs repository to your `sources.list`.**        
You should add a line that specifies your OS name and the release name:

```console
deb https://pkgs.cossacklabs.com/stable/$OS $RELEASE main
```    

* `$OS` should be `debian` or `ubuntu`.
* `$RELEASE` should be one of Debian or Ubuntu release names. You can determine this by running `lsb_release -cs`, if you have `lsb_release` installed.

We currently build packages for the following OSs and RELEASE combinations:

- *CentOS 7*,
- *Debian "Jessie" (Debian 8)*,
- *Debian "Stretch" (Debian 9)*,
- *Ubuntu Xenial Xerus (Ubuntu 16.04)*,
- *Ubuntu Artful Aardvark (Ubuntu 17.10)*,
- *Ubuntu Bionic Beaver (Ubuntu 18.04)*.

For example, if you are running *Debian 9 "Stretch"*, run:

```console
echo "deb https://pkgs.cossacklabs.com/stable/debian stretch main" | \
  sudo tee /etc/apt/sources.list.d/cossacklabs.list
```    

**4. Reload local package database:**

```console
sudo apt-get update
```    

**5. Install the package**

```console
sudo apt-get install acra
```

#### CentOS / RHEL / OEL

> Note: We only build RPM packages for x86_64.

**1. Import the public key used by Cossack Labs to sign packages:**

```console
sudo rpm --import https://pkgs.cossacklabs.com/gpg
```
> Note: If you wish to validate the key fingerprint, it is: `29CF C579 AD90 8838 3E37 A8FA CE53 BCCA C8FF FACB`.

**2. Create a Yum repository file for Cossack Labs package repository:**

```console
wget -qO - https://pkgs.cossacklabs.com/stable/centos/cossacklabs.repo | \
  sudo tee /etc/yum.repos.d/cossacklabs.repo
```    

**3. Install the package:**

```console
sudo yum install acra
```

That's it! You've successfully installed Acra from the Cossack Labs repository.