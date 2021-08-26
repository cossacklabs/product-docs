---
title: Masking
bookCollapseSection: true
---

# Masking

Partial column encryption.
Hides encrypted part from those who don't have right decryption keys.
In case of decryption failure, encrypted data will be replaced with a placeholder.

## AcraServer configuration

In configuration file, passed by `--encryptor_config_file` flag, you can individually configure
masking for any field of any table, if that field can be encrypted.
These options are accepted:

<!-- Config struct lives in encryptor/config/encryptionSettings.go -->
* `masking` — text string that will be shown in unsuccessful decryption responses instead of encrypted data
* `plaintext_length` — how many bytes should be left unencrypted
* `plaintext_side` — which side of column should contain unencrypted part of value
  * `left`
  * `right`
* `crypto_envelope` — which crypto container to use
  * [`acrastruct`]({{< ref "acra/acra-in-depth/data-structures/_index.md#acrastruct" >}}) (default)
  * [`acrablock`]({{< ref "acra/acra-in-depth/data-structures/_index.md#acrablock" >}})
* `reencrypting_to_acrablocks` — whether to automatically re-encrypt values stored
  in [AcraStructs]({{< ref "acra/acra-in-depth/data-structures/_index.md#acrastruct" >}})
  to [AcraBlocks]({{< ref "acra/acra-in-depth/data-structures/_index.md#acrablock" >}})
<!-- TODO add link to page where colemn encryption settings are described in general, with client_id, zone_id etc -->

<!-- Config validation func lives in masking/common/patterns.go -->
In order to enable masking you will need:
* non-empty value for `masking`
* `plaintext_length` ⩾ 0
* valid value for `plaintext_side` (`left` or `right`)

## Examples

Here are few examples of configuration and results it would give

`{ masking: "*", plaintext_length: 5, plaintext_side: "left" }`
* data, successful decryption: `Alan Turing`
* encrypted: `Alan <encrypted>`
* unsuccessful decryption: `Alan *`

`{ masking: "XXXX", plaintext_length: 4, plaintext_side: "right" }`
* data, successful decryption: `Blaise Pascal`
* encrypted: `<encrypted>scal`
* unsuccessful decryption: `XXXXscal`

`{ masking: "???", plaintext_length: 0, plaintext_side: "left" }`
* data, successful decryption: `Nikola Tesla`
* encrypted: `<encrypted>`
* unsuccessful decryption: `???`

<!-- More examples of configuration can be found among test configs, <acra>/tests/*masking*.yml -->
