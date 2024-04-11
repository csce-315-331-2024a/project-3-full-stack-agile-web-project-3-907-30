import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { PairsAndAppearance } from "@/lib/types";
import { DataTypeOIDs } from "postgresql-client";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { startDate, endDate } = req.query;

    try{
        const getPairs = await db.prepare(`SELECT mp.item1_name, mp.item2_name, COUNT(DISTINCT so1.order_id) AS pair_appearances
        FROM menu_pairs AS mp 
        JOIN (
        SELECT orders.order_id, item_id
        FROM orders
        JOIN orders_menu ON orders_menu.order_id = orders.order_id
        WHERE orders.order_date BETWEEN $1 AND $2
        ) AS so1 ON so1.item_id = mp.item1_id 
        JOIN (
        SELECT orders.order_id, item_id
        FROM orders
        JOIN orders_menu ON orders_menu.order_id = orders.order_id
        WHERE orders.order_date BETWEEN $3 AND $4
        ) AS so2 ON so2.item_id = mp.item2_id AND so2.order_id = so1.order_id 
        GROUP BY mp.item1_id, mp.item2_id, mp.item1_name, mp.item2_name
        ORDER BY pair_appearances DESC;`, {paramTypes: [DataTypeOIDs.date, DataTypeOIDs.date,
        DataTypeOIDs.date, DataTypeOIDs.date]});

        const pairs = await getPairs.execute({params:[startDate, endDate, startDate, endDate]});

        await getPairs.close();

        if(pairs.rows!.length === 0) {
            res.status(400).json({ error: "There were no pairs found" });
        }
        else {
            const pairsData: PairsAndAppearance[] = pairs.rows!.map((row) => 
                ({
                    item1: row[0],
                    item2: row[1],
                    appearances: row[2]
                })
            )
            res.status(200).json(pairsData);
        }
    }
    catch(error){
        console.error("Error getting pairs", error);
        res.status(500).json({ error: 'Error getting pairs' });
    }
}