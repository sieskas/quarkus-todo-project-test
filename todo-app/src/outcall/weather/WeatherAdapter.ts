import { OpenAPI } from "../../api/generated";

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

export class WeatherAdapter implements IWeatherAdapter {
    async getWeather(city: WeatherCity): Promise<WeatherData> {
        const query = new URLSearchParams({ lat: String(city.lat), lon: String(city.lon) });
        const response = await fetch(OpenAPI.BASE.replace(/\/$/, '') + '/api/v1/weather?' + query);
        if (!response.ok) throw new Error('Weather fetch failed: ' + response.status);
        return response.json();
    }
}
