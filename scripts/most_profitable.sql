SELECT item_price * times_ordered AS money_made, item_name 
FROM Menu_items
ORDER BY money_made DESC
LIMIT 1;