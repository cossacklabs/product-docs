---
title: "Tables filters"
bookCollapseSection: true
---

## Tables

Tables work in the following manner: the names of the tables are alternately extracted from the queries that address the database and each table is compared to the list of tables from the configuration file.
There is a restriction for query types: only `SELECT` and `INSERT` types are allowed, other query types are not supported.
This filter Used differently by `allow`/`deny` handlers. Allow handler pass query only if all tables specified in configuration file matched with tables in the query and deny if at least one specified table not matched.
Deny handler denies query if at least one table specified in the configuration file matches tables in the query. Look at examples below.

### Allow handler

Allow handler denies any query if it does not contain the whole set of tables specified in configuration file for this handler. Query is allowed if number of tables in configuration file equals to number of tables in the query. E.g. all tables from configuration file should be presented in a set of tables of the query.

| list of tables | allowed queries | denied queries |
| ------- | ------- | ------- |
| `["EMPLOYEE"]` | `SELECT EMP_ID, LAST_NAME FROM EMPLOYEE WHERE CITY = 'Seattle' ORDER BY EMP_ID;`<br/><br/>`INSERT INTO EMPLOYEE values(1, 'email', 'name');` | `SELECT EMP_ID, LAST_NAME FROM EMPLOYEE_TBL WHERE CITY = 'Seattle' ORDER BY EMP_ID;`<br/><br/>`SELECT EMP_ID, LAST_NAME FROM EMPLOYEE, EMPLOYEE_TBL WHERE CITY = 'Seattle' ORDER BY EMP_ID;`<br/><br/>`INSERT INTO EMPLOYEE_TBL VALUES (1, 'email', 'name');`
| `["EMPLOYEE", "EMPLOYEE_TBL"]` | `SELECT EMP_ID, LAST_NAME FROM EMPLOYEE, EMPLOYEE_TBL WHERE CITY = 'INDIANAPOLIS' ORDER BY EMP_ID asc;` | `SELECT EMP_ID, LAST_NAME FROM EMPLOYEE, EMPLOYEE_TBL, CUSTOMERS WHERE CITY = 'INDIANAPOLIS' ORDER BY EMP_ID asc;`<br/><br/>`INSERT INTO EMPLOYEE VALUES(1, 'email', 'name');`

### Deny handler

Deny handler denies queries if they contain any table specified in configuration file.

| list of tables | allowed queries | denied queries |
| ------- | ------- | ------- |
| `["EMPLOYEE"]` | `SELECT EMP_ID, LAST_NAME FROM EMPLOYEE_TBL WHERE CITY = 'Seattle' ORDER BY EMP_ID;`<br/><br/>`INSERT INTO EMPLOYEE_TBL values(1, 'email', 'name');` | `SELECT EMP_ID, LAST_NAME FROM EMPLOYEE WHERE CITY = 'Seattle' ORDER BY EMP_ID;`<br/><br/>`SELECT EMP_ID, LAST_NAME FROM EMPLOYEE, EMPLOYEE_TBL WHERE CITY = 'Seattle' ORDER BY EMP_ID;`<br/><br/>`INSERT INTO EMPLOYEE VALUES (1, 'email', 'name');`
| `["EMPLOYEE", "EMPLOYEE_TBL"]` | `SELECT CUST_ID, LAST_NAME FROM CUSTOMERS WHERE CITY = 'INDIANAPOLIS' ORDER BY CUST_ID asc;` | `SELECT EMP_ID, LAST_NAME FROM EMPLOYEE, CUSTOMERS, PROFILE WHERE CITY = 'INDIANAPOLIS' ORDER BY CUST_ID asc;`<br/><br/>`INSERT INTO EMPLOYEE VALUES(1, 'email', 'name');` <br/><br/>`SELECT EMP_ID, LAST_NAME FROM EMPLOYEE_TBL, CUSTOMERS, PROFILE WHERE CITY = 'INDIANAPOLIS' ORDER BY CUST_ID asc;`
