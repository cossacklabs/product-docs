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

If the stable package version does not suit your needs,
you can manually build and install the latest version of Themis from source code.

 1. [Build and install Themis Core library](/themis/installation/installation-from-sources/)
    into your system.

 2. Create a "wheel" package

    ```bash
    make pythemis_make_wheel
    ```

    Result package filename will be printed at the end, like this:
    ```
    Result: src/wrappers/themis/python/dist/pythemis-0.14.0-py2.py3-none-any.whl
    ```

 3. Install PyThemis into virtual environment

    Activate your virtual environment and run
    ```bash
    make pythemis_install_wheel
    ```

    Or run `pip install pythemis-...-none-any.whl` (the package file previously created).
    If the virtual environment already contained PyThemis of the same version,
    add `--force-reinstall` option to rewrite the previous package.

<!-- DRAFT FOR OS PACKAGES FOR PROPER GLOBAL INSTALLATION
To install PyThemis globally, you need to create a system package first:
```bash
make pythemis_make_os_pkg
```

The result will be located at `src/wrappers/themis/python`.

For Debian/Ubuntu it's a `.deb` file, install with `sudo dpkg -i <filename>`.

*TODO: Add more package types*

-->

## Building latest version from source (deprecated)

{{< hint warning >}}
[PEP 668](https://peps.python.org/pep-0668/) changed the way Python packages are managed.
It is now recommended to use `pip install` to only install packages into isolated virtual environments
while installing things system-wide should be done using OS package manager (like `apt` or `rpm`).
This means running `sudo make pythemis_old_install` is no longer recommended as it copies files
into system-managed Python directory (like `/usr/lib/python3.X/site-packages`) that is no longer maintained by `pip`.
Consider building a `.whl` and installing it into your venv instead.
{{< /hint >}}

 1. [Build and install Themis Core library](/themis/installation/installation-from-sources/)
    into your system.

 2. Install PyThemis package from the source code:

    ```bash
    sudo make pythemis_old_install
    ```

    The package will be installed globally into the system.

 3. Run PyThemis test suite to verify the installation:

    ```bash
    make prepare_tests_all test_python
    ```

To remove PyThemis after using `pythemis_old_install`, run
```bash
sudo pip uninstall --break-system-packages pythemis
```
