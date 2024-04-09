// SELECT inventory.inv_id, inventory.inv_name, COALESCE(SUM(inv_menu.amount), 0) as amount FROM inventory
//                     INNER JOIN inv_menu ON inv_menu.inv_id = inventory.inv_id
//                     INNER JOIN menu_items on menu_items.item_id = inv_menu.item_id
//                     INNER JOIN orders_menu ON orders_menu.item_id = menu_items.item_id
//                     INNER JOIN orders ON orders.order_id = orders_menu.order_id
//                     WHERE orders.order_date BETWEEN ? AND ?
//                     GROUP BY inventory.inv_id;
import { NextApiRequest, NextApiResponse } from "next";
import { executeStatement, rowToInventoryItem } from "@/lib/utils";
import db from "@/lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Get a list of ingredients that are below their required fill level for a given menu item.
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
    req: NextApiRequest, res: NextApiResponse
) {
    // const { id } = req.query;
    // const rows = await executeStatement(
    //     db,
    //     `SELECT inv_menu.inv_id, inv_name, inv_price::numeric, fill_level, current_level, times_refilled, date_refilled, has_dairy, has_nuts, has_eggs, is_vegan, is_halal FROM inv_menu INNER JOIN inventory ON inventory.inv_id = inv_menu.inv_id WHERE inv_menu.item_id = $1 AND inventory.current_level < inventory.fill_level;`,
    //     [DataTypeOIDs.int4],
    //     [id]
    // ).then(data => {
    //     return data.rows!;
    // });

    // if (rows.length === 0) {
    //     return res.status(404).json({ error: 'No corresponding menu item'});
    // } else {
    //     return res.status(200).json(rows.map(row => {
    //         return rowToInventoryItem(row);
    //     }));
    // }
}