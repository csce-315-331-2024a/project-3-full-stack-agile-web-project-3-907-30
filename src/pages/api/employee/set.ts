import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Set an employee as verified, a manager or admin
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getStatement = await db.prepare(
    'UPDATE employees SET "is_manager" = $1, "is_admin" = $2, "is_verified" = $3 WHERE "emp_email" = $4',
    {
      paramTypes: [
        DataTypeOIDs.bool,
        DataTypeOIDs.bool,
        DataTypeOIDs.bool,
        DataTypeOIDs.varchar,
      ],
    }
  );

  const isManager: boolean = req.body.isManager;
  const isAdmin: boolean = req.body.isAdmin;
  const isVerified: boolean = req.body.isVerified;
  const email: string = req.body.email;

  const employee = await getStatement.execute({
    params: [isManager, isAdmin, isVerified, email],
  });

  await getStatement.close();

  // return success message if the employee was updated
  if (employee.rowsAffected === 1) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(404).json({ error: "Employee not found" });
  }
}
