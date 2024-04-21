import db from "@/lib/db";
import { executeStatement } from "@/lib/utils";
import { MenuOrderPair } from "@/pages/employee/kitchen";
import { NextApiRequest, NextApiResponse } from "next";
import { QueryResult } from "postgresql-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const items_sql = `SELECT
    o.order_id, m.item_name
    FROM orders AS o
    INNER JOIN orders_menu AS om ON o.order_id = om.order_id
    INNER JOIN menu_items AS m ON om.item_id = m.item_id
    WHERE o.status = 0;`;

  // Get menu-order pairs from join table
  const itemsPairs = await executeStatement(db, items_sql, [], []).then((res: QueryResult) => {
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

  res.status(200).json(JSON.stringify(itemsPairs));
}