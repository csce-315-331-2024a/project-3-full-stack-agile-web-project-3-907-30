import type { NextApiRequest, NextApiResponse } from "next";
import { CustomerOrder } from "../../../lib/types";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Handles GET requests for customer order history.
 * 
 * @example
 * handler(req, res)
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns {Promise} A promise that resolves to an array of customer order data.
 * @description
 *   - Retrieves customer order history from the database.
 *   - Uses the customer ID from the request query to filter results.
 *   - Converts order data into a custom format.
 *   - Returns an error if no order history is found or if there is an error retrieving items.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method !== "GET") {
        res.status(400).json({ error: "Not a valid Method" });
        return;
    }

    try{
        const custId = req.query.custId;// Should be in local storage
        // Note: when getting only one paramater from query, specify what you're getting
        const getPurchases = await db.prepare(
            `SELECT order_id, order_date, order_time, order_total::numeric, e.emp_name, used_points FROM orders as o
             JOIN employees AS e ON e.emp_id = o.emp_id
             WHERE cust_id = $1 ORDER BY order_date DESC;`,{paramTypes: [DataTypeOIDs.numeric]}
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
                    emp_name: row[4],
                    used_points: row[5]
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