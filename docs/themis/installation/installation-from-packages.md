---
weight: 11
---

## Installing Themis Core from packages

The core library is available via Cossack Labs package repositories.
Follow the instructions below for your operating system.

### Debian, Ubuntu

Supported systems:

  - Debian 8 "Jessie"
  - Debian 9 "Stretch"
  - Ubuntu 16.04 LTS "Xenial Xerus"
  - Ubuntu 18.04 LTS "Bionic Beaver"

**1. Import Cossack Labs public key**

You need to import the public key used by Cossack Labs to sign packages:

```bash
wget -qO - https://pkgs.cossacklabs.com/gpg | sudo apt-key add -
```


{{< hint info >}}
If you wish to validate the key fingerprint, it is:<br/>
`29CF C579 AD90 8838 3E37 A8FA CE53 BCCA C8FF FACB`
{{< /hint >}}

**2. Make sure APT supports HTTPS**

You should install HTTPS support for APT
if it is not installed already:

```bash
sudo apt-get install apt-transport-https
```

**3. Add Cossack Labs repository to your `sources.list`**

Create a new `*.list` file under `/etc/apt/sources.list.d` directory
(for example, `/etc/apt/sources.list.d/cossacklabs.list`).
Put the following line into the list file:

```bash
deb https://pkgs.cossacklabs.com/stable/$OS_NAME $RELEASE main
```

where

  - `$OS_NAME` should be `debian` or `ubuntu`     
  - `$RELEASE` should be Debian or Ubuntu release name (like `stretch`).     
    You can determine this by running `lsb_release -cs`, if you have `lsb_release` installed.

We currently build packages for the following OS_NAME and RELEASE combinations:

  - `debian jessie` — Debian 8 "Jessie"    
  - `debian stretch` — Debian 9 "Stretch"    
  - `ubuntu xenial` — Ubuntu 16.04 LTS "Xenial Xerus"    
  - `ubuntu bionic` — Ubuntu 18.04 LTS "Bionic Beaver"

For example, if you are running _Debian 9 "Stretch"_, run:

```bash
echo "deb https://pkgs.cossacklabs.com/stable/debian stretch main" | \
  sudo tee /etc/apt/sources.list.d/cossacklabs.list
```

**4. Reload local package database**

```bash
sudo apt-get update
```

**5. Install Themis package**

```bash
sudo apt-get install libthemis-dev
```

### CentOS / RHEL / OEL

Supported systems:

  - CentOS 7


{{< hint info >}}
We build RPM packages only for x86_64, 32-bit systems are not supported.
{{< /hint >}}

**1. Import Cossack Labs public key**

You need to import the public key used by Cossack Labs to sign packages:

```bash
sudo rpm --import https://pkgs.cossacklabs.com/gpg
```

> **NOTE:**
> If you wish to validate the key fingerprint, it is:<br/>
> `29CF C579 AD90 8838 3E37 A8FA CE53 BCCA C8FF FACB`

**2. Add Yum repository for Cossack Labs**

The easiest way is to download the `*.repo` file from our server:

```bash
wget -qO - https://pkgs.cossacklabs.com/stable/centos/cossacklabs.repo | \
  sudo tee /etc/yum.repos.d/cossacklabs.repo
```

**3. Install Themis package**

```bash
sudo yum install libthemis-devel
```

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

**2. Update local formula database**

```bash
brew update
```

**3. Install Themis**

```bash
brew install libthemis
```    

Congratulations! You're done!

### Windows    

{{< hint info >}}
Note: This is an experimental feature!   
{{< /hint >}}

Starting with Themis 0.12.0, there are now two ways to install Themis Core on Windows: compile in MSYS2 environment and install manually, or use NSIS installer.        

MSYS2 is a popular and easy way to compile POSIX-compliant software on Windows. It provides GNU development environment and API compatibility layer between POSIX and WinAPI.      

To compile Themis Core for Windows using **[MSYS2 environment](https://www.msys2.org/)**, follow next steps:

**1.** [Install MSYS2](https://www.msys2.org/) for x86_64 platform.    

**2.** Open a new MSYS2 terminal (Start > MSYS2 > MSYS2 MSYS).    

**3.** Install build tools and dependencies:    

```bash
pacman -S git make gcc openssl-devel
```

**4.** Check out Themis, build and run tests:

```bash
git clone https://github.com/cossacklabs/themis
cd themis
make test
```

The resulting binaries will be placed into the **build** directory:

  - `msys-soter-0.dll`, `msys-themis-0.dll`: DLLs to be distributed with your application,       
  - `libsoter.dll.a`, `libthemis.dll.a`: import libraries to be used when building your application.           

Note that Themis DLLs depend on some MSYS2 DLLs which need to be distributed together with Themis:

  - msys-2.0.dll     
  - msys-crypto-1.1.dll     
  - msys-z.dll      

They can be found in `/usr/bin` directory of MSYS2 environment (typically `C:\msys64\usr\bin` from Windows point of view).


Alternative way is to **compile NSIS installer and use it** to install Themis.

**1.** Install NullSoft Installation System:

```bash
pacman -S mingw-w64-x86_64-nsis
export PATH=$PATH:/mingw64/bin
```

**2.** Check out Themis and build NSIS installer:

```bash
git clone https://github.com/cossacklabs/themis
cd themis
make nsis_installer
```

**3.** Use NSIS installer GUI (steps 1., 2., 3. below) to install Themis and all necessary dependencies.       

![](https://docs.cossacklabs.com/files/wiki/cossack-labs-themis-win-installer.png)


## Installing Themis language wrappers from packages

Installing language-specific wrappers is done after you've installed the core library itself.
Check out the corresponding language guides for more details on how to install Themis wrapper for your language:    

* [C++](/docs/themis/languages/cpp)     
* [Go](/docs/themis/languages/go)
* [Java (Android)](/docs/themis/languages/java-android)
* [Kotlin (Android)](/docs/themis/languages/kotlin-android) 
* [Java (Desktop)](/docs/themis/languages/java-desktop)    
* [JavaScript (WebAssembly)](/docs/themis/languages/wasm)
* [Node.js](/docs/themis/languages/nodejs)    
* [Objective-C](/docs/themis/languages/objc)    
* [Swift](/docs/themis/languages/swift)    
* [PHP](/docs/themis/languages/php)    
* [Python](/docs/themis/languages/python)    
* [Ruby](/docs/themis/languages/ruby)    
* [Rust](/docs/themis/languages/rust)        

You may also want to check out the [Building from sources page](/docs/themis/installation/installation-from-sources) if you do not wish to use the repositories for installation and prefer to do everything manually.  