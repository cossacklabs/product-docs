---
title: TLS configuration
weight: 5
---

# TLS configuration

There are some performance differences depending on TLS configuration being used:

## Ciphers

In most cases AES will be the fastest cipher because of hardware acceleration in all modern CPUs.
Smaller (128 bit) keys will result in lower CPU load compared to larger (256 bit) keys, altough, difference is not that big.
On systems without hardware AES acceleration, ChaCha will show much better results.
It is recommended to simply allow both of these ciphers on servers and let clients decide which one to use.
Most recent version of TLS (which is 1.3) offers only these two by the way.

## Key agreement

When deciding which key agreement scheme to use, elliptic curve based one is recommended.
Compared to RSA, it has smaller keys (less data to transmit during handshake), better performance, and at least the same level of security.
The key used during certificate generation and in server configuration should be EC one as well.

## Certificate revocation checks

You may decide to use [OCSP](https://en.wikipedia.org/wiki/Online_Certificate_Status_Protocol)
and/or [CRL](https://en.wikipedia.org/wiki/Certificate_revocation_list) to increase security of your system.
The drawback of using these things is increased TLS handshake time:

* for every OCSP request, additional network request will be performed (plain HTTP over TCP)
* for every CRL, CRL file will be downloaded (again, HTTP)

Even though CRLs can be cached, at the time when cached item expired, it will be downloaded again, resulting in longer TLS handshake.

If OCSP/CRL validations are a bottleneck in performance, you can try to make them faster by:
- providing OCSP/CRL servers in different locations close to clients;
- making sure they are powerful enough to process big amount of requests
