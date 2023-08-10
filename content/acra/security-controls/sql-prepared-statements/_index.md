---
title: SQL Prepared statements
weight: 12
---

## Prepared statements from SQL

{{< hint info >}}
This feature is available in Acra only starting from 0.95.
{{< /hint>}}

Acra support alternative SQL interface to prepared statements
for [`MySQL`](https://dev.mysql.com/doc/refman/8.0/en/sql-prepared-statements.html)
and [`PostgreSQL`](https://www.postgresql.org/docs/current/sql-prepare.html).

This interface is not as efficient as using the binary protocol through a prepared statement API, but requires no
programming because it is available directly at the SQL level.

### PostgreSQL

AcraServer fully supports syntax of prepared statements for PostgreSQL.

For Prepare query like:

```
PREPARE fooplan (int, text, bool, numeric) AS INSERT INTO foo VALUES($1, $2, $3, $4);
```

AcraServer will detect the prepared statement query and store it destructed for further processing.

For Execute query like:

```
EXECUTE fooplan(1, 'Hunter Valley', 't', 200.00);
```

AcraServer will extract values based on the query stored in `Prepare` query and perform encryption/decryption.

### MySQL

MySQL has a different syntax for prepared statements.
It uses `SET @a = 'value';` queries to provide data in DB and uses it as a reference in `EXECUTE` statements.

To apply any security controls on data provided by `SET` queries. AcraServer expects it in the following format:

```
{table_from_encryptor_config}{delimiter}{column_from_encryptor_config}:
```

For encryptor config:

```
schemas:
  - table: users
    columns:
      - id
      - name
    encrypted:
      - column: name
```

and query:

```
SET @users__name = 'value'
```

AcraServer will detect and apply pure encryption for column `name` from `users` table.

To overwrite the `delimiter` used in `SET` queries, `prepared_statements_set_arg_delimiter`
setting could be used (if no setting provided the `__` delimiter will be used by default)

```
database_settings:
  mysql:
    prepared_statements_set_arg_delimiter: '&&'

schemas:
  - table: users
    columns:
      - id
      - name
    encrypted:
      - column: name
```

It is also possible to use [searchable encryption](/acra/security-controls/searchable-encryption/) with SQL prepared
statements.
AcraServer will analyze and transform queries as the following:

```
PREPARE stmt1 FROM 'SELECT * FROM test_table WHERE searchable_field = ?';
```

```
PREPARE stmt1 FROM 'SELECT * FROM test_table WHERE substr(searchable_field, 1, <search HASH size>) = substr(?, 1, <search HASH size>,)';
```

And

```
PREPARE stmt1 FROM 'SELECT * FROM test_table WHERE searchable_field = 'value';
```

```
PREPARE stmt1 FROM 'SELECT * FROM test_table WHERE substr(searchable_field, 1, <search HASH size>) = '<searchable HASH>';
```

