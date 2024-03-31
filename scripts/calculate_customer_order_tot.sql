UPDATE customers AS cus
SET num_orders = (
    SELECT COUNT(*)
    FROM orders AS od
    WHERE od.cust_id = cus.cust_id
)
WHERE EXISTS (
    SELECT 1
    FROM orders AS od
    WHERE od.cust_id = cus.cust_id
);

-- test
-- UPDATE counts AS co
-- SET count = (
--     SELECT COUNT(*)
--     FROM account AS a
--     WHERE a.id = co.id
-- )
-- WHERE EXISTS (
--     SELECT 1
--     FROM account AS a
--     WHERE a.id = co.id
-- );