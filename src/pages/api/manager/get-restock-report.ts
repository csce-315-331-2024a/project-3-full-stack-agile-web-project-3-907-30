import type { NextApiRequest, NextApiResponse } from "next";
import { RestockReportItem } from "../../../lib/types";
import db from "../../../lib/db";

/**
 * Creates and returns the restock report
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }



const selectStatement = await db.prepare(
    `SELECT inv_id, inv_name, current_level, fill_level FROM inventory WHERE current_level < fill_level;`
);


const selectStatementResult = await selectStatement.execute();

const rows = selectStatementResult.rows!;

await selectStatement.close();

if (rows.length === 0) {
    res.status(404).json({ error: "Errors" });
}
else {
    // convert the rows to an array of Employee objects
const items: RestockReportItem[] = rows.map((row) => ({
    id: row[0],
    name: row[1],
    current_level: row[2],
    fill_level: row[3],
    }));
    
    res.status(200).json(items);
    }
}
