---
weight: 2
title: Troubleshooting installation
---

# Troubleshooting installation


## Troubleshooting installation on Ubuntu

### Expired Let's Encrypt root certificate

If you see errors like "Certificate verification failed" or "gpg: no valid OpenPGP data found" when [installing Themis Core](/themis/installation/installation-from-packages/) on Ubuntu, make sure that OS uses the latest [Let's Encrypt root certificate](https://letsencrypt.org/docs/dst-root-ca-x3-expiration-september-2021/).

```bash
$ sed -i 's|mozilla/DST_Root_CA_X3.crt|!mozilla/DST_Root_CA_X3.crt|' /etc/ca-certificates.conf
$ update-ca-certificates
```
 