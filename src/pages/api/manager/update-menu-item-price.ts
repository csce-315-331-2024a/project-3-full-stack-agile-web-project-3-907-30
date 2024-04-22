import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";


/**
 * Updates the price of a menu item.
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { itemName, newPrice } = req.body;

  const newPriceFloat = parseFloat(newPrice);

  try {
    const updateMenuItemStatement = await db.prepare(
      "UPDATE menu_items SET item_price = $1 WHERE item_name = $2"
    );

    await updateMenuItemStatement.execute({
      params: [newPriceFloat, itemName],
    });

    await updateMenuItemStatement.close();
  }
  catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ error: "Error updating menu item" });
  }
}
