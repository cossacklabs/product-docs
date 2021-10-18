---
title: Encryption
bookCollapseSection: true
---

# Encryption as a security control

Acra prevents adversaries with access to database from seeing sensitive plaintexts, if it has been configured so.
Acra does that by encrypting the sensitive data selectively and keeping the keys to itself. In this, Acra acts as security boundary in front of sensitive data.

## Encryption

* AcraServer transparent: If AcraServer has been set up in transparent mode, encryption happens on AcraServer during insert/update queries.
* AcraTranslator: Encryption happens via request to AcraTranslator API.
* SDK (AcraWriter): It is possible to generate AcraStructs using AcraWriter library with appropriate public keys.

This page also describes how to configure it in AcraServer and what you will get as a result.

## Decryption

Decryption always happens on AcraServer / AcraTranslator, as it is the only entity to hold the keys and metadata.

## Interoperability 

Records encrypted by AcraTranslator can be decrypted by AcraServer and vice versa. Records encrypted by AcraWriter can by decrypted by both as well. 

## AcraServer behavior

AcraServer works as a proxy between database client and the database itself.
When a column is configured to be encrypted, AcraServer will transparently encrypt its value.
You can also encrypt the data manually on the client side using
[AcraWriter]({{< ref "acra/configuring-maintaining/installing/building-acrawriter/_index.md" >}}).
Decryption on the other hand is done automagically: Acra will detect encrypted data and will attempt
to decrypt it with all known keys.

However, there are some caveats:
* In simplest scenario, AcraServer clients won't see any difference: they `INSERT` plaintext,
  they get plaintext in `SELECT` queries, just like with direct connection to database.
  At the same time, the data in the database itself will be stored in encrypted form.
  And if the attacker has full access to the database (but not to the AcraServer),
  he won't be able to magically bypass the encryption, no keys means no data.
* Every AcraServer client has own unique identifier (usually derived during TLS or Secure Session handshake),
  and keys associated with that identifier.
  If the keystore does not contain keys that were used to encrypt requested data,
  the data will be returned "as is", just like it is stored in database in encrypted form.
* Apart from client IDs, encryption keys can be bound to [zones]({{< ref "/acra/security-controls/zones/_index.md" >}}),
  in this case clients should set proper zone ID in requests or AcraServer will be unable
  to decrypt data because of the same reason as with client ID, no proper keys.
  Alternatively, zone ID can be stored in database as a separate column.
* When [masking]({{< ref "/acra/security-controls/masking/_index.md" >}}) is enabled,
  part of data won't be encrypted (depending on configuration) and
  the response will be different depending on whether the client has proper keys as well.
* When [tokenization]({{< ref "/acra/security-controls/tokenization/_index.md" >}}) is enabled,
  returned values will be anonymized, they will be different from the actual plaintext.

You don't have to run a single AcraServer instance and give it all the keys.
Many instances can be launched, each responsible for different tables and/or clients and/or zones.

For example, you can have few clusters, each responsible for
protection of different data based on its confidentiality level:
* Few Acra servers that process common requests like "find user by email" or "get his/her name"
* Dedicated Acra servers for specific geographic regions, with different keys used to
  encrypt user activity based on his/her location at that monent

When combined with proper network settings, you can end up with a complex system
where each component can only access data it was created to work with.
And when combined with other features like
[SQL firewall]({{< ref "/acra/security-controls/sql-firewall/_index.md" >}}) and/or
[audit logging](/acra/audit-log-INVALID),
it will be impossible for somebody to perform malicious activity without being noticed.

## AcraServer configuration

Although AcraServer can work without knowing database schema,
if you want to use features like transparent encryption, masking or tokenization,
you will have to tell AcraServer that schema.
Which tables exist, which columns (name/type) are in these tables.
Then, you choose which columns should be encrypted and use different configuration options to tune the behavior.
A simple example of the configuration file may look like this:

<!-- Config struct lives in encryptor/config/encryptionSettings.go -->
```yaml
schemas:
  - table: users
    # Here we specify names of all columns this table contains
    columns:
      - id
      - email
      - address

    # This array should contain list of all columns you want to encrypt
    encrypted:
      - column: address
```

Here we have one table called `users` with three columns: `id`, `email`, `address`.
More tables can be added to `schemas` array as well.

More complete example with non-required options may look like this:
```yaml
defaults:
  # By default, if `crypto_envelope` is not set in column encryption settings,
  # AcraStruct will be used, but here we switch to the alternative, AcraBlock
  crypto_envelope: acrablock

schemas:
  - table: users
    columns:
      - id
      - name
      - email
      - address
      - zone_id

    encrypted:
      - column: name

        # Enable masking, do not encrypt first byte, show
        # unauthenticated users "*" in place of encrypted data they cannot access
        masking: "*"
        plaintext_length: 1
        plaintext_side: "left"

      - column: email

        # Make it possible to find user knowing his email
        searchable: true

      - column: address

        # Invert behavior of "acrablock by default"
        # set in the beginning of the file
        crypto_envelope: "acrastruct"

      - column: zone_id

        # This is a special column that affects which keys will be used when
        # AcraServer performs crypto operations with other encrypted columns
        zone_id: DDDDDDDDMatNOMYjqVOuhACC
```

Some of the flags in the second example are part of a speific feature
rather than encryption configuration, you can read more about them on their pages:
* [Masking]({{< ref "/acra/security-controls/masking/_index.md" >}}) —
  partial column encryption, with configurable placeholder for unauthenticated reads
* [Searchable encryption]({{< ref "/acra/security-controls/searchable-encryption/_index.md" >}}) —
  allows efficient search when you know exact value (plaintext) inside encrypted column
* [Tokenization]({{< ref "/acra/security-controls/tokenization/_index.md" >}}) —
  when you want to anonymize data returned to clients
* [Zones]({{< ref "/acra/security-controls/zones/_index.md" >}}) —
  one of the approaches to make Acra use different encryption keys for different data,
  depending on zone ID specified in the request or stored in column
