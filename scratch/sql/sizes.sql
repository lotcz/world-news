SELECT
    nspname AS schema_name,
    relname AS table_name,
    reltuples::bigint AS row_estimate,  -- approximate row count
    pg_size_pretty(pg_relation_size(c.oid)) AS table_size,
    pg_size_pretty(pg_indexes_size(c.oid)) AS index_size,
    pg_size_pretty(pg_total_relation_size(c.oid) -
                   pg_relation_size(c.oid) -
                   pg_indexes_size(c.oid)) AS toast_size,
    pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'r'   -- only ordinary tables
ORDER BY pg_total_relation_size(c.oid) DESC;
