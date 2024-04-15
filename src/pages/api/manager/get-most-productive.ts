import type { NextApiRequest, NextApiResponse } from "next";
import {
  ExcessReportItem,
  MostProductiveEmployeeItem,
} from "../../../lib/types";
import db from "../../../lib/db";
import { rowToMostProductiveEmployeeItem } from "@/lib/utils";

/**
 * Creates and returns the most productive employees
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
    `SELECT
      e.emp_id,
      e.emp_name,
      COUNT(o.order_id) AS total_orders
    FROM
        employees e
    JOIN
        orders o ON e.emp_id = o.emp_id
    WHERE
        o.order_date BETWEEN $1 AND $2
    GROUP BY
        e.emp_id,
        e.emp_name
    ORDER BY
        total_orders DESC;`
  );

  const selectStatementResult = await selectStatement.execute({
    params: [startDate, endDate],
  });

  const rows = selectStatementResult.rows!;

  await selectStatement.close();

  if (rows.length === 0) {
    res.status(404).json({ error: "Errors" });
  } else {
    // convert the rows to an array of Employee objects
    const items: MostProductiveEmployeeItem[] = rows.map((row) =>
      rowToMostProductiveEmployeeItem(row)
    );

    res.status(200).json(items);
  }
}
