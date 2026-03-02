---
name: skill-creator
description: Meta-skill for creating new skills for the Que-me-pongo project. Use this when you need to add a new capability to the agent's skill library.
---

# Skill Creator

This skill teaches you how to create new, well-structured skills for the **¿Qué me pongo?** wardrobe app project.

## When to Use This Skill

- When the user asks you to "create a skill" or "add a skill"
- When you identify a repeatable task that would benefit from a documented skill
- When onboarding a new capability (new API, new library, new workflow)

## Skill Folder Structure

Every skill lives in `.agent/skills/<skill-name>/` and **must** contain:

```
.agent/skills/<skill-name>/
├── SKILL.md          ← Required: main instructions (this format)
├── scripts/          ← Optional: helper scripts
├── examples/         ← Optional: reference implementations
└── resources/        ← Optional: templates, assets
```

## SKILL.md Format

```markdown
---
name: <skill-name>
description: <one-line description — used by skill-coordinator to pick the right skill>
---

# <Skill Title>

Brief explanation of what this skill does and when to use it.

## When to Use This Skill
- Bullet list of trigger conditions

## Prerequisites
- List any required env vars, installed packages, or setup steps

## Instructions
Step-by-step instructions the agent should follow.

## Examples
Concrete examples of inputs and expected outputs.

## Pitfalls
Common mistakes to avoid.
```

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Frontend | `<framework>-<purpose>` | `react-component-builder` |
| Backend/AI | `<service>-<purpose>` | `genai-integration` |
| Infrastructure | `skill-<role>` | `skill-coordinator` |
| Workflow | `<action>-workflow` | `vite-dev-workflow` |

## Steps to Create a New Skill

1. **Identify the skill name** using the naming conventions above.
2. **Create the folder**: `.agent/skills/<skill-name>/`
3. **Write `SKILL.md`** using the template above. Be specific — vague instructions are useless.
4. **Add examples** in `examples/` if the skill involves code generation.
5. **Register with coordinator**: Update `skill-coordinator/SKILL.md` to include the new skill in the registry table.
6. **Notify the maintainer**: Add a note in `skill-maintainer/SKILL.md` changelog section.

## Quality Checklist

Before finishing a new skill, verify:
- [ ] YAML frontmatter has both `name` and `description`
- [ ] "When to Use" section is specific enough to disambiguate from other skills
- [ ] Instructions are actionable (no vague steps like "handle errors")
- [ ] Skill is registered in `skill-coordinator`
- [ ] Examples reflect actual project patterns (TypeScript, React 19, Vite)
