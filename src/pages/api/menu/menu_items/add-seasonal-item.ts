/**
 * API endpoint to add a new menu item
 * @module /api/menu/menu_items/add-item
 */

import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";


/**
 * Add a new menu item to the database
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 * @returns {Promise<void>} A promise that resolves when the request is complete
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

const latestIdStatement = await db.prepare(
  "SELECT MAX(item_id) FROM menu_items;",
  
);

const latestIdRow = await latestIdStatement.execute();

const addStatement = await db.prepare(
  "INSERT into menu_items (item_id, item_name, item_price, times_ordered, points, cur_price, seasonal_item, deprecated) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);",
  {
    paramTypes: [
      DataTypeOIDs.int4,
      DataTypeOIDs.varchar,
      DataTypeOIDs.numeric,
      DataTypeOIDs.int4,
      DataTypeOIDs.int4,
      DataTypeOIDs.numeric,
      DataTypeOIDs.bool,
      DataTypeOIDs.bool,
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

const latestId = latestIdRow.rows![0][0];

const menuItem = await addStatement.execute({
  params: [
    latestId + 1,
    item_name,
    item_price,
    times_ordered,
    points,
    cur_price,
    seasonal_item,
    deprecated,
  ],
}
);

await addStatement.close();


  // Prepare statement to insert ingredients:
  const addIngredientStatement = await db.prepare(
    "INSERT into inv_menu (item_id, inv_id, amount) VALUES ($1, $2, $3);",
    {
      paramTypes: [
        DataTypeOIDs.int4,
        DataTypeOIDs.int4,
        DataTypeOIDs.int4,

      ],
    }
  );

  // Insert each ingredient into the database:
  for (const ingredient of ingredients) {
    await addIngredientStatement.execute({
      params: [
        latestId + 1,
        ingredient.inv_id,
        ingredient.amount,
      ],
    });
  }

  await addIngredientStatement.close();




  if (menuItem.rowsAffected === 1) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(404).json({ status: "error" });
  }

}

// ADD INGREDIENTS WHEN ADDING A NEW MENU ITEM



  
  








