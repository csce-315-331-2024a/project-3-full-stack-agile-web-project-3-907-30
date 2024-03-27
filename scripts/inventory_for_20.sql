-- Returning inventory for 20 menu items
SELECT item_name, inv_name, amount
FROM Menu_items
INNER JOIN inv_menu ON Menu_items.item_id = inv_menu.item_id
INNER JOIN Inventory on inv_menu.inv_id = inventory.inv_id
WHERE item_name in (SELECT DISTINCT(item_name) FROM Menu_items LIMIT 20);