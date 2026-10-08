# SuperGloo or a Public Agent?

Some requests are better served by SuperGloo, each member's personal assistant, than by a new Public Agent. Check this before you start building.

## What SuperGloo is

- One per member per workspace. It already exists, so there's nothing to create.
- It acts as the member, with their permissions and their connected accounts (Google Workspace, Slack, Notion, Microsoft 365, and others).
- Its conversation and memory are private to that member.
- Desktop, mobile, voice, and iMessage all reach the same SuperGloo.
- It can work in folders the member grants on their Mac.
- It has no system prompt. Members shape it with Settings › Agent › Personalization, skills (public GitHub only), and **folder agents**: files on their Mac that define a job SuperGloo works as.
- It has no wiki, scheduled or event triggers, email address, browser, Linear, GitHub App, huddles, or project-channel @mentions. It can check back on long work with watches.
- Workspace-wide Public Agents can message a member through their SuperGloo when an admin turns that on (guide: "Reaching people through SuperGloo"). Recommend this when a team agent needs one person's decision.

## Recommend SuperGloo when

- The job is for **one person**: their inbox, calendar, tasks, files, or accounts.
- It's private: drafting sensitive messages, personal priorities, anything about one individual.
- They want it by voice or from their phone.
- They want to try out a procedure before building a team agent.

## Build a Public Agent when

- Several people need it, or it works in project channels or on board tasks.
- It should run on a schedule, react to events, or receive email.
- The team should share and read its memory.
- It must work as its own identity when the person isn't around.

If it's mixed, say so: a Public Agent for the team part, SuperGloo for the personal part. SuperGloo can hand work to a Public Agent.

## Handing off to SuperGloo

You can't reach anyone's Mac, so you can't create folder agents. Tell the user:

1. Add the skill to SuperGloo: open **Agents**, click the **⋯** icon on the SuperGloo row, open the **Skills** tab, paste `TangoGroup/mission-control-agent-skills@supergloo-agent-folders`, click **Add**, then **Save skills**.
2. Create an empty folder for their agents (for example `Documents/Agents`). Grant and select it in the SuperGloo message box on desktop.
3. Message SuperGloo: "Help me build a folder agent for {job}." Offer a short summary of what you've learned so far for them to paste in, so SuperGloo can skip those questions.

## Turning a folder agent into a Public Agent

When a folder agent should become a team agent, ask the user to paste its `AGENTS.md` and any skills or reference files. Then map them:

| Folder agent | Public Agent |
|---|---|
| `AGENTS.md` purpose, scope, output, "Ask me before", "Never" | System prompt |
| `AGENTS.md` steps, and `skills/` | Skills (shared repo or upload) |
| `reference/` templates and examples | Skill `references/` or `assets/` |
| `memory/notes.md` | Wiki pages, or nothing if it was personal |
| Personal accounts it used | MCP servers or secrets the agent can use as itself, or a person-specific step that stays with SuperGloo |

Watch for steps that depended on acting as the person, such as reading their own email. A Public Agent can't do those.
