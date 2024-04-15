import { NextApiRequest, NextApiResponse } from "next";
import api from "@/lib/api";

export type Weather = {
    description: Capitalize<string>,
    value: number,
    isDay: boolean
};

/**
 * This function handles the request and response for the Next.js API.
 * @example
 * handler(req, res)
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns {Weather} Returns the current weather data for College Station.
 * @description
 *   - Uses the getCurrentWeatherByCityName function from the API to retrieve weather data.
 *   - Parses the data into a Weather object with description, value, and isDay properties.
 *   - If an error occurs, returns a default Weather object with clear weather data.
 *   - Only works for the city of College Station.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // Get data from API and parse into Weather object
        await api.getCurrentWeatherByCityName({cityName: 'College Station'}).then(weather => {
            const data: Weather = { 
                description: weather.weather.at(0)!.description as Capitalize<string>,
                value: Math.round(weather.main.temp),
                isDay: weather.weather.at(0)!.icon.includes('d'),     
            };
            res.status(200).json(data);
        });
    } catch (error) {
        res.status(200).json({ value: 0, isDay: true, description: 'Clear' });
    }
}