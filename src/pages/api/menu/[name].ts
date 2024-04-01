import { NextApiRequest, NextApiResponse } from "next";
import { executeStatement, rowToMenuItem } from "@/lib/utils";
import db from "@/lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Get a menu item from the database by its name.
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { name } = req.query;
    const rows = await executeStatement(
        db,
        "SELECT item_id, item_name, item_price::numeric, times_ordered FROM menu_items WHERE item_name = ($1)", 
        [DataTypeOIDs.varchar], [name]
    ).then( data => {
        return data.rows!
    });

    if (rows.length === 0) {
        return res.status(404).json({ error: 'No corresponding menu item'});
    } else {
        return res.status(200).json(rowToMenuItem(rows.at(0)));
    }

}