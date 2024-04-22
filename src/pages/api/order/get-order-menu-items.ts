import type { NextApiRequest, NextApiResponse } from "next";
import { OrderMenuItem } from "../../../lib/types";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Get all menu items used in an order
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getStatement = await db.prepare(
    "SELECT mi.item_id, mi.item_name, COUNT(*) AS quantity FROM orders o JOIN orders_menu om ON o.order_id = om.order_id JOIN menu_items mi ON om.item_id = mi.item_id WHERE o.order_id = $1 GROUP BY mi.item_id, mi.item_name;",
    {
      paramTypes: [DataTypeOIDs.int4],
    }
  );

  const order_id = req.body.orderId;

  const orderItem = await getStatement.execute({
    params: [order_id],
  });

  await getStatement.close();

  const rows = orderItem.rows!;

  // convert the rows to an array of order menu item objects
  const orderMenuItems: OrderMenuItem[] = rows.map((row) => ({
    item_id: row[0],
    item_name: row[1],
    quantity: row[2],
  }));

  res.status(200).json(orderMenuItems);
}
