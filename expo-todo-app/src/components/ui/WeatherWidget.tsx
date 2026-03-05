import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

    if (isLoading) return <Text style={styles.text}>…</Text>;
    if (isError || !data) return <Text style={styles.error}>⚠️ weather</Text>;

    const emoji = ICON_MAP[data.icon] ?? '🌡️';

    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.temp}>{data.temp}°C</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#e0f2fe',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    emoji: {
        fontSize: 14,
    },
    temp: {
        fontSize: 12,
        fontWeight: '600',
        color: '#0369a1',
    },
    text: {
        fontSize: 12,
        color: '#94a3b8',
    },
    error: {
        fontSize: 11,
        color: '#ef4444',
    },
});
