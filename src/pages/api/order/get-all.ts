import type { NextApiRequest, NextApiResponse } from "next";
import { OrderItem } from "../../../lib/types";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Get all orders from the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getStatement = await db.prepare(
    "SELECT order_id, order_date, order_time::varchar(8), order_total::numeric, cust_id, emp_id, used_points, status FROM orders ORDER BY order_id DESC LIMIT 100 OFFSET $1;",
    {
      paramTypes: [DataTypeOIDs.int4],
    }
  );

  const offset = req.body.offset || 0;

  const orderItem = await getStatement.execute({
    params: [offset],
    fetchCount: 100,
  });

  await getStatement.close();

  const rows = orderItem.rows!;

  if (rows.length === 0) {
    res.status(404).json({ error: "No orders found" });
  } else {
    // convert the rows to an array of order item objects
    const orderItems: OrderItem[] = rows.map((row) => ({
      order_id: row[0],
      order_date: row[1],
      order_time: row[2],
      order_total: row[3],
      cust_id: row[4],
      emp_id: row[5],
      used_points: row[6],
      status: row[7],
    }));

    res.status(200).json(orderItems);
  }
}
