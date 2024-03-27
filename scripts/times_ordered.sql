UPDATE menu_items
SET times_ordered = ( --update times_ordered column
    SELECT COUNT(orders_menu.item_id) --gonna count instances of item_id in orders_menu based on subquery below
    FROM orders_menu 
    JOIN orders ON orders_menu.order_id = orders.order_id --join the order id's (for a given order)
    WHERE orders_menu.item_id = menu_items.item_id --corresponding menu item
);