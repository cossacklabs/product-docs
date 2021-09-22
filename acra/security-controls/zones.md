---
title: Zones
bookCollapseSection: true
---

# Zones

Zones are a way to cryptographically compartmentalise access to data.

By default, access to encrypted data is compartmentalized by transport authentication.
Applications connected to AcraServer or AcraTranslator through SecureSession or TLS will get access only to the data associated with the ClientID of their transport keys.
This mode is called *zoneless*.
You can think of it as all data implicitly belonging to a single ClientID zone.

In *zone mode* applications can explicitly specify a different ZoneID in their SQL queries (through AcraServer) or requests (to AcraTranslator) to access encrypted data related to this zone.
Application will need to know the correct ZoneID as well as which data records are encrypted with keys associated with this ZoneID.

## What are the Zone and ZoneID

**Zone** is a pair of ZoneID and related symmetric (for AcraBlocks) and asymmetric keys (AcraStructs) used to encrypt data.

**ZoneID** is a random identifier for the keys. It is constructed of a ZoneID header `DDDDDDDD` and 16 random ASCII letters, for example `DDDDDDDDjKjECtcRBDkmHVBh`.

## How to encrypt data using zones

There are two ways to encrypt data with zones: using static or dynamic ZoneID.

In any case, a zone must be created first with [`acra-addzone` tool]({{< ref "/acra/configuring-maintaining/general-configuration/acra-addzone.md" >}}) or [AcraServer's HTTP API]({{< ref "/acra/configuring-maintaining/general-configuration/acra-server.md#http-api" >}}).
Newly generated keys will be placed into AcraServer or AcraTranslator keystore so that they are able to decrypt the encrypted data.
You will also get the ZoneID and the public key you will need to encryption.

### Static ZoneID

AcraServer in [Transparent encryption mode]({{< ref "/acra/configuring-maintaining/general-configuration/acra-server.md#transparent-encryption-mode-INVALID" >}})
can be configured to use a static ZoneID for encryption.

You can specify which table columns should be encrypted and what Zone that should be used.
Application doesn't need to encrypt the data, know the appropriate ZoneID, or store the zone public key.
AcraServer will transparently encrypt and decrypt data according to its configuration.

{{< hint info >}}
**Note:**
If you need to change the configuration, AcraServer must be restarted to apply the new settings.
{{< /hint >}}

### Dynamic ZoneID

AcraServer and AcraTranslator support dynamic ZoneID specified on per-request basis.

With AcraServer, you must supply your application with ZoneID and generated public key. AcraWriter is used to encrypt data in zone mode which is then stored as usual in the database. Only AcraServer will be able to decrypt the data back.

With AcraTranslator, zone keys are stored on AcraTranslator and you supply your application with ZoneID. Requests to AcraTranslator to encrypt must include the appropriate ZoneID for it to locate the associated keys.

## How to decrypt data using zones

### Decrypt with AcraTranslator

AcraTranslator supports decryption of zoned data via HTTP or gRPC API.
Just send it the encrypted data along with the associated ZoneID in request and you get decrypted data in response.

The application has to know only the correct ZoneID.
Decryption keys are stored on the AcraTranslator which looks them up by the provided ZoneID.

### Decrypt with AcraServer

AcraServer supports decryption of zoned data in SQL query responses.
You need to send appropriate ZoneID along with the query, encrypted data stored in the database will be decrypted and forwarded to the application in response.

The application has to know only the correct ZoneID.
Decryption keys are stored on the AcraServer which looks them up by the provided ZoneID.

Since the application does not communicate with the AcraServer directly, the SQL query must specify the ZoneID to use in some way, either in the query itself on in the resulting response.
Several options are supported:
* ZoneID can be stored in the database and queried together with encrypted data.
* ZoneID can be specified explicitly in SQL queries as a binary literal.

#### Method 1 – ZoneID stored in the database

One option is to store the ZoneID along with encrypted data directly in the database,
then you query both of them for decryption.
This way it's easy to ensure that correct ZoneID is associated with the data but the association itself is naturally disclosed in the database.

Here's an example of database schema for PostgreSQL:
```sql
CREATE TABLE application_data (
 id SERIAL PRIMARY KEY,
 zone_id BYTEA,
 data BYTEA
);
INSERT INTO application_data (zone_id, data) 
VALUES (
        'DDDDDDDDjKjECtcRBDkmHVBh'::BYTEA, 
        '\x2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103'::BYTEA
        );
```
If you use MySQL, data schema might look like this:
```sql
CREATE TABLE application_data (
 id INTEGER PRIMARY KEY AUTO_INCREMENT,
 zone_id BLOB,
 data BLOB
);
INSERT INTO application_data (zone_id, data) 
VALUES (
        'DDDDDDDDjKjECtcRBDkmHVBh', 
        X'2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103'
        );
```
Here we create a table where ZoneID is stored in `zone_id` column preceding the `data` column with encrypted data.
The columns in the database may have a different order, but `SELECT` queries must have ZoneID column before the encrypted data.
For example, if you make the following query:
```sql
SELECT id, zone_id, data FROM application_data
```

the response for Postgresql will be like this:
```
1 \x44444444444444446a4b6a454374635242446b6d48564268 
\x2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103 
```

for MySQL:
```
1 0x44444444444444446A4B6A454374635242446B6D48564268 
0x2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103 
```

AcraServer processes database response row by row, column by column, matching them for ZoneIDs and AcraStruct or AcraBlock signatures.

1. Try matching `1`. This does not look like anything so AcraServer skips to the next column.

2. Try matching `\x44444444444444446a4b6a45...`. This is a correct ZoneID header so AcraServer looks for associated keys. If zone keys are available, AcraServer will use them for processing the following columns of the same row.

3. Try matching `\x222222222222222255454332...`. This is a correct AcraStruct header so AcraServer will load the zone's private key and try to decrypt the AcraStruct. If successful, AcraServer will replace the AcraStruct in response with decrypted data.

This is why the ZoneID column must precede the encrypted data column in SQL queries.

#### Method 2 – ZoneID provided as a literal

It is also possible to not store ZoneID in the database, but instead provide it from other source.
Application may store ZoneID locally or derive it from user's input.
In any case, the ZoneID is not stored in the database, only the encrypted data.
The database schema may look like this for PostgreSQL:
```sql
CREATE TABLE application_data (
 id SERIAL PRIMARY KEY,
 data BYTEA
);
INSERT INTO application_data (data) 
VALUES (
        '\x2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103'::BYTEA
        );
```
Or if you use MySQL:
```sql
CREATE TABLE application_data (
 id INTEGER PRIMARY KEY AUTO_INCREMENT,
 data BLOB
);
INSERT INTO application_data (data) 
VALUES (
        X'2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103'
        );
```

However, AcraServer still needs to know the ZoneID to decrypt the data.

Instead of querying it from the database, the application specifies ZoneID directly in the query as a literal:

```sql
SELECT id, 'DDDDDDDDjKjECtcRBDkmHVBh', data FROM application_data
```

Here we placed ZoneID as a string literal before the encrypted column `data`. ZoneID value will be returned by the database before encrypted data in the result rows:

Just like with the previous method, AcraServer will match the ZoneID in response and use it to decrypt AcraStruct data that follows in the next column.


### More information about Zones

 How Zones affect certain tuning strategies for increased performance and security.
* [Using Zones on client]({{< ref "/acra/guides/advanced-integrations/client-side-integration-with-acra-connector.md#client-side-with-zones" >}}): A practical How-To on using AcraWriter with Zones on application side.