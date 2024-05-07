import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Updates the sale price, start date, and end date of a menu item to null and sets the current price to the original item price.
 * @example
 * handler(req, res)
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns {NextApiResponse} A response object with a message indicating the item was successfully reset.
 * @description
 *   - Checks if the request method is POST and returns an error if it is not.
 *   - Retrieves the item name from the request body.
 *   - Updates the menu item in the database with the original price and null values for sale price, start date, and end date.
 *   - Returns a success message if the item was successfully reset.
 *   - Logs and returns an error if there is an issue resetting the item.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
    
    const { itemName } = req.body; 

      try {
          const resetMenuItemStatement = await db.prepare(`UPDATE menu_items SET sale_price = null, sale_start = null,
          sale_end = null, cur_price = item_price WHERE item_name = $1;`, {paramTypes: [DataTypeOIDs.text]});
  
      await resetMenuItemStatement.execute({params: [itemName]});
  
      await resetMenuItemStatement.close();

      return res.status(200).json({message: 'Item successfully reset'});
    }
    catch (error) {
      console.error("Error resetting item.", error);
      res.status(500).json({ error: "Error resetting item." });
    }
  }
  