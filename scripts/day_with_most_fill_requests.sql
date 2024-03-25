SELECT date_refilled, COUNT(date_refilled) AS number_of_refills
FROM Inventory
GROUP BY date_refilled
ORDER BY number_of_refills DESC
LIMIT 1;
