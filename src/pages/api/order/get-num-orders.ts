import type { NextApiRequest, NextApiResponse } from "next";
import { OrderItem } from "../../../lib/types";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Get the total number orders from the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getStatement = await db.prepare("SELECT count(*) FROM orders;");

  const orderCount = await getStatement.execute();

  await getStatement.close();

  const rows = orderCount.rows!;

  if (rows.length === 0) {
    res.status(404).json({ error: "No orders found" });
  } else {
    const orderCount: number = rows[0][0];

    res.status(200).json(orderCount);
  }
}
