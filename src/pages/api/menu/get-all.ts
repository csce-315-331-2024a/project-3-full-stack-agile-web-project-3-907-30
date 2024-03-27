import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { MenuItem } from "@/lib/types";
import { executeStatement, rowToMenuItem } from "@/lib/utils";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Get all accounts from the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const items = await executeStatement(db, "SELECT item_id, item_name, item_price::numeric, times_ordered FROM menu_items;", [] , []);
  const rows = items.rows!;

  if (rows.length === 0) {
    res.status(404).json({ error: "No menu item found" });
  } else {
    // convert the rows to an array of Account objects
    const items = rows.map((row: any[]) => {
      return rowToMenuItem(row);
    })

    res.status(200).json(items);
  }
}