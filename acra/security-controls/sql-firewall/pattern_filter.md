---
title: '"patterns" filters'
bookCollapseSection: true
---

## `patterns` filters

`patterns` filters match the queries by a template consisting of literal query text with variable parts represented as *patterns*.

AcraCensor parses the incoming query and compares its structure to the provided template.
That is, the query must have matching type (`SELECT`, `INSERT`, `UPDATE`, etc.),
the internal structure must match too (`WHERE`, `JOIN`, `ORDER BY`, `UNION` clauses, etc.),
as well as individual expressions, literal values, column names and tables used in the query.
If the query matches all the patterns, the handles applies the decision: whether to `allow` the query, or `deny` it.

### Supported patterns

{{< hint info >}}
**Note:**
AcraCensor is still work in progress, the list of supported patterns here might be incomplete.
See example configuration files used in [integration tests](https://github.com/cossacklabs/acra/tree/master/tests/acra-censor_configs)
and [unit tests](https://github.com/cossacklabs/acra/blob/master/acra-censor/acra-censor_test.go)
for the latest supported features.

If the query type you need is not supported yet, consider using [`queries` filters]({{ ref "acra/security-controls/sql-firewall/queries_filter.md" }}).
Please [file an issue](https://github.com/cossacklabs/acra/issues/new) if you believe `patterns` filters are missing an important query type.
{{< /hint >}}

#### `VALUE` pattern

`%%VALUE%%` represents a literal value (string, binary, number, boolean).
It is supported in many places where literal values can be used:

  - `WHERE`, `ORDER BY`, `GROUP BY` clauses
  - `IN`, `BETWEEN` expressions

##### `WHERE ... = VALUE` clause

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT a `<br/>`FROM t `<br/>`WHERE ID = %%VALUE%%` |  `SELECT a `<br/>`FROM t `<br/>`WHERE ID = '123'`<br/><br/> `SELECT a `<br/>`FROM t `<br/>`WHERE ID = 35`  | `SELECT a, b `<br/>`FROM t `<br/>`WHERE ID = '123'`<br/><br/> `SELECT a `<br/>`FROM anothertable `<br/>`WHERE ID = '123`<br/><br/> `SELECT a FROM t WHERE ID > '123` |


##### `BETWEEN VALUE AND VALUE` expression

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT a `<br/>`FROM t `<br/>`WHERE param BETWEEN %%VALUE%% and %%VALUE%%` | `SELECT a FROM t WHERE param BETWEEN 1 and 3`<br/><br/> `SELECT a `<br/>`FROM t `<br/>`WHERE param BETWEEN "qwerty" and NULL` | `SELECT a, b `<br/>`FROM t `<br/>`WHERE param BETWEEN 1 and 3`<br/><br/> `SELECT a `<br/>`FROM anothertable `<br/>`WHERE param BETWEEN 1 and 3`


##### `IN (VALUE, VALUE, ...)` expression

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT 1 `<br/>`FROM t `<br/>`WHERE b='qwe' and v `<br/>`IN (%%VALUE%%, %%VALUE%%, %%VALUE%%)` | `SELECT 1 `<br/>`FROM t `<br/>`WHERE b='qwe' and `<br/>`v IN (1, 2, 3)` | `SELECT 1 `<br/>`FROM t `<br/>`WHERE b='qwe' and v `<br/>`IN (1, 2)`<br/><br/>`SELECT 1 `<br/>`FROM t `<br/>`WHERE b='qwe' and v `<br/>`IN (1, 2, 3, 4, 5)`

##### `LIST_OF_VALUES` pattern

`%%LIST_OF_VALUES%%` matches a list of `%%VALUE%%` patterns of arbitrary length,
for example in `IN` expressions.

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT 1 `<br/>`FROM t `<br/>`WHERE b='qwe' and `<br/>`v IN (%%LIST_OF_VALUES%%)` | `SELECT 1 `<br/>`FROM t `<br/>`WHERE b='qwe' and v `<br/>`IN (1, 2, 3)`</br><br/>`SELECT 1 `<br/>`FROM t `<br/>`WHERE b='qwe' and `<br/>`v IN (1, 'qwe', True, NULL, FALSE)` | `SELECT 1 `<br/>`FROM anothertable `<br/>`WHERE b='qwe' and `<br/>`v IN (1, 2)`

##### `SUBQUERY` pattern

`%%SUBQUERY%%` matches a subquery expression (`SELECT ...`)
which is used as a value in the parent query.

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT 1 `<br/>`FROM t `<br/>`WHERE a=%%SUBQUERY%%` | `SELECT 1 `<br/>`FROM t `<br/>`WHERE a=(SELECT column1, column2 FROM table1 WHERE a=1)`<br/><br/> `SELECT 1 `<br/>`FROM t `<br/>`WHERE a=(SELECT column1, column2 FROM table1 WHERE a=1 union SELECT column1, column2 FROM table2)` | `SELECT 1 `<br/>`FROM t `<br/>`WHERE a=2`<br/><br/>`SELECT 1 `<br/>`FROM anothertable `<br/>`WHERE a=(SELECT column1, column2 FROM table1 WHERE a=1)`

#### `WHERE` pattern

`%%WHERE%%` matches a `WHERE` clause with one or more expressions.
This pattern is supported for `SELECT`, `UPDATE`, and `DELETE` queries.

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT users `<br/>`FROM company %%WHERE%%` | `SELECT users `<br/>`FROM company `<br/>`WHERE title = 'engineer'`<br/><br/> `SELECT users `<br/>`FROM company `<br/>`WHERE AGE IN ( 25, 27 )`<br/><br/> `SELECT users `<br/>`FROM company `<br/>`WHERE NAME LIKE 'Pa%'`<br/><br/> `SELECT users `<br/>`FROM company `<br/>`WHERE A=(SELECT age FROM company WHERE salary > 65000 limit 1) and `<br/>`B=(SELECT age FROM company123 WHERE salary > 1000 limit 1)` | `SELECT users, cats `<br/>`FROM company `<br/>`WHERE a = 'someValue'`<br/><br/> `SELECT age `<br/>`FROM company4 `<br/>`WHERE age IS NULL` <br/> `SELECT users `<br/>`FROM company4 `<br/>`INNER JOIN (SELECT age FROM company WHERE id = 1) AS t ON t.id=another_table.id `<br/>`WHERE AGE NOT IN (25, 27)`

#### `COLUMN` pattern

`%%COLUMN%%` matches a column name expression,
such as in `SELECT` and `ORDER BY` clauses.

* **SELECT COLUMN**

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT %%COLUMN%%, %%COLUMN%% `<br/>`FROM company` | `SELECT users, cats `<br/>`FROM company`<br/><br/> `SELECT a, b `<br/>`FROM t `<br/>`WHERE ID = '123'` | `SELECT users `<br/>`FROM company`<br/><br/> `SELECT users, cats, chameleons `<br/>`FROM company` <br/> `SELECT users, cats, chameleons `<br/>`FROM company`<br/>`SELECT users, cats `<br/>`FROM zoo` |

* **ORDER BY COLUMN**

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT 1 `<br/>`FROM t `<br/>`ORDER BY %%COLUMN%%` | `SELECT 1 `<br/>`FROM t `<br/>`ORDER BY age`</br></br>`SELECT 1 `<br/>`FROM t `<br/>`ORDER BY (case when f1 then 1 when f1 is null then 2 else 3 end)` | `SELECT 1 `<br/>`FROM anothertable `<br/>`ORDER BY age`</br></br> `SELECT 1 `<br/>`FROM anothertable `<br/>`ORDER BY age DESC`

#### `SELECT pattern`

`%%SELECT%%` matches any `SELECT` query.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%SELECT%%` | `SELECT users, cats `<br/>`FROM company`<br/><br/>`SELECT dogs, chameleons `<br/>`FROM company`<br/><br/>`SELECT SUM(Salary) `<br/>`FROM Employee `<br/>`WHERE Emp_Age < 30` | any non-SELECT query: `UPDATE users SET name='new_name'`

#### `INSERT` pattern

`%%INSERT%%` matches any `INSERT` query.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%INSERT%%` | `INSERT INTO Customers (CustomerName, ContactName) `<br/>`VALUES ('Cardinal', 'Tom B. Erichsen')`<br/><br/>`INSERT INTO dbo.Points (PointValue) `<br/>`VALUES ('1,99');` | any non-INSERT query: `SELECT email FROM users;`


#### `UPDATE` pattern
  
`%%UPDATE%%` matches any `UPDATE` query.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%UPDATE%%` | `UPDATE t SET a=1 `<br/>`WHERE ID = 1`<br/><br/>`UPDATE Customers `<br/>`SET ContactName = 'Alfred Schmidt', City = 'Frankfurt' `<br/>`WHERE CustomerID = 1` | any non-UPDATE query: `SELECT email FROM users;`


#### `DELETE` pattern

`%%DELETE%%` matches any `DELETE` query.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%DELETE%%` | `DELETE FROM t `<br/>`WHERE removed = TRUE`<br/><br/>`DELETE FROM Customers `<br/>`WHERE CustomerName = 'Alfreds Futterkiste'` | any non-DELETE query: `SELECT email FROM users;`

#### `BEGIN` pattern

`%%BEGIN%%` matches any `BEGIN` query.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%BEGIN%%` | `BEGIN` | any non-BEGIN query: `SELECT email FROM users;`


#### `COMMIT` pattern

`%%COMMIT%%` matches any `COMMIT` query.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%COMMIT%%` | `COMMIT` | any non-COMMIT query: `SELECT email FROM users;`


#### `ROLLBACK` pattern

`%%ROLLBACK%%` matches any `ROLLBACK` query.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%ROLLBACK%%` | `ROLLBACK` | any non-ROLLBACK query: `SELECT email FROM users;`


This is a constantly updating list of useful configuration examples. See the examples we are using for integration testing in [tests/acra-censor_configs](https://github.com/cossacklabs/acra/tree/master/tests/acra-censor_configs) and AcraCensor's [unit tests](https://github.com/cossacklabs/acra/blob/master/acra-censor/acra-censor_test.go). We will also appreciate your questions and [Pull Requests](https://github.com/cossacklabs/acra/pulls).
