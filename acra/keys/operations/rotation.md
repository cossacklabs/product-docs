---
weight: 3
title: Rotating keys
bookCollapseSection: true
---

# Key rotation

All cryptographic keys should have a definite time span – known as **cryptoperiod** –
during which the key is authorised for usage.
After the cryptoperiod expires, key should be replaced with a new one.
This regularly performed procedure is known as **key rotation**.

Here we discuss how to approach and perform key rotation in Acra.

## When to rotate keys

There are many factors that determine an appropriate duration of the cryptoperiod,
such as threat and risk model, encryption strength and risk of compromise.
We recommend using a cryptoperiod of **1 year** for data storage keys,
which is consistent with current NIST recommendations
([full publication](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/draft),
[short version](https://www.keylength.com/en/4/)).

Key rotation is one of required security operations procedure,
you should rotate all or certain storage keys in these cases:

- if keys are about to expire (when they get near the end of their cryptoperiod);
- if there's a risk that encryption keys, transport protection or data are compromised;
- if there's a known fact that security incident occurred.

If you suspect a security breach that may have leaked the keys,
it is wise to rotate potentially affected keys immediately
and be ready to do it again after the breach has been confirmed and contained.

<!--
Key store version 2 is able to track cryptoperiods of keys.
However, it is not possible to view them at the moment.
This section will be expanded when that's available.
-->

Check [NIST SP 800-57 recommendations](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/draft) to learn more about key management best practices.

## Which keys can be rotated

Acra keeps [a multitude of keys](../../inventory/) which require different approaches.

  - **Transport keys** authenticate component identities and provides transport encryption
    (TLS or Themis Secure Session).
    These keys are easily rotated.

    - TLS: generate new TLS certificate and revoke old one.
      Distribute new TLS certificates and private keys throughout your infrastructure.

    - Themis Secure Session keys:
      generate a new key pair and distribute the public key to appropriate peers.
      The new key will apply on the next connection.

  - **Data storage keys** protect the data stored in a datastore.
    They are rotated by generating a new storage keypair and distributing the public key.

    - If you're using client-side encryption (data is encrypted on application side using AcraWriter),
      distribute public key to all your applications that encrypt data.

    - If you're using transparent proxy mode (data is encrypted on AcraServer or AcraTranslator),
      distribute public key to all instances of AcraServer or AcraTranslator
      or put them into shared keystorage.

    The new key will apply to newly stored data,
    but the old data was encrypted with the previous key and is still unchanged.
    Depending on your key rotation strategy,
    you might need to re-encrypt data with new data storage key.

  - **Acra master keys** protect other keys in the key store.
    Each Acra component has its own set of master keys which can be rotated independently.
    Currently, there's no easy way to rotate Master keys.

<!--
  - AcraBlocks use several keys embedded into them, each can be rotated individually.
    However, this is a new feature and no mechanisms for rotation are in place yet.
    Therefore this item is commented out.

  - There are other keys and it might be a good idea to describe them here.
-->

## Data re-encryption strategies

There're different strategies of re-encrypting data after rotating **data storage keys**:

  - **No re-encryption**.
    Old data is retained as is, encrypted with old keys,
    only new data is encrypted with new keys.
    Acra decrypts old data with old keys and new data with new keys.
    This strategy should not be used if keys were compromised.

  - **Full re-encryption**.
    Old data is decrypted with old keys, then encrypted with new keys and replaced in storage.
    New data is encrypted with new keys.
    Acra decrypts all data with new keys.
    Old keys are unused and can be destroyed and/or marked as compromised.
    This strategy requires [data re-encryption](#re-encrypting-encrypted-data)
    which increases system load.

  - **Partial re-encryption**.
    Re-encrypting data "piece by piece", leaving old keys active for some amount of time.
    This strategy is the best one performance-wise, but requires careful planning.

## How to rotate Acra keys

`acra-keymaker` tool can be used to generate new keys.
After that you will need to distribute the new public keys.
Data storage keys may require additional attention.

Make sure you have set up the correct master key before using `acra-keymaker`.
Please refer to the [key generation instructions](../generation/#master-keys)
to learn about master keys.

### Rotating transport keys

Run `acra-keymaker` to rotate a specific transport key for a client:

```shell
acra-keymaker --client_id=Alice --generate_acraconnector_keys
```

{{< hint info >}}
**Note:**
`acra-keymaker` must be used on the machine that runs the correponding component.
For example, AcraConnector keys must be generated only on the machine that runs AcraConnector.
This ensures that the new private key never leaves the machine that will use it.
{{< /hint >}}

Use the following command-line parameters to rotate specific transport keys.

| Parameter | Key |
| --------- | --- |
| `--generate_acraconnector_keys`  | AcraConnector transport keypair  |
| `--generate_acraserver_keys`     | AcraServer transport keypair     |
| `--generate_acratranslator_keys` | AcraTranslator transport keypair |

Remember to share newly generated public keys with peer components that need them:

  - AcraConnector public key → AcraServer/AcraTranslator
  - AcraServer public key → AcraConnector
  - AcraTranslator public key → AcraConnector

Please refer to the [key exchange guide](../generation/#3-exchanging-public-keys)
to learn where the keys are stored and how to exchange them correctly and securely.
<!-- But in fact I think it should be described right here. This is a how-to after all. -->

### Rotating data storage keys

<!--
There is an `acra-rotate` utility but it is experimental and not ready for production usage.
Data migration is probably too tricky for a general tool that to work for everybody.
However, if would be truly nice if we offered a single command
that needs to be told about the data schema and then takes care of everything by itself,
instead of dumping all this prose that still requires additional work.
-->

Run `acra-keymaker` to rotate the key for a specific client:

```shell
acra-keymaker --client_id=Alice --generate_acrawriter_keys
```

{{< hint info >}}
**Note:**
`acra-keymaker` must be used on the machine that runs AcraServer or AcraTranslator.
This ensures that the new private key never leaves the machine that will use it.
If you're using shared key storage,
provide corresponded parameters to `acra-keymaker` to place the keys into shared storage.
{{< /hint >}}

  - If you're using client-side encryption,
    remember to share newly generated public key with AcraWriters that need it.

  - If you're using AcraServer in transparent proxy encryption mode or using AcraTranslator,
    starting from Acra 0.86.0, Acra uses _"rotation without re-encryption"_ strategy by default.
    If you expect other data re-encryption strategy or you're using older version of Acra,
    you need to [re-encrypt your data](#re-encrypting-encrypted-data).

Please refer to the [key exchange guide](../generation/#3-exchanging-public-keys)
to learn where the keys are stored and how to exchange them correctly and securely.
<!-- But in fact I think it should be described right here. This is a how-to after all. -->

#### Rotating zone keys

If you are using [zones](https://docs.cossacklabs.com/pages/documentation-acra/#zones),
run `acra-addzone` on AcraServer or AcraTranslator to generate a new zone with a new key:

```shell
acra-addzone
```

It will output the new zone ID and the corresponding public key:

```
{"id":"DDDDDDDDQHpbUSOgYTzqCktp","public_key":"VUVDMgAAAC3yMBGsAmK/wBXZkL8iBv/C+7hqoQtSZpYoi4fZYMafkJbWe2dL"}
```

Remember to share newly generated public key and zone ID with AcraWriters that need them.

<!-- There is currently no way to rotate a key for a specific existing zone. -->

## Re-encrypting encrypted data

After you have rotated storage keys,
you may need to re-encrypt existing data with new keys.

### Have a backup!

As always with any database migrations,
it is a good idea to make and check a fresh backup immediately before doing anything.

### Full re-encryption

In order to migrate the data you need to decrypt it with the old key and encrypt it back with the new one.
Acra components will always use the new, current key when encrypting data.
On decryption requests, the old key will be used if necessary to access the data (for Acra 0.86.0 and newer).
The easiest way to re-encrypt the data is to query data through Acra and put it back right away.

#### Using client-side encryption

If you using [AcraConnector and AcraWriter](https://docs.cossacklabs.com/pages/documentation-acra/#acraconnector-and-acrawriter):

1. Make sure that you have the new public key for AcraWriter.
   This key will be used to encrypt the data.
2. Connect to the database via AcraConnector.
   It still keeps the old key and knows how to decrypt the data.
3. Run a migration script to fetch plaintext (decrypted) data via AcraConnector,
   encrypt it with AcraWriter, and store the updated data back.

The script may look like this if you are using Python:

```python
import acrawriter

rows = db.query('SELECT id, column1, column2 FROM table')
for row in rows:
    column1 = acrawriter.create_acrastruct(
        data=row['column1'],
        acra_public_key=new_public_key)
    column2 = acrawriter.create_acrastruct(
        data=row['column2'],
        acra_public_key=new_public_key)
    db.execute(
        'UPDATE table SET column1 = $1, column2 = $2 WHERE id = $3',
        column1, column2, row['id'])
```

Remember that Acra does not encrypt all columns in the database.
Only binary blobs can be encrypted (`bytea` type)
so you need to select and update only the encrypted columns.

#### Using AcraServer in transparent proxy encryption mode

{{< hint info >}}
**Note:**
This will work for Acra 0.86.0 and newer.
{{< /hint >}}

If you are using AcraServer in transparent proxy mode:

1. Rotate the storage keys on AcraServer. It will keep the old keys.
2. Query data from the storage through AcraServer for decryption. It will use old key to decrypt data.
3. Push data back to the database through AcraServer. It will use new key to encrypt data.

#### Using AcraTranslator

{{< hint info >}}
**Note:**
This will work for Acra 0.86.0 and newer.
{{< /hint >}}

If you are using [AcraTranslator](https://docs.cossacklabs.com/pages/acratranslator/),
the idea is the same:

1. Rotate the storage keys on AcraTranslator. It will keep the old keys.
2. Query data from the storage, submit it to AcraTranslator for decryption.
3. Encrypt the data with AcraTranslator again and put it back into the storage.

#### Migrating zoned data

If you are using [zones](https://docs.cossacklabs.com/pages/documentation-acra/#client-side-with-zones),
the queries will be more complicated to include the zone ID for decryption.
AcraWriter also needs the new zone ID for encryption.
For example, if the zone ID is stored in the same table,
the Python script may look like this:

```python
rows = db.query('SELECT id, zone_id, column1, zone_id, column2 FROM table')
for row in rows:
    column1 = acrawriter.create_acrastruct(
        data=row['column1'],
        acra_public_key=new_public_key,
        context=new_zone_ID)
    column2 = acrawriter.create_acrastruct(
        data=row['column2'],
        acra_public_key=new_public_key,
        context=new_zone_ID)
    db.execute(
        'UPDATE table \
         SET column1 = $1, column2 = $2, zone_id = $3 \
         WHERE id = $4',
        column1, column2, new_zone_ID, row['id'])
```

The old zone ID is queried before the encrypted column for AcraConnector.
AcraWriter needs to be configured to use the new zone ID and public key
received from `acra-addzone` utility.
The new zone ID is also written into the database along with updated data.

If you are using zones with AcraTranslator,
remember to [submit zone ID](https://docs.cossacklabs.com/pages/acratranslator/)
with each request as required by the API you use.

### Partial re-encryption

You need to update each and every table and row encrypted with the old key,
which there may be many.
You may want to proceed with migration incrementally,
processing only some part of the data set at a time.
Be sure to keep track of the data you have already migrated to avoid duplicating the work.

Each client and zone have their own storage key pair which can be rotated independently.
This allows to spread out in time planned rotations,
or may limit the effort in case the keys need to be rotated after a suspected security breach.

### Verify encrypted data

After you have completed full or partial data re-encryption,
it is advisable to check that it was successful.
Try quering the migrated data to confirm that AcraServer or AcraTranslator are able to decrypt it.

<!--

### Rotating other keys

There are some other keys which are not covered here:

  - master keys
  - AcraWebconfig keys
  - poison record keys (do we need to rotate them at all?)
  - various Acra EE keys:
    - search token keys
    - audit log keys

## Examples

It would be nice to provide a complete example playground that demonstrates rotation.

-->
