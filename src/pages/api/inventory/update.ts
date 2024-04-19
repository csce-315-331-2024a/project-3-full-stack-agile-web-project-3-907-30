import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Update an inventory item in the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const updateStatement = await db.prepare(
    "UPDATE inventory SET inv_name = $1, inv_price = $2, fill_level = $3, current_level = $4, times_refilled = $5, date_refilled = $6, has_dairy = $7, has_nuts = $8, has_eggs = $9, is_vegan = $10, is_halal = $11 WHERE inv_id = $12;",
    {
      paramTypes: [
        DataTypeOIDs.varchar,
        DataTypeOIDs.numeric,
        DataTypeOIDs.numeric,
        DataTypeOIDs.numeric,
        DataTypeOIDs.numeric,
        DataTypeOIDs.date,
        DataTypeOIDs.bool,
        DataTypeOIDs.bool,
        DataTypeOIDs.bool,
        DataTypeOIDs.bool,
        DataTypeOIDs.bool,
        DataTypeOIDs.int4,
      ],
    }
  );

  var {
    id,
    name,
    price,
    fill_level,
    curr_level,
    times_refilled,
    date_refilled,
    has_dairy,
    has_nuts,
    has_eggs,
    is_vegan,
    is_halal,
  } = req.body;

  date_refilled = new Date(date_refilled);

  const inventoryItem = await updateStatement.execute({
    params: [
      name,
      price,
      fill_level,
      curr_level,
      times_refilled,
      date_refilled,
      has_dairy,
      has_nuts,
      has_eggs,
      is_vegan,
      is_halal,
      id,
    ],
  });

  await updateStatement.close();

  // return success message if the inventory item was updated
  if (inventoryItem.rowsAffected === 1) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(404).json({ error: "Inventory item not found" });
  }
}
