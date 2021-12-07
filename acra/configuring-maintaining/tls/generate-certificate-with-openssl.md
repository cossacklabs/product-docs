---
weight: 1
title: Certificate generation with OpenSSL
---

# Certificate generation with OpenSSL

Here you will see few tips about how certificates can be generated using `openssl` CLI tool.

{{< hint warning >}}
This is more like a collection of tips, and it doesn't pretend to be exhaustive.
In production settings, make sure at least that: your private keys are kept safe; certificate extensions are properly configured;
apps that use these certificates are properly configured. A lot of things require attention in order to work as expected and remain secure.
{{< /hint >}}

Since there are some parameters we cannot configure with CLI flags, we need to create own configuration file.
This is an example of simple `openssl.cnf` configuration file without intermediate CAs:
```
# This section is required by OpenSSL, but we specify DN on the command line,
# so here an empty placeholder is used.
[ req ]
distinguished_name = req_dn

[ req_dn ]

# X.509 v3 extensions for issued certificates
[ v3_req ]
basicConstraints = CA:false
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = DNS:localhost

# X.509 v3 extensions for CA certificate
[ v3_ca ]
basicConstraints = critical,CA:true
subjectAltName = DNS:localhost
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid:always,issuer

[ ca ]
default_ca = CA_default

[ CA_default ]
dir = .
database = $dir/index.txt
serial = $dir/serial

certificate = $dir/ca.crt.pem
private_key = $dir/ca.key.pem

default_md = sha256
default_crl_days = 30
policy = policy_anything

[ policy_anything ]
countryName             = optional
stateOrProvinceName     = optional
localityName            = optional
organizationName        = optional
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = optional
```

## Generate RSA private key

```
openssl genrsa -out private_rsa.key.pem 4096
```
Here `4096` is the key size in bits, other popular choices are `2048` and `3072`.
It is not recommended using less that 2048 bits due to low security margin of such keys.

## Generate EC private key

```
openssl ecparam -name prime256v1 -genkey -noout -out private_ec.key.pem
```
<!-- # Convert the key to PKCS8 format, not required when using with certificates -->
<!-- openssl pkcs8 -topk8 -nocrypt -in private_ec.key.pem -out private_ec_pkcs8.key.pem -->
Here `prime256v1` is the name of ECC curve to use.
Its name also tells about key size in bits (256 here).
Run `openssl ecparam -list_curves` if you need list of all supported curves.

## Create self-signed CA certificate

Here you can use either RSA or EC key for `-key` flag.
EC key is recommended since RSA is kinda outdated nowadays, it has bigger keys while also works slower.
```
openssl req \
    -x509 -sha256 -nodes -days 365 \
    -key ca.key.pem \
    -out ca.crt.pem \
    -subj '/C=GB/ST=London/L=London/O=Global Security/OU=IT/CN=Test CA'

# Create certificate database, will be needed when signing CSRs
touch index.txt
```

## Show generated certificate in readable format

```
openssl x509 -noout -text -in ca.crt.pem
```
Example output:
```
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            64:28:80:32:72:4e:a6:5a:cc:31:bb:00:e5:bc:31:48:62:b1:e9:1f
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: C = GB, ST = London, L = London, O = Global Security, OU = IT, CN = Test CA
        Validity
            Not Before: Jul  5 07:37:16 2021 GMT
            Not After : Jul  5 07:37:16 2022 GMT
        Subject: C = GB, ST = London, L = London, O = Global Security, OU = IT, CN = Test CA
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (4096 bit)
                Modulus:
                    00:98:86:b9:17:5e:d2:80:64:68:83:4a:51:fd:c1:
                    ### many lines skipped ###
                    38:73:71:ad:64:5f:76:74:17:41:0d:5e:bf:e3:5a:
                    a6:64:b1
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Subject Key Identifier:
                80:17:42:A5:C4:C5:B5:5E:14:82:7D:72:74:25:0A:AB:C8:9F:E3:2E
            X509v3 Authority Key Identifier:
                keyid:80:17:42:A5:C4:C5:B5:5E:14:82:7D:72:74:25:0A:AB:C8:9F:E3:2E

            X509v3 Basic Constraints: critical
                CA:TRUE
    Signature Algorithm: sha256WithRSAEncryption
         8e:77:bf:da:4b:74:8c:c8:23:a2:a8:5b:9c:88:1b:58:90:96:
         ### many lines skipped ###
         f4:71:d2:7d:2c:6e:ae:01:5b:8c:2f:f8:70:a5:c5:b6:55:2e:
         e9:00:62:5f:89:c3:0d:00
```
while using EC key would produce key description like this:
```
        Signature Algorithm: ecdsa-with-SHA256

        Subject Public Key Info:
            Public Key Algorithm: id-ecPublicKey
                Public-Key: (256 bit)
                pub:
                    04:78:8d:0a:6a:b3:24:8e:fc:ca:5c:3b:b3:00:d6:
                    11:7c:51:d8:21:e4:83:29:5c:a9:75:71:96:a2:c9:
                    00:ac:7d:31:d6:41:67:26:1c:1a:54:af:43:a3:39:
                    0c:e4:a2:6a:bd:53:a3:6b:ae:60:8b:0e:6f:6b:7e:
                    93:09:1a:8d:8e
                ASN1 OID: prime256v1
                NIST CURVE: P-256

    Signature Algorithm: ecdsa-with-SHA256
         30:46:02:21:00:bc:a7:36:3a:cb:86:aa:cf:bd:92:5d:e5:9c:
         0b:98:5b:b1:53:d5:37:42:0f:e9:7f:32:2b:f7:c7:87:18:bf:
         fc:02:21:00:b4:b3:44:52:32:25:4d:cf:52:c7:e2:f5:cc:6b:
         75:49:6a:16:6b:90:82:a3:e1:13:88:05:a9:0c:d9:9f:59:8d
```

## Create client's private key

RSA private key:

```
openssl genrsa -out cert1.key.pem 4096
```

EC private key:

```
openssl ecparam -name prime256v1 -genkey -noout -out cert1.key.pem
```

## Create Certificate Signing Request

```
# First, you need a private key called cert1.key.pem,
# use one of command above to generate it

openssl req -new \
    -key cert1.key.pem \
    -out cert1.csr.pem \
    -subj '/C=GB/ST=London/L=London/O=Global Security/OU=IT/CN=Test certificate 1'
```

## Sign Certificate Signing Request

```
openssl ca \
    -config openssl.cnf \
    -in cert1.csr.pem \
    -out cert1.crt.pem \
    -extensions v3_req \
    -batch \
    -outdir /tmp \
    -rand_serial \
    -notext \
    -days 365

# See signed certificate being added to database
cat index.txt
```
Example content of `index.txt`:
```
V       220705074134Z           334E651762E338DB251AE2B5E8CF0150D5C8A824        unknown /C=GB/ST=London/L=London/O=Global Security/OU=IT/CN=Test certificate 1
```

What now?

* `ca.crt.pem` is a CA certificate, can be used for options like `-tls_ca`
* `cert1.crt.pem` is a leaf certificate signed by CA itself, can be used for `-tls_cert`
* `cert1.key.pem` is a key corresponding to `cert1.crt.pem`, can be used for `-tls_key`

## Other useful tools

If you think using `openssl` may be complex, you're not wrong.
There is a couple of tools that make life easier when it comes to certificate generation and all this PKI related work.

Two of them are [easy-rsa](https://github.com/OpenVPN/easy-rsa) and [certstrap](https://github.com/square/certstrap).
