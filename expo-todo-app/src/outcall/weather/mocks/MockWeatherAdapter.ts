import { faker } from '@faker-js/faker';
import type { IWeatherAdapter, WeatherCity, WeatherData } from '../WeatherAdapter';

const MOCK_DATA: WeatherData[] = [
    { city: 'Paris', temp: 14, description: 'partly cloudy', icon: '02d' },
    { city: 'Tokyo', temp: 22, description: 'clear sky', icon: '01d' },
    { city: 'New York', temp: 8, description: 'light rain', icon: '10d' },
    { city: 'Sydney', temp: 28, description: 'sunny', icon: '01d' },
    { city: 'Nairobi', temp: 24, description: 'broken clouds', icon: '04d' },
    { city: 'Reykjavik', temp: -2, description: 'snow', icon: '13d' },
    { city: 'Singapore', temp: 32, description: 'thunderstorm', icon: '11d' },
    { city: 'Cairo', temp: 35, description: 'haze', icon: '50d' },
];

export class MockWeatherAdapter implements IWeatherAdapter {
    getWeather(city: WeatherCity): Promise<WeatherData> {
        const data = MOCK_DATA.find(d => d.city === city.name) ?? faker.helpers.arrayElement(MOCK_DATA);
        return Promise.resolve({ ...data });
    }
}
