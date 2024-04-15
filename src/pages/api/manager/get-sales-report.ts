import type { NextApiRequest, NextApiResponse } from "next";
import { SalesReportItem } from "../../../lib/types";
import db from "../../../lib/db";
import { rowToSalesReportItem } from "@/lib/utils";

/**
 * Creates and returns the sales report within a given date range.
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
    `SELECT menu_items.item_id, menu_items.item_name, COUNT(*)*menu_items.item_price::numeric as profit
      FROM menu_items
      INNER JOIN orders_menu ON menu_items.item_id = orders_menu.item_id
      INNER JOIN orders ON orders_menu.order_id = orders.order_id
      WHERE orders.order_date BETWEEN $1 AND $2
      GROUP BY menu_items.item_id;`
  );

  const selectStatementResult = await selectStatement.execute({
    params: [startDate, endDate],
  });

  const rows = selectStatementResult.rows!;

  await selectStatement.close();

  if (rows.length === 0) {
    res.status(404).json({ error: "Errors" });
  } else {
    // convert the rows to an array of SalesReportItem objects
    const items: SalesReportItem[] = rows.map((row) =>
      rowToSalesReportItem(row)
    );

    res.status(200).json(items);
  }
}
