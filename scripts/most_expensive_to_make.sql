-- Returning inventory for 20 menu items
SELECT SUM(inv_price), item_name
FROM Menu_items
INNER JOIN inv_menu ON Menu_items.item_id = inv_menu.item_id
INNER JOIN Inventory on inv_menu.inv_id = inventory.inv_id
GROUP BY item_name
ORDER BY SUM(inv_price) DESC
LIMIT 1;
