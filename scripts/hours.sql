
SELECT 
    (SELECT COUNT(*)
    FROM orders 
    WHERE '10:00 AM' <= order_time AND order_time < '11:00 AM') 
    as "10:00_AM",

    (SELECT SUM(menu_items.item_price::numeric)
    FROM orders
    INNER JOIN orders_menu ON orders.order_id = orders_menu.order_id
    INNER JOIN menu_items ON orders_menu.item_id = menu_items.item_id
    WHERE '10:00 AM' <= order_time AND order_time < '11:00 AM')
    as price; 
            
SELECT 
    (SELECT COUNT(*)
    FROM orders 
    WHERE '11:00 AM' <= order_time AND order_time < '12:00 PM') 
    as "11:00_AM",

    (SELECT SUM(menu_items.item_price::numeric)
    FROM orders
    INNER JOIN orders_menu ON orders.order_id = orders_menu.order_id
    INNER JOIN menu_items ON orders_menu.item_id = menu_items.item_id
    WHERE '11:00 AM' <= order_time AND order_time < '12:00 PM')
    as price; 
            
SELECT 
    (SELECT COUNT(*)
    FROM orders 
    WHERE '12:00 PM' <= order_time AND order_time < '1:00 PM') 
    as "12:00_PM",

    (SELECT SUM(menu_items.item_price::numeric)
    FROM orders
    INNER JOIN orders_menu ON orders.order_id = orders_menu.order_id
    INNER JOIN menu_items ON orders_menu.item_id = menu_items.item_id
    WHERE '12:00 PM' <= order_time AND order_time < '1:00 PM')
    as price; 
            
SELECT 
    (SELECT COUNT(*)
    FROM orders 
    WHERE '1:00 PM' <= order_time AND order_time < '2:00 PM') 
    as "1:00_PM",

    (SELECT SUM(menu_items.item_price::numeric)
    FROM orders
    INNER JOIN orders_menu ON orders.order_id = orders_menu.order_id
    INNER JOIN menu_items ON orders_menu.item_id = menu_items.item_id
    WHERE '1:00 PM' <= order_time AND order_time < '2:00 PM')
    as price; 
            
SELECT 
    (SELECT COUNT(*)
    FROM orders 
    WHERE '2:00 PM' <= order_time AND order_time < '3:00 PM') 
    as "2:00_PM",

    (SELECT SUM(menu_items.item_price::numeric)
    FROM orders
    INNER JOIN orders_menu ON orders.order_id = orders_menu.order_id
    INNER JOIN menu_items ON orders_menu.item_id = menu_items.item_id
    WHERE '2:00 PM' <= order_time AND order_time < '3:00 PM')
    as price; 
            
SELECT 
    (SELECT COUNT(*)
    FROM orders 
    WHERE '3:00 PM' <= order_time AND order_time < '4:00 PM') 
    as "3:00_PM",

    (SELECT SUM(menu_items.item_price::numeric)
    FROM orders
    INNER JOIN orders_menu ON orders.order_id = orders_menu.order_id
    INNER JOIN menu_items ON orders_menu.item_id = menu_items.item_id
    WHERE '3:00 PM' <= order_time AND order_time < '4:00 PM')
    as price; 
            
SELECT 
    (SELECT COUNT(*)
    FROM orders 
    WHERE '4:00 PM' <= order_time AND order_time < '5:00 PM') 
    as "4:00_PM",

    (SELECT SUM(menu_items.item_price::numeric)
    FROM orders
    INNER JOIN orders_menu ON orders.order_id = orders_menu.order_id
    INNER JOIN menu_items ON orders_menu.item_id = menu_items.item_id
    WHERE '4:00 PM' <= order_time AND order_time < '5:00 PM')
    as price; 
            
SELECT 
    (SELECT COUNT(*)
    FROM orders 
    WHERE '5:00 PM' <= order_time AND order_time < '6:00 PM') 
    as "5:00_PM",

    (SELECT SUM(menu_items.item_price::numeric)
    FROM orders
    INNER JOIN orders_menu ON orders.order_id = orders_menu.order_id
    INNER JOIN menu_items ON orders_menu.item_id = menu_items.item_id
    WHERE '5:00 PM' <= order_time AND order_time < '6:00 PM')
    as price; 
            
SELECT 
    (SELECT COUNT(*)
    FROM orders 
    WHERE '6:00 PM' <= order_time AND order_time < '7:00 PM') 
    as "6:00_PM",

    (SELECT SUM(menu_items.item_price::numeric)
    FROM orders
    INNER JOIN orders_menu ON orders.order_id = orders_menu.order_id
    INNER JOIN menu_items ON orders_menu.item_id = menu_items.item_id
    WHERE '6:00 PM' <= order_time AND order_time < '7:00 PM')
    as price; 
            
SELECT 
    (SELECT COUNT(*)
    FROM orders 
    WHERE '7:00 PM' <= order_time AND order_time < '8:00 PM') 
    as "7:00_PM",

    (SELECT SUM(menu_items.item_price::numeric)
    FROM orders
    INNER JOIN orders_menu ON orders.order_id = orders_menu.order_id
    INNER JOIN menu_items ON orders_menu.item_id = menu_items.item_id
    WHERE '7:00 PM' <= order_time AND order_time < '8:00 PM')
    as price; 
            
SELECT 
    (SELECT COUNT(*)
    FROM orders 
    WHERE '8:00 PM' <= order_time AND order_time < '9:00 PM') 
    as "8:00_PM",

    (SELECT SUM(menu_items.item_price::numeric)
    FROM orders
    INNER JOIN orders_menu ON orders.order_id = orders_menu.order_id
    INNER JOIN menu_items ON orders_menu.item_id = menu_items.item_id
    WHERE '8:00 PM' <= order_time AND order_time < '9:00 PM')
    as price; 
            