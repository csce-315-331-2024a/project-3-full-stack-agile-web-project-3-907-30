import type { NextApiRequest, NextApiResponse } from "next";
import { Employee } from "../../../lib/types";
import db from "../../../lib/db";

/**
 * Get employee accounts from the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getStatement = await db.prepare(
    "SELECT * FROM Employees WHERE is_verified=TRUE AND is_manager=FALSE AND is_admin=FALSE ORDER BY emp_id ASC"
  );

  const queryResult = await getStatement.execute();

  await getStatement.close();

  const rows = queryResult.rows!;

  if (rows.length === 0) {
    res.status(404).json({ error: "No employees found" });
  } else {
    // convert the rows to an array of Employee objects
    const employees: Employee[] = rows.map((row) => ({
      empId: row[0],
      empName: row[1],
      empEmail: row[2],
      empPicture: row[3],
      isManager: row[4],
      isAdmin: row[5],
      isVerified: row[6],
      totalOrders: row[7],
    }));

    res.status(200).json(employees);
  }
}
