import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";

/**
 * Deletes an order from the database.
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { orderId } = req.body;

    // Parse the string values to their respective types
    const orderIdInt = parseInt(orderId, 10);

    try {

        // When an order is deleted from orders, the corresponding records from orders_menu are also deleted
        const orderDeleteStatement = await db.prepare(
            "DELETE FROM orders WHERE order_id = $1"
          );
      
        await orderDeleteStatement.execute({
          params: [orderIdInt],
        });

        orderDeleteStatement.close();
        res.status(200).json({ message: 'Order deleted successfully' });
    }
    catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Error deleting order' });
    }
}