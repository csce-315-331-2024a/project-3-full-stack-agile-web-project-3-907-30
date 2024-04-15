import type { NextApiRequest, NextApiResponse } from "next";
import { ProductUsageItem } from "../../../lib/types";
import db from "../../../lib/db";
import { rowToProductUsageItem } from "@/lib/utils";

/**
 * Creates and returns the product usage report within a given date range.
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const selectStatement = await db.prepare(
    `SELECT inventory.inv_id, inventory.inv_name, COALESCE(SUM(inv_menu.amount), 0) as amount FROM inventory
      INNER JOIN inv_menu ON inv_menu.inv_id = inventory.inv_id
      INNER JOIN menu_items on menu_items.item_id = inv_menu.item_id
      INNER JOIN orders_menu ON orders_menu.item_id = menu_items.item_id
      INNER JOIN orders ON orders.order_id = orders_menu.order_id
      WHERE orders.order_date BETWEEN $1 AND $2
      GROUP BY inventory.inv_id;`
  );

  const selectStatementResult = await selectStatement.execute({
    params: [startDate, endDate],
  });

  const rows = selectStatementResult.rows!;

  await selectStatement.close();

  if (rows.length === 0) {
    res.status(404).json({ error: "Errors" });
  } else {
    // convert the rows to an array of ProductUsageItem objects
    const items: ProductUsageItem[] = rows.map((row) =>
      rowToProductUsageItem(row)
    );

    res.status(200).json(items);
  }
}
