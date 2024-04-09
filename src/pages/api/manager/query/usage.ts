
import { NextApiRequest, NextApiResponse } from "next";
import { executeStatement, rowToInventoryItem } from "@/lib/utils";
import db from "@/lib/db";
import { DataTypeOIDs } from "postgresql-client";

export interface ProductUsageItem {
    id: number;
    name: string;
    amount: number
}

const rowToProductUsageItem = (array: any[]) => {
    return {
        id: array[0],
        name: array[1],
        amount: array[2]
    } as ProductUsageItem;
}

/**
 * Get a list of ingredients that are below their required fill level for a given menu item.
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
        `SELECT inventory.inv_id, inventory.inv_name, COALESCE(SUM(inv_menu.amount), 0) as amount FROM inventory
                    INNER JOIN inv_menu ON inv_menu.inv_id = inventory.inv_id
                    INNER JOIN menu_items on menu_items.item_id = inv_menu.item_id
                    INNER JOIN orders_menu ON orders_menu.item_id = menu_items.item_id
                    INNER JOIN orders ON orders.order_id = orders_menu.order_id
                    WHERE orders.order_date BETWEEN $1 AND $2
                    GROUP BY inventory.inv_id;`,
        [DataTypeOIDs.date, DataTypeOIDs.date],
        [begin, end]
    ).then(data => data.rows!);

    if (rows.length === 0) {
        return res.status(400).json({ error: 'No corresponding data for the date range' });
    } else {
        return res.status(200).json(rows.map(row => rowToProductUsageItem(row)));
    }
}