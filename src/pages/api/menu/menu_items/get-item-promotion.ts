/**
 * API endpoint to get all menu items and their prices
 * @module /api/menu/menu_items/get-item-promotion
 */

import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../lib/db";

/**
 * Get all menu items from the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 * @returns {Promise<void>} A promise that resolves when the request is complete
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const getStatement = await db.prepare(
        "SELECT item_id, item_price::numeric, cur_price::numeric FROM menu_items ORDER BY item_id ASC"
    );
    const menuItemsResult = await getStatement.execute();
    
    await getStatement.close();

    const rows = menuItemsResult.rows!;

   

    // If there are no menu items, return an error
    if (rows.length === 0) {
      res.status(404).json({ error: "No menu items found" });
    } 
    
    else {

      // Convert the rows to an array of objetcs with item name and price
        const menuItems = rows.map((row) => {
            return {
            id: row[0],
            price: row[1],
            currentPrice: row[2]
            }
        });
        

      res.status(200).json(menuItems);
    }
  } catch (error) {
    console.error("Error accessing database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}