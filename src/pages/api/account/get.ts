import type { NextApiRequest, NextApiResponse } from "next";
import { Account } from "../../../lib/types";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Get an account from the database by email.
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getStatement = await db.prepare(
    "SELECT * FROM account WHERE email = $1",
    { paramTypes: [DataTypeOIDs.varchar] }
  );

  const email = req.body.email;

  const account = await getStatement.execute({ params: [email] });

  await getStatement.close();

  const rows = account.rows!;

  if (rows.length === 0) {
    res.status(404).json({ error: "Account not found" });
  } else {
    const account: Account = {
      id: rows[0][0],
      email: rows[0][1],
      name: rows[0][2],
      picture: rows[0][3],
      isEmployee: rows[0][4],
      isManager: rows[0][5],
      points: rows[0][6],
    };

    res.status(200).json(account);
  }
}
