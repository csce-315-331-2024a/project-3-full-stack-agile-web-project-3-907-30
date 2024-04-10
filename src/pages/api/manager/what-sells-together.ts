import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { pairsAndAppearance } from "@/lib/types";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { startDate, endDate } = req.body;

    const makeOrdersView = await db.prepare(
        "CREATE VIEW select_orders AS SELECT orders.order_id, item_id "+ 
        "FROM orders "+
        "JOIN orders_menu ON orders_menu.order_id = orders.order_id "+ 
        "WHERE orders.order_date BETWEEN $1 AND $2;"
    );

    await makeOrdersView.execute({
        params: [startDate, endDate]
    });

    await makeOrdersView.close();

    const getOrderPairs = await db.prepare(
        "SELECT mp.item1_name, mp.item2_name, count(DISTINCT so1.order_id) AS pair_appearances "+
        "FROM menu_pairs AS mp "+
        "JOIN select_orders AS so1 ON so1.item_id = mp.item1_id "+
        "JOIN select_orders AS so2 ON so2.item_id = mp.item2_id AND so2.order_id = so1.order_id "+
        "GROUP BY mp.item1_id, mp.item2_id, mp.item1_name, mp.item2_name "+
        "ORDER BY pair_appearances DESC;"
    );

    const pairs = await getOrderPairs.execute();

    await getOrderPairs.close();

    const deleteOrdersView = await db.prepare("DROP VIEW select_orders;");

    await deleteOrdersView.close();

    const pairsRows = pairs.rows!;

    if(pairsRows.length === 0) {
        res.status(400).json({ error: "There were no pairs found" });
    }
    else {
        const pairsData: pairsAndAppearance[] = pairsRows.map((row) => 
            ({
                item1: row[0],
                item2: row[1],
                appearances: row[2]
            })
        )
        res.status(200).json(pairsData);
    }
}