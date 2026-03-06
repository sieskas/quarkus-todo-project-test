import { useQuery } from '@tanstack/react-query';
import { weatherAdapter } from '../outcall/weather';
import type { WeatherCity } from '../outcall/weather';

const CITIES: WeatherCity[] = [
    { name: 'Paris',     lat: 48.8566,  lon: 2.3522   },
    { name: 'Tokyo',     lat: 35.6762,  lon: 139.6503 },
    { name: 'New York',  lat: 40.7128,  lon: -74.0060 },
    { name: 'Sydney',    lat: -33.8688, lon: 151.2093 },
    { name: 'Nairobi',   lat: -1.2921,  lon: 36.8219  },
    { name: 'Reykjavik', lat: 64.1355,  lon: -21.8954 },
    { name: 'Singapore', lat: 1.3521,   lon: 103.8198 },
    { name: 'Cairo',     lat: 30.0444,  lon: 31.2357  },
];

const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];

export const useWeather = () => {
    return useQuery({
        queryKey: ['weather', randomCity.name],
        queryFn: () => weatherAdapter.getWeather(randomCity),
        staleTime: 10 * 60 * 1000,
        retry: 1,
    });
};
