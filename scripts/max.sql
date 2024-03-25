SELECT inv_id, inv_name, current_level
FROM inventory
ORDER BY current_level DESC
LIMIT 10;