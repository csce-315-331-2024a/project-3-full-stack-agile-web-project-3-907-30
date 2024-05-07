import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { itemName, salePrice, saleStart, saleEnd } = req.body;
  
      try {
          const updateMenuItemStatement = await db.prepare(`UPDATE menu_items SET sale_price = $1, sale_start = $2,
            sale_end = $3 WHERE item_name = $4`, {paramTypes: [DataTypeOIDs.numeric, DataTypeOIDs.date, DataTypeOIDs.date,
                DataTypeOIDs.text ]});
  
      await updateMenuItemStatement.execute({
        params: [ itemName, salePrice, saleStart, saleEnd ]
      });
  
      await updateMenuItemStatement.close();

      return res.status(200).json({message: 'Item sale status sucessfully updated'});
    }
    catch (error) {
      console.error("Error putting menu item on sale.", error);
      res.status(500).json({ error: "Error putting menu item on sale." });
    }
  }
  