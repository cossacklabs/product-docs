---
title: "Patterns filters"
bookCollapseSection: true
---

## Patterns

Patterns work in the following manner: when a query addressing the database is checked, each pattern (if any is detected) is parsed alongside the incoming query. The parsing process extracts the SQL statement type (SELECT, INSERT, UPDATE etc), WHERE and UNION nodes, tables, columns, and values from the body of the query. If the pattern and the query have matching nodes, then tables are checked. If matches for tables are detected, then columns are checked. When separate columns match, a decision to block (through denylist) or to allow (through allowlist) the query is made.

### Supported patterns

{{< hint info >}}This is a work-in-progress area, the list is a subject of fixes and updates.{{< /hint >}}

#### VALUE pattern

`%%VALUE%%` represents literal value (string, binary, number, boolean), it's supported in the following cases: after WHERE, IN, ORDER BY, GROUP BY, BETWEEN.

* **WHERE ... VALUE**

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT a `<br/>`FROM t `<br/>`WHERE ID = %%VALUE%%` |  `SELECT a `<br/>`FROM t `<br/>`WHERE ID = '123'`<br/><br/> `SELECT a `<br/>`FROM t `<br/>`WHERE ID = 35`  | `SELECT a, b `<br/>`FROM t `<br/>`WHERE ID = '123'`<br/><br/> `SELECT a `<br/>`FROM anothertable `<br/>`WHERE ID = '123`<br/><br/> `SELECT a FROM t WHERE ID > '123` |


* **BETWEEN VALUE and VALUE**

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT a `<br/>`FROM t `<br/>`WHERE param BETWEEN %%VALUE%% and %%VALUE%%` | `SELECT a FROM t WHERE param BETWEEN 1 and 3`<br/><br/> `SELECT a `<br/>`FROM t `<br/>`WHERE param BETWEEN "qwerty" and NULL` | `SELECT a, b `<br/>`FROM t `<br/>`WHERE param BETWEEN 1 and 3`<br/><br/> `SELECT a `<br/>`FROM anothertable `<br/>`WHERE param BETWEEN 1 and 3`


* **IN (VALUE, VALUE)**

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT 1 `<br/>`FROM t `<br/>`WHERE b='qwe' and v `<br/>`IN (%%VALUE%%, %%VALUE%%, %%VALUE%%)` | `SELECT 1 `<br/>`FROM t `<br/>`WHERE b='qwe' and `<br/>`v IN (1, 2, 3)` | `SELECT 1 `<br/>`FROM t `<br/>`WHERE b='qwe' and v `<br/>`IN (1, 2)`<br/><br/>`SELECT 1 `<br/>`FROM t `<br/>`WHERE b='qwe' and v `<br/>`IN (1, 2, 3, 4, 5)`

* **LIST_OF_VALUES pattern**

  `%%LIST_OF_VALUES%%` represents several values one by one.

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT 1 `<br/>`FROM t `<br/>`WHERE b='qwe' and `<br/>`v IN (%%LIST_OF_VALUES%%)` | `SELECT 1 `<br/>`FROM t `<br/>`WHERE b='qwe' and v `<br/>`IN (1, 2, 3)`</br><br/>`SELECT 1 `<br/>`FROM t `<br/>`WHERE b='qwe' and `<br/>`v IN (1, 'qwe', True, NULL, FALSE)` | `SELECT 1 `<br/>`FROM anothertable `<br/>`WHERE b='qwe' and `<br/>`v IN (1, 2)`

* **SUBQUERY pattern**

  `%%SUBQUERY%%` represents subquery expression starting from SELECT.

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT 1 `<br/>`FROM t `<br/>`WHERE a=%%SUBQUERY%%` | `SELECT 1 `<br/>`FROM t `<br/>`WHERE a=(SELECT column1, column2 FROM table1 WHERE a=1)`<br/><br/> `SELECT 1 `<br/>`FROM t `<br/>`WHERE a=(SELECT column1, column2 FROM table1 WHERE a=1 union SELECT column1, column2 FROM table2)` | `SELECT 1 `<br/>`FROM t `<br/>`WHERE a=2`<br/><br/>`SELECT 1 `<br/>`FROM anothertable `<br/>`WHERE a=(SELECT column1, column2 FROM table1 WHERE a=1)`

#### **WHERE pattern**

  `%%WHERE%%` represents one or more expressions after `WHERE` statement. This pattern works for SELECT/UPDATE/DELETE queries.

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT users `<br/>`FROM company %%WHERE%%` | `SELECT users `<br/>`FROM company `<br/>`WHERE title = 'engineer'`<br/><br/> `SELECT users `<br/>`FROM company `<br/>`WHERE AGE IN ( 25, 27 )`<br/><br/> `SELECT users `<br/>`FROM company `<br/>`WHERE NAME LIKE 'Pa%'`<br/><br/> `SELECT users `<br/>`FROM company `<br/>`WHERE A=(SELECT age FROM company WHERE salary > 65000 limit 1) and `<br/>`B=(SELECT age FROM company123 WHERE salary > 1000 limit 1)` | `SELECT users, cats `<br/>`FROM company `<br/>`WHERE a = 'someValue'`<br/><br/> `SELECT age `<br/>`FROM company4 `<br/>`WHERE age IS NULL` <br/> `SELECT users `<br/>`FROM company4 `<br/>`INNER JOIN (SELECT age FROM company WHERE id = 1) AS t ON t.id=another_table.id `<br/>`WHERE AGE NOT IN (25, 27)`

