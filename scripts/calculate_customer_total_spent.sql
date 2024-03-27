UPDATE customers AS cus
SET total_spent = (
    SELECT SUM(order_total)
    FROM orders AS od
    WHERE od.cust_id = cus.cust_id
)
WHERE EXISTS (
    SELECT 1
    FROM orders AS od
    WHERE od.cust_id = cus.cust_id
);

--test
-- UPDATE counts AS co
-- SET points = (
--     SELECT SUM(a.points)
--     FROM account AS a
--     WHERE a.name = co.id
-- )
-- WHERE EXISTS (
--     SELECT 1
--     FROM account AS a
--     WHERE a.name = co.id
-- );