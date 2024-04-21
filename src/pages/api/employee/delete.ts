import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Remove an employee from the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const deleteStatement = await db.prepare(
    'DELETE FROM employees WHERE "emp_id" = $1;',
    {
      paramTypes: [DataTypeOIDs.int4],
    }
  );

  const empId: number = req.body.empId;

  const employee = await deleteStatement.execute({
    params: [empId],
  });

  await deleteStatement.close();

  // return success message if the employee was deleted
  if (employee.rowsAffected === 1) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(404).json({ error: "Employee not found" });
  }
}
