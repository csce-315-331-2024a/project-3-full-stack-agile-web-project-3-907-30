SELECT order_date, SUM(order_total)
FROM Orders
GROUP BY order_date
ORDER BY SUM(order_total) DESC
LIMIT 2;
