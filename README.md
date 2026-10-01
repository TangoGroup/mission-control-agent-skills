# Mission Control agent skills

Agent Skills for TangoGroup's Mission Control Public Agents. Each folder under `skills/` is one skill in the open [Agent Skills](https://agentskills.io) format.

> **This repository is public.** Never add secrets, API keys, customer or member data, people's personal details, or internal-only procedures. Anything that must stay private belongs in an uploaded skill or the workspace wiki instead.

## Use a skill on an agent

In the Mission Control desktop app, open the agent's editor › **Skills** and add:

```
TangoGroup/mission-control-agent-skills@<skill-name>
```

Agents sync skills from this repo's default branch (`main`) at the start of each job, so merged changes reach every agent using the skill on its next run.

## Layout

```
skills/
  <skill-name>/
    SKILL.md          required: frontmatter + instructions
    references/       optional: longer material the skill points to
    scripts/          optional: scripts the agent can run
    assets/           optional: templates, examples
templates/
  SKILL.template.md   starting point for a new skill
```

## Rules

- **Name:** lowercase letters, numbers, and single hyphens, up to 64 characters (for example `invoice-intake`). The folder name and the `name:` in `SKILL.md` must match.
- **Reserved:** `workspace-wiki` is built into Mission Control and can't be used.
- **Description:** up to 1,024 characters. Say what the skill does *and when to load it*. The agent sees only names and descriptions until it loads a skill.
- **Size:** keep `SKILL.md` under 128 KB. Move long material into `references/` and tell the agent when to read each file.
- **Changes:** open a pull request. Someone who manages agents reviews it before it merges, since a merge changes every agent that uses the skill.
