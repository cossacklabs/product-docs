---
title: PKI overview for Acra
weight: 3
---

# Acra, PKI / CA and secure deployment

We strongly recommend following the best security practices while deployment and using the public key infrastructure (PKI) to provide transport data encryption and authentication between Acra's components. This page contains some useful information about the PKI and links to related resources.

The central component of any PKI is the Certificate Authority (CA). The CA acts as an arbitrator or a third party, whilst the trust relations are established between the two other sides (client and server) that initially do not trust each other. CA holds a cryptographic key (marked green) used for digitally signing certificates (blue and purple envelopes signed by green key of CA) for both client and server. Mutual authentication between client and server can be established by verification of digital signature presented in the certificate if they both trust to cryptographic key of Certificate Authority.

![](/files/wiki/pki-acra-secure-deployment.png)

CA can have various implementations starting from primitive set of scripts (manually used by DevSecOps person) like [easy-rsa](https://github.com/OpenVPN/easy-rsa) and ending with automated toolkits like [CFSSL](https://github.com/cloudflare/cfssl).
Various organizations depending on their size, operations and internal processes have different policies and requirements to own PKI. In simplest scenario TLS is enabled for each service within infrastructure. To achieve this DevSecOps employee can act as a CA
and manually generate and deploy all TLS cryptographic keys and correspondent certificates for each service (and enable TLS on each service) via [easy-rsa](https://github.com/OpenVPN/easy-rsa) scripts. Even in this simple scenario infrastructure gains significant security boost, since all communications between services are now encrypted and mutually authenticated.
However, various security concerns are still presented. For example, if one of services within infrastructure has become compromised, how to exclude it from communications? The answer is enabling usage of advanced [CRL](https://en.wikipedia.org/wiki/Certificate_revocation_list) / [OCSP](https://en.wikipedia.org/wiki/Online_Certificate_Status_Protocol) validations within PKI.
In two words, each service while establishing TLS handshake can additionally check if certificate of remote party is not revoked and to break communication if this is a case. Another security concern is that TLS certificates should be rotated periodically to prevent possibility of theoretical attacks, when man-in-the-middle adversary passively collects information about encrypted TLS communications between services.
There are other non-security concerns (requirement to automate process of issuing certificates or hardware-enforcing security of CA's cryptographic key) that caused creation of [more complex scenarios](https://github.com/storojs72/cfssl-experiments) and solutions of PKI usage.

Acra doesn't include actual PKI / CA components in its toolkit because, as it was mentioned, various organizations have different policies and requirements in this regard, but all Acra services support [TLS](/acra/configuring-maintaining/tls/) communications via pre-generated certificates and [CRL](/acra/configuring-maintaining/tls/crl/) / [OCSP](/acra/configuring-maintaining/tls/ocsp/) as well.
It allows building a complex security solution for your infrastructure which includes integration of PKI with Acra services for providing enhanced security.

You can see that security of CA (its cryptographic key) is critical for overall security of your infrastructure. Compromising CA means that adversary obtains possibility to generate fake certificates which would be accepted by other services. Similar is true for AcraServer / AcraTranslator, since those Acra services contain set of cryptographic keys used for protecting data inside your database. For this reason, we recommend treating AcraServer / AcraTranslator security importance similar to CA's one. Considering that Acra services possess cryptographic keys to the data of your database, Acra should be deployed using following best security practices while delivering those keys to the target components (in [Docker containers](/acra/getting-started/installing/launching-acra-from-docker-images/)).

They are provided below:

- **Environment variables** — classic and reasonably secure way that is simple, flexible, and can be implemented with system tools. The main known risks of this method are: the possibility to bleed into logs if the deployment was untidy and the possible granting of access to the non-target apps in case of insufficiently fine-tunes access rights differentiation.

- **Files** — many technologies of secrets’ deployment  use the transfer of secrets in the file format to the app - both for infrastructure management systems and container orchestration systems. This method is usually implemented through a regular creation of files containing secrets (at the moment deployment or by daemons of the key distribution systems), or through mounting from the host system inside a container or virtual file system mounting (Swarm, Kubernetes). The pros and cons and the same as in the variant with the environment variables, with some specifics depending on the exact implementation.

- **URI / REST API** — another rather common way based on cloud services like AWS, Azure, DO, etc. The main disadvantage of this approach is its price. Cloud KMS also often use REST API to delivery secrets.

- **KMS** — usually implemented using the supplied libraries of KMS providers. They are offered by AWS, Azure, etc., to enable the work with their KMS clouds. The standard de-facto approach here is HashiCorp Vault integrated with numerous applications.

Acra supports several ways of delivering keys – direct connection to KMS (HashiCorp Vault), delivery via environment variables.
