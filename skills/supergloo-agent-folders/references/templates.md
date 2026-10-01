# Folder agent templates

Replace every `{placeholder}`. Delete sections that don't apply.

## Layout

```
<agents folder>/
  README.md                  index: one line per agent and when to use it
  <agent-name>/
    AGENTS.md                job description, steps, output rules
    skills/<procedure>/SKILL.md   optional: long procedures, read when needed
    reference/               optional: templates, policies, example output
    memory/notes.md          optional: facts the user wants kept
    outbox/                  optional: where drafts are saved
```

Agent folder names: lowercase words joined by hyphens, such as `weekly-update`.

## README.md

```markdown
# My agents

Each folder here defines an assistant. When I ask for one of these jobs,
read that folder's AGENTS.md first.

- {agent-name}/ — {when to use it}
```

When adding an agent, add one line. Don't rewrite the others.

## AGENTS.md

```markdown
# {Agent name}

{One sentence: what this agent does for me.}

Use this agent when I ask to {trigger phrasings}.

## Before you start
- Read memory/notes.md, if it exists.
- {Anything else to check first.}

## Steps
1. {First step, naming the source: "List my tasks completed this week."}
2. {Second step}
3. {...}
For {special case}, read skills/{procedure}/SKILL.md.

## Output
- {Format and length. "Match reference/example.md."}
- {Where it goes: "Show me the draft in chat, then offer to save it to
  outbox/ as YYYY-MM-DD.md."}

## Ask me before
- {Anything that sends, posts, or changes something others will see.}

## Never
- {Hard limits.}

## At the end
- Suggest any facts worth adding to memory/notes.md. Add them only if I
  say yes.
```

## skills/{procedure}/SKILL.md

For a procedure too long for `AGENTS.md`, or used only in some runs.

```markdown
---
name: {procedure}
description: {What it does}. Read when {situation}.
---

# {Procedure title}

## When to use
- {Situations it covers}

## Steps
1. {...}

## Output
{What the result looks like.}
```

Folder skills aren't loaded automatically like skills added in SuperGloo's settings (Agents › ⋯ on the SuperGloo row › Skills). They're read only because `AGENTS.md` points to them.

## memory/notes.md

```markdown
# Notes for {agent name}

Facts this agent should know. Newest first. Keep each line short and dated.

- {YYYY-MM-DD}: {fact}
```

## Personalization snippet

The user pastes this once into Settings › Agent › Personalization › Custom instructions. Use the real name of their agents folder.

```
Agent folders: if a local folder named "{Agents}" is available, it defines
assistants I use, listed in {Agents}/README.md. When my request matches one of
them, read README.md and that agent's AGENTS.md before starting, and work by
it for that request. If the folder isn't available, tell me to select it in
the message box or that my Mac may be offline.
```

Why it's needed: SuperGloo treats file contents as information, not instructions. Custom instructions are part of SuperGloo's own instructions, so this snippet is what makes it open and follow `AGENTS.md`. It's worded to do nothing when the folder isn't available, because custom instructions apply to every agent run the user starts.
