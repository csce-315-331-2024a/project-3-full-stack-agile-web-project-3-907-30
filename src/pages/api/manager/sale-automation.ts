import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { TbDatabaseExclamation } from "react-icons/tb";
import { DataTypeOIDs } from "postgresql-client";
import { parseArgs } from "util";


export default async function handler (
    req:NextApiRequest,
    res:NextApiResponse
) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try{
        const getTempItems = await db.prepare(`SELECT item_id, sale_end, seasonal_item, sale_start, sale_price::numeric
         FROM menu_items WHERE sale_end IS NOT NULL`);
        const tempItems = await getTempItems.execute();
        await getTempItems.close();

        if(tempItems.rows!.length == 0){
            return res.status(503).json({ message: "There are no temporary items to remove" })
        }
        else{
            const todaysDate = new Date();
            let itemsReset: number = 0;
            let itemsPushedToMenu: number = 0;
            for(const row of tempItems.rows!) {
                if(row[1] <= todaysDate) {
                    //Not a seasonal menu item
                    if(row[2] === false) { 
                        const resetItem = await db.prepare(`UPDATE menu_items SET cur_price = item_price, 
                        sale_end = NULL WHERE item_id = $1`,
                            {paramTypes: [DataTypeOIDs.numeric]});
                        await resetItem.execute({params: [row[0]]});
                        await resetItem.close();
                        itemsReset++;
                    }
                    else {
                        const removeSeasonal = await db.prepare(`UPDATE menu_items SET deprecated = true WHERE item_id = $1`,
                            {paramTypes: [DataTypeOIDs.numeric]});
                        await removeSeasonal.execute({params: [row[0]]});
                        await removeSeasonal.close();
                        itemsReset++;
                    }
                }
                //If today is within a sale/seasonal item window
                else if(todaysDate < row[1] && todaysDate >= row[3]) {
                    //Not a seasonal menu item
                    if(row[2] === false) { 
                        const initiateSale = await db.prepare(`UPDATE menu_items SET cur_price = sale_price WHERE item_id = $1`,
                            {paramTypes: [DataTypeOIDs.numeric]});
                        await initiateSale.execute({params: [row[0]]});
                        await initiateSale.close();
                        itemsPushedToMenu++;
                    }
                    else {
                        const initiateSeasonal = await db.prepare(`UPDATE menu_items SET deprecated = false WHERE item_id = $1`,
                            {paramTypes: [DataTypeOIDs.numeric]});
                        await initiateSeasonal.execute({params: [row[0]]});
                        await initiateSeasonal.close();
                        itemsPushedToMenu++;
                    }
                }
            }
            return res.status(200).json({message: "Items reset: "+itemsReset})
        }
    }
    catch(error){
        console.error("Date based delete failed");
        return res.status(500).json({ error: "Date based delete failed" });
    }
}