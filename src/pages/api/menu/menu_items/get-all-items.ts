// api/menu/menu_items/get-all-items.ts

import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../lib/db";

/**
 * Get all menu items from the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const getStatement = await db.prepare("SELECT item_name FROM menu_items ORDER BY item_id ASC WHERE deprecated = false");
    const menuItemsResult = await getStatement.execute();
    
    await getStatement.close();

    const rows = menuItemsResult.rows!;

    if (rows.length === 0) {
      res.status(404).json({ error: "No menu items found" });
    } else {
      // Convert the rows to an array of item names
      const menuItems: string[] = rows.map((row) => row[0]);

      res.status(200).json(menuItems);
    }
  } catch (error) {
    console.error("Error accessing database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
