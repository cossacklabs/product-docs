---
title: Building and installing AcraWriter
bookCollapseSection: true
---

## Building AcraWriter for your language

Acra uses [Themis]({{< ref "themis/" >}}) for performing cryptographic computations. AcraWriter is basically Themis + high level code that generates [AcraStructs]({{< ref "acra/acra-in-depth/data-structures/#understanding-acrastruct" >}}) from input data and public key.

There are many languages / architectures supported by Themis, and eventually, most of them will support Acra, too.

### Common steps for all languages

**1. Install dependencies**

```bash
sudo apt install git make build-essential
```

**2. [Install Themis]({{< ref "themis/installation/" >}})**


**3. Get Acra sources**

For some languages/platforms you can use language specific package manager (Python, Ruby, iOS, Java/Android), but some support installing only from sources (NodeJS, Golang, C++, PHP). For second languages you need to get Acra sources.

```bash
git clone https://github.com/cossacklabs/acra.git
cd acra
```

### Building AcraWriter for Python

> Before building AcraWriter for Python, make sure you've installed [Themis as system library]({{< ref "themis/installation/" >}})!

#### Installation

```bash
sudo apt install python-pip
pip install acrawriter
```    

#### Testing

```python
from pythemis.skeygen import GenerateKeyPair, KEY_PAIR_TYPE
from acrawriter import create_acrastruct

keypair = GenerateKeyPair(KEY_PAIR_TYPE.EC)
create_acrastruct(b'some data', keypair.export_public_key())
```
Output
```
'""""""""UEC2\x00\x00\x00-\xc2\xda\xbc\x03\x03`/\xc5\x8d.|DuX\xc4\x1c\xe5\x11\xd2>.\xc7.\xf3\xe5\xa5\xec\x83\xdbC\xd9\xdb/\x85K\x19\xe5 \'\x04&T\x00\x00\x00\x00\x01\x01@\x0c\x00\x00\x00\x10\x00\x00\x00 \x00\x00\x00\xb1o\xde\xbf\xcc\xa1\xe6\x13\x00MT)\x98\x95@Z?\xd1\xea\xa2n\xa1\xf7\x93\x9dD\xf4Gr\n?8J\x94\x1c$\x86\x91\xdc\x05^\x1d\xe0>\x18ru\xa4A\x04\xf9\x98X]\x13\x9c$\x97~\x145\x00\x00\x00\x00\x00\x00\x00\x00\x01\x01@\x0c\x00\x00\x00\x10\x00\x00\x00\t\x00\x00\x00D\xe7\xafw\x82\xb3\xff"q3\x94\x17X\x14+\xe6e\x07\xecR>\xc9\x9d\xd4\xa8"T\xf5(\xcf:\x83\xe8\x82\x02\xcf\x16'
```    

#### Examples
[With Zones](https://github.com/cossacklabs/acra/blob/master/examples/python/example_with_zone.py) and [without Zones](https://github.com/cossacklabs/acra/blob/master/examples/python/example_without_zone.py).

A real-world example project that protects Django web application and a set of small Python command-line applications is available in [Acra example projects](https://github.com/cossacklabs/acra-engineering-demo#protecting-data-on-django-based-web-site).

### Building AcraWriter for Ruby

> Before building AcraWriter for Ruby, make sure you've installed [Themis as system library]({{< ref "themis/installation/" >}})!

#### Installation

```bash
gem install acrawriter
```    

#### Test
```bash
gem install --user-install minitest rake
rake test
```
Output
```
Finished in 0.003829s, 261.1501 runs/s, 0.0000 assertions/s.

