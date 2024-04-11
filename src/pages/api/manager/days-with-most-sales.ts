import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { PopularMenuItem, SalesForADay } from "@/lib/types";
import { DataTypeOIDs } from "postgresql-client";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        res.status(400).json({ error: "Not a valid method" });
    }

    const { month, year } = req.query;

    try{

        const getBestDays = await db.prepare(
            `SELECT order_date, COUNT(*) AS num_orders
             FROM orders
             WHERE EXTRACT( MONTH FROM order_date) = $1
             AND EXTRACT( YEAR FROM order_date) = $2
             GROUP BY order_date
             ORDER BY num_orders DESC;`,
             { paramTypes: [DataTypeOIDs.numeric, DataTypeOIDs.numeric] }
        );

        const bestDays = await getBestDays.execute({ params: [month, year] });

        await getBestDays.close();

        // res.status(200).json(bestDays.rows!);

        if(bestDays.rows!.length === 0){
            res.status(505).json({ error: "There were no pairs found" });
        }
        else {
            const bestDaysData: SalesForADay[] = bestDays.rows!.map( (row) =>
                ({
                    day: row[0],
                    sales: row[1]
                })
            )
            res.status(200).json(bestDaysData);
        }
    }
    catch(error){
        console.error("Error getting items");
        res.status(500).json({ error: "Error getting items" });
    }
}