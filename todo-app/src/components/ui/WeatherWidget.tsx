import React from 'react';
import { useWeather } from '../../hooks/useWeather';

const ICON_MAP: Record<string, string> = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '⛅',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌦️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
};

export const WeatherWidget: React.FC = () => {
    const { data, isLoading, isError } = useWeather();

    if (isLoading) return <span className="text-sm text-gray-400">…</span>;
    if (isError || !data) return <span className="text-sm text-red-400">⚠️ weather</span>;

    const emoji = ICON_MAP[data.icon] ?? '🌡️';

    return (
        <div className="flex items-center gap-1 bg-sky-100 text-sky-700 px-2 py-1 rounded-lg text-sm font-semibold">
            <span>{emoji}</span>
            <span>{data.temp}°C</span>
        </div>
    );
};
