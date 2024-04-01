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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId, orderTotal, custId, empId, chosenItems, quantities } = req.body;

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
    
    // First, Get IDs for each of the menu items
    const selectStatement = await db.prepare(
      "SELECT item_name FROM menu_items ORDER BY item_id ASC"
    );

    const selectStatementResult = await selectStatement.execute();

await selectStatement.close();

    const rows = selectStatementResult.rows!;
    const menuItemsOrderedById: string[] = rows.map((row) => row[0]);
    
    let parametersArray = [];
    
    for (let i = 0; i < chosenItems.length; i++){
      const currentId = menuItemsOrderedById.indexOf(chosenItems[i]);
      for (let j = 0; j < quantities[i]; j++){
        parametersArray.push(orderIdInt, currentId);
      }
    }

    // One insert is much more optimized than multiple insert statements
    let updateStatementString = "INSERT INTO orders_menu (order_id, item_id) VALUES";

    for (let i = 1; i <= parametersArray.length/2 - 1; i++){
      updateStatementString =  updateStatementString + ` ($${2*i-1}, $${2*i}),`;
    }
    updateStatementString =  updateStatementString + ` ($${2*(parametersArray.length/2)-1}, $${2*(parametersArray.length/2)})`;
    
    const updateStatement = await db.prepare(updateStatementString);

  await updateStatement.execute({
    params: parametersArray,
  });

  await updateStatement.close();
    res.status(200).json({ message: 'Order submitted successfully' });
  } catch (error) {
    console.error("Error submitting order:", error);
    res.status(500).json({ error: "Error submitting order" });
  }
}
