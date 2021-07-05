---
weight: 3
title: Certificate generation with OpenSSL
bookCollapseSection: true
---

# Certificate generation with OpenSSL

Here you will see few tips about how certificates can be generated using `openssl` CLI tool.

{{< hint warning >}}
This is more like a collection of tips.
In real world you have to make sure you keep private keys safe.
Make sure the certificate extensions are properly configured.
Make sure apps that use these certificates are properly configured.
A lot of things require attention in order to work as expected and remain secure.
{{< /hint >}}

Since there are some parameters we cannot configure with CLI flags, we need to create own configuration file.
Here it is, simple `openssl.cnf`, without intermediate CAs:
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

## Create self-signed CA certificate

```
openssl req \
    -x509 -sha256 -nodes -days 365 -newkey rsa:4096 \
    -keyout ca.key.pem \
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
                    ### some lines skipped ###
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
         ### some lines skipped ###
         f4:71:d2:7d:2c:6e:ae:01:5b:8c:2f:f8:70:a5:c5:b6:55:2e:
         e9:00:62:5f:89:c3:0d:00
```

## Generate RSA key for a certificate

```
openssl genrsa -out cert1.key.pem 2048
```

## Create Certificate Signing Request

```
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
* `cert1.key.pem` is a key corresponsing to `cert1.crt.pem`, can be used for `-tls_key`
