import { NextApiRequest, NextApiResponse } from "next";
import { executeStatement, rowToInventoryItem } from "@/lib/utils";
import db from "@/lib/db";
import { DataTypeOIDs } from "postgresql-client";

export default async function handler(
    req: NextApiRequest, res: NextApiResponse
) {
    const { id } = req.query;
    const rows = await executeStatement(
        db,
        `SELECT inv_menu.inv_id, inv_name, inv_price::numeric, fill_level, current_level, times_refilled, date_refilled, has_dairy, has_nuts, has_eggs, is_vegan, is_halal FROM inv_menu INNER JOIN inventory ON inventory.inv_id = inv_menu.inv_id WHERE inv_menu.item_id = $1 AND inventory.current_level < inventory.fill_level;`,
        [DataTypeOIDs.int4],
        [id]
    ).then(data => {
        return data.rows!;
    });

    if (rows.length === 0) {
        return res.status(404).json({ error: 'No corresponding menu item'});
    } else {
        return res.status(200).json(rows.map(row => {
            return rowToInventoryItem(row);
        }));
    }

}