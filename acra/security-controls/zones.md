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

In any case, a zone must be created first with [`acra-addzone` tool]({{< ref "/acra/configuring-maintaining/general-configuration/acra_addzone.md" >}}) or [AcraServer's HTTP API]({{< ref "/acra/configuring-maintaining/general-configuration/acra_server.md#http-api" >}}).
Newly generated keys will be placed into AcraServer or AcraTranslator keystore so that they are able to decrypt the encrypted data.
You will also get the ZoneID and the public key you will need to encryption.

### Static ZoneID

AcraServer in [Transparent encryption mode]({{< ref "/acra/configuring-maintaining/general-configuration/acra_server.md#transparent-encryption-mode-INVALID" >}})
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
```
CREATE TABLE application_data (
 id SERIAL PRIMARY KEY,
 zone_id BYTEA,
 data BYTEA
);
INSERT INTO application_data (zone_id, data) VALUES ('DDDDDDDDjKjECtcRBDkmHVBh'::BYTEA, '\x2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103'::BYTEA);
```
If you use MySQL, data schema might look like this:
```
CREATE TABLE application_data (
 id INTEGER PRIMARY KEY AUTO_INCREMENT,
 zone_id BLOB,
 data BLOB
);
INSERT INTO application_data (zone_id, data) VALUES ('DDDDDDDDjKjECtcRBDkmHVBh', X'2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103');
```
Here we created table where ZoneID will be stored in `zone_id` and this column precedes the `data` column where stored encrypted data. So if we query `SELECT * FROM application_data` 
it will be expanded by database to `SELECT "application_data"."id", "application_data"."zone_id", "application_data"."data"` and result rows will contain ZoneID before encrypted data.
In our example result from PostgreSQL will be:
```
1 \x44444444444444446a4b6a454374635242446b6d48564268 \x2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103 
```

From MySQL:
```
1 0x44444444444444446A4B6A454374635242446B6D48564268 0x2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103 
```
AcraServer will process row by row, column by column. At first, it will try to match ZoneID until success.
1. Try match `1`. It will fail because of invalid ZoneID begin tag `DDDDDDDD`.
2. Try match `DDDDDDDDjKjECtcRBDkmHVBh` and if finds keys related with this ZoneID then it will remember until finish process row data. After that starts to match AcraStruct or AcraBlock signatures.
3. Try match `\x222222222222222255454332....` and recognize AcraStruct signature. After that loads Zone's private key and tries to decrypt AcraStructs. On success AcraServer will replace AcraStruct with decrypted data.

#### Method 2 – ZoneID provided as a literal

At this case application will not store ZoneID in database and store it locally or get it from user's input. Our table in database will be changed.
For PostgreSQL:
```
CREATE TABLE application_data (
 id SERIAL PRIMARY KEY,
 data BYTEA
);
INSERT INTO application_data (data) VALUES ('\x2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103'::BYTEA);
```
Or if you use MySQL:
```
CREATE TABLE application_data (
 id INTEGER PRIMARY KEY AUTO_INCREMENT,
 data BLOB
);
INSERT INTO application_data (data) VALUES (X'2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103');
```

Now application should explicitly specify ZoneID in SQl query (works for MySQL and PostgreSQL): `SELECT "application_data"."id", 'DDDDDDDDjKjECtcRBDkmHVBh', "application_data"."data" FROM "application_data";`
Here we placed ZoneID as string literal before encrypted column `data` and ZoneID value will be returned by database before encrypted data. So result rows will look similar as in example of [method 1](#method-1):
```
1 DDDDDDDDjKjECtcRBDkmHVBh \x2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103 
```

#### Method 3

We can use SQL as API to communicate with AcraServer to decrypt data similar to AcraTranslator and construct custom result rows.  
Query for PostgreSQL: 
```
SELECT 1, 
       'DDDDDDDDjKjECtcRBDkmHVBh', 
       '\x2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103'::BYTEA;
```

Query for MySQL: 
```
SELECT 1, 
       'DDDDDDDDjKjECtcRBDkmHVBh', 
       X'2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103';
```
Here we explicitly specify ZoneID as `DDDDDDDDjKjECtcRBDkmHVBh` and explicitly specify AcraStruct value as HEX literal. 
So, database will return data as is and result rows will look similar to previous examples:


## How Zones work

When analysing the database output stream, AcraServer searches for certain strings called Zone Ids (also ZoneId and zoneid/zone_id in code). They let Acra know that within this record a private key corresponding to the Zone Id should be used for the actual decryption of AcraStructs. It will only work if the user explicitly formats the output for Zone Id to precede the AcraStruct.

### More information about Zones

* [Tuning Acra]({{< ref "/acra/configuring-maintaining/optimisations/#zones-INVALID" >}}): How Zones affect certain tuning strategies for increased performance and security.
* [Using Zones on client]({{< ref "/acra/guides/advanced-integrations/client-side-integration-with-acra-connector.md#client-side-with-zones" >}}): A practical How-To on using AcraWriter with Zones on application side.