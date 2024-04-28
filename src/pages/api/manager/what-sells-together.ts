import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { PairsAndAppearance } from "@/lib/types";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Retrieves the top 10 most frequently ordered pairs of menu items within a given date range.
 * 
 * @example
 * handler('2021-01-01', '2021-01-31')
 * @param {NextApiRequest} req - The NextApiRequest object.
 * @param {NextApiResponse} res - The NextApiResponse object.
 * @returns {PairsAndAppearance[]} An array of objects containing the row number, item names, and number of appearances for each pair.
 * @description
 * - Checks if the request method is GET and returns an error if it is not.
 * - Retrieves the start and end dates from the request query.
 * - Executes a SQL query to retrieve the top 10 pairs of menu items and their number of appearances within the given date range.
 * - Converts the results into an array of objects with the necessary data.
 * - Returns the array of objects if there are any pairs found, otherwise returns an error.
 * - Handles any errors that may occur during the process.
 */
export default async function handler (
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { startDate, endDate } = req.query;

	try{
		const getPairs = await db.prepare(
		`SELECT ROW_NUMBER() OVER () AS row, t.*
		FROM (SELECT mp.item1_name, mp.item2_name, COUNT(DISTINCT so1.order_id) AS pair_appearances
		FROM menu_pairs AS mp 
		JOIN (
		SELECT orders.order_id, item_id
		FROM orders
		JOIN orders_menu ON orders_menu.order_id = orders.order_id
		WHERE orders.order_date BETWEEN $1 AND $2
		) AS so1 ON so1.item_id = mp.item1_id 
		JOIN (
		SELECT orders.order_id, item_id
		FROM orders
		JOIN orders_menu ON orders_menu.order_id = orders.order_id
		WHERE orders.order_date BETWEEN $3 AND $4
		) AS so2 ON so2.item_id = mp.item2_id AND so2.order_id = so1.order_id 
		GROUP BY mp.item1_id, mp.item2_id, mp.item1_name, mp.item2_name
		ORDER BY pair_appearances DESC) AS t;`, {paramTypes: [DataTypeOIDs.date, DataTypeOIDs.date,
		DataTypeOIDs.date, DataTypeOIDs.date]});

		const pairs = await getPairs.execute({params:[startDate, endDate, startDate, endDate]});

		await getPairs.close();

		if(pairs.rows!.length === 0) {
			res.status(405).json({ error: "There were no pairs found" });
		} 
		else {
			const pairsData: PairsAndAppearance[] = pairs.rows!.map((row) => 
				({
					row_id: row[0],
					item1: row[1],
					item2: row[2],
					appearances: row[3]
				})
			)
			res.status(200).json(pairsData);
		}
	} catch(error){
		console.error("Error getting pairs", error);
		res.status(500).json({ error: 'Error getting pairs' });
	}
}