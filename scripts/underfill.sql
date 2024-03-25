SELECT inv_id, 
    (current_level - fill_level) as fill_difference,
    CASE WHEN (current_level - fill_level) > 0 THEN 'good to go'
         ELSE 'needs to be filled'
    END as needs_refill
    FROM inventory
    WHERE NOT (current_level - fill_level) > 0;

