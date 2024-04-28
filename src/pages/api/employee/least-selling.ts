import db from "@/lib/db";
import { executeStatement, rowToMenuItem } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { DataTypeOIDs } from "postgresql-client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    const sql = `SELECT menu_items.item_id, menu_items.item_name, menu_items.item_price::numeric, COUNT(orders_menu.item_id)
    FROM menu_items
    INNER JOIN orders_menu ON menu_items.item_id = orders_menu.item_id
    INNER JOIN orders ON orders_menu.order_id = orders.order_id
    INNER JOIN employees ON orders.emp_id = employees.emp_id
    WHERE menu_items.deprecated = FALSE AND employees.emp_id = $1 
    GROUP BY menu_items.item_id
    ORDER BY COUNT(menu_items.item_id)
    LIMIT 10;`

    const rows = await executeStatement(db, sql, [DataTypeOIDs.numeric], [id]).then((response) => response.rows!);
    if (rows.length === 0 || rows === undefined) {
        res.status(404).json({error: 'Error fetching employee info'});
    }

    const items = rows.map((row) => rowToMenuItem(row));
    res.status(200).json(items);
}