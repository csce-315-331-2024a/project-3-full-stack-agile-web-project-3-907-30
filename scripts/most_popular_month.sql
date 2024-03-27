
SELECT COUNT(order_id), EXTRACT(month FROM order_date)
FROM orders
GROUP BY EXTRACT(month FROM order_date)
ORDER BY COUNT(order_id) DESC
LIMIT 1;

