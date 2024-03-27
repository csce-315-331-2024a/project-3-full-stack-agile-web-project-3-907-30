// import type { NextApiRequest, NextApiResponse } from "next";
// import { Account } from "../../../lib/types";
// import db from "../../../lib/db";

// /**
//  * Get all accounts from the database
//  *
//  * @param {NextApiRequest} req Request object
//  * @param {NextApiResponse} res Response object
//  */



// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const getStatement = await db.prepare("SELECT * FROM account");

//   const account = await getStatement.execute();

//   await getStatement.close();

//   const rows = account.rows!;

//   if (rows.length === 0) {
//     res.status(404).json({ error: "No accounts found" });
//   } else {
//     // convert the rows to an array of Account objects
//     const accounts: Account[] = rows.map((row) => ({
//       id: row[0],
//       email: row[1],
//       name: row[2],
//       picture: row[3],
//       isEmployee: row[4],
//       isManager: row[5],
//       isAdmin: row[6],
//       points: row[7],
//     }));

//     res.status(200).json(accounts);
//   }
// }

