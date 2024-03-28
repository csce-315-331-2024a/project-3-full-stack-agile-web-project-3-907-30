import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";


/**
 * Get the next available order ID from the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const limit = 1;

  const getStatement = await db.prepare("SELECT order_id FROM orders ORDER BY order_id DESC LIMIT $1",
  {
    paramTypes: [DataTypeOIDs.int2]
  });

  const queryResult = await getStatement.execute(
    {params: [limit]}
  );

  await getStatement.close();

  const rows = queryResult.rows!;


  if (rows.length === 0) {
    res.status(404).json({ error: "Query to get next order ID failed" });
  } else {
    const nextOrderId = rows[0][0] + 1;
    res.status(200).json({ nextOrderId });
  }
}