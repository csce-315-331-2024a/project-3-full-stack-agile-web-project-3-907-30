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
    
}