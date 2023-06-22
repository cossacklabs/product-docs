---
weight: 1
title:  Installation from packages
---

# Installing Themis from packages

## Installing Themis Core

The core library is available via Cossack Labs package repositories.
Follow the instructions below for your operating system.

In case you experience issues during installation, refer to [Troubleshooting installation](/themis/debugging/troubleshooting-installation/) page which contains the wisdom of ages.

### Debian, Ubuntu

Supported systems:

  - Debian 9 “Stretch”
  - Debian 10 “Buster”
  - Debian 11 “Bullseye”
  - Ubuntu 16.04 LTS “Xenial Xerus”
  - Ubuntu 18.04 LTS “Bionic Beaver”
  - Ubuntu 20.04 LTS “Focal Fossa”

**1. Import Cossack Labs public key**

You need to import the public key used by Cossack Labs to sign packages:

```bash
wget -qO - https://pkgs-ce.cossacklabs.com/gpg | sudo apt-key add -
```

If you wish to validate the key fingerprint, it is:
```
$ apt-key list 'Cossack Labs'
pub   rsa4096 2017-07-14 [SC]
      29CF C579 AD90 8838 3E37  A8FA CE53 BCCA C8FF FACB
uid           [ unknown] Cossack Labs Limited <dev@cossacklabs.com>
```

**2. Make sure APT supports HTTPS**

You should install HTTPS support for APT
if it is not installed already:

```bash
sudo apt install apt-transport-https
```

**3. Add Cossack Labs repository to your `sources.list`**

Create a new `*.list` file under `/etc/apt/sources.list.d` directory
(for example, `/etc/apt/sources.list.d/cossacklabs.list`).
Put the following line into the list file:

```
deb https://pkgs-ce.cossacklabs.com/stable/${OS_NAME} ${RELEASE} main
```

where

  - `${OS_NAME}` should be `debian` or `ubuntu`
  - `${RELEASE}` should be Debian or Ubuntu release name (like `focal`)

     You can determine this by running `lsb_release -cs`,
     if you have `lsb_release` installed (`lsb-release` package).

We currently build packages for the following OS_NAME and RELEASE combinations:

  - `debian stretch` — Debian 9 “Stretch”
  - `debian buster` — Debian 10 “Buster”
  - `debian bullseye` — Debian 11 “Bullseye”
  - `ubuntu xenial` — Ubuntu 16.04 LTS “Xenial Xerus”
  - `ubuntu bionic` — Ubuntu 18.04 LTS “Bionic Beaver”
  - `ubuntu focal` — Ubuntu 20.04 LTS “Focal Fossa”

For example, if you are running _Debian 11 “Bullseye”_, run:

```bash
echo "deb https://pkgs-ce.cossacklabs.com/stable/debian bullseye main" | \
  sudo tee /etc/apt/sources.list.d/cossacklabs.list
```

**4. Reload local package database**

```bash
sudo apt update
```

**5. Install Themis Core package**

```bash
sudo apt install libthemis-dev
```

---

### CentOS, RHEL, Oracle Linux

Supported systems:

  - RHEL 7
  - RHEL 8
  - OEL 7
  - OEL 8
  - CentOS 7
  - CentOS 8

{{< hint info >}}
**Note:**
We build RPM packages only for the x86_64 architecture.
32-bit systems are not supported.
{{< /hint >}}

**1. Import Cossack Labs public key**

You need to import the public key used by Cossack Labs to sign packages:

```bash
sudo rpm --import https://pkgs-ce.cossacklabs.com/gpg
```

{{< hint info >}}
If you wish to validate the key fingerprint, it is:
```
$ rpm -qi gpg-pubkey | gpg --with-fingerprint
pub  4096R/C8FFFACB 2017-07-14 Cossack Labs Limited <dev@cossacklabs.com>
      Key fingerprint = 29CF C579 AD90 8838 3E37  A8FA CE53 BCCA C8FF FACB
```
{{< /hint >}}

**2. Add Yum repository for Cossack Labs**

The easiest way is to download the `cossacklabs.repo` file from our server:

```bash
wget -qO - https://pkgs-ce.cossacklabs.com/stable/centos/cossacklabs.repo | \
  sudo tee /etc/yum.repos.d/cossacklabs.repo
```

**3. Install Themis package**

```bash
sudo yum install libthemis-devel
```


---

### macOS

