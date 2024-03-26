CREATE TABLE IF NOT EXISTS Customers (
cust_id SERIAL PRIMARY KEY,
cust_name varchar,
phone_number varchar,
num_orders INT,
total_spent MONEY
);

CREATE TABLE IF NOT EXISTS Employees (
emp_id SERIAL PRIMARY KEY,
emp_name varchar,
emp_email varchar,
emp_picture varchar,
is_manager boolean DEFAULT FALSE,
is_admin boolean DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS Inventory (
inv_id SERIAL PRIMARY KEY,
inv_name varchar,
inv_price MONEY,
fill_level int,
current_level int,
times_refilled int,
date_refilled date,
has_dairy boolean DEFAULT FALSE,
has_nuts boolean DEFAULT FALSE,
has_eggs boolean DEFAULT FALSE,
is_vegan boolean DEFAULT FALSE,
is_halal boolean DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS Menu_items (
item_id SERIAL PRIMARY KEY,
item_name varchar,
item_price money,
times_ordered int
);

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

CREATE TABLE IF NOT EXISTS Orders (
order_id SERIAL PRIMARY KEY,
order_date date,
order_time time,
order_total money DEFAULT 0,
cust_id int not null,
emp_id int not null,
FOREIGN KEY (cust_id)
    REFERENCES customers(cust_id)
    ON DELETE CASCADE,
FOREIGN KEY (emp_id)
    REFERENCES employees(emp_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inv_menu (
item_id int not null,
inv_id int not null,
amount int not null,
FOREIGN KEY (inv_id)
    REFERENCES inventory(inv_id)
    ON DELETE CASCADE,
FOREIGN KEY (item_id)
    REFERENCES menu_items(item_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders_menu (
order_id int not null,
item_id int not null,
FOREIGN KEY (order_id)
    REFERENCES orders(order_id)
    ON DELETE CASCADE,
FOREIGN KEY (item_id)
    REFERENCES menu_items(item_id)
    ON DELETE CASCADE
);
