import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Set an account as an employee or manager
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getStatement = await db.prepare(
    'UPDATE account SET "is_employee" = $1, "is_manager" = $2, "is_admin" = $3 WHERE "email" = $4',
    {
      paramTypes: [
        DataTypeOIDs.bool,
        DataTypeOIDs.bool,
        DataTypeOIDs.bool,
        DataTypeOIDs.varchar,
      ],
    }
  );

  const isEmployee = req.body.isEmployee;
  const isManager = req.body.isManager;
  const isAdmin = req.body.isAdmin;
  const email = req.body.email;

  const account = await getStatement.execute({
    params: [isEmployee, isManager, isAdmin, email],
  });

  await getStatement.close();

  // return success message if the account was updated
  if (account.rowsAffected === 1) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(404).json({ error: "Account not found" });
  }
}
