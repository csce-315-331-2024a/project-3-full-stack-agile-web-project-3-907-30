import db from "@/lib/db";
import { executeStatement } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { DataTypeOIDs } from "postgresql-client";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { id } = req.query;
	 
	if (id === undefined || req.method !== 'PUT') {
		res.status(400).json({error: "No ID given"});
	}

	const sql = `UPDATE orders
	SET status = -1
	WHERE order_id = $1;`;

	await executeStatement(db, sql, [DataTypeOIDs.int8], [id]);
		
	res.status(200).json({msg: "Order marked as cancelled"});
}