import { Badge } from "@/components/ui/badge"
import { Weather } from "@/pages/api/customer/weather";

export const getCurrentWeather = async () => {
    const response = await fetch('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/api/customer/weather');
    if (!response.ok) {
        throw new Error('Error fetching weather');
    }

    const data: Weather = await response.json();
    return data;
}

const getIcon = (data: Weather): string => {
    let icon: string;
    switch (data.description) {
        case 'Thunderstorm':
            icon = '⚡️';
            break;
        case 'Drizzle':
            icon = '🌧️';
            break;
        case 'Rain':
            icon = '💧';
            break;
        case 'Snow':
            icon = '❄';
            break;
        case 'Atmosphere':
            icon = '💨'
            break;
        case 'Clouds':
            icon = '☁';
            break;
        default:
            icon = (data.isDay) ? '☼' : '☽';
            break;
    }
    return icon;
}

const CustomerWeather = ({ data }: { data: Weather }) => {

    const theme: string = (data.isDay) ? 'bg-orange-400' : 'bg-indigo-950';

    return (
        <Badge className={`text-md ${theme}`}>
            {getIcon(data)}&nbsp;{data.value}°
        </Badge>
    );
}

export default CustomerWeather;
