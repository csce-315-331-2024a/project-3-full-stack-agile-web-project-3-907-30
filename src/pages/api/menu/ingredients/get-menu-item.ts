import { NextApiRequest, NextApiResponse } from 'next';
import { executeStatement } from "@/lib/utils";
import db from "@/lib/db";
import { DataTypeOIDs } from "postgresql-client";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) 

{
    const rows = await executeStatement(
        db,
        `SELECT * FROM ingredients`
    ).then( data => {
        return data.rows!
    });

    if (rows.length === 0) {
        return res.status(404).json({ error: 'No ingredients found'});
    } else {
        return res.status(200).json(rows);
    }
}