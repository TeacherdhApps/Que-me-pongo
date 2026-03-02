---
name: ui-design-system
description: Manages the project's design tokens, CSS variables, animations, and visual consistency. Use when changing styles, colors, typography, or adding new visual effects.
---

# UI Design System

Manages the visual language of **¿Qué me pongo?** — a fashion app that should feel premium, modern, and elegant.

## When to Use This Skill

- When changing colors, typography, or spacing
- When adding new animations or transitions
- When ensuring a new component matches the existing visual style
- When asked to "update the design", "change the style", or "add animation"

## Current Design Language

The app uses a **clean, minimal aesthetic** inspired by high-end fashion apps:

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#ffffff` | Main background |
| Accent | `#000000` | Text, borders |
| Zinc | `#f4f4f5` | Card backgrounds |
| Font | `Plus Jakarta Sans` | All text |
| Font weights | 200, 400, 700, 800 | Light to ExtraBold |

## CSS Variables (in `index.html` / `src/index.css`)

```css
:root {
  --bg: #ffffff;
  --accent: #000000;
  --zinc-custom: #f4f4f5;
}
```

## Established CSS Classes

| Class | Effect |
|-------|--------|
| `.glass-nav` | Frosted glass navigation bar |
| `.clothing-card` | Card with hover lift animation |
| `.no-scrollbar` | Hides scrollbar cross-browser |
| `.animate-fade` | Fade-in + slide-up entrance animation |

## Glass Effect Pattern

```css
.glass-nav {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
}
```

## Animation Standards

```css
/* Entrance animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade { animation: fadeIn 0.6s ease-out forwards; }

/* Hover lift (clothing cards) */
.clothing-card {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.clothing-card:hover { transform: translateY(-8px); }
```

## Adding New Styles

### In the Vite/React version (`src/index.css` or `src/App.css`)
1. Add CSS variables to `:root` for new design tokens
2. Create utility classes for reusable patterns
3. Use `@keyframes` for new animations
4. Apply classes in component JSX

### In the standalone HTML version (`index.html`)
Styles live in the `<style>` tag inside `<head>`. Follow the same patterns.

## Typography Scale

```css
/* Headings */
font-size: 2rem;    font-weight: 800;  /* Page titles */
font-size: 1.25rem; font-weight: 700;  /* Section headers */
font-size: 1rem;    font-weight: 400;  /* Body text */
font-size: 0.875rem; font-weight: 200; /* Captions, labels */
```

## Color Palette Expansion

When adding new colors, follow this pattern:
- Use HSL for flexibility: `hsl(0, 0%, 96%)` instead of `#f5f5f5`
- Add as CSS variables, not hardcoded values
- Ensure sufficient contrast (WCAG AA: 4.5:1 for normal text)

## Pitfalls

- Do NOT use inline styles for anything that should be reusable
- Do NOT hardcode colors — always use CSS variables
- Animations should use `cubic-bezier` easing, not `linear` or `ease`
- The app is mobile-first — always test responsive behavior
