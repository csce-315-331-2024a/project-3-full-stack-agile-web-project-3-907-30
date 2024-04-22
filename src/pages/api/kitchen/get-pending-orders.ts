import db from "@/lib/db";
import { executeStatement } from "@/lib/utils";
import { PendingOrder } from "@/pages/employee/kitchen";
import { NextApiRequest, NextApiResponse } from "next";
import { QueryResult } from "postgresql-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
	const length_sql = `SELECT
		order_id, order_date, order_time,
		order_total::numeric, e.emp_name, used_points, status
		FROM orders AS o 
		INNER JOIN employees AS e ON o.emp_id = e.emp_id
		WHERE status = 0;`;

	// TODO: extend query to use limit and offset
	const order_sql = `SELECT
		order_id, order_date, order_time,
		order_total::numeric, e.emp_name, used_points, status
		FROM orders AS o 
		INNER JOIN employees AS e ON o.emp_id = e.emp_id
		WHERE status = 0
		ORDER BY order_date DESC;`;

	// TODO: Add support for bounds checking
	let offset = 0;
  	const pendingOrders: PendingOrder[] = []

	// // Get initial count of rows
	// const initialCount = await executeStatement(db, length_sql, [], []).then((res: QueryResult) => {
    // 	return res.rows![0][0];
  	// })

	// while (offset != initialCount) {
		// Get first set of rows
		const rows = await executeStatement(db, order_sql, [], []).then((res: QueryResult) => {
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
		
		rows.map((row) => pendingOrders.push(row))
    	// offset += (initialCount - (offset + 1000) > 0) ? 1000 : initialCount - offset ;
	// }
	// while current count != initial count

	// get more rows

	// send rows as JSON
	res.status(200).json(JSON.stringify(pendingOrders));
}