import { useState, useEffect, useCallback } from 'react';
import { getCurrentWeather } from '../lib/weatherService';
import type { WeatherData } from '../types';

export function useWeather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCurrentWeather();
            setWeather(data);
        } catch (err: any) {
            setError(err.message || 'Error al obtener el clima');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    return { weather, loading, error, refetch: fetchWeather };
}
