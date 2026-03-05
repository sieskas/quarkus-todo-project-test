import { WeatherAdapter } from './WeatherAdapter';
import { MockWeatherAdapter } from './mocks/MockWeatherAdapter';

export type { IWeatherAdapter, WeatherCity, WeatherData } from './WeatherAdapter';

const isMock = process.env.EXPO_PUBLIC_WEATHER_MOCK_ENABLED === 'true'
    && process.env.EXPO_PUBLIC_ENV !== 'production';

console.log('[Weather] isMock:', isMock, 'WEATHER_MOCK:', process.env.EXPO_PUBLIC_WEATHER_MOCK_ENABLED, 'ENV:', process.env.EXPO_PUBLIC_ENV);

export const weatherAdapter: IWeatherAdapter = isMock ? new MockWeatherAdapter() : new WeatherAdapter();
