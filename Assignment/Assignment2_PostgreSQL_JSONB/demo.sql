DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sku text NOT NULL UNIQUE,
    name text NOT NULL,
    price numeric(10, 2) NOT NULL CHECK (price >= 0),
    attributes jsonb NOT NULL DEFAULT '{}'::jsonb
);

INSERT INTO products (sku, name, price, attributes) VALUES
('MUG-01', 'Ceramic mug', 12.50, '{"color":"blue","capacity_ml":350,"features":["dishwasher-safe"]}'),
('BAG-02', 'Day bag', 48.00, '{"color":"green","volume_l":18,"waterproof":true}'),
('MUG-03', 'Travel mug', 19.00, '{"color":"blue","capacity_ml":500,"insulated":true}');

-- -> returns JSON; ->> returns text.
SELECT name, attributes->>'color' AS color FROM products;

-- Containment query; eligible for a default GIN index on attributes.
SELECT sku, name FROM products WHERE attributes @> '{"color":"blue"}'::jsonb;

-- Top-level key existence.
SELECT name FROM products WHERE attributes ? 'waterproof';

CREATE INDEX products_attributes_gin ON products USING GIN (attributes);

-- Update a single nested value while preserving other properties.
UPDATE products
SET attributes = jsonb_set(attributes, '{capacity_ml}', '400'::jsonb)
WHERE sku = 'MUG-01';

-- Hybrid model: stable and constrained fields remain regular columns.
SELECT sku, name, price, attributes
FROM products
WHERE price < 20 AND attributes @> '{"color":"blue"}'::jsonb;
