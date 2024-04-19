import { Badge } from "@/components/ui/badge"
import { Weather } from "@/pages/api/customer/weather";

/**
 * Fetches the current weather from the API.
 * @returns {Promise<Weather>} A promise that resolves to an object containing the current weather.
 * @description
 *   - Makes a GET request to the API endpoint '/api/customer/weather'.
 *   - Throws an error if the response is not ok.
 *   - Returns the JSON response from the API.
 */
export const getCurrentWeather = async () => {
	const response = await fetch('api/customer/weather');
	if (!response.ok) {
		throw new Error('Error fetching weather');
	}

	const data: Weather = await response.json();
	return data;
}

/**
 * Returns a string representing the weather icon based on the provided weather data.
 * @example
 * getWeatherIcon({ description: 'Rain', isDay: true }) // 💧
 * @param {Weather} data - An object containing weather data.
 * @returns {string} A string representing the weather icon.
 * @description
 *   - Uses a switch statement to determine the appropriate icon based on the provided weather description.
 *   - If the weather description is not recognized, the function will return a sun or moon icon depending on the isDay value.
 *   - Only supports a limited number of weather descriptions.
 *   - Does not handle errors or invalid input.
 */
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

/**
 * Displays icon with the current temperature and weather condiditons.
 * 
 * @param {Weather} data Passes in weather information from API
 * @returns {JSX.Element} Weather icon component.
 */
const CustomerWeather = ({ data }: { data: Weather }) => {

	const theme: string = (data.isDay) ? 'bg-orange-400' : 'bg-indigo-950';

	return (
		<Badge className={`text-md ${theme} notranslate`}>
			{getIcon(data)}&nbsp;{data.value}°
		</Badge>
	);
}

export default CustomerWeather;
