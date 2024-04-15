import type { NextApiRequest, NextApiResponse } from "next";
import { RevenueReportItem } from "../../../lib/types";
import db from "../../../lib/db";

/**
 * Gets the 5 items which contribute the smallest percent to the revenue
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
    `SELECT menu_items.item_id, menu_items.item_name, menu_items.item_price::numeric, SUM(menu_items.item_price::numeric)
    FROM menu_items
    INNER JOIN orders_menu ON menu_items.item_id = orders_menu.item_id
    INNER JOIN orders ON orders_menu.order_id = orders.order_id  
    GROUP BY menu_items.item_id
    ORDER BY SUM(menu_items.item_price)`
);


const selectStatementResult = await selectStatement.execute();

const rows = selectStatementResult.rows!;

await selectStatement.close();

let revenue = 0;

for (let i = 0; i < rows.length; i++){
    revenue += rows[i][3];
}

const total_revenue = revenue;


if (rows.length === 0) {
    res.status(404).json({ error: "Errors" });
}
else {
    // convert the rows to an array of Employee objects
const items: RevenueReportItem[] = rows.slice(0, 5).map((row) => ({
    id: row[0],
    name: row[1],
    price: row[2],
    revenue: row[3],
    percentage: (parseFloat(row[3]) / total_revenue) * 100 
    }));
    
    res.status(200).json(items);
    }
}
