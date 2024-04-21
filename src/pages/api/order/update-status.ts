import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Update an order's status in the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const updateStatement = await db.prepare(
    "UPDATE orders SET status = $1 WHERE order_id = $2;",
    {
      paramTypes: [DataTypeOIDs.int4, DataTypeOIDs.int4],
    }
  );

  var order_id = req.body.orderId;
  var status = req.body.status;

  const orderItem = await updateStatement.execute({
    params: [status, order_id],
  });

  await updateStatement.close();

  // return success message if the order was updated
  if (orderItem.rowsAffected === 1) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(404).json({ error: "Order not found" });
  }
}
