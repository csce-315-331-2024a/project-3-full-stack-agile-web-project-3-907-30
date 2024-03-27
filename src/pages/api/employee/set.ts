import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Set an employee as a manager or admin
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getStatement = await db.prepare(
    'UPDATE employees SET "is_manager" = $1, "is_admin" = $2 WHERE "emp_email" = $3',
    {
      paramTypes: [DataTypeOIDs.bool, DataTypeOIDs.bool, DataTypeOIDs.varchar],
    }
  );

  const isManager = req.body.isManager;
  const isAdmin = req.body.isAdmin;
  const email = req.body.email;

  const employee = await getStatement.execute({
    params: [isManager, isAdmin, email],
  });

  await getStatement.close();

  // return success message if the employee was updated
  if (employee.rowsAffected === 1) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(404).json({ error: "Employee not found" });
  }
}
