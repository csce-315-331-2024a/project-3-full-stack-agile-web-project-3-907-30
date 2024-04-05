import { NextApiRequest, NextApiResponse } from "next";
import api from "@/lib/api";

export type Weather = {
    description: Capitalize<string>,
    value: number,
    isDay: boolean
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        api.getCurrentWeatherByCityName({cityName: 'College Station'}).then(weather => {
            const data: Weather = { 
                description: weather.weather.at(0)!.description as Capitalize<string>,
                value: Math.round(weather.main.temp),
                isDay: weather.weather.at(0)!.icon.includes('d'),     
            };
            res.status(200).json(data);
        });
    } catch (error) {
        res.status(400).json({error: error});
    }
}