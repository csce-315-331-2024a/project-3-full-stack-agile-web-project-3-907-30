import type { NextApiRequest, NextApiResponse } from "next";
import { ExcessReportItem } from "../../../lib/types";
import db from "../../../lib/db";

/**
 * Creates and returns the excess report
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
    `SELECT inventory.inv_id, inv_name, SUM(amount) + inventory.current_level AS initial_amount, CAST(SUM(amount) AS DECIMAL)/(SUM(amount) + inventory.current_level) * 100 AS percent_used
    FROM Orders
    INNER JOIN orders_menu ON Orders.order_id = orders_menu.order_id
    INNER JOIN inv_menu ON orders_menu.item_id = inv_menu.item_id
    INNER JOIN inventory ON inv_menu.inv_id = inventory.inv_id
    WHERE order_date >= '2023-01-01'
    GROUP BY inventory.inv_id
    HAVING CAST(SUM(amount) AS DECIMAL)/(SUM(amount) + inventory.current_level) * 100 < 50
    ORDER BY inventory.inv_id;`
);


const selectStatementResult = await selectStatement.execute();

const rows = selectStatementResult.rows!;

await selectStatement.close();

if (rows.length === 0) {
    res.status(404).json({ error: "Errors" });
}
else {
    // convert the rows to an array of Employee objects
const items: ExcessReportItem[] = rows.map((row) => ({
    id: row[0],
    name: row[1],
    initial_amount: row[2],
    percent_used: row[3],
    }));
    
    res.status(200).json(items);
    }
}
