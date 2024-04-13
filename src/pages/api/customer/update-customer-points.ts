import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Update the points column in the customers table with the given points where the cust_id matches
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    // Only allow PUT requests for this API route
    if (req.method !== "PUT") {
        res.setHeader("Allow", "PUT");
        res.status(405).end("Method Not Allowed");
        return;
    }
    
    const { cust_id, points } = req.body;
    
    if (!cust_id) {
        res.status(400).json({ error: "Customer ID is required" });
        return;
    }
    
    if (points === undefined) {
        res.status(400).json({ error: "Points is required" });
        return;
    }
    
    const updateStatement = await db.prepare(
        "UPDATE customers SET points = $1 WHERE cust_id = $2",
        { paramTypes: [DataTypeOIDs.int4, DataTypeOIDs.int4] }
    );

    const result = await updateStatement.execute({ params: [points, cust_id] });
    await updateStatement.close();
    
    if (result.rowsAffected === 0) {
        res.status(404).json({ error: "Customer not found" });
    } else {
        res.status(200).json({ success: true });
    }
}