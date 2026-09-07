import { WeatherAdapter, type IWeatherAdapter } from './WeatherAdapter';
import { MockWeatherAdapter } from './mocks/MockWeatherAdapter';

export type { IWeatherAdapter, WeatherCity, WeatherData } from './WeatherAdapter';

// The public playground explicitly uses simulated weather; tasks still use Quarkus.
const isMock = import.meta.env.VITE_WEATHER_MOCK_ENABLED === 'true';

export const weatherAdapter: IWeatherAdapter = isMock ? new MockWeatherAdapter() : new WeatherAdapter();
