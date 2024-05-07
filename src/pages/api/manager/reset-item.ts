import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
    
    const { itemName } = req.body; 

      try {
          const resetMenuItemStatement = await db.prepare(`UPDATE menu_items SET sale_price = null, sale_start = null,
          sale_end = null, cur_price = item_price WHERE item_name = $1;`, {paramTypes: [DataTypeOIDs.text]});
  
      await resetMenuItemStatement.execute({params: [itemName]});
  
      await resetMenuItemStatement.close();

      return res.status(200).json({message: 'Item successfully reset'});
    }
    catch (error) {
      console.error("Error resetting item.", error);
      res.status(500).json({ error: "Error resetting item." });
    }
  }
  