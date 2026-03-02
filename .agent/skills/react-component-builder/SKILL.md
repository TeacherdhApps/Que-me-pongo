---
name: react-component-builder
description: Builds React components following the project's TypeScript + React 19 patterns. Use when creating new views, components, or UI elements for the wardrobe app.
---

# React Component Builder

Builds React components for **¿Qué me pongo?** following the project's established patterns: TypeScript, functional components, React 19 hooks, and CSS modules.

## When to Use This Skill

- When creating a new view or page (e.g., a new tab in the app)
- When adding a new UI element (modal, card, button group)
- When refactoring an existing component
- When asked to "create a component", "add a view", or "build a UI"

## Project Component Inventory

| Component | File | Purpose |
|-----------|------|---------|
| `ClosetView` | `components/ClosetView.js` | Displays and manages clothing items |
| `RecommendationView` | `components/RecommendationView.js` | Shows AI outfit recommendations |
| `WeeklyPlanner` | `components/WeeklyPlanner.js` | Weekly outfit planning calendar |
| `App` | `src/App.tsx` | Root component (currently default Vite template) |

## Component Template (TypeScript)

```tsx
// src/components/<ComponentName>.tsx
import { useState, useCallback } from 'react';
import type { ClothingItem, WeatherData } from '../types'; // import from types.ts

interface <ComponentName>Props {
  // define props with explicit types
  items?: ClothingItem[];
  onSelect?: (item: ClothingItem) => void;
}

export function <ComponentName>({ items = [], onSelect }: <ComponentName>Props) {
  const [selected, setSelected] = useState<ClothingItem | null>(null);

  const handleSelect = useCallback((item: ClothingItem) => {
    setSelected(item);
    onSelect?.(item);
  }, [onSelect]);

  return (
    <div className="<component-name>">
      {/* component content */}
    </div>
  );
}

export default <ComponentName>;
```

## Available Types (from `types.ts`)

```typescript
enum Category { TOP, BOTTOM, SHOES, ACCESSORY }

interface ClothingItem {
  id: string;
  name: string;
  category: Category;
  color: string;
  image: string;
  tags: string[];
}

interface WeatherData { temp: number; condition: string; city: string; }
interface DailyOutfit { day: string; items: ClothingItem[]; event?: string; notes?: string; recommendation?: string; }
type WeeklyPlan = Record<string, DailyOutfit>;
```

## Steps to Build a New Component

1. **Define the props interface** — what data does the component need?
2. **Identify which types from `types.ts`** are needed
3. **Create the file** in `src/components/<ComponentName>.tsx`
4. **Write the component** using the template above
5. **Add CSS** in `src/components/<ComponentName>.css` or inline styles following the design system
6. **Export and import** in the parent component or `App.tsx`
7. **Run `vite-dev-workflow`** to verify no TypeScript errors

## React 19 Patterns

- Use `useCallback` for event handlers passed as props
- Use `useMemo` for expensive computations on lists
- Prefer `useState` + `useReducer` for complex state
- Use `useEffect` only for side effects (API calls, subscriptions)
- **Avoid**: class components, `React.FC` type annotation (use explicit return types instead)

## Pitfalls

- Do NOT use `.js` extension for new TypeScript files — use `.tsx` for components, `.ts` for utilities
- Do NOT import from `react` with default import — use named imports: `import { useState } from 'react'`
- Always handle the `undefined`/`null` case for optional props
