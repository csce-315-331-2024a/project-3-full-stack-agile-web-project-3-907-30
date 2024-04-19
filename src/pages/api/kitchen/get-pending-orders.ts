import db from "@/lib/db";
import { executeStatement } from "@/lib/utils";
import { PendingOrder } from "@/pages/employee/kitchen";
import { NextApiRequest, NextApiResponse } from "next";
import { QueryResult } from "postgresql-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
	const order_sql = `SELECT
		order_id, order_date, order_time,
		order_total::numeric, e.emp_name, used_points, status
		FROM orders AS o 
		INNER JOIN employees AS e ON o.emp_id = e.emp_id
		WHERE status = 0
		ORDER BY order_date DESC;`;
	
		// Get customer orders
		const pendingOrders = await executeStatement(db, order_sql, [], []).then((res: QueryResult) => {
			if (res.rows!.length === 0) {
				return []
			} else {
				return res.rows!.map((row: any[]) => {
					return {
						order_id: row[0],
						order_date: row[1].toString().substring(4, 15),
						order_time: row[2].toString(),
						order_total: row[3].toFixed(2),
						emp_name: row[4],
						used_points: row[5],
						status: row[6] === 0 ? "Pending" : "Complete"
					} as PendingOrder;
				})
			}
		});

		res.status(200).json(JSON.stringify(pendingOrders));
}