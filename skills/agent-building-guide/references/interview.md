# Building a new agent: interview procedure

Goal: leave the user with everything they need to create the agent in the desktop app, with nothing left to invent.

## How to run the interview

- Ask 3–5 questions per turn. Use a question card when the answers are choices (project agent or workspace-wide, access mode, wiki options, where it's used). Use plain questions for open answers.
- Skip questions the user already answered. Restate what you've understood at the end of each stage in two or three lines so they can correct it.
- Push for specifics. "Helpful and friendly" is not a tone; ask for an example reply they'd love and one they'd hate.
- If an answer creates a risk (a restricted space on an agent with wider access, an MCP tool that sends or deletes, email from anyone), say so when it comes up, not at the end.
- Don't draft until stages 1–4 are answered. Stages 5–6 can use sensible defaults that you state.

## Stage 1 — Job and audience

1. What is the agent's job, in one sentence?
2. Who will use it? (Everyone, one team, a few people.)
3. Where will they use it? (DMs, a project's channels, board tasks, scheduled runs, email, Linear, GitHub.)
4. What are the three most common requests it will get? Ask for real examples.
5. What should it refuse or redirect, and to whom?

Then check `supergloo.md`. If the answers describe one person's own work (their inbox, calendar, files, or accounts), recommend SuperGloo with a folder agent, explain why in two or three sentences, and offer the handoff steps. Continue with a Public Agent only if the user still wants one or the job is for a team.

## Stage 2 — Output

1. What does a great answer look like? Ask them to paste or describe one.
2. Length, structure, tone.
3. Where results should land: reply in thread, a channel, a board task, a Library document, a Feed post.
4. What needs a person's approval before the agent does it?

## Stage 3 — Tools, projects, and triggers

1. Which outside services does it need? For each: is there an MCP server already in Settings › Workspace › MCP Servers? If not, does the service have one, or an API key route (Secrets)? GitHub or Linear (Connections tab)?
2. For each MCP server: which tools matter, and which of them write, send, or delete? If they don't know the tool names, give them the list-tools DM from the guide.
3. Project agent or workspace-wide? (Guide: "Project agent or workspace-wide?")
   - Default to a **project agent** in the one project it serves. Ask which project; it's permanent. Confirm the user manages that project (or is a workspace owner/admin), since only they can create it.
   - Choose **workspace-wide** only if it must work across projects, in workspace channels or group DMs, serve people outside one project, or message members through SuperGloo. Creating it needs `workspace.agents.manage`. Then ask which projects to attach it to.
   - If it would serve several separate projects whose knowledge must stay apart, recommend one project agent per project.
4. Should anything start it automatically: schedule, project events, email, webhook? For email, who sends it and how to filter (guide: "The agent's email address"). A project agent's trigger output must go to a channel in its home project.
5. Should it sign up for any services itself (guide: Connections, external accounts)? Should it reach specific people through SuperGloo (workspace-wide agents only; guide: "Reaching people through SuperGloo")?

## Stage 4 — Memory and wiki

1. Should it remember anything across conversations? What exactly is worth keeping, and what isn't?
2. Who should be able to read that memory? This decides the space. Default to the agent's own space. Use a project space for one project's knowledge. Propose a named space only when a different audience should read it, several agents or a team share it, or it should outlive the agent (guide: "Own space or a named space?"). Use `shared/` only for facts the whole workspace needs.
3. Does it need to read existing knowledge? Which spaces? Do those spaces have Space settings (instructions, and page types if they need their own folders or page structure) yet?
4. Is any of the content sensitive (pay, health, HR, client confidential)? Decide restricted spaces together with who can reach the agent (its project's members, or its Access mode if workspace-wide).

## Stage 4b — Skills

1. Walk through the common requests from stage 1. Which ones follow a set procedure, or need a template, checklist, or reference document?
2. Is there existing material (a how-to doc, a checklist, a template) you can turn into a skill? Ask them to paste or attach it.
3. For each skill candidate: can it be public (shared repo) or must it stay private (upload)? See `skill-authoring.md`.

## Stage 5 — Identity and access

1. Name (what people type after @) and optional title.
2. Access: for a project agent, the home project's members (no Access tab). For a workspace-wide agent, Workspace or Restricted (which people or roles)?
3. Model preference, if any. Default: a strong reasoning model for open-ended work, a faster one for simple lookups.
4. Does it join huddles? If yes, voice and speaking style.

## Stage 6 — Hard limits

1. What must it never do?
2. When should it hand off to a person, and who?

## Mapping answers to settings

| Answer | Goes to |
|---|---|
| Job, audience, scope, output, approvals, limits, when to use the wiki, which tool for what | System prompt |
| What to remember, where each kind of fact is filed, where to look first, topic names | Wiki instructions |
| How a shared space is used: purpose, when to use each page type, naming, what doesn't belong, owner | Space instructions (Space settings › Instructions) |
| How pages in a space are structured: folders, sections, required fields, pinned types | Space settings › Page types (describe the types to set up; you can't set them yourself) |
| A procedure, template, or reference material for some requests | A skill (see `skill-authoring.md`), plus one line in the system prompt saying when to load it |
| Which spaces it reads or writes | Wiki tab settings |
| Who can use it | Project agent: the home project's membership. Workspace-wide: Access tab |
| Where it's created | Project agent: project › Agents tab › New agent. Workspace-wide: Settings › Workspace › Agents › New workspace-wide agent |
| Projects (workspace-wide only) | Project › Agents tab › ⋯ › Attach workspace-wide agent…, with project-only MCP and secrets under Project config |
| Services | MCP tab / Secrets / Connections |
| Automatic starts | Triggers tab |

## Final package

Deliver in this order, each text in its own fenced block with a label line above it:

1. **Summary** — the job in one sentence, who uses it, where.
2. **Where to create it and the settings checklist by tab** — project agents: Profile, Skills, Secrets, Harnesses, MCP, Triggers, Connections, Wiki; workspace-wide agents also have Projects and Access — with the exact values to set and "leave default" where nothing is needed. Include the named spaces to create in the Wiki pane, if any.
3. **Profile › System prompt** — with character count.
4. **Wiki › Instructions** — with character count. Omit if the agent has no wiki use, and say to turn wiki access off.
5. **Space settings** — for each space: any page types to set up (described as a list for a wiki manager to enter), and the instructions block labeled with the space path, with character count.
6. **Skills** — for each: name, where it lives (pull request link for the shared repo, or the private upload instructions), the Skills-tab entry, and the full files for private skills.
7. **Trigger prompts** — one per trigger, with filters.
8. **Test plan** — five to eight concrete messages to send and what a pass looks like, including one out-of-scope request, one that should load each skill, and one wiki write to check in the Wiki pane.

Then remind the user that you can't create the agent yourself, and offer to review it once it's set up.
