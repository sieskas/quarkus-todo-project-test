import React from 'react';
import { render, screen } from '@testing-library/react';
import { WeatherWidget } from '../../components/ui/WeatherWidget';

vi.mock('../../hooks/useWeather', () => ({
    useWeather: vi.fn(),
}));

import { useWeather } from '../../hooks/useWeather';
const mockUseWeather = vi.mocked(useWeather);

test('renders weather data without crashing', () => {
    mockUseWeather.mockReturnValue({
        data: { city: 'Paris', temp: 14, description: 'partly cloudy', icon: '02d' },
        isLoading: false,
        isError: false,
    } as any);
    render(<WeatherWidget />);
    expect(screen.getByText('14°C')).toBeInTheDocument();
});

test('renders loading state without crashing', () => {
    mockUseWeather.mockReturnValue({ data: undefined, isLoading: true, isError: false } as any);
    render(<WeatherWidget />);
    expect(screen.getByText('…')).toBeInTheDocument();
});

test('renders error state without crashing', () => {
    mockUseWeather.mockReturnValue({ data: undefined, isLoading: false, isError: true } as any);
    render(<WeatherWidget />);
    expect(screen.getByText(/weather/i)).toBeInTheDocument();
});
