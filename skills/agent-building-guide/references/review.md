# Reviewing an existing agent setup

## Gather

Ask for what you can't see yourself:

- The agent's **system prompt** (Profile tab) and **wiki instructions** (Wiki tab › Instructions). Ask the user to paste them.
- Whether it's a project agent (which project) or workspace-wide.
- A description or screenshots of: model, Access mode (workspace-wide only), Wiki tab settings (own space, job spaces permission, grants), attached projects (workspace-wide only), MCP servers, triggers, connections including external accounts.
- What the agent is for, and what people complain about, if anything.

Look up yourself before asking:

- **Space instructions and page types** for any space you've been granted: `wiki/<space>/SCHEMA.md`.
- Recent pages the agent wrote, in spaces you can read: `index.md`, `inventory.md`, `log.md`.
- The agent's name and title: `list_workspace_agents`.
- Shared-repo skills it uses: read them in `~/repos/mission-control-agent-skills/skills/`. Ask the user which skills are on its Skills tab.

## Checklist

Mark each finding High, Medium, or Low.

**High — likely causing wrong behavior**
- No clear job or audience in the system prompt.
- The job depends on the wiki, but the system prompt never says when to use it.
- A hard rule (privacy, approval, never-do) lives only in wiki or space instructions, where it ranks below the system prompt.
- Instructions conflict across the three texts.
- A tool that writes, sends, or deletes has no approval rule.
- A restricted space is granted to an agent whose audience is wider than that space's (a workspace-access agent, or a project agent whose project includes people outside the space).
- An agent that signed itself up for a service and created an MCP server for it. Those servers are open to the whole workspace; check that's intended (Connections › External accounts).
- The prompt names MCP tools that don't exist (wrong server name, renamed server).
- Email triggers with no From filter on an agent that takes actions.

**Medium — wasteful or fragile**
- Wiki page format, frontmatter, or the wiki procedure repeated in the system prompt.
- Space layout repeated in the system prompt or wiki instructions instead of space instructions, or page structure (folders, sections, required fields) written as instructions instead of set as page types.
- Permissions described in prose ("you can write to shared/").
- Wiki content pasted into the prompt, which goes stale.
- A named space created for one agent whose audience matches the agent's own space, and that no other agent or team uses. Use the own space instead.
- A workspace-wide agent attached to projects it doesn't need, or several unrelated projects sharing one agent's memory. Suggest one project agent per project.
- A workspace-wide agent that only serves one project. Suggest a project agent instead.
- The default read-write grant on `shared` kept on an agent that shouldn't write workspace-wide notes.
- System prompt so long that the important rules are buried. Aim for 300–1,500 words.
- A long procedure or reference material in the system prompt that only some requests need. Move it into a skill.
- Skill descriptions that don't say when to load the skill.
- Agent-written skills that exist only in the agent's workspace (listed In the sandbox but not configured). Move good ones into the shared repo or upload them.
- No output format or destination.
- No out-of-scope or handoff guidance.

- A Public Agent that only one person uses, for their own accounts or files. Suggest SuperGloo with a folder agent (see `supergloo.md`).

**Low — polish**
- Vague tone words with no example.
- Missing title or avatar.
- Space with no owner named in its space instructions.

## Report format

1. One paragraph: what the agent is set up to do and the overall verdict.
2. Findings, highest severity first. For each: what you found (quote it), why it matters (cite the guide section), and the fix.
3. Rewritten text, ready to paste, for every text you recommend changing, with character counts. Change only what the findings require; keep the user's voice.
4. Settings changes as a short checklist by tab.
5. How to check the fix: two or three test messages.
