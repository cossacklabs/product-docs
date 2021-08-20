---
title: "Queries filters"
bookCollapseSection: true
---

## Queries

Queries work in the following manner: the queries addressed to the database are alternately checked (lines are compared) for the queries matching the ones that the firewall needs to block/allow. If there is a match, the query addressing the database is blocked and a corresponding error is returned (if it's AcraCensor's deny handler at work) or the query is allowed through (if it matches a record in the allow handler of AcraCensor).
AcraCensor compares queries after normalization, that strips `;` at the end, convert all reserved SQL keywords to same case, removing extra spaces between tokens.
There are no restrictions for the query types (`SELECT`, `INSERT`, `UNION`, etc.).

| query | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `SELECT name, email, age`<br/>`FROM company` | `SELECT name, email, age`<br/>`FROM company` | any other not equal query
| `INSERT INTO company `<br/>`VALUES (1, 'name', 'email');` | `INSERT INTO company `<br/>`VALUES (1, 'name', 'email');`<br/><br/>`insert      INTO company `<br/>`VALUES     (1, 'name', 'email');` | any other not equal query
