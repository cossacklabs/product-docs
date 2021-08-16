---
title: Zones
bookCollapseSection: true
---

# Zones

Zones are the way to cryptographically compartmentalise access to data. By default, used default zones called `ClientID` that divide access by transport authentication. 
Applications connected to AcraServer or AcraTranslator through SecureSession or TLS as transport encryption will get access only to data encrypted with appropriate ClientID. 
It works in zoneless mode. In zone mode applications can specify ZoneID in their SQL queries (through AcraServer) or requests (to AcraTranslator)  to get decrypted data related to this zone.
So application have access to decrypted data only if knows correct ZoneID and data records that encrypted with keys linked with this ZoneID.

## What are the Zone and ZoneID

**ZoneID** is a random identifier for keys. It represented by 24 length string where first 8 symbols is ZoneID header `DDDDDDDD` and next 16 characters are random ASCII letters. For example `DDDDDDDDjKjECtcRBDkmHVBh`.
**Zone** is a pair of ZoneID and related symmetric (for AcraBlocks) and asymmetric keys (AcraStructs).

## How to encrypt data using zones

There are two ways to encrypt data with zones: static and dynamic. Static method works only with AcraServer. 
In both methods Zones should be created before encryption with [acra-addzone]({{< ref "/acra/configuring-maintaining/general-configuration/acra_addzone.md" >}}) tool or [AcraServer's HTTP API]({{< ref "/acra/configuring-maintaining/general-configuration/acra_server.md#http-api" >}}).
After generating new Zone you don't need to restart AcraServer or AcraTranslator. On generation, it saved in KeyStore specified for `acra-addzone` or AcraServer (if generated via HTTP API). 
So, AcraServer with AcraTranslator will get new keys for encryption from KeyStore on new encryption requests at run-time. 

### Static

Static method works with AcraServer in [Transparent encryption mode]({{< ref "/acra/configuring-maintaining/general-configuration/acra_server.md#transparent-encryption-mode-INVALID" >}}) 
that allows to configure database encryption per table column and specify Zone that should be used. Application doesn't need to encrypt data and store Zone public key, AcraServer will do it transparently.
Every change of encryptor's config require AcraServer restart to apply new settings.

### Dynamic

Works with AcraServer and AcraTranslator. After generating new Zone with [acra-addzone]({{< ref "/acra/configuring-maintaining/general-configuration/acra_addzone.md" >}}) tool or [AcraServer's HTTP API]({{< ref "/acra/configuring-maintaining/general-configuration/acra_server.md#http-api" >}})
it is available to encrypt data. Your application should know new ZoneID to specify it in requests to AcraTranslator and should have access to generated public key to encrypt data with AcraWriter and Zone.

## How to decrypt data using zones

### Decrypt with AcraTranslator

To decrypt data encrypted with Zone you need just send correct pair of encrypted data and appropriate ZoneID in requests to AcraTranslator via HTTP or gRPC API. 
AcraTranslator will load decryption keys by ZoneID identifier and try to decrypt data. Successful decryption represents authorized data access. Otherwise, it means trying to get data that not authorized for acquirer.

### Decrypt with AcraServer

To decrypt data AcraServer should know which ZoneID should use to decrypt data. It processes result rows from database and before any decryption tries to match ZoneID.
Only after successful match ZoneID AcraServer starts matching AcraStruct/AcraBlock signatures in result data. 
So, every ZoneID should be placed before appropriate piece of encrypted data in result rows.

Because SQL is the only way how application communicates with database and AcraServer, there is only one way where AcraServer can get and match ZoneID in pair with encrypted data: database result rows.
There are several methods how to achieve it:
* ZoneID should be stored in database and precedes encrypted data in result rows
* ZoneID specified explicitly in SQL query as literal (according to database binary literals) in `SELECT` statement before encrypted column
* ZoneID specified explicitly in SQL query as literal (according to database binary literals) in `SELECT` statement before explicitly specified encrypted data as SQL literal

#### Method 1

Let's look how it works on first method on simple example when application stores ZoneID and encrypted data in database table. 
For PostgreSQL will look like:
```
CREATE TABLE application_data (
 id SERIAL PRIMARY KEY,
 zone_id BYTEA,
 data BYTEA
);
INSERT INTO application_data (zone_id, data) VALUES ('DDDDDDDDjKjECtcRBDkmHVBh'::BYTEA, '\x2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103'::BYTEA);
```
For MySQL will look like:
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

#### Method 2

At this case application will not store ZoneID in database and store it locally or get it from user's input. Our table in database will be changed.
For PostgreSQL:
```
CREATE TABLE application_data (
 id SERIAL PRIMARY KEY,
 data BYTEA
);
INSERT INTO application_data (data) VALUES ('\x2222222222222222554543320000002d116bab650305cf67209623ed3a134fd77bfecd0c9a95107450826e14f950fdd1dba73732872027042654000000000101400c00000010000000200000003f5fd06dbf8bf49be6a8b440ea54f01174934049fd563ce27ff0aafbe5ea9155588e1ddd0ce64804fe5ff347ae097e29dd007fcaa02a3548da568df83300000000000000000101400c00000010000000070000002273af944d98bcde697b914d98fea013b77a358a93959ddfee47858b75d2e86eb5f103'::BYTEA);
```

For MySQL:
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

* [Tuning Acra]({{< ref "/acra/configuring-maintaining/optimisations/#zones-INVALID" >}}): How Zones affect certain tuning strategies for increased performance / security.
* [Using Zones on client]({{< ref "/acra/guides/advanced-integrations/client-side-integration-with-acra-connector.md#client-side-with-zones" >}}): A practical How-To use AcraWriter with Zones on application side.