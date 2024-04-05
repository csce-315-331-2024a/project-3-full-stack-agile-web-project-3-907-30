import OpenWeatherMap from 'openweathermap-ts';

const api = new OpenWeatherMap( {apiKey: process.env.OPENWEATHER_KEY! });

export default api;