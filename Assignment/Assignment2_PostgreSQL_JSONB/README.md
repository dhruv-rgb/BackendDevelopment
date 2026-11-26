# Assignment 2: PostgreSQL JSONB

## Question

How can PostgreSQL combine relational modeling with flexible document fields, and when is that useful compared with a document database?

## Overview

PostgreSQL's `json` type stores the original JSON text, while `jsonb` stores a decomposed representation that is generally more efficient to query and can be indexed. The trade-off is that `jsonb` does not preserve insignificant whitespace, object key order, or duplicate object keys. It is useful for optional or evolving attributes, but it does not remove the value of relational columns, constraints, and foreign keys.

## Example: product catalog

The SQL file in this folder creates a catalog with stable relational fields (`sku`, `name`, `price`) and a flexible `attributes` document for category-specific properties. It demonstrates extraction, containment, key existence, updates, and a GIN index.

```sql
SELECT name FROM products WHERE attributes @> '{"color":"blue"}'::jsonb;
```

The containment and existence operators can be supported by GIN indexes. The default `jsonb_ops` operator class supports key existence and containment; `jsonb_path_ops` supports a narrower set of operators and can be a better fit when queries primarily use containment. Index choice should follow the application's query patterns.

## Relational and document approaches

| Need | Prefer relational columns | Prefer JSONB |
|---|---|---|
| Frequent joins, sorting, uniqueness, or range checks | Yes | Rarely |
| Stable attributes shared by all records | Yes | Usually no |
| Optional attributes that vary by category | Sometimes | Often |
| Strong schema evolution and flexible nested payloads | Less flexible | Often |
| Referential integrity across entities | Yes | No automatic foreign keys inside a document |

PostgreSQL JSONB is not a complete replacement for a document database. It is a way to store and query document-like values inside a relational system. A hybrid table keeps important business fields normalized and reserves JSONB for the variable portion.

## Performance evaluation

No benchmark result is claimed here. To evaluate a real workload, create representative rows, compare the same query before and after adding an appropriate index, run `EXPLAIN (ANALYZE, BUFFERS)`, and record PostgreSQL version, row count, data distribution, query, and warm/cold cache conditions. A GIN index adds storage and write cost, so benchmark both reads and writes.

## References

- [PostgreSQL JSON types and JSONB indexing](https://www.postgresql.org/docs/current/datatype-json.html)
- [PostgreSQL JSON functions and operators](https://www.postgresql.org/docs/current/functions-json.html)
