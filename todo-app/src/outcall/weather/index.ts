import { WeatherAdapter } from './WeatherAdapter';
import { MockWeatherAdapter } from './mocks/MockWeatherAdapter';

export type { IWeatherAdapter, WeatherCity, WeatherData } from './WeatherAdapter';

const isMock = import.meta.env.VITE_WEATHER_MOCK_ENABLED === 'true'
    && import.meta.env.VITE_ENV !== 'production';

export const weatherAdapter: IWeatherAdapter = isMock ? new MockWeatherAdapter() : new WeatherAdapter();
