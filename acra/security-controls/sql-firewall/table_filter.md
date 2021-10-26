---
title: '"tables" filters'
---

# `tables` filters

`tables` filters match only the tables used in queries, ignoring differences in query structure and values.

If the tables involved in the query match the provided table list, the query is allowed or denied.
`tables` filters support only `SELECT` and `INSERT` queries, other query types are skipped.

In `allow` handlers, the query is allowed only if *all* tables involved in the query are in the `tables` list.
In `deny` handlers, the query is denied if *any* table involved in the query is in the `tables` list.
Please see examples below.

## `allow` handler

`allow` handler denies any query if they do not contain the whole set of tables specified in configuration file for this handler. Query is allowed if number of tables in configuration file equals to number of tables in the query. E.g. all tables from configuration file should be presented in a set of tables of the query.

| list of tables | allowed queries | denied queries |
| ------- | ------- | ------- |
| `["EMPLOYEE"]` | `SELECT EMP_ID, LAST_NAME FROM EMPLOYEE WHERE CITY = 'Seattle' ORDER BY EMP_ID; INSERT INTO EMPLOYEE values(1, 'email', 'name');` | `SELECT EMP_ID, LAST_NAME FROM EMPLOYEE_TBL WHERE CITY = 'Seattle' ORDER BY EMP_ID; SELECT EMP_ID, LAST_NAME FROM EMPLOYEE, EMPLOYEE_TBL WHERE CITY = 'Seattle' ORDER BY EMP_ID; INSERT INTO EMPLOYEE_TBL VALUES (1, 'email', 'name');`
| `["EMPLOYEE", "EMPLOYEE_TBL"]` | `SELECT EMP_ID, LAST_NAME FROM EMPLOYEE, EMPLOYEE_TBL WHERE CITY = 'INDIANAPOLIS' ORDER BY EMP_ID asc;` | `SELECT EMP_ID, LAST_NAME FROM EMPLOYEE, EMPLOYEE_TBL, CUSTOMERS WHERE CITY = 'INDIANAPOLIS' ORDER BY EMP_ID asc; INSERT INTO EMPLOYEE VALUES(1, 'email', 'name');`

## `deny` handler

`deny` handler denies queries if they contain any table specified in the configuration file.

| list of tables | allowed queries | denied queries |
| ------- | ------- | ------- |
| `["EMPLOYEE"]` | `SELECT EMP_ID, LAST_NAME FROM EMPLOYEE_TBL WHERE CITY = 'Seattle' ORDER BY EMP_ID; INSERT INTO EMPLOYEE_TBL values(1, 'email', 'name');` | `SELECT EMP_ID, LAST_NAME FROM EMPLOYEE WHERE CITY = 'Seattle' ORDER BY EMP_ID; SELECT EMP_ID, LAST_NAME FROM EMPLOYEE, EMPLOYEE_TBL WHERE CITY = 'Seattle' ORDER BY EMP_ID; INSERT INTO EMPLOYEE VALUES (1, 'email', 'name');`
| `["EMPLOYEE", "EMPLOYEE_TBL"]` | `SELECT CUST_ID, LAST_NAME FROM CUSTOMERS WHERE CITY = 'INDIANAPOLIS' ORDER BY CUST_ID asc;` | `SELECT EMP_ID, LAST_NAME FROM EMPLOYEE, CUSTOMERS, PROFILE WHERE CITY = 'INDIANAPOLIS' ORDER BY CUST_ID asc; INSERT INTO EMPLOYEE VALUES(1, 'email', 'name'); SELECT EMP_ID, LAST_NAME FROM EMPLOYEE_TBL, CUSTOMERS, PROFILE WHERE CITY = 'INDIANAPOLIS' ORDER BY CUST_ID asc;`
