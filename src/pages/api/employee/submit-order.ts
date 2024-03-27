import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";

/**
 * Submits an order to the database.
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId, orderTotal, custId, empId } = req.body;

  // Parse the string values to their respective types
    const orderIdInt = parseInt(orderId, 10);
    const custIdInt = parseInt(custId, 10);
    const empIdInt = parseInt(empId, 10);
    const orderTotalMoney = parseFloat(orderTotal); // might have issues here

    try {
        const insertStatement = await db.prepare(
            "INSERT INTO orders (order_id, order_date, order_time, order_total, cust_id, emp_id) VALUES ($1, CURRENT_DATE, date_trunc('second', CURRENT_TIMESTAMP), $2::money, $3, $4)"
          );
      
        await insertStatement.execute({
          params: [orderIdInt, orderTotalMoney, custIdInt, empIdInt],
        });

    await insertStatement.close();

    res.status(200).json({ message: 'Order submitted successfully' });
  } catch (error) {
    console.error('Error submitting order:', error);
    res.status(500).json({ error: 'Error submitting order' });
  }
}