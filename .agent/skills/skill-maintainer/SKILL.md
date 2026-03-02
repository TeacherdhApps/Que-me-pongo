---
name: skill-maintainer
description: Audits, updates, and keeps all project skills healthy and consistent with the current codebase. Use this when skills may be outdated or need review.
---

# Skill Maintainer

The maintainer ensures the skills library stays accurate, complete, and aligned with the evolving codebase of **¿Qué me pongo?**.

## When to Use This Skill

- When the codebase changes significantly (new dependencies, refactors, new features)
- When a skill produces incorrect or outdated instructions
- When asked to "audit skills", "update skills", or "check skills"
- Periodically, after major feature additions

## Audit Checklist

Run through this checklist for each skill in `.agent/skills/`:

### 1. Structural Integrity
- [ ] Folder exists at `.agent/skills/<name>/`
- [ ] `SKILL.md` exists and is non-empty
- [ ] YAML frontmatter has `name` and `description` fields
- [ ] Skill is registered in `skill-coordinator/SKILL.md`

### 2. Content Accuracy
- [ ] File paths referenced in the skill still exist in the project
- [ ] Package names match current `package.json` dependencies
- [ ] TypeScript types referenced match current `types.ts`
- [ ] Component names match files in `components/` and `src/`
- [ ] API endpoints or env vars are still valid

### 3. Completeness
- [ ] "When to Use" section is specific and actionable
- [ ] Instructions are step-by-step, not vague
- [ ] Examples use current project patterns (React 19, TypeScript, Vite)

## Audit Procedure

### Step 1: Inventory all skills
```bash
find .agent/skills -name "SKILL.md" | sort
```

### Step 2: Check coordinator registry
Open `skill-coordinator/SKILL.md` and verify every skill in the filesystem appears in the registry table.

### Step 3: Cross-reference with codebase
Check these key files for changes that might invalidate skill instructions:
- `package.json` — dependency changes
- `types.ts` — data model changes
- `src/` and `components/` — component changes
- `vite.config.ts` — build config changes

### Step 4: Update outdated skills
For each outdated skill:
1. Edit the `SKILL.md` to reflect current reality
2. Add an entry to the **Changelog** section below
3. If the skill is no longer needed, remove the folder and unregister from coordinator

### Step 5: Verify skill-creator template
Ensure `skill-creator/SKILL.md` template is still accurate and up-to-date.

## Changelog

| Date | Skill | Change | Reason |
|------|-------|--------|--------|
| 2026-02-18 | All | Initial creation | Skills infrastructure bootstrapped |

## Known Fragile Areas

These parts of the codebase change frequently and may invalidate skills:

| Area | Skills Affected |
|------|----------------|
| `types.ts` data model | `wardrobe-data-manager`, `genai-integration` |
| Google GenAI API version | `genai-integration` |
| Vite/rolldown-vite version | `vite-dev-workflow` |
| Component file names | `react-component-builder`, `ui-design-system` |
| Weather API endpoints | `weather-api-integration` |
