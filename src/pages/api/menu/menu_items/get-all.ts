import type { NextApiRequest, NextApiResponse } from "next";
import { DetailedMenuItem } from "../../../../lib/types";
import db from "../../../../lib/db";

/**
 * Get all menu items with all related data from the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const getStatement = await db.prepare("SELECT item_id, item_name, item_price::numeric, times_ordered, points, cur_price::numeric, seasonal_item, deprecated FROM menu_items WHERE deprecated=FALSE ORDER BY item_id ASC");
    const menuItemsResult = await getStatement.execute();
    
    await getStatement.close();

    const rows = menuItemsResult.rows!;

    if (rows.length === 0) {
      res.status(404).json({ error: "No menu items found" });
    }
    else {
      // convert the rows to an array of DetailedMenuItem objects
    const menuItems: DetailedMenuItem[] = rows.map((row) => ({
      item_id: row[0],
      item_name: row[1],
      item_price: row[2],
      times_ordered: row[3],
      points: row[4],
      cur_price: row[5],
      seasonal_item: row[6],
      deprecated: row[7],
      ingredients: [0]
    }));

    res.status(200).json(menuItems);

      res.status(200).json(menuItems);
    }
  } catch (error) {
    console.error("Error accessing database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
