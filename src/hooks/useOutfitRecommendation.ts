import { useState, useCallback } from 'react';
import { streamOutfitRecommendation } from '../lib/genai';
import type { ClothingItem, WeatherData } from '../types';

export function useOutfitRecommendation() {
    const [recommendation, setRecommendation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateRecommendation = useCallback(async (
        wardrobe: ClothingItem[],
        weather: WeatherData,
        event?: string
    ) => {
        setLoading(true);
        setRecommendation('');
        setError(null);

        try {
            const stream = streamOutfitRecommendation(wardrobe, weather, event);

            for await (const chunk of stream) {
                setRecommendation(prev => prev + chunk);
            }
        } catch (err: any) {
            setError(err.message || 'Error al conectar con la IA');
        } finally {
            setLoading(false);
        }
    }, []);

    return { recommendation, loading, error, generateRecommendation };
}
