// Filename: api/menu/get-item-price

import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests for this API route
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
    return;
  }

  const itemName = req.query.itemName as string; // or get from req.body if using POST

  if (!itemName) {
    res.status(400).json({ error: "Item name is required" });
    return;
  }

  const getStatement = await db.prepare(
    "SELECT item_price FROM menu_items WHERE item_name = $1",
    { paramTypes: [DataTypeOIDs.varchar] } // item_name is a varchar type
  );

  const result = await getStatement.execute({ params: [itemName] });

  await getStatement.close();

  const rows = result.rows!;

  if (rows.length === 0) {
    res.status(404).json({ error: "Menu item not found" });
  } else {
    const price = rows[0][0]; // assuming item_price is the first column

    res.status(200).json({ price });
  }
}
