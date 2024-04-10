import type { NextApiRequest, NextApiResponse } from "next";
import { MenuItem } from "../../../lib/types";
import db from "../../../lib/db";

/**
 * Gets the 10 least selling items from the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }



const selectStatement = await db.prepare(
    `SELECT menu_items.item_id, menu_items.item_name, menu_items.item_price, COUNT(orders_menu.item_id)
    FROM menu_items
    INNER JOIN orders_menu ON menu_items.item_id = orders_menu.item_id
    INNER JOIN orders ON orders_menu.order_id = orders.order_id  
    GROUP BY menu_items.item_id
    ORDER BY COUNT(menu_items.item_id) LIMIT 10`
);


const selectStatementResult = await selectStatement.execute();

const rows = selectStatementResult.rows!;

await selectStatement.close();

if (rows.length === 0) {
    res.status(404).json({ error: "Errors" });
}
else {
    // convert the rows to an array of Employee objects
const items: MenuItem[] = rows.map((row) => ({
    id: row[0],
    name: row[1],
    price: row[2],
    times_ordered: row[3],
    }));
    
    res.status(200).json(items);
    }
}
