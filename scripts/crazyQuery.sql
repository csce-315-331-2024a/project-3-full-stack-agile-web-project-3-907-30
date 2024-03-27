SELECT mp.item1_name, mp.item2_name, count(DISTINCT so1.order_id) AS pair_appearances 
FROM menu_pairs AS mp 
JOIN select_orders AS so1 ON so1.item_id = mp.item1_id 
JOIN select_orders AS so2 ON so2.item_id = mp.item2_id AND so2.order_id = so1.order_id 
GROUP BY mp.item1_id, mp.item2_id, mp.item1_name, mp.item2_name
ORDER BY pair_appearances DESC;