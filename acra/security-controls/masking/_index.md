---
title: Masking
weight: 3
---

# Masking

Masking is a partial column encryption. Masking hides encrypted part from client apps which don't have right decryption keys.
In case of decryption failure, encrypted data will be replaced with a placeholder.

Use cases may include:

* Credit card numbers (reveal only last N digits)
* Mobile phone (again, reveal only last N digits, i.e. for recovery purposes)
* First/last name (mask everything except 1-3 first characters)

Masking is "kinda anonymisation". It's helpful when the dataset should be shared with untrusted third parties.

Under the hood, AcraServer/AcraTranslator encrypts the data completely, and concatenates a piece of plaintext (defined by `plaintext_length` variable, see below). So the data itself is stored encrypted into AcraStruct/AcraBlock with a tiny chunk of plaintext data.

AcraServer is the only component that provides transparent masking for `INSERT` and `UPDATE` queries and
transparent demasking for `SELECT` queries, with per column configuration.

## AcraServer configuration

In configuration file, passed by `--encryptor_config_file` flag, you can individually configure
masking for any field of any table, if that field can be encrypted.
These options are accepted:

<!-- Config struct lives in encryptor/config/encryptionSettings.go -->
<!-- Config validation func lives in masking/common/patterns.go -->
```yaml
schemas:
  - table: table_name
    encrypted:
      - column: masked_column_name

        # (required, must be non-empty)
        # Replacement string to use for masking out encrypted data.
        # If decryption fails, this string will be show instead of the masked
        # portion of the data.
        masking: "XXXXXXXXXXXX"

        # (required, must be non-negative)
        # How many bytes of plaintext to leave unencrypted.
        plaintext_length: 4

        # (required, allowed values: "left", "right")
        # Which side of the plaintext to leave unencrypted.
        # "plaintext_length" bytes will be retained from left or right side of
        # the data cell.
        plaintext_side: "right"

        # (optional, default: "acrastruct",
        # allowed values: "acrastruct", "acrablock")
        # Which cryptographic container to use for data encryption.
        crypto_envelope: "acrastruct"

        # (optional, default: false)
        # If true, data stored in AcraStructs will be transparently re-encrypted
        # into AcraBlocks.
        reencrypting_to_acrablocks: false
```
<!-- TODO add link to page where column encryption settings are described in general, with client_id, zone_id etc -->

## Examples

Here are few examples of configuration and results it would give.
The actual encrypted part of data will look differently in a database, and will take more bytes.
Examples below only illustrate which part of plaintext would be encrypted.

### Retain first five characters

```yaml
  masking: "*",
  plaintext_length: 5,
  plaintext_side: "left"
```

| Viewpoint                  | Visible data            |
| -------------------------- | :---------------------- |
| database, encrypted        | `Alan PGVuY3J5cHRlZD4=` |
| authorized user, decrypted | `Alan Turing`           |
| unauthorized used, masked  | `Alan *`                |

### Retain last four characters

```yaml
  masking: "XXXX XXXX XXXX ",
  plaintext_length: 4,
  plaintext_side: "right"
```

| Viewpoint                  | Visible data            |
| -------------------------- | :---------------------- |
| database, encrypted        | `PGVuY3J5cHRlZD4=3456`  |
| authorized user, decrypted | `1234 5678 9012 3456`   |
| unauthorized used, masked  | `XXXX XXXX XXXX 3456`   |

### Completely hide content

```yaml
  masking: "???",
  plaintext_length: 0,
  plaintext_side: "left"
```

| Viewpoint                  | Visible data       |
| -------------------------- | :----------------- |
| database, encrypted        | `PGVuY3J5cHRlZD4=` |
| authorized user, decrypted | `Nikola Tesla`     |
| unauthorized used, masked  | `???`              |

<!-- More examples of configuration can be found among test configs, <acra>/tests/*masking*.yml -->