Themis is available on macOS via Homebrew.

Supported systems:

  - macOS 10.12 Sierra
  - macOS 10.13 High Sierra
  - macOS 10.14 Mojave
  - macOS 10.15 Catalina

**1. Add Cossack Labs tap**

```bash
brew tap cossacklabs/tap
```

**2. Install Themis**

```bash
brew install libthemis
```

If you have issues with finding header or library files on macOS 12 (Monterey) or M1 processors you may add the following lines to your .zshrc or equivalent.
```bash
export PATH=$PATH:/opt/homebrew/bin
export CPATH=$CPATH:/opt/homebrew/include
export LIBRARY_PATH=$LIBRARY_PATH:/opt/homebrew/lib
```

Congratulations! You're done!


---

### Windows

{{< hint info >}}
**Note:**
This is an experimental feature available since Themis 0.12.
{{< /hint >}}

Themis Core can be installed into MSYS2 environment on Windows.
You can either compile and use it inside MSYS2,
or build an NSIS installer to use Themis outside of MSYS2.

[**MSYS2**](https://www.msys2.org/)
is a popular and easy way to compile POSIX-compliant software on Windows.
It provides GNU development environment and API compatibility layer between POSIX and WinAPI.

#### Building in MSYS2

To compile Themis Core for Windows using the MSYS2 environment,
follow these steps:

 1. [Install MSYS2](https://www.msys2.org/) for x86_64 platform.

 2. Open a new MSYS2 terminal (Start > MSYS2 > MSYS2 MSYS).

 3. Install build tools and dependencies:

    ```bash
    pacman -S git make gcc openssl-devel
    ```

 4. Check out Themis, build it, run tests, install:

    ```bash
    git clone https://github.com/cossacklabs/themis
    cd themis
    make all
    make test
    ```

The resulting binaries will be placed into the `build` directory:

  - `msys-soter-0.dll`, `msys-themis-0.dll`: DLLs to be distributed with your application
  - `libsoter.dll.a`, `libthemis.dll.a`: import libraries to be used when building your application

Note that Themis DLLs depend on some MSYS2 DLLs which need to be distributed together with Themis:

  - `msys-2.0.dll`
  - `msys-crypto-1.1.dll`
  - `msys-z.dll`

They can be found in `/usr/bin` directory of MSYS2 environment
(typically `C:\msys64\usr\bin` from the Windows point of view).

#### Building NSIS installer

Alternatively, you can build an NSIS installer
which can be used to redistribute Themis to systems without MSYS2.

 1. Install NullSoft Installation System:

    ```bash
    pacman -S mingw-w64-x86_64-nsis
    export PATH=$PATH:/mingw64/bin
    ```

 2. Check out Themis and build NSIS installer:

    ```bash
    git clone https://github.com/cossacklabs/themis
    cd themis
    make nsis_installer
    ```

 3. Use NSIS installer GUI (steps 1–3 below)
    to install Themis along with all necessary dependencies.

![](/files/wiki/cossack-labs-themis-win-installer.png)


---

## Installing Themis language wrappers

Language-specific wrappers enable you to use Themis in a particular language.
Most of them are available via language-specific package repositories.

Check out the corresponding language guide for more details
on how to install Themis wrapper for your language.

{{< hint info >}}
**Note:**
For server-side development you need to install Themis Core first.

For iOS, Android, and WebAssembly you do not need to install Themis Core separately.
{{< /hint>}}

### Server-side and desktop platforms

  - [C++](/themis/languages/cpp/installation/)
  - [Go](/themis/languages/go/installation/)
  - [JavaScript (Node.js)](/themis/languages/nodejs/installation/)
  - [Java](/themis/languages/java/installation-desktop/)
  - [Kotlin](/themis/languages/kotlin/installation-desktop/)
  - [PHP](/themis/languages/php/installation/)
  - [Python](/themis/languages/python/installation/)
  - [Ruby](/themis/languages/ruby/installation/)
  - [Rust](/themis/languages/rust/installation/)

### Mobile and Web platforms

  - [Swift](/themis/languages/swift/installation/)
  - [Objective-C](/themis/languages/objc/installation/)
  - [Kotlin](/themis/languages/kotlin/installation-android/)
  - [Java](/themis/languages/java/installation-android/)
  - [JavaScript (WebAssembly)](/themis/languages/wasm/installation/)
