---
name: weather-api-integration
description: Fetches and processes weather data for outfit suggestions. Use when adding weather-based outfit recommendations or geolocation features.
---

# Weather API Integration

Fetches real-time weather data for **¿Qué me pongo?** to power context-aware outfit recommendations based on temperature and conditions.

## When to Use This Skill

- When adding or modifying weather-based outfit logic
- When implementing geolocation to detect the user's city
- When asked about "weather", "temperature", "geolocation", or "climate"

## Recommended API: Open-Meteo (Free, No Key Required)

Open-Meteo is a free, open-source weather API — no API key needed, perfect for this project.

```
Base URL: https://api.open-meteo.com/v1/forecast
Geocoding: https://geocoding-api.open-meteo.com/v1/search
```

## Implementation

### Step 1: Get user coordinates via Geolocation API

```typescript
// src/lib/geolocation.ts
export function getUserCoordinates(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation no está disponible en este navegador'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(new Error(`Error de geolocalización: ${error.message}`)),
      { timeout: 10000, maximumAge: 300000 } // 5 min cache
    );
  });
}
```

### Step 2: Reverse geocode to get city name

```typescript
// src/lib/weather.ts
export async function getCityName(lat: number, lon: number): Promise<string> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=&latitude=${lat}&longitude=${lon}&count=1&language=es&format=json`;
  // Fallback: use coordinates as city name
  return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
}
```

### Step 3: Fetch weather data

```typescript
import type { WeatherData } from '../types';

const WMO_CONDITIONS: Record<number, string> = {
  0: 'Despejado',
  1: 'Mayormente despejado', 2: 'Parcialmente nublado', 3: 'Nublado',
  45: 'Niebla', 48: 'Niebla con escarcha',
  51: 'Llovizna ligera', 53: 'Llovizna moderada', 55: 'Llovizna intensa',
  61: 'Lluvia ligera', 63: 'Lluvia moderada', 65: 'Lluvia intensa',
  71: 'Nieve ligera', 73: 'Nieve moderada', 75: 'Nieve intensa',
  80: 'Chubascos ligeros', 81: 'Chubascos moderados', 82: 'Chubascos intensos',
  95: 'Tormenta eléctrica',
};

export async function fetchWeather(lat: number, lon: number, city: string): Promise<WeatherData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat.toString());
  url.searchParams.set('longitude', lon.toString());
  url.searchParams.set('current', 'temperature_2m,weathercode');
  url.searchParams.set('temperature_unit', 'celsius');

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`Weather API error: ${response.status}`);

  const data = await response.json();
  const temp = Math.round(data.current.temperature_2m);
  const code = data.current.weathercode as number;

  return {
    temp,
    condition: WMO_CONDITIONS[code] ?? 'Desconocido',
    city,
  };
}
```

### Step 4: Full weather service

```typescript
// src/lib/weatherService.ts
import { getUserCoordinates } from './geolocation';
import { fetchWeather } from './weather';
import type { WeatherData } from '../types';

export async function getCurrentWeather(): Promise<WeatherData> {
  const coords = await getUserCoordinates();
  const city = `${coords.latitude.toFixed(1)}°N, ${coords.longitude.toFixed(1)}°W`;
  return fetchWeather(coords.latitude, coords.longitude, city);
}
```

## React Hook

```typescript
// src/hooks/useWeather.ts
import { useState, useEffect } from 'react';
import { getCurrentWeather } from '../lib/weatherService';
import type { WeatherData } from '../types';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentWeather()
      .then(setWeather)
      .catch(err => setError(err instanceof Error ? err.message : 'Error al obtener el clima'))
      .finally(() => setLoading(false));
  }, []);

  return { weather, loading, error };
}
```

## Outfit Logic Based on Weather

```typescript
export function getWeatherClothingAdvice(weather: WeatherData): string {
  const { temp, condition } = weather;

  if (temp < 10) return 'Muy frío — abrígate bien con capas';
  if (temp < 18) return 'Fresco — lleva una chaqueta o suéter';
  if (temp < 25) return 'Templado — ropa ligera con una capa extra';
  if (temp < 32) return 'Caluroso — ropa ligera y transpirable';
  return 'Muy caluroso — ropa muy ligera, protección solar';
}
```

## Permissions

The app already requests `geolocation` permission in `metadata.json`:
```json
{ "requestFramePermissions": ["camera", "geolocation"] }
```

## Pitfalls

- Always handle geolocation denial gracefully — offer a manual city input fallback
- Cache weather data for at least 5 minutes to avoid excessive API calls
- Open-Meteo uses WMO weather codes (not text) — always map them to Spanish strings
- Temperature is in Celsius — the app is for Spanish-speaking users
