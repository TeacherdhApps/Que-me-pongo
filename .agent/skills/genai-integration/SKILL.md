---
name: genai-integration
description: Integrates Google GenAI (Gemini) for outfit recommendations in the wardrobe app. Use when adding or modifying AI-powered features.
---

# Google GenAI Integration

Manages the **Gemini AI** integration in **¿Qué me pongo?** for personalized outfit recommendations, style advice, and wardrobe curation.

## When to Use This Skill

- When adding or modifying AI outfit recommendations
- When designing prompts for Gemini
- When handling streaming AI responses in the UI
- When asked about "AI recommendations", "Gemini", or "outfit suggestions"

## Package

```json
"@google/genai": "^1.37.0"
```

Import:
```typescript
import { GoogleGenAI } from '@google/genai';
```

In the standalone HTML version, it's loaded via ESM:
```javascript
import { GoogleGenAI } from "https://esm.sh/@google/genai@1.3.0";
```

## Setup

```typescript
// src/lib/genai.ts
import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is not set. Add it to .env.local');
}

export const genai = new GoogleGenAI({ apiKey: API_KEY });
```

## Outfit Recommendation Prompt Pattern

```typescript
import type { ClothingItem, WeatherData, DailyOutfit } from '../types';

export async function getOutfitRecommendation(
  wardrobe: ClothingItem[],
  weather: WeatherData,
  event?: string
): Promise<string> {
  const wardrobeList = wardrobe
    .map(item => `- ${item.name} (${item.category}, ${item.color})`)
    .join('\n');

  const prompt = `
Eres un estilista personal experto. El usuario tiene el siguiente armario:
${wardrobeList}

El clima actual en ${weather.city} es: ${weather.condition}, ${weather.temp}°C.
${event ? `El evento es: ${event}` : ''}

Recomienda un outfit completo (superior, inferior, calzado y accesorio si aplica).
Explica brevemente por qué es una buena elección para el clima y la ocasión.
Responde en español, de forma amigable y concisa.
  `.trim();

  const response = await genai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  return response.text ?? '';
}
```

## Streaming Response Pattern

For a better UX, stream the AI response:

```typescript
export async function streamOutfitRecommendation(
  wardrobe: ClothingItem[],
  weather: WeatherData,
  onChunk: (text: string) => void
): Promise<void> {
  const prompt = buildOutfitPrompt(wardrobe, weather);

  const stream = await genai.models.generateContentStream({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  for await (const chunk of stream) {
    onChunk(chunk.text ?? '');
  }
}
```

## React Hook

```typescript
// src/hooks/useOutfitRecommendation.ts
import { useState, useCallback } from 'react';
import { streamOutfitRecommendation } from '../lib/genai';
import type { ClothingItem, WeatherData } from '../types';

export function useOutfitRecommendation() {
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recommend = useCallback(async (wardrobe: ClothingItem[], weather: WeatherData) => {
    setLoading(true);
    setRecommendation('');
    setError(null);
    try {
      await streamOutfitRecommendation(wardrobe, weather, (chunk) => {
        setRecommendation(prev => prev + chunk);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener recomendación');
    } finally {
      setLoading(false);
    }
  }, []);

  return { recommendation, loading, error, recommend };
}
```

## Prompt Engineering Tips

- **Language**: Always prompt in Spanish — the app is for Spanish-speaking users
- **Context**: Include weather, event type, and available wardrobe items
- **Constraints**: Ask for specific items from the wardrobe, not generic suggestions
- **Format**: Request structured output when parsing is needed (JSON mode available)
- **Model**: Use `gemini-2.0-flash` for speed; `gemini-2.0-pro` for complex reasoning

## Environment Variables

```bash
# .env.local (never commit)
VITE_GEMINI_API_KEY=your_key_here
```

## Pitfalls

- Always check `response.text` for `null` — stream chunks can be empty
- Do NOT expose the API key in client-side code (it's already in env vars, keep it that way)
- Rate limits apply — add debouncing for user-triggered recommendations
- The standalone HTML version uses a different import path for `@google/genai`
