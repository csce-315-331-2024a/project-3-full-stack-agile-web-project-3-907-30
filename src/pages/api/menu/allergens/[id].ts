import { NextApiRequest, NextApiResponse } from "next";
import { executeStatement, rowToAllergens } from "@/lib/utils";
import { Allergens } from "@/lib/types";
import db from "@/lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Get the associated allergens for the given menu item.
 *
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
    req: NextApiRequest, res: NextApiResponse
) {
    const { id } = req.query;
    const rows = await executeStatement(
        db,
        `SELECT has_dairy, has_nuts, has_eggs, is_vegan, is_halal FROM inventory INNER JOIN inv_menu ON inventory.inv_id = inv_menu.inv_id WHERE inv_menu.item_id = $1`,
        [DataTypeOIDs.int4],
        [id]
    ).then(data => {
        return data.rows!;
    });

    if (rows.length === 0) {
        return res.status(404).json({ error: 'No corresponding menu item'});
    } else {
        return res.status(200).json(parseAllergens(rows.map(row => rowToAllergens(row))));
    }
}

const parseAllergens = (itemAllergens: Allergens[]) : Allergens => {
    return itemAllergens.reduce((accum, curr) => {
            accum.has_dairy = (curr.has_dairy) ? true : accum.has_dairy;
            accum.has_nuts = (curr.has_nuts) ? true : accum.has_nuts;
            accum.has_eggs = (curr.has_eggs) ? true : accum.has_eggs;
            accum.is_vegan = (curr.is_vegan) ? true : accum.is_vegan;
            accum.is_halal = (curr.is_halal) ? true : accum.is_halal;
            return accum;
        }, {
            has_dairy: false,
            has_nuts: false,
            has_eggs: false,
            is_vegan: false,
            is_halal: false,
        });
}