---
name: wardrobe-data-manager
description: Manages clothing items, categories, and local storage persistence for the wardrobe app. Use when adding, editing, or deleting clothing items or managing wardrobe state.
---

# Wardrobe Data Manager

Handles all data operations for the **¿Qué me pongo?** wardrobe — creating, reading, updating, and deleting clothing items, and persisting the wardrobe to `localStorage`.

## When to Use This Skill

- When adding CRUD operations for clothing items
- When changing the data model in `types.ts`
- When implementing wardrobe persistence (save/load)
- When asked about "clothing data", "wardrobe storage", or "add/delete items"

## Data Model (from `types.ts`)

```typescript
export enum Category {
  TOP = 'Superior',
  BOTTOM = 'Inferior',
  SHOES = 'Calzado',
  ACCESSORY = 'Accesorio'
}

export interface ClothingItem {
  id: string;          // UUID or timestamp-based unique ID
  name: string;        // e.g., "Camisa blanca Oxford"
  category: Category;  // TOP | BOTTOM | SHOES | ACCESSORY
  color: string;       // e.g., "blanco", "azul marino"
  image: string;       // base64 data URL or file path
  tags: string[];      // e.g., ["formal", "verano", "casual"]
}

export interface DailyOutfit {
  day: string;                // e.g., "Lunes"
  items: ClothingItem[];      // selected clothing items
  event?: string;             // e.g., "Reunión de trabajo"
  notes?: string;             // user notes
  recommendation?: string;    // AI recommendation text
}

export type WeeklyPlan = Record<string, DailyOutfit>;
```

## Local Storage Service

```typescript
// src/lib/wardrobeStorage.ts
import type { ClothingItem, WeeklyPlan } from '../types';

const WARDROBE_KEY = 'que-me-pongo:wardrobe';
const WEEKLY_PLAN_KEY = 'que-me-pongo:weekly-plan';

// --- Wardrobe CRUD ---

export function loadWardrobe(): ClothingItem[] {
  try {
    const raw = localStorage.getItem(WARDROBE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWardrobe(items: ClothingItem[]): void {
  localStorage.setItem(WARDROBE_KEY, JSON.stringify(items));
}

export function addClothingItem(item: Omit<ClothingItem, 'id'>): ClothingItem {
  const newItem: ClothingItem = {
    ...item,
    id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
  const wardrobe = loadWardrobe();
  saveWardrobe([...wardrobe, newItem]);
  return newItem;
}

export function updateClothingItem(id: string, updates: Partial<ClothingItem>): void {
  const wardrobe = loadWardrobe();
  const updated = wardrobe.map(item => item.id === id ? { ...item, ...updates } : item);
  saveWardrobe(updated);
}

export function deleteClothingItem(id: string): void {
  const wardrobe = loadWardrobe();
  saveWardrobe(wardrobe.filter(item => item.id !== id));
}

// --- Weekly Plan ---

export function loadWeeklyPlan(): WeeklyPlan {
  try {
    const raw = localStorage.getItem(WEEKLY_PLAN_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveWeeklyPlan(plan: WeeklyPlan): void {
  localStorage.setItem(WEEKLY_PLAN_KEY, JSON.stringify(plan));
}
```

## React Hook

```typescript
// src/hooks/useWardrobe.ts
import { useState, useEffect, useCallback } from 'react';
import { loadWardrobe, addClothingItem, updateClothingItem, deleteClothingItem } from '../lib/wardrobeStorage';
import type { ClothingItem, Category } from '../types';

export function useWardrobe() {
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);

  useEffect(() => {
    setWardrobe(loadWardrobe());
  }, []);

  const add = useCallback((item: Omit<ClothingItem, 'id'>) => {
    const newItem = addClothingItem(item);
    setWardrobe(prev => [...prev, newItem]);
    return newItem;
  }, []);

  const update = useCallback((id: string, updates: Partial<ClothingItem>) => {
    updateClothingItem(id, updates);
    setWardrobe(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  }, []);

  const remove = useCallback((id: string) => {
    deleteClothingItem(id);
    setWardrobe(prev => prev.filter(item => item.id !== id));
  }, []);

  const filterByCategory = useCallback((category: Category) => {
    return wardrobe.filter(item => item.category === category);
  }, [wardrobe]);

  return { wardrobe, add, update, remove, filterByCategory };
}
```

## Image Handling

Clothing images are stored as base64 data URLs. To convert a file input:

```typescript
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

## Category Labels (Spanish)

| Enum Value | Display Label |
|-----------|--------------|
| `Category.TOP` | `Superior` |
| `Category.BOTTOM` | `Inferior` |
| `Category.SHOES` | `Calzado` |
| `Category.ACCESSORY` | `Accesorio` |

## Pitfalls

- `localStorage` is synchronous — avoid calling it in render functions
- Always wrap `JSON.parse` in try/catch — corrupted data will throw
- IDs must be unique — use `Date.now()` + random suffix, not sequential numbers
- Images stored as base64 can make `localStorage` hit the 5MB limit — warn users
