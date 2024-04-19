import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Update the used_points column in the orders table
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
	
	const { order_id, used_points } = req.body;
	
	if (!order_id) {
		res.status(400).json({ error: "Order ID is required" });
		return;
	}
	
	if (used_points === undefined) {
		res.status(400).json({ error: "Used points is required" });
		return;
	}
	
	const updateStatement = await db.prepare(
		"UPDATE orders SET used_points = $1 WHERE order_id = $2",
		{ paramTypes: [DataTypeOIDs.bool, DataTypeOIDs.int4] }
	);
	
	const result = await updateStatement.execute({ params: [used_points, order_id] });
	
	await updateStatement.close();
	
	if (result.rowsAffected === 0) {
		res.status(404).json({ error: "Order not found" });
	} else {
		res.status(200).json({ success: true });
	}
}