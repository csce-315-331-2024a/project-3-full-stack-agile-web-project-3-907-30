import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Updates the sale status of a menu item in the database.
 * @example
 * handler(req, res)
 * @param {NextApiRequest} req - The request object containing the menu item information.
 * @param {NextApiResponse} res - The response object used to send the updated sale status message.
 * @returns {NextApiResponse} Returns a response object with a success message or an error message.
 * @description
 *   - Checks if the request method is POST and returns an error if it is not.
 *   - Destructures the itemName, salePrice, saleStart, and saleEnd from the request body.
 *   - Uses a prepared statement to update the menu item's sale status in the database.
 *   - Returns a success message if the update is successful.
 *   - Logs and returns an error message if there is an error with the update.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { itemName, salePrice, saleStart, saleEnd } = req.body;
      try {
          const updateMenuItemStatement = await db.prepare(`UPDATE menu_items SET sale_price = $1, sale_start = $2,
            sale_end = $3 WHERE item_name = $4;`, {paramTypes: [DataTypeOIDs.numeric, DataTypeOIDs.date, DataTypeOIDs.date,
                DataTypeOIDs.text ]});
  
      await updateMenuItemStatement.execute({
        params: [ salePrice, saleStart, saleEnd, itemName ]
      });
  
      await updateMenuItemStatement.close();

      return res.status(200).json({message: 'Item sale status sucessfully updated'});
    }
    catch (error) {
      console.error("Error putting menu item on sale.", error);
      res.status(500).json({ error: "Error putting menu item on sale." });
    }
  }
  