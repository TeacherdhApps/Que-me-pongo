---
name: vite-dev-workflow
description: Handles dev server startup, build commands, TypeScript compilation, and hot module reload for the Que-me-pongo Vite + React project.
---

# Vite Dev Workflow

Manages the development and build lifecycle of **¿Qué me pongo?**, which uses **rolldown-vite** (a Rust-based Vite fork) with React 19 and TypeScript.

## When to Use This Skill

- When starting the development server
- When building for production
- When fixing TypeScript compilation errors
- When the dev server is not reflecting changes
- When asked to "run the app", "build", or "fix TypeScript errors"

## Project Setup

| Tool | Version | Notes |
|------|---------|-------|
| Vite | `rolldown-vite@7.2.5` | Rust-based Vite fork, faster builds |
| React | `19.2.0` | Latest React with concurrent features |
| TypeScript | `~5.9.3` | Strict mode recommended |
| ESLint | `9.39.1` | With react-hooks and react-refresh plugins |

## Key Commands

```bash
# Start development server (with HMR)
npm run dev

# Type-check + build for production
npm run build

# Preview production build locally
npm run preview

# Lint the codebase
npm run lint
```

## TypeScript Configuration

The project has **three tsconfig files**:

| File | Purpose |
|------|---------|
| `tsconfig.json` | Root config — references the others |
| `tsconfig.app.json` | App source (`src/`) — strict TypeScript |
| `tsconfig.node.json` | Vite config and Node scripts |

When fixing TypeScript errors, check which config applies to the file in question.

## Common TypeScript Fixes

### Missing type for event handlers
```typescript
// ❌ Implicit any
const handleClick = (e) => { ... }
// ✅ Explicit type
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... }
```

### Non-null assertion for DOM elements
```typescript
// ❌ Possible null
const root = document.getElementById('root');
createRoot(root).render(...)
// ✅ Non-null assertion (safe when you know it exists)
createRoot(document.getElementById('root')!).render(...)
```

### Importing types
```typescript
// Use 'import type' for type-only imports (better tree-shaking)
import type { ClothingItem, WeatherData } from '../types';
```

## Environment Variables

Vite exposes env vars prefixed with `VITE_`:

```typescript
// Access in code
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Type-safe env vars — add to src/vite-env.d.ts:
interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_WEATHER_API_KEY: string;
}
```

Create `.env.local` for local secrets (never commit):
```
VITE_GEMINI_API_KEY=your_key_here
```

## Vite Config (`vite.config.ts`)

Current minimal config:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

Common additions:
```typescript
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },  // auto-open browser
  build: { outDir: 'dist' },
})
```

## Troubleshooting

| Problem | Solution |
|---------|---------|
| Port already in use | `npm run dev -- --port 5174` |
| HMR not working | Check that file is imported in the component tree |
| TypeScript errors on build | Run `npx tsc --noEmit` to see all errors |
| `node_modules` issues | Delete `node_modules/` and `package-lock.json`, then `npm install` |
| rolldown-vite issues | Check `overrides` in `package.json` — vite is aliased to rolldown-vite |

## Pitfalls

- Do NOT run `npm run build` to test during development — use `npm run dev`
- Do NOT modify `tsconfig.json` directly — edit `tsconfig.app.json` for app code
- The `type: "module"` in `package.json` means all JS files are ESM — no `require()`
