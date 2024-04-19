import type { NextApiRequest, NextApiResponse } from "next";
import { InventoryItem } from "../../../lib/types";
import db from "../../../lib/db";

/**
 * Get all inventory items from the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getStatement = await db.prepare(
    "SELECT inv_id, inv_name, inv_price::numeric, fill_level, current_level, times_refilled, date_refilled, has_dairy, has_nuts, has_eggs, is_vegan, is_halal FROM inventory ORDER BY inv_id ASC;"
  );

  const inventoryItem = await getStatement.execute();

  await getStatement.close();

  const rows = inventoryItem.rows!;

  if (rows.length === 0) {
    res.status(404).json({ error: "No inventory items found" });
  } else {
    // convert the rows to an array of Inventory item objects
    const inventoryItems: InventoryItem[] = rows.map((row) => ({
      id: row[0],
      name: row[1],
      price: row[2],
      fill_level: row[3],
      curr_level: row[4],
      times_refilled: row[5],
      date_refilled: row[6],
      has_dairy: row[7],
      has_nuts: row[8],
      has_eggs: row[9],
      is_vegan: row[10],
      is_halal: row[11],
    }));

    res.status(200).json(inventoryItems);
  }
}
