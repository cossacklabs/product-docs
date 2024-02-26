---
weight: 2
title: Python installation
---

# Installing PyThemis

PyThemis is [available on **PyPi**](https://pypi.org/project/pythemis/)
and can be installed with the usual `pip install`.
Additionally, Themis Core library has to be installed in your system as well.

Themis Core is available as a system package for Linux and macOS.
Usually you want to install the stable package to benefit from automatic dependency management and security updates.
However, you can also build and install the latest PyThemis from the source code.

## Installing stable version on Linux

The easiest way to install Themis on Linux is to use package repositories for your system.
We build packages for a multitude of Linux distributions.

 1. [Add Cossack Labs package repositories](/themis/installation/installation-from-packages/)
    to your system.

 2. Install Themis Core _development_ package.

    For Debian, Ubuntu:

    ```bash
    sudo apt install libthemis-dev
    ```

    For CentOS, RHEL:

    ```bash
    sudo yum install libthemis-devel
    ```

 3. Install PyThemis via PyPi:

    ```bash
    pip install pythemis
    ```

    You may need `sudo` for global installation,
    if you are not using virtual environments.

Once PyThemis is installed, you can [try out code examples](../examples/).

## Installing stable version on macOS

The easiest way to install Themis on macOS is to use Homebrew.

 1. Add Cossack Labs tap to your system:

    ```bash
    brew tap cossacklabs/tap
    ```

 2. Install Themis Core package:

    ```bash
    brew install libthemis
    ```

 3. Install PyThemis via PyPi:

    ```bash
    pip install pythemis
    ```

Once PyThemis is installed, you can [try out code examples](../examples/).

## Building latest version from source

If the stable package version does not suit your needs, you can install the latest version of Themis from source code.
Either by installing into activated virtualenv or by building and installing `.deb`/`.rpm` package on your system.

### Installing into virtualenv

 1. [Build and install Themis Core library](/themis/installation/installation-from-sources/)
    into your system.

 4. Install PyThemis

    ```bash
    # activate virtualenv if not done yet
    make pythemis_install
    ```

### OS package

A package for system-wide installation, for Debian-like and RHEL-like distros

 1. [Build and install Themis Core library](/themis/installation/installation-from-sources/)
    into your system.

 2. Install Python dependencies

    For Debian, Ubuntu:

    ```bash
    sudo apt install lsb-release python3-pip ruby
    sudo gem install fpm
    ```

    For CentOS, RHEL:

    ```bash
    sudo yum install redhat-lsb-core python3-pip ruby rpm-build
    sudo gem install fpm
    ```

    On RHEL you also need to have working `pip` command. If it's not, and you only got `pip3`,
    create a symlink like this: `sudo ln -s $(which pip3) /usr/bin/pip`.

 3. Create a PyThemis package

    For Debian, Ubuntu:

    ```bash
    make deb_python
    ```

    For CentOS, RHEL:

    ```bash
    make rpm_python
    ```

    The result will be located at `build/deb/python3-pythemis_...all.deb`
    or `build/rpm/python3-pythemis_...all.rpm` respectively.

 4. Install PyThemis

    For Debian, Ubuntu:

    ```bash
    sudo make pythemis_install_deb
    ```

    For manual installation, there are two ways:
    1. `sudo apt install ./path/to/package.deb` (the `./` is important here)
    2. `sudo dpkg -i path/to/package.deb` (need to install `python3-six` and `libthemis` beforehands)

    For CentOS, RHEL:

    ```bash
    sudo make pythemis_install_rpm
    ```

    Or manually run `sudo yum install ./path/to/package.rpm`

## Building Themis < 0.15 version from sources (deprecated)

{{< hint warning >}}
The instructions below are relevant only for Themis older than 0.15. Most likely, you don't need to follow them, and should install the latest Themis instead.
{{< /hint >}}

{{< hint warning >}}
[PEP 668](https://peps.python.org/pep-0668/) changed the way Python packages are managed.
It is now recommended to use `pip install` to only install packages into isolated virtual environments
while installing things system-wide should be done using OS package manager (like `apt` or `rpm`).
This means running `sudo make pythemis_install` is no longer recommended as it copies files
into system-managed Python directory (like `/usr/lib/python3.X/site-packages`) that is no longer maintained by `pip`.
Consider building a `.whl` and installing it into your venv instead.
{{< /hint >}}

 1. [Build and install Themis Core library](/themis/installation/installation-from-sources/)
    into your system.

 2. Install PyThemis package from the source code:

    ```bash
    sudo make pythemis_install
    ```

    The package will be installed globally into the system.

 3. Run PyThemis test suite to verify the installation:

    ```bash
    make prepare_tests_all test_python
    ```

To remove PyThemis after using `pythemis_install`, run
```bash
sudo pip uninstall --break-system-packages pythemis
```
