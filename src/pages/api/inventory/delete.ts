import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Remove an inventory item from the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const deleteStatement = await db.prepare(
    'DELETE FROM inventory WHERE "inv_id" = $1;',
    {
      paramTypes: [DataTypeOIDs.int4],
    }
  );

  const invId: number = req.body.id;

  const inventoryItem = await deleteStatement.execute({
    params: [invId],
  });

  await deleteStatement.close();

  // return success message if the inventory item was deleted
  if (inventoryItem.rowsAffected === 1) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(404).json({ error: "Inventory item not found" });
  }
}
