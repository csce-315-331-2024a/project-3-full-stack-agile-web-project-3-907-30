-- Run this after inputting the orders and orders_menu table
CREATE OR REPLACE FUNCTION calc_order_total(id integer) RETURNS money AS $$
DECLARE
    order_total money := 0;
BEGIN
    -- Calculate sum based on ID
    SELECT INTO order_total COALESCE(SUM(menu_items.item_price::numeric), 0)
    FROM orders
    INNER JOIN orders_menu ON orders.order_id = orders_menu.order_id
    INNER JOIN menu_items ON orders_menu.item_id = menu_items.item_id
    WHERE orders.order_id = id;

    -- Return the sum
    RETURN order_total;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION apply_order_totals() RETURNS VOID AS $$
DECLARE
    id integer := 0;
    total money := 0;
BEGIN

    -- Based on query of for loop
    FOR id in SELECT * FROM orders LOOP
        RAISE NOTICE '%', id;
        SELECT INTO total calc_order_total(id);
        UPDATE orders SET order_total = total WHERE order_id = id;

    END LOOP;

END;
$$ language plpgsql;

SELECT apply_order_totals();