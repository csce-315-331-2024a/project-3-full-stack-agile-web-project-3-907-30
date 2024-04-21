import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Add an inventory item to the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const latestIdStatement = await db.prepare(
    "SELECT MAX(inv_id) FROM inventory;",
    {
      paramTypes: [],
    }
  );

  const latestIdRow = await latestIdStatement.execute();

  const addStatement = await db.prepare(
    "INSERT INTO inventory (inv_id, inv_name, inv_price, fill_level, current_level, times_refilled, date_refilled, has_dairy, has_nuts, has_eggs, is_vegan, is_halal) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);",
    {
      paramTypes: [
        DataTypeOIDs.int4,
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
      ],
    }
  );

  var {
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
  const latestId = latestIdRow.rows![0][0];

  const inventoryItem = await addStatement.execute({
    params: [
      latestId + 1,
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
    ],
  });

  await addStatement.close();

  // return success message if the inventory item was added
  if (inventoryItem.rowsAffected === 1) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(404).json({ error: "Failed to add inventory item" });
  }
}