1 runs, 0 assertions, 0 failures, 0 errors, 0 skips
```    

#### AcraWriter supports ActiveDirectory

```
gem 'activerecord_acrawriter'
```

#### Examples
[With Zones](https://github.com/cossacklabs/acra/blob/master/examples/ruby/example_with_zone.rb) and [without Zones](https://github.com/cossacklabs/acra/blob/master/examples/ruby/example.rb).

A real-world example project that protects Ruby on Rail application is available in [Acra example projects](https://github.com/cossacklabs/acra-engineering-demo#protecting-data-in-a-rails-application).

### Building AcraWriter for Nodejs

> Before building AcraWriter for NodeJS, make sure you've installed [Themis as system library]({{< ref "themis/installation/" >}})!

#### Installation
```bash
sudo apt install node npm
sudo apt install nodejs-legacy
sudo npm install -g npm
cd wrappers/nodejs
npm install nan
npm install
```
#### Testing
```
node test.js
```
Output
```
work
```
#### Examples
[With Zones](https://github.com/cossacklabs/acra/blob/master/examples/nodejs/examples_with_zone.js) and [without Zones](https://github.com/cossacklabs/acra/blob/master/examples/nodejs/examples_without_zones.js).

### Building AcraWriter for PHP

> Before building AcraWriter for PHP, make sure you've installed [Themis as system library]({{< ref "themis/installation/" >}})!

#### Installation

```bash
sudo apt install php5 php5-dev
cd themis
sudo make phpthemis_install
# extension=phpthemis.so
sudo nano /etc/php5/cli/php.ini
# check that extension is available
php --ri phpthemis
cd -
```
#### Testing
```bash
php acra/wrappers/php/test.php
```
Output
```
work
```
Now use `acra/wrappers/php/acrawriter.php` in your project. In future
`acrawriter` will contain composer.json and will be added to packagist.

#### Examples
[With Zones](https://github.com/cossacklabs/acra/blob/master/examples/php/example_with_zone.php) and [without Zones](https://github.com/cossacklabs/acra/blob/master/examples/php/example.php)

### Building AcraWriter for Go

> Before building AcraWriter for Go, make sure you've installed [Themis as system library]({{< ref "themis/installation/" >}})!

#### Installation
```bash
sudo apt install golang
# leave your GOPATH or set some
export GOPATH=$HOME/work
go get github.com/cossacklabs/acra/acra-writer
```   

#### Testing
```
go test github.com/cossacklabs/acra/acra-writer
```
Output
```
ok  	github.com/cossacklabs/acra/acra-writer	0.112s
```

#### Examples
[With Zones](https://github.com/cossacklabs/acra/blob/master/examples/golang/src/example_with_zone/example_with_zone.go) and [without Zones](https://github.com/cossacklabs/acra/blob/master/examples/golang/src/example/example.go)

### Building AcraWriter for C++

> Before building AcraWriter for C++, make sure you've installed [Themis as system library]({{< ref "themis/installation/" >}})!

#### Dependencies

Additionally, install [ThemisPP (Themis C++ wrapper) as system library](https://github.com/cossacklabs/themis/wiki/CPP-Howto) from Themis source folder:

```bash
cd themis
make themispp_install
cd -
```

#### Installation

Grab `acrawriter.hpp` source file and add it to your project. Link `themis` and `crypto` libs.

Example of CMake file:

```bash
project(my_project)
set(CMAKE_CXX_STANDARD 14)

//path to acrawriter.hpp file
set(ACRAWRITER ../../wrappers/cpp)
include_directories(${ACRAWRITER})

set(
    SOURCE_FILES
    ${ACRAWRITER}/acrawriter.hpp
    main.cpp
    )

add_executable(my_project ${SOURCE_FILES})
target_link_libraries(my_project themis crypto)

```

#### C++ examples and tests

See CLion project example in [examples/cpp](https://github.com/cossacklabs/acra/tree/master/examples/cpp) for generating AcraStruct with and without Zones, and tests.


### Building AcraWriter for iOS

#### Installation via CocoaPods

Update your Podfile with:

```bash
pod 'acrawriter'
```

AcraWriter for iOS supports bitcode and has Themis (and OpenSSL) as dependencies.

#### iOS examples and tests

Check out the iOS project example using Objective-C in [examples/objc](https://github.com/cossacklabs/acra/tree/master/examples/objc) for generation of an AcraStruct with and without Zones and decrypting them using AcraTranslator via HTTP API.

Check out another iOS project example using Swift in [examples/swift](https://github.com/cossacklabs/acra/tree/master/examples/swift) for generation of an AcraStruct with and without Zones.

### Building AcraWriter for Android

#### Installation

Installation via maven: AcraWriter is placed into our [bintray](https://bintray.com/cossacklabs/maven/acrawriter).

First, update your `build.gradle` file with URL to our maven repository:

```
repositories {
        // whatever you have here, add maven
        maven { url "https://dl.bintray.com/cossacklabs/maven/" }
}
```

Then link acrawriter from `app/build.gradle` file:

```
dependencies {
     // ....
    implementation 'com.cossacklabs.com:acrawriter:1.0.1'
}
```

#### Android examples and tests

See Android project example in [examples/android_java](https://github.com/cossacklabs/acra/tree/master/examples/android_java) for generating AcraStruct with and without Zones, and decrypting them using AcraTranslator via HTTP API.
