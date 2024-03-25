SELECT emp_name, COUNT(*), (COALESCE(SUM(order_total::numeric), 0)::money) as total_revenue
FROM orders 
INNER JOIN employees ON employees.emp_id = orders.emp_id
GROUP BY emp_name
ORDER BY COALESCE(SUM(order_total::numeric), 0) DESC
LIMIT 5;