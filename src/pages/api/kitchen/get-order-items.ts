import db from "@/lib/db";
import { executeStatement } from "@/lib/utils";
import { MenuOrderPair } from "@/pages/employee/kitchen";
import { NextApiRequest, NextApiResponse } from "next";
import { DataTypeOIDs, QueryResult } from "postgresql-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO: extend query to use limit and offset
  const length_sql = `SELECT COALESCE(COUNT(*), 0) 
    FROM orders as o
    INNER JOIN orders_menu AS om ON o.order_id = om.order_id
    INNER JOIN menu_items AS m ON om.item_id = m.item_id
    WHERE o.status = 0;`

  const items_sql = `SELECT
    o.order_id, m.item_name
    FROM orders AS o
    INNER JOIN orders_menu AS om ON o.order_id = om.order_id
    INNER JOIN menu_items AS m ON om.item_id = m.item_id
    WHERE o.status = 0
    ORDER BY o.order_id DESC
    LIMIT 1000 OFFSET $1;`;

  // TODO: Add support for bounds checking
  let offset = 0;
  const itemsPairs: MenuOrderPair[] = []

	// Get initial count of rows
  // const initialCount = await executeStatement(db, length_sql, [], []).then((res: QueryResult) => {
  //   return res.rows![0][0];
  // })

  // while (offset != initialCount) {
  // Get first set of rows
    const rows = await executeStatement(db, items_sql, [DataTypeOIDs.numeric], [offset]).then((res: QueryResult) => {
      if (res.rows!.length === 0) {
        return []
      } else {
        return res.rows!.map((row: any[]) => {
          return {
            id: row[0],
            name: row[1]
          } as MenuOrderPair;
        });
      }
    });

    rows.map((row) => itemsPairs.push(row))
    // offset += (initialCount - (offset + 1000) > 0) ? 1000 : initialCount - offset ;
  // } 
	// send rows as JSON
  res.status(200).json(itemsPairs);
}