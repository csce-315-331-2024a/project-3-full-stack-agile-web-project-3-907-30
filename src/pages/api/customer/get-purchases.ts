import type { NextApiRequest, NextApiResponse } from "next";
import { CustomerOrder } from "../../../lib/types";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method !== "GET") {
        res.status(400).json({ error: "Not a valid Method" })
    }

    try{
        const custId = req.query.custId;// Should be in local storage
        // Note: when only passing one parameter, dont use backticks (``), use ""
        const getPurchases = await db.prepare(
            "SELECT * FROM orders WHERE cust_id = $1 ORDER BY order_date DESC",{paramTypes: [DataTypeOIDs.numeric]}
        );
        const customerOrders = await getPurchases.execute({params: [custId]});
        await getPurchases.close();

        if(customerOrders.rows!.length === 0) {
            res.status(505).json({ error: "There was no order history found" });
        }
        else{
            const customerOrderData: CustomerOrder[] = customerOrders.rows!.map((row) => 
                ({
                    order_id: row[0],
                    order_date: row[1],
                    order_time: row[2],
                    order_total: row[3],
                    cust_id: row[4],
                    emp_id: row[5],
                    used_points: row[6]
                })
            )
            res.status(200).json(customerOrderData);
        }
    }
    catch(error){
        console.error("Error getting items");
        res.status(500).json({ error: "Error getting items" });
    }
}