import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { PopularMenuItem } from "@/lib/types";
import { DataTypeOIDs } from "postgresql-client";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        res.status(400).json({ error: "Not a valid method" });
    }

    const { startDate, endDate } = req.query;

    try{

        const getPopularItems = await db.prepare(
            `SELECT mi.item_name, COUNT(ord.item_id) AS num_sales
             FROM menu_items AS mi
             JOIN (
                SELECT orders.order_id, item_id
                FROM orders
                JOIN orders_menu ON orders_menu.order_id = orders.order_id
                WHERE orders.order_date BETWEEN $1 AND $2
             ) AS ord ON mi.item_id = ord.item_id
             GROUP BY mi.item_id
             ORDER BY num_sales DESC LIMIT 10;`,
             { paramTypes: [DataTypeOIDs.date, DataTypeOIDs.date] }
        );

        const popularItems = await getPopularItems.execute({ params: [startDate, endDate] });

        await getPopularItems.close();

        if(popularItems.rows!.length === 0){
            res.status(505).json({ error: "There were no pairs found" });
        }
        else {
            const popularItemsData: PopularMenuItem[] = popularItems.rows!.map( (row) =>
                ({
                    item: row[0],
                    num_sales: row[1]
                })
            )
            res.status(200).json(popularItemsData);
        }
    }
    catch(error){
        console.error("Error getting items");
        res.status(500).json({ error: "Error getting items" });
    }
}