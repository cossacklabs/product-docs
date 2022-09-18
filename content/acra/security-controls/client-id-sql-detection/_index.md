---
title: ClientID SQL Detection
weight: 12
---

## ClientID Detection from SQL

{{< hint info >}}
This feature is available in [Acra Enterprise Edition](/acra/enterprise-edition/) only starting from 0.93.
{{< /hint>}}

AcraServer supports the ability to retrieve the ClientID from SQL in the runtime dynamically.

AcraServer uses a default behavior in which the ClientID is retrieved from TLS
certificates [`--tls_client_id_from_cert` flag]({{< ref "acra/configuring-maintaining/general-configuration/acra-server/#tls" >}}), provided by the client during handshake.

To enable SQL ClientID detection, provide `--client_id_sql_varname=<variable>` flag which set SQL variable name to use
as ClientID in session scope. After SQL ClientID detection is ON, AcraServer expect `SET` SQL command to extract
ClientID in runtime.

AcraServer fully support the SET SQL commands syntax
for [PostgreSQL](https://www.postgresql.org/docs/current/sql-set.html)
and [MySQL](https://dev.mysql.com/doc/refman/5.7/en/set-variable.html#set-variable-user-variables).

Example of PostgreSQL SET commands (`--client_id_sql_varname='app.client_id'` ):

```
set app.client_id = 'client_id' || set app.client_id TO 'client_id'
```

Example of MySQL SET command (`--client_id_sql_varname='@app.client_id'`):

```
set @app.client_id TO 'client_id'
```

## ClientID Ignoring

{{< hint info >}}
This feature is available in [Acra Enterprise Edition](/acra/enterprise-edition/) only starting from 0.93.
{{< /hint>}}

AcraServer also supports the ability to ignore and skip encryption/decryption for specified ClientIDs. TLS-extracted, SQL detected ClientIDs are applicable to ignore by AcraServer.

Ignored ClientIDs should be declared as the part of `encryptor_config` in the `defaults.ignore_client_ids` section.

When `ignore_client_ids` are provided AcraServer will ignore all security controls defined in encryptor_config such as: encryption, masking, searchable-encryption, tokenization.

Example of `ignore_client_ids` section:
```
defaults:
 ignore_client_ids:
  - client_id_to_ignore

schemas:
 .....
```