#### **COLUMN pattern**

`%%COLUMN%%` represents a column expression.

* **SELECT COLUMN**

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT %%COLUMN%%, %%COLUMN%% `<br/>`FROM company` | `SELECT users, cats `<br/>`FROM company`<br/><br/> `SELECT a, b `<br/>`FROM t `<br/>`WHERE ID = '123'` | `SELECT users `<br/>`FROM company`<br/><br/> `SELECT users, cats, chameleons `<br/>`FROM company` <br/> `SELECT users, cats, chameleons `<br/>`FROM company`<br/>`SELECT users, cats `<br/>`FROM zoo` |

* **ORDER BY COLUMN**

  | pattern | matching queries | non-matching queries |
  | ------- | ------- | ------- |
  | `SELECT 1 `<br/>`FROM t `<br/>`ORDER BY %%COLUMN%%` | `SELECT 1 `<br/>`FROM t `<br/>`ORDER BY age`</br></br>`SELECT 1 `<br/>`FROM t `<br/>`ORDER BY (case when f1 then 1 when f1 is null then 2 else 3 end)` | `SELECT 1 `<br/>`FROM anothertable `<br/>`ORDER BY age`</br></br> `SELECT 1 `<br/>`FROM anothertable `<br/>`ORDER BY age DESC`

#### **SELECT pattern**

`%%SELECT%%` represents a whole `SELECT` expression.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%SELECT%%` | `SELECT users, cats `<br/>`FROM company`<br/><br/>`SELECT dogs, chameleons `<br/>`FROM company`<br/><br/>`SELECT SUM(Salary) `<br/>`FROM Employee `<br/>`WHERE Emp_Age < 30` | any non-SELECT query

#### **INSERT pattern**

`%%INSERT%%` represents a whole `INSERT` expression.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%INSERT%%` | `INSERT INTO Customers (CustomerName, ContactName) `<br/>`VALUES ('Cardinal', 'Tom B. Erichsen')`<br/><br/>`INSERT INTO dbo.Points (PointValue) `<br/>`VALUES ('1,99');` | any non-INSERT query


#### **UPDATE pattern**
  
`%%UPDATE%%` represents a whole `UPDATE` expression.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%UPDATE%%` | `UPDATE t SET a=1 `<br/>`WHERE ID = 1`<br/><br/>`UPDATE Customers `<br/>`SET ContactName = 'Alfred Schmidt', City = 'Frankfurt' `<br/>`WHERE CustomerID = 1` | any non-UPDATE query


#### **DELETE pattern**

`%%DELETE%%` represents a whole `DELETE` expression.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%DELETE%%` | `DELETE FROM t `<br/>`WHERE removed = TRUE`<br/><br/>`DELETE FROM Customers `<br/>`WHERE CustomerName = 'Alfreds Futterkiste'` | any non-DELETE query

#### **BEGIN pattern**

`%%BEGIN%%` represents a whole `BEGIN` expression.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%BEGIN%%` | `BEGIN` | any non-BEGIN query


#### **COMMIT pattern**

`%%COMMIT%%` represents a whole `COMMIT` expression.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%COMMIT%%` | `COMMIT` | any non-COMMIT query


#### **ROLLBACK pattern**

`%%ROLLBACK%%` represents a whole `ROLLBACK` expression.

| pattern | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `%%ROLLBACK%%` | `ROLLBACK` | any non-ROLLBACK query


This is a constantly updating list of useful configuration examples. See the examples we are using for integration testing in [tests/acra-censor_configs](https://github.com/cossacklabs/acra/tree/master/tests/acra-censor_configs) and AcraCensor's [unit tests](https://github.com/cossacklabs/acra/blob/master/acra-censor/acra-censor_test.go). We will also appreciate your questions and [Pull Requests](https://github.com/cossacklabs/acra/pulls).
