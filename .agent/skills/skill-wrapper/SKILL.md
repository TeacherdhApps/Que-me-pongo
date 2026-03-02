---
name: skill-wrapper
description: Wraps external tools, libraries, and APIs into skill-compatible interfaces so they follow the project's patterns. Use when integrating a new library or service.
---

# Skill Wrapper

The wrapper skill provides a **standardized integration pattern** for bringing external tools and APIs into the **¿Qué me pongo?** project while maintaining consistency with the existing codebase.

## When to Use This Skill

- When integrating a new npm package or external API
- When an external service needs to be adapted to the project's TypeScript types
- When creating a reusable abstraction over a third-party library
- When asked to "add a library", "integrate a service", or "wrap an API"

## Wrapping Pattern

Every external integration should follow this 3-layer pattern:

```
External API/Library
        ↓
  [Wrapper Layer]     ← thin adapter, handles auth, errors, retries
        ↓
  [Service Layer]     ← business logic, maps to project types
        ↓
  [React Hook/Component] ← UI consumption
```

## Step-by-Step Wrapping Process

### Step 1: Install the dependency
```bash
npm install <package-name>
# or for dev dependencies:
npm install -D <package-name>
```

### Step 2: Create the wrapper file
Create `src/lib/<service-name>.ts` with this structure:

```typescript
// src/lib/<service-name>.ts
// Wrapper for <ExternalService>

const API_KEY = import.meta.env.VITE_<SERVICE>_API_KEY;
const BASE_URL = '<api-base-url>';

export interface <ServiceName>Config {
  // configuration options
}

export async function <serviceAction>(params: <ParamsType>): Promise<<ReturnType>> {
  try {
    // 1. Build request
    // 2. Call external API
    // 3. Map response to project types (from types.ts)
    // 4. Return typed result
  } catch (error) {
    console.error('[<ServiceName>] Error:', error);
    throw new Error(`<ServiceName> failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
```

### Step 3: Add environment variables
Add to `.env.local` (never commit this file):
```
VITE_<SERVICE>_API_KEY=your_key_here
```

Add to `.env.example` (commit this as documentation):
```
VITE_<SERVICE>_API_KEY=
```

### Step 4: Create a React hook
```typescript
// src/hooks/use<ServiceName>.ts
import { useState, useCallback } from 'react';
import { <serviceAction> } from '../lib/<service-name>';

export function use<ServiceName>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (params: <ParamsType>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await <serviceAction>(params);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}
```

### Step 5: Create a skill for the new integration
Use `skill-creator` to document the new integration as its own skill, then register it in `skill-coordinator`.

## Existing Wrappers in the Project

| Service | Wrapper File | Hook | Skill |
|---------|-------------|------|-------|
| Google GenAI | `src/lib/genai.ts` (to be created) | `useGenAI` | `genai-integration` |
| Weather API | `src/lib/weather.ts` (to be created) | `useWeather` | `weather-api-integration` |

## Error Handling Standards

All wrappers must:
1. Catch all errors and re-throw with a descriptive message
2. Log errors with a `[ServiceName]` prefix for easy filtering
3. Never expose raw API keys or sensitive data in error messages
4. Return `null` (not throw) from React hooks — let the UI handle the error state

## TypeScript Standards

- All wrapper functions must be fully typed
- Map external API responses to types defined in `types.ts` when applicable
- Use `unknown` for untyped API responses, then narrow with type guards
