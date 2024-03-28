import type { NextApiRequest, NextApiResponse } from "next";
import { Customer } from "../../../lib/types";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";
import { sha256 } from "js-sha256";

/**
 * Get a customer from the database by hashed phone number.
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getStatement = await db.prepare(
    "SELECT cust_id, cust_name, phone_number, num_orders, total_spent::numeric, points FROM customers WHERE phone_number = $1",
    { paramTypes: [DataTypeOIDs.varchar] }
  );

  const phone = req.body.phone;
  const hashedPhone = sha256(phone);

  const customer = await getStatement.execute({ params: [hashedPhone] });

  await getStatement.close();

  const rows = customer.rows!;

  if (rows.length === 0) {
    res.status(404).json({ error: "Customer not found" });
  } else {
    const customer: Customer = {
      cust_id: rows[0][0],
      cust_name: rows[0][1],
      phone_number: rows[0][2],
      num_orders: rows[0][3],
      total_spent: rows[0][4],
      points: rows[0][5],
    };

    res.status(200).json(customer);
  }
}
