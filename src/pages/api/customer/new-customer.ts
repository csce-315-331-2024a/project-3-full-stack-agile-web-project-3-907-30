import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";
import { createHash } from "crypto";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { custName, phoneNumber } = req.body;

    try{
        const nextIdQ = await db.prepare(`SELECT cust_id FROM customers ORDER BY cust_id DESC LIMIT 1`);
        const nextIdRes = await nextIdQ.execute();
        await nextIdQ.close();
        let nextId: number = parseInt(nextIdRes.rows!.at(0));
        nextId = nextId + 1;

        const hash = createHash('sha256');
        hash.update(phoneNumber);
        const hashedPhone = hash.digest('hex');

        const getPairs = await db.prepare(
            `INSERT INTO customers 
            (cust_id, cust_name, phone_number)
            VALUES ($1, $2, $3)`, {paramTypes: [DataTypeOIDs.numeric, DataTypeOIDs.text,
        DataTypeOIDs.text]});

        const status = await getPairs.execute({params:[nextId, custName, hashedPhone]});

        await getPairs.close();

        if(status !== null){
            res.status(200).json({ message: "Customer successfully inserted" });
        }
        else{
            res.status(400).json({ error: "Customer was not inserted" });
        }
    }
    catch(error){
        console.error("Error getting pairs", error);
        res.status(500).json({ error: 'Error getting pairs' });
    }
}