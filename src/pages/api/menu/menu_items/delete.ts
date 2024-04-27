import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Remove a menu item from the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const deleteStatement = await db.prepare(
    'DELETE FROM menu_items WHERE "item_id" = $1;',
    {
      paramTypes: [DataTypeOIDs.int4],
    }
  );

  const menuID: number = req.body.id;

  const menuItem = await deleteStatement.execute({
    params: [menuID],
  });

  await deleteStatement.close();

  // return success message if the inventory item was deleted
  if (menuItem.rowsAffected === 1) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(404).json({ error: "Menu item not found" });
  }
}
