import { NextApiRequest, NextApiResponse } from "next";
import { executeStatement } from "@/lib/utils";
import db from "@/lib/db";
import { DataTypeOIDs } from "postgresql-client";

export interface SalesReportItem {
    id: number;
    name: string;
    profit: number;
}

const rowToSalesReportItem = (array: any[]) => {
    return {
        id: array[0],
        name: array[1],
        profit: array[2]
    } as SalesReportItem;
}

/**
 * Get a list of profits for the given menu items used in orders across a given date range.
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
    req: NextApiRequest, res: NextApiResponse
) {
    const { begin, end } = req.body;
    const rows = await executeStatement(
        db,
        `SELECT menu_items.item_id, menu_items.item_name, COUNT(*)*menu_items.item_price::numeric as profit
                    FROM menu_items
                    INNER JOIN orders_menu ON menu_items.item_id = orders_menu.item_id
                    INNER JOIN orders ON orders_menu.order_id = orders.order_id
                    WHERE orders.order_date BETWEEN $1 AND $2
                    GROUP BY menu_items.item_id;`,
        [DataTypeOIDs.date, DataTypeOIDs.date],
        [begin, end]
    ).then(data => data.rows!);

    if (rows.length === 0) {
        return res.status(400).json({ error: 'No corresponding data for the date range' });
    } else {
        return res.status(200).json(rows.map(row => rowToSalesReportItem(row)));
    }
}