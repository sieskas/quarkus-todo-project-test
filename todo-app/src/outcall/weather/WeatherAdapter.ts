export interface WeatherCity {
    name: string;
    lat: number;
    lon: number;
}

export interface WeatherData {
    city: string;
    temp: number;
    description: string;
    icon: string;
}

export interface IWeatherAdapter {
    getWeather(city: WeatherCity): Promise<WeatherData>;
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY ?? '';
const BASE_URL = import.meta.env.VITE_OPENWEATHER_API_URL ?? 'https://api.openweathermap.org/data/2.5';

export class WeatherAdapter implements IWeatherAdapter {
    async getWeather(city: WeatherCity): Promise<WeatherData> {
        const url = `${BASE_URL}/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Weather fetch failed: ${res.status}`);
        }
        const data = await res.json();
        return {
            city: data.name,
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
        };
    }
}
