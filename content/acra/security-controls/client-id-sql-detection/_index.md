---
title: ClientID SQL Detection
weight: 12
---

## ClientID Detection from SQL

{{< hint info >}}
This feature is available in [Acra Enterprise Edition](/acra/enterprise-edition/) only starting from 0.93.
{{< /hint>}}

AcraServer encrypts/decrypts data per client (application, user or group of users). 
To distinguish the clients, AcraServer uses "ClientID" which it retrieves from TLS certificate provided by the client during handshake (use flag [`--tls_client_id_from_cert`](/acra/configuring-maintaining/general-configuration/acra-server/#tls)).

AcraServer supports the ability to retrieve the ClientID from SQL in the runtime dynamically. ClientID Detection from
SQL can be especially useful in scenarios where there is a need to switch between different ClientIDs at runtime without
restarting AcraServer having only one or several permanent TLS connections to Acra (in `--tls_client_id_from_cert` AcraServer mode
to switch between different ClientIDs, new TLS connection should be initiated as ClientID derives from the TLS
certificate).

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

Sometimes it's useful NOT to add encryption/decryption for certain applications ("clients" in Acra terms). Now you can configure a list of "Ignored ClientIDs": a traffic coming from them won't be parsed, encrypted or decrypted.
AcraServer supports the ability to ignore and skip encryption/decryption for specified ClientIDs. If clientID is extracted from TLS certificate, AcraServer can match it with "Ignored ClientIDs" like and do NOT perform encryption/decryption for this client, send its queries "as is".

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
