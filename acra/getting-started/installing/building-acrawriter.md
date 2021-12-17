---
title: Building and installing AcraWriter
weight: 5
---

# Building and installing AcraWriter

{{< hint info >}}
AcraWriter is available in [Acra Enterprise Edition](/acra/enterprise-edition/) only.
{{< /hint>}}

[AcraWriter](/acra/acra-in-depth/architecture/sdks/acrawriter/) wraps plaintext data into encrypted [AcraStructs](/acra/acra-in-depth/data-structures/acrastruct/) – cryptographic containers used by Acra.
You pass your input data and AcraServer's public key to AcraWriter, and it returns you encrypted AcraStruct that will be stored in the database.
Once you encrypt data with AcraWriter, only the AcraServer will be able to decrypt it.

AcraWriter (and Acra) use [Themis]({{< ref "/themis/" >}}) cryptographic library.
Essentially, AcraWriter is a high-level wrapper around Themis, using its cryptosystems to generate AcraStructs.

Themis is highly portable and supports many platforms and languages.
At the moment, AcraWriter supports only some of these platforms:

- Android apps written in Kotlin, Java
- iOS apps written in Swift, Objective-C
- desktop apps in a variety of languages:
    - C++
    - Node.js
    - PHP
    - Python
    - Ruby
    

## Installing AcraWriter for your language

Acra uses [Themis]({{< ref "themis/" >}}) for performing cryptographic operations. AcraWriter is essentially a high-level wrapper of Themis (some of its low-level cryptosystems) that generates [AcraStructs](/acra/acra-in-depth/data-structures/acrastruct/) from input data and public key.

There are many languages / architectures supported by Themis, and eventually, most of them will support AcraWriter, too.

### Common steps for all languages

**1. Install dependencies**

```bash
sudo apt install git make build-essential
```

**2. [Install Themis]({{< ref "themis/installation/" >}})**


**3. Get Acra sources**

For some languages/platforms you can use language specific package manager (Python, Ruby, iOS<!--, Java/Android-->), but some support installing only from sources (Node.js, Golang, C++, PHP). For second languages you need to get Acra sources.

```bash
git clone https://github.com/cossacklabs/acra.git
cd acra
```

### Installing AcraWriter for Python

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

A real-world example project that protects Django web application with a set of small Python command-line applications are available in [Acra example projects](https://github.com/cossacklabs/acra-engineering-demo#examples-1-2-protecting-data-on-django-based-web-site).

### Installing AcraWriter for Ruby

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

#### AcraWriter supports ActiveRecord

```
gem 'activerecord_acrawriter'
```

#### Examples
[With Zones](https://github.com/cossacklabs/acra/blob/master/examples/ruby/example_with_zone.rb) and [without Zones](https://github.com/cossacklabs/acra/blob/master/examples/ruby/example.rb).

A real-world example project that protects Ruby on Rails application is available in [Acra example projects](https://github.com/cossacklabs/acra-engineering-demo#example-4-protecting-data-in-a-rails-application).

### Installing AcraWriter for Node.js

> Before building AcraWriter for Node.js, make sure you've installed [Themis as system library]({{< ref "themis/installation/" >}})!

#### Installation
```bash
npm install acrawriter
```
#### Testing
```bash
cd node_modules/acrawriter/
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

{{< hint info >}}
AcraWriter is currently not packaged for PHP.
It is available in source form and requires PHPThemis extension to be installed.
PHP versions 5.6, 7.0–7.2 are supported.
{{< /hint >}}

Please follow [PHPThemis installation instructions]({{< ref "/themis/languages/php/installation.md" >}}).


#### Testing
```bash
php acra/wrappers/php/test.php
```
Output
```
work
```
Now use `acra/wrappers/php/acrawriter.php` in your project. 

#### Examples
[With Zones](https://github.com/cossacklabs/acra/blob/master/examples/php/example_with_zone.php) and [without Zones](https://github.com/cossacklabs/acra/blob/master/examples/php/example.php)

### Installing AcraWriter for Go

> Before building AcraWriter for Go, make sure you've installed [Themis as system library]({{< ref "themis/installation/" >}})!

#### Installation

* Install [GoThemis]({{< ref "/themis/languages/go/installation.md" >}})
* Run `go get github.com/cossacklabs/acra/acra-writer`

#### Testing
```bash
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

Install [ThemisPP (Themis C++ wrapper) as system library]({{< ref "/themis/languages/cpp/installation.md" >}})

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


### Installing AcraWriter for iOS

#### Installation via CocoaPods

Update your Podfile with:

```bash
pod 'acrawriter'
```

AcraWriter for iOS supports bitcode and has Themis (and OpenSSL) as dependencies.

#### iOS examples and tests

Check out the iOS project example using Objective-C in [examples/objc](https://github.com/cossacklabs/acra/tree/master/examples/objc) for generation of an AcraStruct with and without Zones and decrypting them using AcraTranslator via HTTP API.

Check out another iOS project example using Swift in [examples/swift](https://github.com/cossacklabs/acra/tree/master/examples/swift) for generation of an AcraStruct with and without Zones. For decryption please use [Objective-C](https://github.com/cossacklabs/acra/tree/master/examples/objc) example.

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

See Android project example in [examples/android\_java](https://github.com/cossacklabs/acra/tree/master/examples/android_java)
for generating AcraStruct with and without Zones, and decrypting them using AcraTranslator via HTTP API.
