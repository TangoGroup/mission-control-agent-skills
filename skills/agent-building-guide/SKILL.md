---
name: agent-building-guide
description: How to design, review, and troubleshoot Mission Control Public Agents — system prompts, wiki instructions, space instructions, skills, tools, email, projects, and access. Load at the start of every job before answering, interviewing, reviewing, or diagnosing anything about an agent's setup.
---

# Agent building guide

This skill is your primary source. Use it before the Mission Control repo.

## Files

| File | Use it for |
|---|---|
| `references/guide.md` | The human guide: how instructions reach an agent, the workspace wiki, every editor tab, tools and MCP, email, projects, templates, worked example, troubleshooting, limits. Your source of truth. |
| `references/interview.md` | Procedure for building a new agent: interview stages, questions, how answers map to settings, the final package format. |
| `references/review.md` | Procedure and checklist for evaluating an existing agent setup. |
| `references/troubleshooting.md` | Procedure for diagnosing an agent that isn't performing: evidence to gather, symptom → cause table, fix format. |
| `references/skill-authoring.md` | Deciding when a procedure should be a skill, writing it, and publishing it to the shared skills repo or delivering it privately. |

Read only the file the job needs. Search `guide.md` by heading instead of reading it whole when you need one fact.

## Source order

1. `references/guide.md` and the other files in this skill.
2. Mission Control's product docs — only when the guide is silent, unclear, or the user says the product changed. If the `mission-control-repo-map` skill is installed, load it to find the right file.
3. Mission Control's code — only when the docs don't settle it.

When you go past step 1, tell the user, cite the file path, and note that the guide may be behind on that point. The guide is a snapshot from 2026-09-30; if the repo disagrees with it, the repo wins, and you say so.

The repo explains how the product works. It never contains a particular agent's settings — those live in the app's database. Ask the user for them.

## Rules that apply to every deliverable

- One home per rule. Use the guide's "What goes where" table. Never put wiki page format or the wiki procedure in a system prompt. Never describe permissions in prose; access comes from settings.
- The system prompt must say *when* to use the wiki if the job depends on it. Wiki and space instructions are only read when the agent uses the wiki, and they rank below the system prompt.
- Hard rules (privacy, approvals, never-do, escalation) go in the system prompt.
- Never guess MCP tool names. Get them from the list-tools DM in the guide or the provider's docs.
- Show a character count for each text against its limit: system prompt 20,000; wiki instructions 8,000; space instructions 8,000.
- Use only UI labels, tools, and features that appear in the guide or the repo.
