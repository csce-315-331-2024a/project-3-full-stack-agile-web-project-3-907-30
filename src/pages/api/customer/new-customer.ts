import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";
import { createHash } from "crypto";


/**
 * Handles a POST request to insert a new customer into the database.
 * @example
 * handler(req, res)
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns {NextApiResponse} Returns a response object with a status code and message.
 * @description
 * - Checks if the request method is POST, returns an error if not.
 * - Extracts the customer name and phone number from the request body.
 * - Generates a unique customer ID and hashes the phone number.
 * - Inserts the customer into the database and returns a success or error message.
 * - Handles any errors that may occur during the process.
 */
export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const {custName, phoneNumber} = req.body;

    try{
        const nextIdQ = await db.prepare(`SELECT cust_id FROM customers ORDER BY cust_id DESC LIMIT 1;`);
        const nextIdRes = await nextIdQ.execute();
        await nextIdQ.close();
        let nextId: number = parseInt(nextIdRes.rows!.at(0), 10);
        nextId = nextId + 1;

        const hash = createHash('sha256');
        hash.update(phoneNumber);
        const hashedPhone = hash.digest('hex');

        const customerCheck = await db.prepare(`SELECT * FROM customers WHERE phone_number = $1`, { paramTypes: [DataTypeOIDs.text] });
        const customerCheckRes = await customerCheck.execute({params: [hashedPhone]});
        await customerCheck.close();
        if(customerCheckRes.rows?.length !== 0) {
            return res.status(401).json({ error: 'Customer already exists' });
        }


        const getPairs = await db.prepare(
            `INSERT INTO customers
             VALUES ($1, $2, $3, 0, 0, 0);`, {paramTypes: [DataTypeOIDs.numeric, DataTypeOIDs.text,
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
        console.error("Error inserting customer", error);
        res.status(500).json({ error: 'Error inserting customer' });
    }
}