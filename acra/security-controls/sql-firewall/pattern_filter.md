---
title: '"patterns" filters'
---

# `patterns` filters

`patterns` filters match the queries by a template consisting of literal query text with variable parts represented as *patterns*.

AcraCensor parses the incoming query and compares its structure to the provided template.
That is, the query must have matching type (`SELECT`, `INSERT`, `UPDATE`, etc.),
the internal structure must match too (`WHERE`, `JOIN`, `ORDER BY`, `UNION` clauses, etc.),
as well as individual expressions, literal values, column names and tables used in the query.
If the query matches all the patterns, the handles applies the decision: whether to `allow` the query, or `deny` it.

## Supported patterns

{{< hint info >}}
AcraCensor is still work in progress, the list of supported patterns here might be incomplete.
See example configuration files used in [integration tests](https://github.com/cossacklabs/acra/tree/master/tests/acra-censor_configs)
and [unit tests](https://github.com/cossacklabs/acra/blob/master/acra-censor/acra-censor_test.go)
for the latest supported features.

If the query type you need is not supported yet, consider using [`queries` filters](/acra/security-controls/sql-firewall/queries_filter/).
Please [file an issue](https://github.com/cossacklabs/acra/issues/new) if you believe `patterns` filters are missing an important query type.
{{< /hint >}}

### `VALUE` pattern

`%%VALUE%%` represents a literal value (string, binary, number, boolean).
It is supported in many places where literal values can be used:

  - `WHERE`, `ORDER BY`, `GROUP BY` clauses
  - `IN`, `BETWEEN` expressions

#### `WHERE ... = VALUE` clause

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT a FROM t WHERE ID = %%VALUE%%` |  `SELECT a FROM t WHERE ID = '123';`  | `SELECT a, b FROM t WHERE ID = '123';` |
  ||`SELECT a FROM t WHERE ID = 35`|`SELECT a FROM anothertable WHERE ID = '123;`|
  |||`SELECT a FROM t WHERE ID > '123`|


#### `BETWEEN VALUE AND VALUE` expression

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT a FROM t WHERE param BETWEEN %%VALUE%% and %%VALUE%%` | `SELECT a FROM t WHERE param BETWEEN 1 and 3; ` | `SELECT a, b FROM t WHERE param BETWEEN 1 and 3;`|
  ||`SELECT a FROM t WHERE param BETWEEN "qwerty" and NULL`|`SELECT a FROM anothertable WHERE param BETWEEN 1 and 3`|


#### `IN (VALUE, VALUE, ...)` expression

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT 1 FROM t WHERE b='qwe' and v IN (%%VALUE%%, %%VALUE%%, %%VALUE%%)` | `SELECT 1 FROM t WHERE b='qwe' and v IN (1, 2, 3)` | `SELECT 1 FROM t WHERE b='qwe' and v IN (1, 2);`|
  |||`SELECT 1 FROM t WHERE b='qwe' and v IN (1, 2, 3, 4, 5)`|

#### `LIST_OF_VALUES` pattern

`%%LIST_OF_VALUES%%` matches a list of `%%VALUE%%` patterns of arbitrary length,
for example in `IN` expressions.

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT 1 FROM t WHERE b='qwe' and v IN (%%LIST_OF_VALUES%%)` | `SELECT 1 FROM t WHERE b='qwe' and v IN (1, 2, 3);` | `SELECT 1 FROM anothertable WHERE b='qwe' and v IN (1, 2)`|
  ||`SELECT 1 FROM t WHERE b='qwe' and v IN (1, 'qwe', True, NULL, FALSE)`||

#### `SUBQUERY` pattern

`%%SUBQUERY%%` matches a subquery expression (`SELECT ...`)
which is used as a value in the parent query.

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT 1 FROM t WHERE a=%%SUBQUERY%%` | `SELECT 1 FROM t WHERE a=(SELECT column1, column2 FROM table1 WHERE a=1);` | `SELECT 1 FROM t WHERE a=2;`|
  ||`SELECT 1 FROM t WHERE a=(SELECT column1, column2 FROM table1 WHERE a=1 union SELECT column1, column2 FROM table2)`|`SELECT 1 FROM anothertable WHERE a=(SELECT column1, column2 FROM table1 WHERE a=1)`|

### `WHERE` pattern

`%%WHERE%%` matches a `WHERE` clause with one or more expressions.
This pattern is supported for `SELECT`, `UPDATE`, and `DELETE` queries.

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT users FROM company %%WHERE%%` | `SELECT users FROM company WHERE title = 'engineer';` | `SELECT users, cats FROM company WHERE a = 'someValue';`|
  ||`SELECT users FROM company WHERE AGE IN ( 25, 27 );`|`SELECT age FROM company4 WHERE age IS NULL;`|
  ||`SELECT users FROM company WHERE NAME LIKE 'Pa%';`|`SELECT users FROM company4 INNER JOIN (SELECT age FROM company WHERE id = 1) AS t ON t.id=another_table.id WHERE AGE NOT IN (25, 27)`|
  ||`SELECT users FROM company WHERE A=(SELECT age FROM company WHERE salary > 65000 limit 1) and B=(SELECT age FROM company123 WHERE salary > 1000 limit 1)`||

### `COLUMN` pattern

`%%COLUMN%%` matches a column name expression,
such as in `SELECT` and `ORDER BY` clauses.

* **SELECT COLUMN**

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT %%COLUMN%%, %%COLUMN%% FROM company` | `SELECT users, cats FROM company;` | `SELECT users FROM company` |
  | | `SELECT a, b FROM t WHERE ID = '123'`| `SELECT users, cats, chameleons FROM company`|
  | | | `SELECT users, cats FROM zoo` |

* **ORDER BY COLUMN**

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT 1 FROM t ORDER BY %%COLUMN%%` | `SELECT 1 FROM t ORDER BY age;` | `SELECT 1 FROM anothertable ORDER BY age;` |
  | | `SELECT 1 FROM t ORDER BY (case when f1 then 1 when f1 is null then 2 else 3 end)` | `SELECT 1 FROM anothertable ORDER BY age DESC` |

### `SELECT pattern`

`%%SELECT%%` matches any `SELECT` query.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%SELECT%%` | `SELECT users, cats FROM company; ` | any non-SELECT query: `UPDATE users SET name='new_name'` |
| |`SELECT SUM(Salary) FROM Employee WHERE Emp_Age < 30`| |
| | `SELECT dogs, chameleons FROM company;`| |


### `INSERT` pattern

`%%INSERT%%` matches any `INSERT` query.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%INSERT%%` | `INSERT INTO Customers (CustomerName, ContactName) VALUES ('Cardinal', 'Tom B. Erichsen');` | any non-INSERT query: `SELECT email FROM users;` |
| | `INSERT INTO dbo.Points (PointValue) VALUES ('1,99');` | |


### `UPDATE` pattern
  
`%%UPDATE%%` matches any `UPDATE` query.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%UPDATE%%` | `UPDATE t SET a=1 WHERE ID = 1` | any non-UPDATE query: `SELECT email FROM users;` |
|  | `UPDATE Customers SET ContactName = 'Alfred Schmidt', City = 'Frankfurt' WHERE CustomerID = 1` | |


### `DELETE` pattern

`%%DELETE%%` matches any `DELETE` query.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%DELETE%%` | `DELETE FROM t WHERE removed = TRUE` | any non-DELETE query: `SELECT email FROM users;` |
| | `DELETE FROM Customers WHERE CustomerName = 'Alfreds Futterkiste'` | |

### `BEGIN` pattern

`%%BEGIN%%` matches any `BEGIN` query.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%BEGIN%%` | `BEGIN` | any non-BEGIN query: `SELECT email FROM users;`


### `COMMIT` pattern

`%%COMMIT%%` matches any `COMMIT` query.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%COMMIT%%` | `COMMIT` | any non-COMMIT query: `SELECT email FROM users;`


### `ROLLBACK` pattern

`%%ROLLBACK%%` matches any `ROLLBACK` query.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%ROLLBACK%%` | `ROLLBACK` | any non-ROLLBACK query: `SELECT email FROM users;`


This is a constantly updating list of useful configuration examples. See the examples we are using for integration testing in [tests/acra-censor_configs](https://github.com/cossacklabs/acra/tree/master/tests/acra-censor_configs) and AcraCensor's [unit tests](https://github.com/cossacklabs/acra/blob/master/acra-censor/acra-censor_test.go). We will also appreciate your questions and [Pull Requests](https://github.com/cossacklabs/acra/pulls).
