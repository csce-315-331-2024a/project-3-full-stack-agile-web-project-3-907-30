-- Selects items from Menu_items that contain allergens

SELECT DISTINCT(item_name)
FROM Menu_items
INNER JOIN inv_menu ON Menu_items.item_id = inv_menu.item_id
INNER JOIN inventory ON inv_menu.inv_id = inventory.inv_id
WHERE has_dairy = 'TRUE' OR has_nuts = 'TRUE' OR has_eggs = 'TRUE';
