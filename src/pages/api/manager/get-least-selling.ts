import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";

/**
 * Gets the 10 least selling items from the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }


    try {
        
    
    // First, Get IDs for each of the menu items
    const selectStatement = await db.prepare(
      ""
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
