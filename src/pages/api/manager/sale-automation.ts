import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";


export default async function handler (
    req:NextApiRequest,
    res:NextApiResponse
) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try{
        const getTempItems = db.prepare(`SELECT item_id FROM menu_items WHERE sale_end IS NOT NULL`);


    }
    catch(error){
        console.error("Date based delete failed");
        return res.status(500).json({ error: "Date based delete failed" });
    }
}