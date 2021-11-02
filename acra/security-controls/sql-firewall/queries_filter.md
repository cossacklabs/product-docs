---
title: '"queries" filters'
---

# `queries` filters

`queries` filters match the queries literally, by comparing them to provided list of allowed or denied queries.

AcraCensor normalizes the query text before comparison:

  - `;` at the end does not matter
  - SQL keywords are case-insensitive
  - whitespace and line breaks between tokens are not significant

There are no restrictions on query types: you can match `SELECT`, `INSERT`, `UNION`, `SET`, etc.
`queries` filters support any query type, in contrast to [`patterns` filters](/acra/security-controls/sql-firewall/pattern_filter/),
but you must enumerate complete queries with all parameters specified.

| query | matching queries | non-matching queries |
| ------- | ------- | ------- |
| `SELECT name, email, age FROM company;` | `SELECT name, email, age FROM company;` | any other not equal query
| `INSERT INTO company VALUES (1, 'name', 'email');` | `INSERT INTO company VALUES (1, 'name', 'email'); insert INTO company VALUES (1, 'name', 'email');` | any other not equal query