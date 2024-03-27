SELECT cust_name, count(*), (coalesce(sum(order_total::numeric), 0)::money) as total_profit
FROM orders
INNER JOIN customers on orders.cust_id = customers.cust_id
GROUP BY cust_name
ORDER BY coalesce(sum(order_total::numeric), 0) DESC
LIMIT 5;