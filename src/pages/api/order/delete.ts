import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Remove an order from the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const deleteStatement = await db.prepare(
    'DELETE FROM orders WHERE "order_id" = $1;',
    {
      paramTypes: [DataTypeOIDs.int4],
    }
  );

  const order_id: number = req.body.orderId;

  const orderItem = await deleteStatement.execute({
    params: [order_id],
  });

  await deleteStatement.close();

  // return success message if the order was deleted
  if (orderItem.rowsAffected === 1) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(404).json({ error: "Order not found" });
  }
}
