---
title: AcraTranslator
bookCollapseSection: true
weight: 2
---

# AcraTranslator

## Command line flags

(excluding TLS-related flags that are listed [here](/acra/configuring-maintaining/tls))

TODO

## Keys

There are few different kinds of keys for different purposes.
When generating them, few things should be kept in mind:
* `ACRA_MASTER_KEY` should be set containing master key of same keystore version
* Output directory should have no permissions for group and others

`client1` in examples is the identifier of client that can be either sent in
RPC requests or derived from the client TLS certificate depending on configuration.

### Storage keys

Required for encrypt/decrypt requests.

```
acra-keymaker \
    --keystore=v2 \
    --client_id=client1 \
    --generate_acrawriter_key \
    --keys_output_dir=/tmp/translator_keys
```

### HMAC keys

Required for hashing requests, as well as searchable encryption/decryption.

```
acra-keymaker \
    --keystore=v2 \
    --client_id=client1 \
    --generate_hmac_key \
    --keys_output_dir=/tmp/translator_keys
```

### Symmetric storage keys

Required for tokenization/detokenization requests.

```
acra-keymaker \
    --keystore=v2 \
    --client_id=client1 \
    --generate_symmetric_storage_key \
    --keys_output_dir=/tmp/translator_keys
```

TODO: mention key generated with `--generate_acratranslator_keys` flag
