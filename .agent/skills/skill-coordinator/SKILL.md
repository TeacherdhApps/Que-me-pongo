---
name: skill-coordinator
description: Orchestrates multiple skills together. Use this to determine which skill(s) to invoke for a given task, and how to chain them for complex multi-step work.
---

# Skill Coordinator

The coordinator is the **entry point** for any non-trivial task. It maps user requests to the right skill(s) and defines execution order when multiple skills are needed.

## When to Use This Skill

- At the start of any task to determine which skills apply
- When a task requires more than one skill working together
- When you are unsure which skill handles a specific request

## Skill Registry

| Skill | Description | Triggers |
|-------|-------------|----------|
| `skill-creator` | Create new skills | "create a skill", "add a skill" |
| `skill-coordinator` | This file — orchestration | "which skill should I use?", multi-step tasks |
| `skill-maintainer` | Audit and update skills | "update skills", "check skills", "skills are outdated" |
| `skill-wrapper` | Wrap external tools/APIs | "integrate a new library", "add a new API" |
| `react-component-builder` | Build React components | "create a component", "add a view", "new page" |
| `ui-design-system` | Manage styles and design tokens | "change the style", "update colors", "add animation" |
| `vite-dev-workflow` | Dev server, build, TypeScript | "run the app", "build", "fix TypeScript errors" |
| `genai-integration` | Google GenAI outfit recommendations | "AI recommendation", "outfit suggestion", "Gemini" |
| `wardrobe-data-manager` | Clothing data CRUD and storage | "add clothing", "delete item", "save wardrobe" |
| `weather-api-integration` | Weather data for outfit logic | "weather", "temperature", "geolocation" |

## Coordination Patterns

### Pattern 1: New Feature
When adding a new feature to the app:
1. `wardrobe-data-manager` → define/update data model
2. `react-component-builder` → build the UI component
3. `ui-design-system` → apply consistent styles
4. `genai-integration` (if AI is involved) → wire up recommendations
5. `vite-dev-workflow` → verify the build passes

### Pattern 2: New AI Capability
When adding or modifying AI-powered features:
1. `genai-integration` → design the prompt and API call
2. `wardrobe-data-manager` → ensure data is available for the prompt
3. `react-component-builder` → display the AI response in the UI

### Pattern 3: Style/UI Update
When changing the look and feel:
1. `ui-design-system` → update design tokens or CSS
2. `react-component-builder` → apply changes to affected components
3. `vite-dev-workflow` → verify no build errors

### Pattern 4: New Skill Creation
When adding a new skill:
1. `skill-creator` → follow the creation process
2. `skill-coordinator` (this file) → register the new skill in the table above
3. `skill-maintainer` → log the addition

## Decision Tree

```
User request
    │
    ├─ Involves UI/components? → react-component-builder + ui-design-system
    ├─ Involves AI/Gemini? → genai-integration
    ├─ Involves clothing data? → wardrobe-data-manager
    ├─ Involves weather? → weather-api-integration
    ├─ Involves build/dev server? → vite-dev-workflow
    ├─ Involves a new external library? → skill-wrapper
    ├─ Involves creating a skill? → skill-creator
    └─ Involves auditing skills? → skill-maintainer
```

## Chaining Rules

- Always run `vite-dev-workflow` **last** to verify the build after code changes.
- `wardrobe-data-manager` should run **before** `react-component-builder` if new data types are needed.
- `ui-design-system` changes should be applied **after** component structure is finalized.
