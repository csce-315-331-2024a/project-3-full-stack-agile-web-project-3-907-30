CREATE TABLE IF NOT EXISTS menu_pairs (
    pair_id INT PRIMARY KEY,
    item1_id INT,
    item2_id INT,
    item1_name VARCHAR,
    item2_name VARCHAR,
    FOREIGN KEY (item1_id)
        REFERENCES menu_items(item_id)
        ON DELETE CASCADE,
    FOREIGN KEY (item2_id) 
        REFERENCES menu_items(item_id)
        ON DELETE CASCADE
);