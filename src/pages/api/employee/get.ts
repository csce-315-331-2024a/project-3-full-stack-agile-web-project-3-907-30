import type { NextApiRequest, NextApiResponse } from "next";
import { Employee } from "../../../lib/types";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Get an employee from the database by email.
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getStatement = await db.prepare(
    "SELECT * FROM employees WHERE emp_email = $1",
    { paramTypes: [DataTypeOIDs.varchar] }
  );

  const email = req.body.email;

  const employee = await getStatement.execute({ params: [email] });

  await getStatement.close();

  const rows = employee.rows!;

  if (rows.length === 0) {
    res.status(404).json({ error: "Employee not found" });
  } else {
    const employee: Employee = {
      empId: rows[0][0],
      empName: rows[0][1],
      empEmail: rows[0][2],
      empPicture: rows[0][3],
      isManager: rows[0][4],
      isAdmin: rows[0][5],
      isVerified: rows[0][6],
    };

    res.status(200).json(employee);
  }
}
