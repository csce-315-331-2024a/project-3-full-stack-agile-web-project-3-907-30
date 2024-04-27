import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";
import { menuItemsPopularity } from "@/lib/utils";

/**
 * Update a menu item in the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const updateStatement = await db.prepare(
    "UPDATE menu_items SET item_name = $1, item_price = $2, times_ordered = $3, points = $4, cur_price = $5, seasonal_item = $6, deprecated = $7 WHERE item_id = $8;",
    {
      paramTypes: [
        DataTypeOIDs.varchar,
        DataTypeOIDs.numeric,
        DataTypeOIDs.numeric,
        DataTypeOIDs.numeric,
        DataTypeOIDs.numeric,
        DataTypeOIDs.bool,
        DataTypeOIDs.bool,
        DataTypeOIDs.int4,
      ],
    }
  );

  var {
    item_id,
    item_name,
    item_price,
    times_ordered,
    points,
    cur_price,
    seasonal_item,
    deprecated,
    ingredients,
  } = req.body;

  const menuItem = await updateStatement.execute({
    params: [
      item_name,
      item_price,
      times_ordered,
      points,
      cur_price,
      seasonal_item,
      deprecated,
      item_id,
    ],
  });

  await updateStatement.close();

  // Prepare statement to insert new ingredient values
  const insertNewIngredientsStatement = await db.prepare(
    "INSERT INTO inv_menu (item_id, inv_id, amount) VALUES ($1, $2, $3);",
    {
      paramTypes: [
        DataTypeOIDs.int4,
        DataTypeOIDs.int4,
        DataTypeOIDs.int4,

      ],
    }
  );

  // Delete statement to delete the old amounts
  const deleteStatement = await db.prepare(
    "DELETE FROM inv_menu WHERE item_id = $1 AND inv_id = $2;",
    {
      paramTypes: [
        DataTypeOIDs.int4,
        DataTypeOIDs.int4,
      ],
    }
  );

  // Now update the ingredients
  for (let i = 0; i < ingredients.length; i++){
    if (ingredients[i] > 0){
    await deleteStatement.execute({
      params: [
        item_id,
        i,
      ],
    });

    await insertNewIngredientsStatement.execute({
          params: [
            item_id,
            i,
            ingredients[i],
          ],
        });
  }
}

  await insertNewIngredientsStatement.close();

  // return success message if the menu item was updated
  if (menuItem.rowsAffected === 1) {
    res.status(200).json({ status: "success" });
  }
  else {
    res.status(404).json({ error: "menu item not found" });
  }
}
